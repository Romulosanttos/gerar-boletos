const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

// Value Objects
const FatorVencimento = require('./FatorVencimento');
const Valor = require('./Valor');

// Infrastructure
const GeradorDeLinhaDigitavel = require('../generators/line-formatter');

/**
 * Entidade de Domínio: Boleto
 * Representa um boleto bancário com todas suas informações
 */
class Boleto {
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

  /**
   * Calcula o fator de vencimento conforme especificação FEBRABAN
   * Delega o cálculo para o Value Object FatorVencimento
   *
   * @returns {string} Fator de vencimento com 4 dígitos (ex: "0001", "1000", "9999")
   * @throws {Error} Para datas inválidas ou fora do range suportado
   */
  getFatorVencimento() {
    const vencimento = this.getDatas().getVencimento();
    return FatorVencimento.calcular(vencimento);
  }

  getValorFormatado() {
    return Valor.formatarParaBoleto(this._valorBoleto);
  }

  getValorFormatadoBRL() {
    return Valor.formatarParaBRL(this.getValorFormatado());
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

    return Valor.paraReal(this.getValorDescontos());
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

    return Valor.paraReal(this.getValorDeducoes());
  }

  getValorDeducoes() {
    return this._valorDeducoes || 0;
  }

  comValorDeducoes(_valorDeducoes) {
    this._valorDeducoes = _valorDeducoes;
    return this;
  }

  getValorMultaFormatadoBRL() {
    return Valor.paraReal(this.getValorMulta());
  }

  getValorMulta() {
    return this._valorMulta || 0;
  }

  comValorMulta(_valorMulta) {
    this._valorMulta = _valorMulta;
    return this;
  }

  getValorAcrescimosFormatadoBRL() {
    return Valor.paraReal(this.getValorAcrescimos());
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

  /**
   * Retorna o código PIX EMV do boleto
   * @returns {string|object|null}
   */
  getPixEmv() {
    return this._pixEmv || null;
  }

  /**
   * Retorna o código EMV (string) do PIX
   * @returns {string|null}
   */
  getPixEmvString() {
    if (!this._pixEmv) {
      return null;
    }

    // Se for objeto, retorna a propriedade emv
    if (typeof this._pixEmv === 'object' && this._pixEmv.emv) {
      return this._pixEmv.emv;
    }

    // Se for string, retorna diretamente (retrocompatibilidade)
    return typeof this._pixEmv === 'string' ? this._pixEmv : null;
  }

  /**
   * Retorna as instruções do PIX
   * @returns {Array<string>}
   */
  getPixInstrucoes() {
    if (!this._pixEmv) {
      return ['Pague via PIX usando o QR Code ao lado'];
    }

    // Se for objeto, retorna a propriedade instrucoes ou valor padrão
    if (typeof this._pixEmv === 'object') {
      if (Array.isArray(this._pixEmv.instrucoes) && this._pixEmv.instrucoes.length > 0) {
        return this._pixEmv.instrucoes;
      }
      // Suporte legado para propriedade 'texto'
      if (this._pixEmv.texto) {
        return [this._pixEmv.texto];
      }
      return ['Pague via PIX usando o QR Code ao lado'];
    }

    // Se for string (retrocompatibilidade), retorna instruções padrão
    return ['Pague via PIX usando o QR Code ao lado'];
  }

  /**
   * Define o código PIX EMV do boleto
   * Aceita string (retrocompatibilidade) ou objeto {emv: string, instrucoes: string[]}
   * @param {string|object} pixEmv - String EMV ou objeto com emv e instrucoes
   * @returns {Boleto}
   */
  comPixEmv(pixEmv) {
    if (!pixEmv) {
      this._pixEmv = null;
      return this;
    }

    // Validar formato
    if (typeof pixEmv === 'string') {
      // Retrocompatibilidade: aceita string diretamente
      this._pixEmv = pixEmv;
    } else if (typeof pixEmv === 'object') {
      // Novo formato: objeto com emv e instrucoes opcional
      if (!pixEmv.emv || typeof pixEmv.emv !== 'string') {
        throw new Error('PIX EMV objeto deve conter propriedade "emv" como string');
      }

      const pixData = { emv: pixEmv.emv };

      // Validar e processar instruções
      if (pixEmv.instrucoes) {
        if (Array.isArray(pixEmv.instrucoes)) {
          pixData.instrucoes = pixEmv.instrucoes.filter(
            (i) => typeof i === 'string' && i.length > 0
          );
        } else if (typeof pixEmv.instrucoes === 'string') {
          pixData.instrucoes = [pixEmv.instrucoes];
        }
      }

      // Suporte legado para propriedade 'texto'
      if (!pixData.instrucoes && pixEmv.texto) {
        pixData.instrucoes = [pixEmv.texto];
      }

      // Se não tiver instruções, usar padrão
      if (!pixData.instrucoes || pixData.instrucoes.length === 0) {
        pixData.instrucoes = ['Pague via PIX usando o QR Code ao lado'];
      }

      this._pixEmv = pixData;
    } else {
      throw new Error('PIX EMV deve ser uma string ou objeto {emv: string, instrucoes?: string[]}');
    }

    return this;
  }

  static novoBoleto() {
    return new Boleto()
      .comEspecieMoeda('R$')
      .comCodigoEspecieMoeda(9)
      .comAceite(false)
      .comEspecieDocumento('DV');
  }
}

// Export principal
module.exports = Boleto;

// Backward compatibility: re-export entidades e dependências para testes antigos
Object.assign(module.exports, {
  Boleto,
  Pagador: require('./pagador'),
  Beneficiario: require('./beneficiario'),
  Datas: require('./datas'),
  Endereco: require('./endereco'),
  especiesDeDocumento: require('./especiesDocumento'),
  bancos: require('../banks'),
  Gerador: require('../generators/boleto-generator'),
});
