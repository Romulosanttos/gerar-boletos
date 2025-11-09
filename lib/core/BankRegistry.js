/**
 * Registry para gerenciar instâncias de bancos
 * Implementa padrão Registry + Factory para desacoplar Boleto dos bancos
 *
 * Benefícios:
 * - Adicionar novos bancos sem modificar código existente (Open/Closed Principle)
 * - Desacopla Boleto das implementações concretas de bancos
 * - Facilita testes (pode registrar mocks)
 *
 * @example
 * // Registrar um banco
 * BankRegistry.register('Itau', Itau);
 * BankRegistry.register('341', Itau);
 *
 * // Obter instância
 * const banco = BankRegistry.get('Itau');
 * const bancoPorCodigo = BankRegistry.get('341');
 */
class BankRegistry {
  static #banks = new Map();

  /**
   * Registra um banco no registry
   *
   * @param {string|number} identifier - Nome ou código do banco
   * @param {Function} BankClass - Classe do banco (constructor)
   *
   * @example
   * BankRegistry.register('Itau', Itau);
   * BankRegistry.register('341', Itau);
   */
  static register(identifier, BankClass) {
    this.#banks.set(String(identifier), BankClass);
  }

  /**
   * Obtém instância de um banco
   *
   * @param {string|number} identifier - Nome ou código do banco
   * @returns {Object} Nova instância do banco
   * @throws {Error} Se banco não estiver registrado
   *
   * @example
   * const itau = BankRegistry.get('Itau');
   * const bradesco = BankRegistry.get('237');
   */
  static get(identifier) {
    const BankClass = this.#banks.get(String(identifier));

    if (!BankClass) {
      throw new Error(`Banco não encontrado: ${identifier}`);
    }

    return new BankClass();
  }

  /**
   * Lista todos os identificadores de bancos registrados
   *
   * @returns {string[]} Array com identificadores
   *
   * @example
   * const bancos = BankRegistry.list();
   * // ['Itau', '341', 'Bradesco', '237', ...]
   */
  static list() {
    return Array.from(this.#banks.keys());
  }

  /**
   * Verifica se um banco está registrado
   *
   * @param {string|number} identifier - Nome ou código do banco
   * @returns {boolean} true se o banco está registrado
   *
   * @example
   * if (BankRegistry.has('Itau')) {
   *   const banco = BankRegistry.get('Itau');
   * }
   */
  static has(identifier) {
    return this.#banks.has(String(identifier));
  }

  /**
   * Remove um banco do registry (útil para testes)
   *
   * @param {string|number} identifier - Nome ou código do banco
   * @returns {boolean} true se o banco foi removido
   *
   * @example
   * BankRegistry.unregister('Itau');
   */
  static unregister(identifier) {
    return this.#banks.delete(String(identifier));
  }

  /**
   * Limpa todos os bancos registrados (útil para testes)
   *
   * @example
   * BankRegistry.clear();
   */
  static clear() {
    this.#banks.clear();
  }

  /**
   * Retorna o número de bancos registrados
   *
   * @returns {number} Quantidade de bancos
   *
   * @example
   * console.log(BankRegistry.size()); // 16
   */
  static size() {
    return this.#banks.size;
  }
}

module.exports = BankRegistry;
