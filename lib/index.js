const Core = require('./core');
const Banks = require('./banks');
const formatacoes = require('./formatters');
const validacoes = require('./validators');
const StreamToPromise = require('./utils/stream');
const BoletosFacade = require('./metodosPublicos/boletoMetodos');
const Gerador = require('./generators/boleto-generator');

/**
 * @typedef {import('./core/boleto').Boleto} Boleto
 * @typedef {import('./core/beneficiario').Beneficiario} Beneficiario
 * @typedef {import('./core/pagador').Pagador} Pagador
 * @typedef {import('./core/datas').Datas} Datas
 * @typedef {import('./core/endereco').Endereco} Endereco
 */

/**
 * Biblioteca para geração de boletos bancários brasileiros
 *
 * @example
 * // Uso simplificado
 * const { Boleto, Banks } = require('gerar-boletos');
 *
 * const boleto = new Boleto({
 *   banco: new Banks.Bradesco(),
 *   valor: 100.00,
 *   // ...
 * });
 *
 * @example
 * // Uso com Builder pattern
 * const { entities } = require('gerar-boletos');
 *
 * const boleto = entities.Boleto.novo()
 *   .comBanco(entities.Banks.Bradesco)
 *   .comValor(100.50);
 */
module.exports = {
  // ===== API Simplificada =====
  /**
   * Classe principal para geração de boletos (wrapper simplificado)
   * @class
   */
  Boleto: BoletosFacade,

  /**
   * Bancos suportados
   * @enum
   * @property {Function} Bradesco - Banco Bradesco (237)
   * @property {Function} Itau - Banco Itaú (341)
   * @property {Function} BancoBrasil - Banco do Brasil (001)
   * @property {Function} Caixa - Caixa Econômica Federal (104)
   * @property {Function} Santander - Banco Santander (033)
   * @property {Function} Sicoob - Sicoob (756)
   * @property {Function} Sicredi - Sicredi (748)
   * @property {Function} Cecred - Cecred/Ailos (085)
   */
  Banks: Banks,

  // ===== Entidades e Builders (avançado) =====
  /**
   * Entidades do domínio (para uso avançado com builder pattern)
   * @namespace
   */
  entities: {
    /**
     * Entidade Boleto com builder pattern
     * @type {typeof Core.Boleto}
     */
    Boleto: Core.Boleto,

    /**
     * Entidade Beneficiário
     * @type {typeof Core.Beneficiario}
     */
    Beneficiario: Core.Beneficiario,

    /**
     * Entidade Pagador
     * @type {typeof Core.Pagador}
     */
    Pagador: Core.Pagador,

    /**
     * Entidade Datas
     * @type {typeof Core.Datas}
     */
    Datas: Core.Datas,

    /**
     * Value Object Endereço
     * @type {typeof Core.Endereco}
     */
    Endereco: Core.Endereco,

    /**
     * Gerador de PDF
     * @type {typeof Gerador}
     */
    Gerador: Gerador,

    /**
     * Bancos suportados
     * @type {typeof Banks}
     */
    Banks: Banks,
  },

  // ===== Utilitários =====
  /**
   * Funções de formatação (dinheiro, CPF/CNPJ, datas, etc)
   * @namespace
   */
  formatters: formatacoes,

  /**
   * Funções de validação (CPF/CNPJ, códigos de barras, etc)
   * @namespace
   */
  validators: validacoes,

  /**
   * Espécies de documento suportadas
   * @enum
   */
  documentTypes: Core.especiesDocumento,

  /**
   * Utilitário para converter stream em promise
   * @type {Function}
   */
  StreamToPromise,

  // ===== Aliases (backward compatibility) =====
  /** @deprecated Use `Boleto` instead */
  Boletos: BoletosFacade,

  /** @deprecated Use `Banks` instead */
  Bancos: Banks,

  /** @deprecated Use `formatters` instead */
  formatacoes,

  /** @deprecated Use `validators` instead */
  Validacoes: validacoes,
};
