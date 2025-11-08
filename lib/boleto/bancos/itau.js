const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;
const insert = StringUtils.insert;

const GeradorDeDigitoPadrao = require('../gerador-de-digito-padrao');
const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

//Varias coisas implementadas inclusive arquivos de retorno
//https://github.com/kivanio/brcobranca
//https://github.com/pagarme/node-boleto

//Várias validações
//http://ghiorzi.org/DVnew.htm

const Itau = (function () {
  const NUMERO_ITAU = '341',
    DIGITO_ITAU = '7';

  function Itau() {}

  Itau.prototype.getTitulos = function () {
    return {};
  };

  Itau.prototype.exibirReciboDoPagadorCompleto = function () {
    return false;
  };

  Itau.prototype.exibirCampoCip = function () {
    return false;
  };

  Itau.prototype.geraCodigoDeBarrasPara = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    let campoLivre = [];

    // Campo Livre Itaú - 25 posições conforme SISPAG CNAB-85
    // Estrutura: CCC NNNNNNNN AAAA BBBBB 000 + 2 DVs
    // CCC: Carteira, NNNNNNNN: Nosso Número, AAAA: Agência
    // BBBBB: Código Beneficiário, 000: Constante
    campoLivre.push(this.getCarteiraFormatado(beneficiario)); // 3 chars
    campoLivre.push(this.getNossoNumeroFormatado(beneficiario)); // 8 chars
    campoLivre.push(beneficiario.getAgenciaFormatada()); // 4 chars
    campoLivre.push(this.getCodigoFormatado(beneficiario)); // 5 chars
    campoLivre.push('000'); // 3 chars
    // Total: 23 caracteres + 2 DVs = 25 posições

    campoLivre = campoLivre.join('');

    // Primeiro DV (posição 21): MOD10 das posições 12-20
    const digito1 = GeradorDeDigitoPadrao.mod10(campoLivre.substring(11, 20));
    campoLivre = insert(campoLivre, 20, digito1);

    // Segundo DV (posição 12): MOD10 das posições 12-21 + 1-11
    // Inclui o primeiro DV conforme especificação CNAB-85
    const digito2 = GeradorDeDigitoPadrao.mod10(
      campoLivre.substring(11, 21) + campoLivre.substring(0, 11)
    );
    campoLivre = insert(campoLivre, 11, digito2);

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  };

  Itau.prototype.getNumeroFormatadoComDigito = function () {
    return [NUMERO_ITAU, DIGITO_ITAU].join('-');
  };

  Itau.prototype.getCarteiraFormatado = function (beneficiario) {
    return pad(beneficiario.getCarteira(), 3, '0');
  };

  Itau.prototype.getCarteiraTexto = function (beneficiario) {
    return this.getCarteiraFormatado(beneficiario);
  };

  Itau.prototype.getCodigoFormatado = function (beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
  };

  Itau.prototype.getImagem = function () {
    return path.join(__dirname, 'logotipos/itau.png');
  };

  Itau.prototype.getNossoNumeroFormatado = function (beneficiario) {
    return pad(beneficiario.getNossoNumero(), 8, '0');
  };

  Itau.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      [beneficiario.getCarteira(), this.getNossoNumeroFormatado(beneficiario)].join('/') +
      '-' +
      beneficiario.getDigitoNossoNumero()
    );
  };

  Itau.prototype.getNumeroFormatado = function () {
    return NUMERO_ITAU;
  };

  Itau.prototype.getNome = function () {
    return 'Banco Itaú S/A';
  };

  Itau.prototype.getImprimirNome = function () {
    return true;
  };

  Itau.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
    const beneficiario = boleto.getBeneficiario();
    const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
    let codigo = this.getCodigoFormatado(beneficiario);

    if (digitoCodigo) {
      codigo += '-' + digitoCodigo;
    }

    return beneficiario.getAgenciaFormatada() + '/' + codigo;
  };

  Itau.novoItau = function () {
    return new Itau();
  };

  return Itau;
})();

module.exports = Itau;
