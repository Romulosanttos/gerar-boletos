//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const StringUtils = require('../utils/string');
const { parseISO, parse, isValid } = require('date-fns');
const pad = StringUtils.pad;

class Datas {
  static #removerHoras(data) {
    data.setHours(0);
    data.setMinutes(0);
    data.setSeconds(0);
    data.setMilliseconds(0);

    return data;
  }

  static #formatar(data) {
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
  static #validarData(data) {
    const ano = data.getFullYear();
    // Range expandido: 1997 até 2049 (conforme novos ciclos FEBRABAN)
    return ano >= 1997 && ano <= 2049;
  }

  /**
   * Converte diferentes formatos de data para Date usando date-fns
   * @param {string|Date} data - Data em formato ISO (YYYY-MM-DD) ou brasileiro (DD/MM/YYYY)
   * @returns {Date} Data convertida para JavaScript Date
   */
  static #converterData(data) {
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

  comDocumento(_documento) {
    _documento = Datas.#converterData(_documento);

    if (!Datas.#validarData(_documento)) {
      throw new Error(
        'O ano do documento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._documento = Datas.#removerHoras(_documento);
    return this;
  }

  getDocumento() {
    return this._documento;
  }

  getDocumentoFormatado() {
    return Datas.#formatar(this.getDocumento());
  }

  comProcessamento(_processamento) {
    _processamento = Datas.#converterData(_processamento);

    if (!Datas.#validarData(_processamento)) {
      throw new Error(
        'O ano de processamento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._processamento = Datas.#removerHoras(_processamento);
    return this;
  }

  getProcessamento() {
    return this._processamento;
  }

  getProcessamentoFormatado() {
    return Datas.#formatar(this.getProcessamento());
  }

  comVencimento(_vencimento) {
    _vencimento = Datas.#converterData(_vencimento);

    if (!Datas.#validarData(_vencimento)) {
      throw new Error(
        'O ano de vencimento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)'
      );
    }

    this._vencimento = Datas.#removerHoras(_vencimento);
    return this;
  }

  getVencimento() {
    return this._vencimento;
  }

  getVencimentoFormatado() {
    return Datas.#formatar(this._vencimento);
  }

  static novasDatas() {
    return new Datas();
  }
}

module.exports = Datas;
