const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const Pagador = require('./pagador');
const Beneficiario = require('./beneficiario');
const Datas = require('./datas');
const Endereco = require('./endereco');

const Itau = require('../banks/itau');
const Caixa = require('../banks/caixa');
const Bradesco = require('../banks/bradesco');
const BancoBrasil = require('../banks/banco-do-brasil');
const Cecred = require('../banks/cecred');
const Sicoob = require('../banks/sicoob');
const Santander = require('../banks/santander');
const Sicredi = require('../banks/sicredi');

const Gerador = require('../generators/boleto-generator');
const GeradorDeLinhaDigitavel = require('../generators/line-formatter');

const especiesDeDocumento = {
  //TODO: Ordenar por ordem alfabética
  DMI: 'Duplicata de Venda Mercantil por Indicação',
  DM: 'Duplicata de Venda Mercantil',
  DSI: 'Duplicata de Prestação de Serviços por Indicação de Comprovante',
  NP: 'Nota Promissória',
  ME: 'Mensalidade Escolar',
  DS: 'Duplicata de Prestação de Serviços Original',
  CT: 'Espécie de Contrato',
  LC: 'Letra de Câmbio',
  CPS: 'Conta de Prestação de Serviços de Profissional Liberal ou Declaração do Profissional',
  EC: 'Encargos Condominiais',
  DD: 'Documento de Dívida',
  CCB: 'Cédula de Crédito Bancário',
  CBI: 'Cédula de Crédito Bancário por Indicação',
  CH: 'Cheque',
  CM: 'Contrato de Mútuo',
  RA: 'Recibo de Aluguel Para Pessoa Jurídica (Contrato Aluguel e Recibo)',
  CD: 'Confissão de Dívida Apenas Para Falência de Declaração do Devedor',
  FS: 'Fatura de Serviço',
  TA: 'Termo de Acordo - Ex. Ação Trabalhista',
  CC: 'Contrato de Câmbio',
  DV: 'Diversos',
};

const bancos = {
  Itau: Itau,
  341: Itau,

  Caixa: Caixa,
  104: Caixa,

  Bradesco: Bradesco,
  237: Bradesco,

  BancoBrasil: BancoBrasil,
  '001': BancoBrasil,

  Cecred: Cecred,
  '085': Cecred,

  Sicoob: Sicoob,
  756: Sicoob,

  Santander: Santander,
  '033': Santander,

  Sicredi: Sicredi,
  748: Sicredi,
};

module.exports.Gerador = Gerador;

class Boleto {
  /**
   * Data base para cálculo do fator de vencimento conforme padrão FEBRABAN
   * 07 de outubro de 1997 - Data inicial do sistema de cobrança bancária
   */
  static #DATA_BASE = new Date(1997, 10 - 1, 7);

