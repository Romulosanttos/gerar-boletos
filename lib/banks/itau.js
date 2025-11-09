const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const GeradorDeDigitoPadrao = require('../generators/digit-generator');
const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

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
    const carteira = beneficiario.getCarteira();
    const nossoNumero = beneficiario.getNossoNumero();

    // Carteiras especiais com nosso número de 15 posições
    const carteirasEspeciais = ['107', '122', '142', '143', '196', '198'];

    // Validação básica
    if (!carteira) {
      throw new Error('Itaú: Carteira é obrigatória');
    }

    if (!nossoNumero) {
      throw new Error('Itaú: Nosso número é obrigatório');
    }

    const campoLivre = [];

    // Carteiras especiais 107, 122, 142, 143, 196, 198 - Nosso Número com 15 posições
    if (carteirasEspeciais.includes(carteira)) {
      // Validação: nosso número deve ter até 8 dígitos para essas carteiras
      // Os 7 dígitos adicionais vêm do número do documento
      if (nossoNumero.length > 8) {
        throw new Error(
          `Itaú: Para carteira ${carteira}, nosso número deve ter até 8 dígitos. ` +
            `Recebido: ${nossoNumero.length} dígitos`
        );
      }

      const carteiraFormatada = pad(carteira, 3, '0');
      const nossoNumeroFormatado = pad(nossoNumero, 8, '0');
      const numeroDocumento = pad(boleto.getNumeroDoDocumento() || '0', 7, '0');
      const codigoCliente = this.getCodigoFormatado(beneficiario);

      // Estrutura: CCC NNNNNNNN DDDDDDD CCCCC DV 0
      // CCC: Carteira (3), NNNNNNNN: Nosso Número (8), DDDDDDD: Número Documento (7)
      // CCCCC: Código Cliente (5), DV: Dígito Verificador (1), 0: Fixo (1)
      const codigo = carteiraFormatada + nossoNumeroFormatado + numeroDocumento + codigoCliente;

      const dv = GeradorDeDigitoPadrao.mod10(codigo);

      return new CodigoDeBarrasBuilder(boleto).comCampoLivre([codigo, dv, '0']);
    }

    // Carteiras normais - Nosso Número com 8 posições
    // Validação: nosso número deve ter até 8 dígitos
    if (nossoNumero.length > 8) {
      throw new Error(
        'Itaú: Nosso número deve ter até 8 dígitos. ' + `Recebido: ${nossoNumero.length} dígitos`
      );
    }

    const carteiraFormatada = this.getCarteiraFormatado(beneficiario);
    const nossoNumeroFormatado = this.getNossoNumeroFormatado(beneficiario);
    const agenciaFormatada = beneficiario.getAgenciaFormatada();
    const codigoFormatado = this.getCodigoFormatado(beneficiario);

    // Carteiras 126, 131, 146, 150, 168: DV calculado apenas com carteira + nosso número
    const carteirasComDvSimples = ['126', '131', '146', '150', '168'];
    let dvAgContaCarteira;

    if (carteirasComDvSimples.includes(carteira)) {
      dvAgContaCarteira = GeradorDeDigitoPadrao.mod10(carteiraFormatada + nossoNumeroFormatado);
    } else {
      // Demais carteiras: DV calculado com agência + conta + carteira + nosso número
      dvAgContaCarteira = GeradorDeDigitoPadrao.mod10(
        agenciaFormatada + codigoFormatado + carteiraFormatada + nossoNumeroFormatado
      );
    }

    // DV da agência/conta
    const dvAgConta = GeradorDeDigitoPadrao.mod10(agenciaFormatada + codigoFormatado);

    // Estrutura campo livre padrão: CCC NNNNNNNN D AAAA CCCCC D 000
    // CCC: Carteira (3), NNNNNNNN: Nosso Número (8), D: DV (1)
    // AAAA: Agência (4), CCCCC: Código (5), D: DV (1), 000: Fixo (3)
    campoLivre.push(carteiraFormatada);
    campoLivre.push(nossoNumeroFormatado);
    campoLivre.push(dvAgContaCarteira);
    campoLivre.push(agenciaFormatada);
    campoLivre.push(codigoFormatado);
    campoLivre.push(dvAgConta);
    campoLivre.push('000');

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
