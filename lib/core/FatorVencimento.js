/**
 * Value Object responsável por calcular o Fator de Vencimento
 * conforme especificação FEBRABAN FB-009/2023
 *
 * @see https://portal.febraban.org.br/
 */
class FatorVencimento {
  static #DATA_BASE = new Date(1997, 10 - 1, 7); // 07/10/1997

  static #CONSTANTES = {
    LIMITE_MAXIMO: 9999,
    CICLO_RESET: 10000,
    INICIO_SEGUNDO_CICLO: 1000,
    DIGITOS_FATOR: 4,
    // Data limite do primeiro ciclo: 21/02/2025
    DATA_LIMITE_PRIMEIRO_CICLO: new Date(2025, 1, 21),
    // Data limite do segundo ciclo: 13/10/2049 (recalculado com início em 1000)
    DATA_LIMITE_SEGUNDO_CICLO: new Date(2049, 9, 13),
  };

  /**
   * Calcula o fator de vencimento para uma data
   * @param {Date} dataVencimento - Data de vencimento do boleto
   * @returns {string} Fator com 4 dígitos (ex: "0001", "1000", "9999")
   * @throws {Error} Para datas inválidas ou fora do range suportado
   */
  static calcular(dataVencimento) {
    this.#validarData(dataVencimento);

    const diasDesdeBase = this.#calcularDiasDesdeBase(dataVencimento);
    const fator = this.#aplicarCiclo(diasDesdeBase, dataVencimento);

    return fator.toString().padStart(this.#CONSTANTES.DIGITOS_FATOR, '0');
  }

  /**
   * Valida se a data de vencimento é válida
   * @private
   * @param {Date} data
   * @throws {Error} Se a data for inválida
   */
  static #validarData(data) {
    if (!data || !(data instanceof Date) || isNaN(data.getTime())) {
      throw new Error('Data de vencimento inválida');
    }

    if (data < this.#DATA_BASE) {
      throw new Error(
        'Data de vencimento não pode ser anterior a ' + this.#DATA_BASE.toLocaleDateString('pt-BR')
      );
    }
  }

  /**
   * Calcula diferença em dias desde a data base
   * @private
   * @param {Date} data
   * @returns {number} Dias desde 07/10/1997
   */
  static #calcularDiasDesdeBase(data) {
    return Math.floor((data.getTime() - this.#DATA_BASE.getTime()) / (1000 * 60 * 60 * 24));
  }

  /**
   * Aplica lógica de ciclos conforme FEBRABAN
   * @private
   * @param {number} diasDesdeBase - Dias desde 07/10/1997
   * @param {Date} dataVencimento - Data de vencimento
   * @returns {number} Fator calculado
   * @throws {Error} Se a data exceder os ciclos suportados
   */
  static #aplicarCiclo(diasDesdeBase, dataVencimento) {
    // Primeiro ciclo (1997-2025): usa valor direto até 9999
    if (diasDesdeBase <= this.#CONSTANTES.LIMITE_MAXIMO) {
      return diasDesdeBase;
    }

    // Segundo ciclo (2025-2049): subtrai 10000 e soma 1000 (conforme FB-009/2023)
    if (dataVencimento <= this.#CONSTANTES.DATA_LIMITE_SEGUNDO_CICLO) {
      const fator =
        diasDesdeBase - this.#CONSTANTES.CICLO_RESET + this.#CONSTANTES.INICIO_SEGUNDO_CICLO;

      if (fator > this.#CONSTANTES.LIMITE_MAXIMO) {
        throw new Error(
          'Data de vencimento excede o limite do segundo ciclo (até ' +
            this.#CONSTANTES.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') +
            ')'
        );
      }

      return fator;
    }

    // Após 2049: aguardando nova definição FEBRABAN
    throw new Error(
      'Data de vencimento após ' +
        this.#CONSTANTES.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') +
        '. Aguardando nova especificação FEBRABAN para terceiro ciclo.'
    );
  }
}

module.exports = FatorVencimento;
