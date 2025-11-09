const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

class Sicoob {
  static NUMERO_SICOOB = '756';
  static DIGITO_SICOOB = '0';

  getTitulos() {
    return {
      localDoPagamento: 'Local de Pagamento',
      especieDoDocumento: 'Espécie',
      instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
      agenciaECodigoDoBeneficiario: 'Coop. contratante/Cód. Beneficiário',
      valorDoDocumento: 'Valor Documento',
      igualDoValorDoDocumento: '',
      nomeDoPagador: 'Nome do Pagador',
    };
  }

  exibirReciboDoPagadorCompleto() {
    return false;
  }

  exibirCampoCip() {
    return false;
  }

  geraCodigoDeBarrasPara(boleto) {
    const beneficiario = boleto.getBeneficiario();
    const carteira = beneficiario.getCarteira();
    const nossoNumero = beneficiario.getNossoNumero();

    // Validações Sicoob
    if (!carteira) {
      throw new Error('Sicoob: Carteira é obrigatória');
    }

    if (!nossoNumero || nossoNumero.length > 7) {
      throw new Error(
        'Sicoob: Nosso número deve ter até 7 dígitos. ' +
          `Recebido: ${nossoNumero?.length || 0} dígitos`
      );
    }

    let campoLivre = [];

    campoLivre.push(this.getCarteiraFormatado(beneficiario));
    campoLivre.push(beneficiario.getAgenciaFormatada());
    campoLivre.push(pad(beneficiario.getCarteira(), 2, '0'));
    campoLivre.push(this.getCodigoFormatado(beneficiario));
    campoLivre.push(this.getNossoNumeroFormatado(beneficiario));
    campoLivre.push(beneficiario.getDigitoNossoNumero());
    campoLivre.push('001');

    campoLivre = campoLivre.join('');

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [Sicoob.NUMERO_SICOOB, Sicoob.DIGITO_SICOOB].join('-');
  }

  getCarteiraFormatado(beneficiario) {
    return pad(beneficiario.getCarteira(), 1, '0');
  }

  getCarteiraTexto(beneficiario) {
    return this.getCarteiraFormatado(beneficiario);
  }

  getCodigoFormatado(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/sicoob.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 7, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      pad(beneficiario.getCarteira(), 2, '0') +
      '/' +
      [this.getNossoNumeroFormatado(beneficiario), beneficiario.getDigitoNossoNumero()].join('-')
    );
  }

  getNumeroFormatado() {
    return Sicoob.NUMERO_SICOOB;
  }

  getNome() {
    return '';
  }

  getImprimirNome() {
    return true;
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

  static novoSicoob() {
    return new Sicoob();
  }
}

module.exports = Sicoob;
