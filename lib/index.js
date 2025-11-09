const BoletoUtils = require('./core/boleto');
const formatacoes = require('./formatters');
const validacoes = require('./validators');
const StreamToPromise = require('./utils/stream');
const BoletosFacade = require('./metodosPublicos/boletoMetodos');

/**
 * @typedef {import('./core/boleto').Boleto} Boleto
 * @typedef {import('./core/boleto').Beneficiario} Beneficiario
 * @typedef {import('./core/boleto').Pagador} Pagador
 * @typedef {import('./core/boleto').Datas} Datas
 * @typedef {import('./core/boleto').Endereco} Endereco
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
  Banks: BoletoUtils.bancos,

  // ===== Entidades e Builders (avançado) =====
  /**
   * Entidades do domínio (para uso avançado com builder pattern)
   * @namespace
   */
  entities: {
    /**
     * Entidade Boleto com builder pattern
     * @type {typeof BoletoUtils.Boleto}
     */
    Boleto: BoletoUtils.Boleto,

    /**
     * Entidade Beneficiário
     * @type {typeof BoletoUtils.Beneficiario}
     */
    Beneficiario: BoletoUtils.Beneficiario,

    /**
     * Entidade Pagador
     * @type {typeof BoletoUtils.Pagador}
     */
    Pagador: BoletoUtils.Pagador,

    /**
     * Entidade Datas
     * @type {typeof BoletoUtils.Datas}
     */
    Datas: BoletoUtils.Datas,

    /**
     * Value Object Endereço
     * @type {typeof BoletoUtils.Endereco}
     */
    Endereco: BoletoUtils.Endereco,

    /**
     * Gerador de PDF
     * @type {typeof BoletoUtils.Gerador}
     */
    Gerador: BoletoUtils.Gerador,
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
  documentTypes: BoletoUtils.especiesDeDocumento,

  /**
   * Utilitário para converter stream em promise
   * @type {Function}
   */
  StreamToPromise,

  // ===== Aliases (backward compatibility) =====
  /** @deprecated Use `Boleto` instead */
  Boletos: BoletosFacade,

  /** @deprecated Use `Banks` instead */
  Bancos: BoletoUtils.bancos,

  /** @deprecated Use `formatters` instead */
  formatacoes,

  /** @deprecated Use `validators` instead */
  Validacoes: validacoes,
};
