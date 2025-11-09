const StringUtils = require('../utils/string');
const { pad } = StringUtils;

/**
 * Value Object responsável por formatação de valores monetários
 */
class Valor {
  /**
   * Formata valor monetário para string com padding (10 dígitos)
   * Usado internamente para geração de boletos
   *
   * @param {number} valor - Valor numérico (ex: 110.50)
   * @returns {string} Valor formatado com 10 dígitos (ex: "0000011050")
   *
   * @example
   * Valor.formatarParaBoleto(110.50)  // "0000011050"
   * Valor.formatarParaBoleto(1234.56) // "0000123456"
   */
  static formatarParaBoleto(valor) {
    const valorArray = valor.toString().split('.');
    const inteiros = valorArray[0];
    let decimais = valorArray.length > 1 ? valorArray[1] : '00';

    decimais = pad(decimais, 2, '0', 'right').substr(0, 2);

    return pad(inteiros + decimais, 10, '0');
  }

  /**
   * Formata string de boleto para formato BRL legível (R$ 1.234,56)
   *
   * @param {string} valorFormatado - String de 10 dígitos (ex: "0000011050")
   * @returns {string} Valor em formato BRL (ex: "R$ 110,50")
   *
   * @example
   * Valor.formatarParaBRL("0000011050") // "R$ 110,50"
   * Valor.formatarParaBRL("0000123456") // "R$ 1.234,56"
   */
  static formatarParaBRL(valorFormatado) {
    let zeroAEsquerda = true;
    let i = -1;

    const parteInteira =
      valorFormatado
        .substr(0, 8)
        .split('')
        .reduce((acc, cur) => {
          if (cur === '0' && zeroAEsquerda) {
            return acc;
          }
          zeroAEsquerda = false;
          return acc + cur;
        }, '')
        .split('')
        .reduceRight((acc, cur) => {
          i++;
          return cur + (i !== 0 && i % 3 === 0 ? '.' : '') + acc;
        }, '') || 0;

    const parteDecimal = valorFormatado.substr(8, 2);

    return `R$ ${parteInteira},${parteDecimal}`;
  }

  /**
   * Converte valor numérico diretamente para formato BRL legível
   * Combina formatarParaBoleto() + formatarParaBRL() em uma chamada
   *
   * @param {number} valor - Valor numérico (ex: 110.50)
   * @returns {string} Valor em formato BRL (ex: "R$ 110,50")
   *
   * @example
   * Valor.paraReal(110.50)  // "R$ 110,50"
   * Valor.paraReal(1234.56) // "R$ 1.234,56"
   */
  static paraReal(valor) {
    return this.formatarParaBRL(this.formatarParaBoleto(valor));
  }
}

module.exports = Valor;
