const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

class Sicredi {
  static NUMERO_SICREDI = '748';
  static DIGITO_SICREDI = 'X';

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
    const carteira = beneficiario.getCarteira();
    const nossoNumero = beneficiario.getNossoNumero();

    // Validações Sicredi
    const carteirasValidas = ['1', '3', '01', '03'];
    if (!carteirasValidas.includes(carteira)) {
      throw new Error(
        'Sicredi: Carteira inválida. Carteiras aceitas: 1 (cobrança simples), 3 (cobrança caucionada). ' +
          `Recebido: ${carteira}`
      );
    }

    if (!nossoNumero || nossoNumero.length > 8) {
      throw new Error(
        'Sicredi: Nosso número deve ter até 8 dígitos. ' +
          `Recebido: ${nossoNumero?.length || 0} dígitos`
      );
    }

    const campoLivre = [];

    const arrayDigitoCampoLivre = (
      '1' +
      this.getCarteiraFormatado(beneficiario) +
      beneficiario.getNossoNumero() +
      beneficiario.getDigitoNossoNumero() +
      beneficiario.getAgenciaFormatada() +
      beneficiario.getCodigoBeneficiario() +
      '10'
    ).split('');
    const pesos = [
      9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3,
      2,
    ];

    let soma = 0;

    for (let i = 0; i < arrayDigitoCampoLivre.length; i++) {
      if (parseInt(arrayDigitoCampoLivre[i]) !== 0) {
        soma += pesos[i] * parseInt(arrayDigitoCampoLivre[i]);
      }
    }
    let digCampoLivre = soma % 11;
    if (digCampoLivre === 1 || digCampoLivre === 0) {
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
  }

  getNumeroFormatadoComDigito() {
    return [Sicredi.NUMERO_SICREDI, Sicredi.DIGITO_SICREDI].join('-');
  }

  getNumeroFormatado() {
    return Sicredi.NUMERO_SICREDI;
  }

  getCarteiraFormatado(beneficiario) {
    // Para Sicredi, carteira deve ter apenas 1 dígito
    const carteira = beneficiario.getCarteira();
    return carteira.charAt(carteira.length - 1); // Pega o último dígito
  }

  getCarteiraTexto(beneficiario) {
    return pad(beneficiario.getCarteira(), 2, '0');
  }

  getCodigoFormatado(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/sicredi.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 8, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      this.getNossoNumeroFormatado(beneficiario).substring(0, 2) +
      '/' +
      [
        this.getNossoNumeroFormatado(beneficiario).substring(2),
        beneficiario.getDigitoNossoNumero(),
      ].join('-')
    );
  }

  getNome() {
    return 'Sicredi';
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

  static novoSicredi() {
    return new Sicredi();
  }
}

module.exports = Sicredi;
