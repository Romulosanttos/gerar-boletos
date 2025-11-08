const path = require('path');
const StringUtils = require('../../utils/string-utils');
const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

class Cecred {
  static NUMERO_CECRED = '085';
  static DIGITO_CECRED = '1';

  getTitulos() {
    return {
      instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
      nomeDoPagador: 'Pagador',
      especie: 'Moeda',
      quantidade: 'Quantidade',
      valor: 'x Valor',
      moraMulta: '(+) Moras / Multa',
    };
  }

  exibirReciboDoPagadorCompleto() {
    return true;
  }

  exibirCampoCip() {
    return true;
  }

  geraCodigoDeBarrasPara(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const errorMsg = 'Erro ao gerar código de barras,';

    if (!beneficiario.getNumeroConvenio() || beneficiario.getNumeroConvenio().length !== 6) {
      throw new Error(
        `${errorMsg} número convênio da cooperativa não possui 6 dígitos: ${beneficiario.getNumeroConvenio()}`
      );
    }
    if (!beneficiario.getNossoNumero() || beneficiario.getNossoNumero().length !== 17) {
      throw new Error(
        `${errorMsg} nosso número não possui 17 dígitos: ${beneficiario.getNossoNumero()}`
      );
    }
    if (!beneficiario.getCarteira() || beneficiario.getCarteira().length !== 2) {
      throw new Error(
        `${errorMsg} código carteira não possui 2 dígitos: ${beneficiario.getCarteira()}`
      );
    }

    const campoLivre = [];
    campoLivre.push(beneficiario.getNumeroConvenio());
    campoLivre.push(beneficiario.getNossoNumero());
    campoLivre.push(beneficiario.getCarteira().substring(0, 2));
    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [Cecred.NUMERO_CECRED, Cecred.DIGITO_CECRED].join('-');
  }

  getNumeroFormatado() {
    return Cecred.NUMERO_CECRED;
  }

  getCarteiraFormatado(beneficiario) {
    return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
  }

  getCarteiraTexto(beneficiario) {
    return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
  }

  getCodigoFormatado(beneficiario) {
    return StringUtils.pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/ailos.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return StringUtils.pad(beneficiario.getNossoNumero(), 11, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      StringUtils.pad(beneficiario.getCarteira(), 2, '0') +
      '/' +
      [this.getNossoNumeroFormatado(beneficiario), beneficiario.getDigitoNossoNumero()].join('-')
    );
  }

  getNome() {
    return 'Ailos';
  }

  getImprimirNome() {
    return false;
  }

  getLocaisDePagamentoPadrao() {
    return [
      'PAGAVEL PREFERENCIALMENTE NAS COOPERATIVAS DO SISTEMA AILOS.',
      'APOS VENCIMENTO PAGAR SOMENTE NA COOPERATIVA ',
    ];
  }

  getAgenciaECodigoBeneficiario(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
    let codigo = this.getCodigoFormatado(beneficiario);

    if (digitoCodigo) {
      codigo += '-' + digitoCodigo;
    }

    const agenciaComDigito =
      beneficiario.getAgenciaFormatada() + '-' + beneficiario.getDigitoAgencia();

    return agenciaComDigito + '/' + codigo;
  }

  static novoCecred() {
    return new Cecred();
  }
}

module.exports = Cecred;
