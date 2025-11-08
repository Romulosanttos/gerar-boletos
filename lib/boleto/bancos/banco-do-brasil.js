const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

class BancoBrasil {
  static NUMERO_BANCO_BRASIL = '001';
  static DIGITO_BANCO_BRASIL = '9';

  getTitulos() {
    return {
      instrucoes: 'Informações de responsabilidade do beneficiário',
      nomeDoPagador: 'Nome do Pagador',
      especie: 'Moeda',
      quantidade: 'Quantidade',
      valor: 'Valor',
      moraMulta: '(+) Juros / Multa',
    };
  }

  exibirReciboDoPagadorCompleto() {
    return true;
  }

  exibirCampoCip() {
    return false;
  }

  geraCodigoDeBarrasPara(boleto) {
    const beneficiario = boleto.getBeneficiario();

    const campoLivre = [];

    if (beneficiario.getNossoNumero().length === 11) {
      campoLivre.push(beneficiario.getNossoNumero());
      campoLivre.push(beneficiario.getAgenciaFormatada());
      campoLivre.push(beneficiario.getCodigoBeneficiario());
      campoLivre.push(beneficiario.getCarteira().substring(0, 2));
    }

    if (beneficiario.getNossoNumero().length === 17) {
      campoLivre.push('000000');
      campoLivre.push(beneficiario.getNossoNumero());
      campoLivre.push(beneficiario.getCarteira().substring(0, 2));
    }

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [BancoBrasil.NUMERO_BANCO_BRASIL, BancoBrasil.DIGITO_BANCO_BRASIL].join('-');
  }

  getNumeroFormatado() {
    return BancoBrasil.NUMERO_BANCO_BRASIL;
  }

  getCarteiraFormatado(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  getCarteiraTexto(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  getCodigoFormatado(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/banco-do-brasil.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 17, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return [this.getNossoNumeroFormatado(beneficiario)].join('-');
  }

  getNome() {
    return 'Banco do Brasil S.A.';
  }

  getImprimirNome() {
    return false;
  }

  getAgenciaECodigoBeneficiario(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
    let codigo = this.getCodigoFormatado(beneficiario);

    if (digitoCodigo) {
      codigo += '-' + digitoCodigo;
    }

    return beneficiario.getAgenciaFormatada() + '/' + codigo;
  }

  static novoBancoBrasil() {
    return new BancoBrasil();
  }
}

module.exports = BancoBrasil;
