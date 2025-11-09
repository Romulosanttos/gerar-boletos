const path = require('path');
const StringUtils = require('../../utils/string');
const pad = StringUtils.pad;
const insert = StringUtils.insert;

const GeradorDeDigitoPadrao = require('../digit-generator');
const CodigoDeBarrasBuilder = require('../barcode-builder');

//Varias coisas implementadas inclusive arquivos de retorno
//https://github.com/kivanio/brcobranca
//https://github.com/pagarme/node-boleto

//Várias validações
//http://ghiorzi.org/DVnew.htm

class Itau {
  static NUMERO_ITAU = '341';
  static DIGITO_ITAU = '7';

  getTitulos() {
    return {};
  }

  exibirReciboDoPagadorCompleto() {
    return false;
  }

  exibirCampoCip() {
    return false;
  }

  geraCodigoDeBarrasPara(boleto) {
    const beneficiario = boleto.getBeneficiario();

    // Validações de carteira - Itaú aceita múltiplas carteiras para diferentes modalidades
    const carteirasValidas = [
      '104',
      '105',
      '107',
      '109',
      '112',
      '115',
      '117',
      '118',
      '119',
      '121',
      '122',
      '126',
      '131',
      '134',
      '135',
      '136',
      '142',
      '143',
      '146',
      '147',
      '150',
      '157',
      '169',
      '174',
      '175',
      '180',
      '188',
      '191',
      '196',
      '198',
    ];
    const carteiraOriginal = beneficiario.getCarteira();
    const carteira = this.getCarteiraFormatado(beneficiario);

    if (!carteiraOriginal || !carteirasValidas.includes(carteira)) {
      throw new Error(
        `Itaú: Carteira inválida. Carteiras aceitas: ${carteirasValidas.join(', ')}. ` +
          `Recebido: "${carteiraOriginal || ''}"`
      );
    }

    // Validação do nosso número - deve ter até 8 dígitos
    const nossoNumero = beneficiario.getNossoNumero();
    if (!nossoNumero || nossoNumero.length > 8) {
      throw new Error(
        'Itaú: Nosso número deve ter até 8 dígitos. ' +
          `Recebido: "${nossoNumero || ''}" (${(nossoNumero || '').length} dígitos)`
      );
    }

    let campoLivre = [];

    // Campo Livre Itaú - 25 posições conforme SISPAG CNAB-85
    // Estrutura: CCC NNNNNNNN AAAA BBBBB 000 + 2 DVs
    // CCC: Carteira, NNNNNNNN: Nosso Número, AAAA: Agência
    // BBBBB: Código Beneficiário, 000: Constante
    campoLivre.push(carteira); // 3 chars
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
  }

  getNumeroFormatadoComDigito() {
    return [Itau.NUMERO_ITAU, Itau.DIGITO_ITAU].join('-');
  }

  getCarteiraFormatado(beneficiario) {
    return pad(beneficiario.getCarteira(), 3, '0');
  }

  getCarteiraTexto(beneficiario) {
    return this.getCarteiraFormatado(beneficiario);
  }

  getCodigoFormatado(beneficiario) {
    return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
  }

  getImagem() {
    return path.join(__dirname, 'logotipos/itau.png');
  }

  getNossoNumeroFormatado(beneficiario) {
    return pad(beneficiario.getNossoNumero(), 8, '0');
  }

  getNossoNumeroECodigoDocumento(boleto) {
    const beneficiario = boleto.getBeneficiario();

    return (
      [beneficiario.getCarteira(), this.getNossoNumeroFormatado(beneficiario)].join('/') +
      '-' +
      beneficiario.getDigitoNossoNumero()
    );
  }

  getNumeroFormatado() {
    return Itau.NUMERO_ITAU;
  }

  getNome() {
    return 'Banco Itaú S/A';
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

  static novoItau() {
    return new Itau();
  }
}

module.exports = Itau;
