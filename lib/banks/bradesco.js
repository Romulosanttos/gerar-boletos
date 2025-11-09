const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

class Bradesco {
  static NUMERO_BRADESCO = '237';
  static DIGITO_BRADESCO = '2';

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
    return true;
  }

  geraCodigoDeBarrasPara(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const carteira = beneficiario.getCarteira();
    const nossoNumero = beneficiario.getNossoNumero();

    // Validações Bradesco
    const carteirasValidas = ['03', '04', '06', '09', '19', '21', '22', '23', '24', '25', '26'];
    if (!carteirasValidas.includes(carteira)) {
      throw new Error(
        `Bradesco: Carteira inválida. Carteiras aceitas: ${carteirasValidas.join(', ')}. ` +
        `Recebido: ${carteira}`
      );
    }

    if (!nossoNumero || nossoNumero.length > 11) {
      throw new Error(
        `Bradesco: Nosso número deve ter até 11 dígitos. ` +
        `Recebido: ${nossoNumero?.length || 0} dígitos`
      );
    }

    const campoLivre = [];

    campoLivre.push(beneficiario.getAgenciaFormatada());
    campoLivre.push(this.getCarteiraFormatado(beneficiario));
    campoLivre.push(this.getNossoNumeroFormatado(beneficiario));
    campoLivre.push(this.getCodigoFormatado(beneficiario));
    campoLivre.push('0');

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [Bradesco.NUMERO_BRADESCO, Bradesco.DIGITO_BRADESCO].join('-');
  }

  getNumeroFormatado() {
    return Bradesco.NUMERO_BRADESCO;
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
    return path.join(__dirname, 'logotipos/bradesco.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 11, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      this.getCarteiraFormatado(beneficiario) +
      '/' +
      [this.getNossoNumeroFormatado(beneficiario), beneficiario.getDigitoNossoNumero()].join('-')
    );
  }

  getNome() {
    return 'Banco Bradesco S.A.';
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

  static novoBradesco() {
    return new Bradesco();
  }
}

module.exports = Bradesco;
