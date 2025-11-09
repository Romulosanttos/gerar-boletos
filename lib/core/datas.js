//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('../formatters');
const validacoes = require('../validators');
const StringUtils = require('../utils/string');
const { parseISO, parse, isValid } = require('date-fns');
const pad = StringUtils.pad;

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

const Datas = (function () {
  function removerHoras(data) {
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);

    return data;
  }

  function formatar(data) {
    return [pad(data.getDate(), 2, '0'), pad(data.getMonth() + 1, 2, '0'), data.getFullYear()].join(
      '/'
    );
  }

  /**
   * Valida se uma data está dentro do range suportado pelo sistema
   * Atualizado para considerar os novos ciclos da FEBRABAN até 2049
   * @param {Date} data - Data a ser validada
   * @returns {boolean} true se a data é válida
   */
  function validarData(data) {
    const ano = data.getFullYear();
    // Range expandido: 1997 até 2049 (conforme novos ciclos FEBRABAN)
    return ano >= 1997 && ano <= 2049;
  }

  /**
   * Converte diferentes formatos de data para Date usando date-fns
   * @param {string|Date} data - Data em formato ISO (YYYY-MM-DD) ou brasileiro (DD/MM/YYYY)
   * @returns {Date} Data convertida para JavaScript Date
   */
  function converterData(data) {
    if (data instanceof Date) {
      return data;
    }

    if (typeof data === 'string') {
      // Formato ISO (YYYY-MM-DD) - padrão internacional
      if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const parsed = parseISO(data);
        if (isValid(parsed)) {
          return parsed;
        }
      }

      // Formato brasileiro (DD/MM/YYYY) - dia/mês/ano
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
        const parsed = parse(data, 'dd/MM/yyyy', new Date());
        if (isValid(parsed)) {
          return parsed;
        }
      }
    }

    // Fallback - tenta parseISO primeiro, depois new Date
    if (typeof data === 'string') {
      const isoAttempt = parseISO(data);
      if (isValid(isoAttempt)) {
        return isoAttempt;
      }
    }

    return new Date(data);
  }

  function Datas() {}

  Datas.prototype.comDocumento = function (_documento) {
    _documento = converterData(_documento);

    if (!validarData(_documento)) {
      throw new Error(
        'O ano do documento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._documento = removerHoras(_documento);
    return this;
  };

  Datas.prototype.getDocumento = function () {
    return this._documento;
  };

  Datas.prototype.getDocumentoFormatado = function () {
    return formatar(this.getDocumento());
  };

  Datas.prototype.comProcessamento = function (_processamento) {
    _processamento = converterData(_processamento);

    if (!validarData(_processamento)) {
      throw new Error(
        'O ano de processamento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._processamento = removerHoras(_processamento);
    return this;
  };

  Datas.prototype.getProcessamento = function () {
    return this._processamento;
  };

  Datas.prototype.getProcessamentoFormatado = function () {
    return formatar(this.getProcessamento());
  };

  Datas.prototype.comVencimento = function (_vencimento) {
    _vencimento = converterData(_vencimento);

    if (!validarData(_vencimento)) {
      throw new Error(
        'O ano de vencimento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._vencimento = removerHoras(_vencimento);
    return this;
  };

  Datas.prototype.getVencimento = function () {
    return this._vencimento;
  };

  Datas.prototype.getVencimentoFormatado = function () {
    return formatar(this._vencimento);
  };

  Datas.novasDatas = function () {
    return new Datas();
  };

  return Datas;
})();


module.exports = Datas;