  /**
   * Constantes para o ciclo do fator de vencimento
   * FEBRABAN definiu que após atingir 9999, o contador reinicia em 1000
   */
  static #FATOR_VENCIMENTO = {
    LIMITE_MAXIMO: 9999,
    CICLO_RESET: 10000,
    INICIO_SEGUNDO_CICLO: 1000, // FEBRABAN FB-009/2023: reinicia em 1000
    DIGITOS_FATOR: 4,
    // Data limite do primeiro ciclo: 21/02/2025
    DATA_LIMITE_PRIMEIRO_CICLO: new Date(2025, 1, 21),
    // Data limite do segundo ciclo: 13/10/2049 (recalculado com início em 1000)
    DATA_LIMITE_SEGUNDO_CICLO: new Date(2049, 9, 13),
  };

  /**
   * Formata valor monetário para string com padding
   * @private
   */
  static #formatarValor(valor) {
    const valorArray = valor.toString().split('.');
    const inteiros = valorArray[0];
    let decimais = valorArray.length > 1 ? valorArray[1] : '00';

    decimais = pad(decimais, 2, '0', 'right').substr(0, 2);

    return pad(inteiros + decimais, 10, '0');
  }

  /**
   * Formata valor em BRL (R$ 1.234,56)
   * @private
   */
  static #formatarBRL(valor) {
    let zeroAEsquerda = true,
      i = -1;

    return (
      'R$ ' +
      (valor
        .substr(0, 8)
        .split('')
        .reduce(function (acc, cur) {
          if (cur === '0' && zeroAEsquerda) {
            return acc;
          }

          zeroAEsquerda = false;
          return acc + cur;
        }, '')
        .split('')
        .reduceRight(function (acc, cur) {
          i++;
          return cur + (i !== 0 && i % 3 === 0 ? '.' : '') + acc;
        }, '') || 0) +
      ',' +
      valor.substr(8, 2)
    );
  }

  /**
   * Calcula o fator de vencimento conforme especificação FEBRABAN
   *
   * Regras implementadas (FB-009/2023):
   * - Período 1 (07/10/1997 a 21/02/2025): Fator 0001 a 9999
   * - Período 2 (22/02/2025 a 13/10/2049): Fator 1000 a 9999 (reinicia em 1000)
   * - Após 13/10/2049: Aguardando nova definição FEBRABAN
   *
   * @returns {string} Fator de vencimento com 4 dígitos (ex: "0001", "1000", "9999")
   * @throws {Error} Para datas inválidas ou fora do range suportado
   */
  getFatorVencimento() {
    const vencimento = this.getDatas().getVencimento();

    // Validações básicas
    if (!vencimento || !(vencimento instanceof Date) || isNaN(vencimento.getTime())) {
      throw new Error('Data de vencimento inválida');
    }

    if (vencimento < Boleto.#DATA_BASE) {
      throw new Error(
        'Data de vencimento não pode ser anterior a ' +
          Boleto.#DATA_BASE.toLocaleDateString('pt-BR')
      );
    }

    // Calcula diferença em dias desde a data base
    const diferencaEmDias = Math.floor(
      (vencimento.getTime() - Boleto.#DATA_BASE.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Aplica lógica do ciclo conforme FEBRABAN
    const fatorVencimento = this._calcularFatorComCiclo(diferencaEmDias, vencimento);

    // Garante formato com 4 dígitos
    return fatorVencimento.toString().padStart(Boleto.#FATOR_VENCIMENTO.DIGITOS_FATOR, '0');
  }

  /**
   * Calcula o fator considerando os ciclos definidos pela FEBRABAN
   * @private
   * @param {number} diasDesdeBase - Dias desde 07/10/1997
   * @param {Date} dataVencimento - Data de vencimento do boleto
   * @returns {number} Fator de vencimento calculado
   */
  _calcularFatorComCiclo(diasDesdeBase, dataVencimento) {
    // Primeiro ciclo (1997-2025): usa valor direto até 9999
    if (diasDesdeBase <= Boleto.#FATOR_VENCIMENTO.LIMITE_MAXIMO) {
      return diasDesdeBase;
    }

    // Segundo ciclo (2025-2049): subtrai 10000 e soma 1000 (conforme FB-009/2023)
    if (dataVencimento <= Boleto.#FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO) {
      const fatorSegundoCiclo =
        diasDesdeBase -
        Boleto.#FATOR_VENCIMENTO.CICLO_RESET +
        Boleto.#FATOR_VENCIMENTO.INICIO_SEGUNDO_CICLO;

      // Valida se ainda está no range válido do segundo ciclo
      if (fatorSegundoCiclo > Boleto.#FATOR_VENCIMENTO.LIMITE_MAXIMO) {
        throw new Error(
          'Data de vencimento excede o limite do segundo ciclo (até ' +
            Boleto.#FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') +
            ')'
        );
      }

      return fatorSegundoCiclo;
    }

    // Após 2052: aguardando nova definição FEBRABAN
    throw new Error(
      'Data de vencimento após ' +
        Boleto.#FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') +
        '. Aguardando nova especificação FEBRABAN para terceiro ciclo.'
    );
  }

  comEspecieMoeda(_especieMoeda) {
    this._especieMoeda = _especieMoeda;
    return this;
  }

  getEspecieMoeda() {
    return this._especieMoeda;
  }

  getCodigoEspecieMoeda() {
    return this._codigoEspecieMoeda;
  }

  comCodigoEspecieMoeda(_codigoEspecieMoeda) {
    this._codigoEspecieMoeda = _codigoEspecieMoeda.toString();
    return this;
  }

  getAceite() {
    return this._aceite;
  }

  getAceiteFormatado() {
    return this._aceite ? 'S' : 'N';
  }

  comAceite(_aceite) {
    this._aceite = _aceite;
    return this;
  }

  getEspecieDocumento() {
    return this._especieDocumento;
  }

  comEspecieDocumento(_especieDocumento) {
    this._especieDocumento = _especieDocumento;
    return this;
  }

  getDatas() {
    return this._datas;
  }

  comDatas(_datas) {
    this._datas = _datas;
    return this;
  }

  getValorFormatado() {
    return Boleto.#formatarValor(this._valorBoleto);
  }

  getValorFormatadoBRL() {
    return Boleto.#formatarBRL(this.getValorFormatado());
  }

  getValorBoleto() {
    return this._valorBoleto;
  }

  comValorBoleto(_valorBoleto) {
    if (_valorBoleto < 0) {
      throw new Error('Valor deve ser maior ou igual a zero');
    }

    if (_valorBoleto > 99999999.99) {
      throw new Error('Valor deve ser menor do que noventa e nove milhoes');
    }

    this._valorBoleto = _valorBoleto;
    return this;
  }

  comValor(_valorBoleto) {
    this.comValorBoleto(_valorBoleto);
  }

  getNumeroDoDocumentoFormatado() {
    return pad(this._numeroDoDocumento || '', 4, '0');
  }

  getNumeroDoDocumento() {
    return this._numeroDoDocumento || '';
  }

  comNumeroDoDocumento(_numeroDoDocumento) {
    this._numeroDoDocumento = _numeroDoDocumento;
    return this;
  }

  getInstrucoes() {
    return this._instrucoes || [];
  }

  comInstrucoes(_instrucoes) {
    if (arguments.length > 1) {
      _instrucoes = Array.prototype.slice.call(arguments, 0);
    }

    if (typeof _instrucoes === 'string') {
      _instrucoes = [_instrucoes];
    }

    if (_instrucoes.length > 5) {
      throw new Error('Máximo de cinco instruções permitidas');
    }

    this._instrucoes = _instrucoes;
    return this;
  }

  getDescricoes() {
    return this._descricoes || [];
  }

  comDescricoes(_descricoes) {
    if (arguments.length > 1) {
      _descricoes = Array.prototype.slice.call(arguments, 0);
    }

    if (typeof _descricoes === 'string') {
      _descricoes = [_descricoes];
    }

    if (_descricoes.length > 5) {
      throw new Error('Máximo de cinco instruções permitidas');
    }

    this._descricoes = _descricoes;
    return this;
  }

  getLocaisDePagamento() {
    if (this._locaisDePagamento) {
      return this._locaisDePagamento;
    }
    if (this.getBanco().getLocaisDePagamentoPadrao) {
      return this.getBanco().getLocaisDePagamentoPadrao();
    }
    return [];
  }

  comLocaisDePagamento(_locaisDePagamento) {
    if (arguments.length > 1) {
      _locaisDePagamento = Array.prototype.slice.call(arguments, 0);
    }

    if (typeof _locaisDePagamento === 'string') {
      _locaisDePagamento = [_locaisDePagamento];
    }

    if (_locaisDePagamento.length > 2) {
      throw new Error('Máximo de dois locais de pagamento permitidos');
    }

    this._locaisDePagamento = _locaisDePagamento;
    return this;
  }

  getQuantidadeDeMoeda() {
    return this._quantidadeDeMoeda;
  }

  comQuantidadeDeMoeda(_quantidadeDeMoeda) {
    this._quantidadeDeMoeda = _quantidadeDeMoeda;
    return this;
  }

  getBanco() {
    return this._banco;
  }

  comBanco(_banco) {
    this._banco = _banco;
    return this;
  }

  getPagador() {
    return this._pagador;
  }

  comPagador(_pagador) {
    this._pagador = _pagador;
    return this;
  }

  getBeneficiario() {
    return this._beneficiario;
  }

  comBeneficiario(_beneficiario) {
    this._beneficiario = _beneficiario;
    return this;
  }

  getValorDescontosFormatadoBRL() {
    if (!this.getValorDescontos()) {
      return '';
    }

    return Boleto.#formatarBRL(Boleto.#formatarValor(this.getValorDescontos()));
  }

  getValorDescontos() {
    return this._valorDescontos || 0;
  }

  comValorDescontos(_valorDescontos) {
    this._valorDescontos = _valorDescontos;
    return this;
  }

  getValorDeducoesFormatadoBRL() {
    if (!this.getValorDeducoes()) {
      return '';
    }

    return Boleto.#formatarBRL(Boleto.#formatarValor(this.getValorDeducoes()));
  }

  getValorDeducoes() {
    return this._valorDeducoes || 0;
  }

  comValorDeducoes(_valorDeducoes) {
    this._valorDeducoes = _valorDeducoes;
    return this;
  }

  getValorMultaFormatadoBRL() {
    return Boleto.#formatarBRL(Boleto.#formatarValor(this.getValorMulta()));
  }

  getValorMulta() {
    return this._valorMulta || 0;
  }

  comValorMulta(_valorMulta) {
    this._valorMulta = _valorMulta;
    return this;
  }

  getValorAcrescimosFormatadoBRL() {
    return Boleto.#formatarBRL(Boleto.#formatarValor(this.getValorAcrescimos()));
  }

  getValorAcrescimos() {
    return this._valorAcrescimos || 0;
  }

  comValorAcrescimos(_valorAcrescimos) {
    this._valorAcrescimos = _valorAcrescimos;
    return this;
  }

  getLinhaDigitavelFormatado() {
    const numeroDocumento = this.getNumeroDoDocumentoFormatado();
    const linha = GeradorDeLinhaDigitavel(this._banco.geraCodigoDeBarrasPara(this), this._banco);
    const linhaDigitavel = { linha, numeroDocumento };
    return linhaDigitavel;
  }

  static novoBoleto() {
    return new Boleto()
      .comEspecieMoeda('R$')
      .comCodigoEspecieMoeda(9)
      .comAceite(false)
      .comEspecieDocumento('DV');
  }
}

module.exports.Boleto = Boleto;

module.exports = Boleto;
module.exports.Boleto = Boleto;
module.exports.Pagador = Pagador;
module.exports.Beneficiario = Beneficiario;
module.exports.Datas = Datas;
module.exports.Endereco = Endereco;
module.exports.Gerador = Gerador;
module.exports.especiesDeDocumento = especiesDeDocumento;
module.exports.bancos = bancos;
