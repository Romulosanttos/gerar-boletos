const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

class Santander {
  static NUMERO_SANTANDER = '033';
  static DIGITO_SANTANDER = '7';

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
    const beneficiario = boleto.getBeneficiario(),
      campoLivre = [];

    campoLivre.push('9');
    campoLivre.push(beneficiario.getCodigoBeneficiario().substring(0, 4));
    campoLivre.push(beneficiario.getCodigoBeneficiario().substring(4));
    campoLivre.push(this.getNossoNumeroFormatado(beneficiario).substring(0, 7));
    campoLivre.push(this.getNossoNumeroFormatado(beneficiario).substring(7));
    campoLivre.push(beneficiario.getDigitoNossoNumero());
    campoLivre.push('0');
    campoLivre.push(this.getCarteiraFormatado(beneficiario));

    return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
  }

  getNumeroFormatadoComDigito() {
    return [Santander.NUMERO_SANTANDER, Santander.DIGITO_SANTANDER].join('-');
  }

  getNumeroFormatado() {
    return Santander.NUMERO_SANTANDER;
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
    return path.join(__dirname, 'logotipos/santander.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 12, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return [this.getNossoNumeroFormatado(beneficiario), beneficiario.getDigitoNossoNumero()].join(
      '-'
    );
  }

  getNome() {
    return 'Banco Santander S.A.';
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

  static novoSantander() {
    return new Santander();
  }
}

module.exports = Santander;
