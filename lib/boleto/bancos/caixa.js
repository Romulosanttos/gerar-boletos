const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');
const GeradorDeDigitoPadrao = require('../gerador-de-digito-padrao');

class Caixa {
  static NUMERO_CAIXA = '104';
  static DIGITO_CAIXA = '0';

  getTitulos() {
    return {
      instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
      nomeDoPagador: 'Nome do Pagador',
      especie: 'Espécie Moeda',
      quantidade: 'Quantidade Moeda',
      valor: 'xValor',
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
    const carteira = beneficiario.getCarteira();
    const contaCorrente = pad(beneficiario.getCodigoBeneficiario(), 6, '0');
    const nossoNumeroFormatado = this.getNossoNumeroFormatado(beneficiario);
    const campoLivre = [];

    if (carteira === '14' || carteira === '24') {
      // Carteira 24 é sem registro e carteira 14 é com registro
      // O número 1 significa com registro e o número 2 sem registro

      campoLivre.push(contaCorrente);
      campoLivre.push(beneficiario.getDigitoCodigoBeneficiario());
      campoLivre.push(nossoNumeroFormatado.substring(2, 5));
      campoLivre.push(nossoNumeroFormatado.substring(0, 1));
      campoLivre.push(nossoNumeroFormatado.substring(5, 8));
      campoLivre.push(nossoNumeroFormatado.substring(1, 2));
      campoLivre.push(nossoNumeroFormatado.substring(8));

      const digito = GeradorDeDigitoPadrao.mod11(campoLivre.join(''), {
        de: [0, 10, 11],
        para: 0,
      });

      campoLivre.push(digito);
    } else {
      throw new Error('Carteira "' + carteira + '" não implementada para o banco Caixa');
    }

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [Caixa.NUMERO_CAIXA, Caixa.DIGITO_CAIXA].join('-');
  }

  getCarteiraFormatado(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  getCarteiraTexto(beneficiario) {
    return {
      1: 'RG',
      14: 'RG',
      2: 'SR',
      24: 'SR',
    }[beneficiario.getCarteira()];
  }

  getCodigoFormatado(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/caixa-economica-federal.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return [
      pad(beneficiario.getCarteira(), 2, '0'),
      pad(beneficiario.getNossoNumero(), 15, '0'),
    ].join('');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return [this.getNossoNumeroFormatado(beneficiario), beneficiario.getDigitoNossoNumero()].join(
      '-'
    );
  }

  getNumeroFormatado() {
    return Caixa.NUMERO_CAIXA;
  }

  getNome() {
    return 'Caixa Econômica Federal S/A';
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

  static novoCaixa() {
    return new Caixa();
  }
}

module.exports = Caixa;
