//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('../formatters');
const validacoes = require('../validators');
const StringUtils = require('../utils/string');
const { parseISO, parse, isValid } = require('date-fns');
const pad = StringUtils.pad;

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

const Pagador = (function () {
  function Pagador() {}

  Pagador.prototype.getNome = function () {
    return this._nome;
  };

  Pagador.prototype.comNome = function (_nome) {
    this._nome = _nome;
    return this;
  };

  Pagador.prototype.getIdentificacao = function () {
    let identificacao = this.getNome();
    const tipo = this.temRegistroNacional();

    // TODO: Inserir novamente o registro nacional depois
    // de implementar mecanismo para o texto não extravassar
    // do campo.

    if (tipo) {
      identificacao +=
        [' (', tipo.toUpperCase(), ': ', this.getRegistroNacionalFormatado(), ')'].join('') || '';
    }

    return (identificacao || '').toUpperCase();
  };

  Pagador.prototype.getRegistroNacional = function () {
    return this._registroNacional;
  };

  Pagador.prototype.getRegistroNacionalFormatado = function () {
    return formatacoes.registroNacional(this._registroNacional);
  };

  Pagador.prototype.temRegistroNacional = function () {
    return validacoes.eRegistroNacional(this._registroNacional);
  };

  Pagador.prototype.comCNPJ = function (_cnpj) {
    this.comRegistroNacional(_cnpj);
    return this;
  };

  Pagador.prototype.comCPF = function (_cpf) {
    this.comRegistroNacional(_cpf);
    return this;
  };

  Pagador.prototype.comRegistroNacional = function (_registroNacional) {
    this._registroNacional = _registroNacional;
    return this;
  };

  Pagador.prototype.getDocumento = function () {
    return this._documento;
  };

  Pagador.prototype.comDocumento = function (_documento) {
    this._documento = _documento;
    return this;
  };

  Pagador.prototype.getEndereco = function () {
    return this._endereco;
  };

  Pagador.prototype.comEndereco = function (_endereco) {
    this._endereco = _endereco;
    return this;
  };

  Pagador.novoPagador = function () {
    return new Pagador().comEndereco(Endereco.novoEndereco());
  };

  return Pagador;
})();


module.exports = Pagador;
