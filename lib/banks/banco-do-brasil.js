const path = require('path');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../generators/barcode-builder');

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
    const nossoNumero = beneficiario.getNossoNumero();
    const convenio = beneficiario.getNumeroConvenio();

    // Validação do convênio: deve ter 4, 6 ou 7 dígitos
    if (convenio) {
      const convenioLength = convenio.toString().length;
      if (convenioLength !== 4 && convenioLength !== 6 && convenioLength !== 7) {
        throw new Error(
          'Banco do Brasil: Convênio deve ter 4, 6 ou 7 dígitos. Recebido: ' + 
          convenioLength + ' dígitos'
        );
      }

      // Validação especial: carteira 21 com convênio 6 dígitos
      // deve ter nosso número de 17 dígitos (sem o convênio)
      const carteira = beneficiario.getCarteira();
      if (convenioLength === 6 && carteira === '21') {
        if (nossoNumero.length !== 17) {
          throw new Error(
            'Banco do Brasil: Carteira 21 com convênio de 6 dígitos ' +
            'requer nosso número de 17 dígitos. Recebido: ' + 
            nossoNumero.length + ' dígitos'
          );
        }
      }

      // Validação: convênio 7 dígitos requer nosso número de 17 dígitos
      if (convenioLength === 7 && nossoNumero.length !== 17) {
        throw new Error(
          'Banco do Brasil: Convênio de 7 dígitos requer nosso número ' +
          'de 17 dígitos. Recebido: ' + nossoNumero.length + ' dígitos'
        );
      }

      // Validação: convênio 4 ou 6 dígitos (carteira != 21) requer nosso número de 11 dígitos
      if ((convenioLength === 4 || (convenioLength === 6 && carteira !== '21')) && 
          nossoNumero.length !== 11) {
        throw new Error(
          'Banco do Brasil: Convênio de ' + convenioLength + ' dígitos ' +
          'requer nosso número de 11 dígitos. Recebido: ' + 
          nossoNumero.length + ' dígitos'
        );
      }
    }

    const campoLivre = [];

    if (nossoNumero.length === 11) {
      campoLivre.push(nossoNumero);
      campoLivre.push(beneficiario.getAgenciaFormatada());
      campoLivre.push(this.getCodigoFormatado(beneficiario));
      // Fix: Usar getCarteiraFormatado e pegar apenas 2 primeiros caracteres
      campoLivre.push(this.getCarteiraFormatado(beneficiario).substring(0, 2));
    }

    if (nossoNumero.length === 17) {
      campoLivre.push('000000');
      campoLivre.push(nossoNumero);
      // Fix: Usar getCarteiraFormatado e pegar apenas 2 primeiros caracteres
      campoLivre.push(this.getCarteiraFormatado(beneficiario).substring(0, 2));
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
    // Banco do Brasil: conta deve ter 8 dígitos para campo livre correto (25 posições)
    // Campo livre = nossoNumero(11) + agencia(4) + conta(8) + carteira(2) = 25
    return pad(beneficiario.getCodigoBeneficiario(), 8, '0');
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
