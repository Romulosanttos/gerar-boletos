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

const Endereco = (function () {
  function Endereco() {}

  Endereco.prototype.getLogradouro = function () {
    return this._logradouro || '';
  };

  Endereco.prototype.comLogradouro = function (_logradouro) {
    this._logradouro = _logradouro;
    return this;
  };

  Endereco.prototype.getBairro = function () {
    return this._bairro || '';
  };

  Endereco.prototype.comBairro = function (_bairro) {
    this._bairro = _bairro;
    return this;
  };

  Endereco.prototype.getCep = function () {
    return this._cep || '';
  };

  Endereco.prototype.getCepFormatado = function () {
    return formatacoes.cep(this.getCep());
  };

  Endereco.prototype.comCep = function (_cep) {
    this._cep = _cep;
    return this;
  };

  Endereco.prototype.getCidade = function () {
    return this._cidade || '';
  };

  Endereco.prototype.comCidade = function (_cidade) {
    this._cidade = _cidade;
    return this;
  };

  Endereco.prototype.getUf = function () {
    return this._uf || '';
  };

  Endereco.prototype.comUf = function (_uf) {
    this._uf = _uf;
    return this;
  };

  Endereco.prototype.getPrimeiraLinha = function () {
    let resultado = '';

    if (this.getLogradouro()) {
      resultado += this.getLogradouro();
    }

    if (this.getLogradouro() && this.getBairro()) {
      resultado += ', ';
    }

    if (this.getBairro()) {
      resultado += this.getBairro();
    }

    return resultado;
  };

  Endereco.prototype.getSegundaLinha = function () {
    let resultado = '';

    if (this.getCidade()) {
      resultado += this.getCidade();
    }

    if (this.getCidade() && this.getUf()) {
      resultado += '/';
    }

    if (this.getUf()) {
      resultado += this.getUf();
    }

    if (resultado && this.getCep()) {
      resultado += ' — ';
    }

    if (this.getCep()) {
      resultado += this.getCepFormatado();
    }

    return resultado;
  };

  Endereco.prototype.getEnderecoCompleto = function () {
    const enderecoCompleto = [];

    this.getLogradouro() && enderecoCompleto.push(this.getLogradouro());
    this.getBairro() && enderecoCompleto.push(this.getBairro());
    this.getCep() && enderecoCompleto.push(this.getCepFormatado());
    this.getCidade() && enderecoCompleto.push(this.getCidade());
    this.getUf() && enderecoCompleto.push(this.getUf());

    return enderecoCompleto.join(' ');
  };

  Endereco.novoEndereco = function () {
    return new Endereco();
  };

  return Endereco;
})();

module.exports = Endereco;
