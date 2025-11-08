const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

const Sicredi = (function () {
  const NUMERO_SICREDI = '748',
    DIGITO_SICREDI = 'X';

  function Sicredi() {

  }

  Sicredi.prototype.getTitulos = function () {
    return {
      instrucoes: 'Informações de responsabilidade do beneficiário',
      nomeDoPagador: 'Nome do Pagador',
      especie: 'Moeda',
      quantidade: 'Quantidade',
      valor: 'Valor',
      moraMulta: '(+) Juros / Multa'
    };
  };

  Sicredi.prototype.exibirReciboDoPagadorCompleto = function () {
    return true;
  };

  Sicredi.prototype.exibirCampoCip = function () {
    return false;
  };

  Sicredi.prototype.geraCodigoDeBarrasPara = function (boleto) {
    const beneficiario = boleto.getBeneficiario(),
      campoLivre = [];

    const arrayDigitoCampoLivre = ('1'
      + this.getCarteiraFormatado(beneficiario)
      + beneficiario.getNossoNumero()
      + beneficiario.getDigitoNossoNumero()
      + beneficiario.getAgenciaFormatada()
      + beneficiario.getCodigoBeneficiario()
      + '10').split('');
    const pesos = [9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    let soma = 0;

    for (let i = 0; i < arrayDigitoCampoLivre.length; i++) {
      if(parseInt(arrayDigitoCampoLivre[i]) != 0){
        soma += pesos[i] * parseInt(arrayDigitoCampoLivre[i]);
      }
    }
    let digCampoLivre = soma % 11;
    if (digCampoLivre == 1 || digCampoLivre == 0) {
      digCampoLivre = 0;
    } else {
      digCampoLivre = 11 - digCampoLivre;
    }

    campoLivre.push('1');
    campoLivre.push(this.getCarteiraFormatado(beneficiario));
    campoLivre.push(beneficiario.getNossoNumero().substring(0, 3));
    campoLivre.push(beneficiario.getNossoNumero().substring(3, 8));
    campoLivre.push(beneficiario.getDigitoNossoNumero());
    campoLivre.push(beneficiario.getAgenciaFormatada());
    campoLivre.push(this.getCodigoFormatado(beneficiario));
    campoLivre.push('1');
    campoLivre.push('0');
    campoLivre.push(digCampoLivre);

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  };

  Sicredi.prototype.getNumeroFormatadoComDigito = function () {
    return [
      NUMERO_SICREDI,
      DIGITO_SICREDI
    ].join('-');
  };

  Sicredi.prototype.getNumeroFormatado = function () {
    return NUMERO_SICREDI;
  };

  Sicredi.prototype.getCarteiraFormatado = function (beneficiario) {
    // Para Sicredi, carteira deve ter apenas 1 dígito
    const carteira = beneficiario.getCarteira();
    return carteira.charAt(carteira.length - 1); // Pega o último dígito
  };

  Sicredi.prototype.getCarteiraTexto = function (beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  };

  Sicredi.prototype.getCodigoFormatado = function (beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  };

  Sicredi.prototype.getImagem = function () {
    return path.join(__dirname, 'logotipos/sicredi.png');
  };

  Sicredi.prototype.getNossoNumeroFormatado = function (beneficiario) {
    return pad(beneficiario.getNossoNumero(), 8, '0');
  };

  Sicredi.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
    const beneficiario = boleto.getBeneficiario();

    return this.getNossoNumeroFormatado(beneficiario).substring(0, 2) + '/' + [
      this.getNossoNumeroFormatado(beneficiario).substring(2),
      beneficiario.getDigitoNossoNumero()
    ].join('-');
  };

  Sicredi.prototype.getNome = function () {
    return 'Sicredi';
  };

  Sicredi.prototype.getImprimirNome = function () {
    return false;
  };

  Sicredi.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
    let beneficiario = boleto.getBeneficiario(),

      codigo = this.getCodigoFormatado(beneficiario),
      digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

    if (digitoCodigo) {
      codigo += '-' + digitoCodigo;
    }

    return beneficiario.getAgenciaFormatada() + '/' + codigo;
  };

  Sicredi.novoSicredi = function () {
    return new Sicredi();
  };

  return Sicredi;
})();

module.exports = Sicredi;
