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

const Beneficiario = (function () {
  function Beneficiario() {}

  Beneficiario.prototype.getIdentificacao = function () {
    let identificacao = this.getNome();
    const tipo = this.temRegistroNacional();

    if (tipo) {
      identificacao += [
        ' (',
        tipo.toUpperCase(),
        ': ',
        this.getRegistroNacionalFormatado(),
        ')',
      ].join('');
    }

    return (identificacao || '').toUpperCase();
  };

  Beneficiario.prototype.getRegistroNacional = function () {
    return this._registroNacional;
  };

  Beneficiario.prototype.getRegistroNacionalFormatado = function () {
    return formatacoes.registroNacional(this._registroNacional);
  };

  Beneficiario.prototype.temRegistroNacional = function () {
    return validacoes.eRegistroNacional(this._registroNacional);
  };

  Beneficiario.prototype.comCNPJ = function (_cnpj) {
    this.comRegistroNacional(_cnpj);
    return this;
  };

  Beneficiario.prototype.comCPF = function (_cpf) {
    this.comRegistroNacional(_cpf);
    return this;
  };

  Beneficiario.prototype.comRegistroNacional = function (_registroNacional) {
    this._registroNacional = _registroNacional;
    return this;
  };

  Beneficiario.prototype.comAgencia = function (_agencia) {
    this._agencia = _agencia;
    return this;
  };

  Beneficiario.prototype.getAgencia = function () {
    return this._agencia;
  };

  Beneficiario.prototype.comCodPosto = function (_posto) {
    this._posto = _posto;
    return this;
  };

  Beneficiario.prototype.getCodposto = function () {
    return this._posto;
  };

  Beneficiario.prototype.getAgenciaFormatada = function () {
    return pad(this._agencia, 4, '0');
  };

  Beneficiario.prototype.comDigitoAgencia = function (_digitoAgencia) {
    this._digitoAgencia = _digitoAgencia;
    return this;
  };

  Beneficiario.prototype.getDigitoAgencia = function () {
    return this._digitoAgencia;
  };

  Beneficiario.prototype.comCodigoBeneficiario = function (_codigo) {
    this._codigo = _codigo;
    return this;
  };

  Beneficiario.prototype.getCodigoBeneficiario = function () {
    return this._codigo;
  };

  Beneficiario.prototype.getDigitoCodigoBeneficiario = function () {
    return this._digitoCodigoBeneficiario;
  };

  Beneficiario.prototype.comDigitoCodigoBeneficiario = function (_digitoCodigoBeneficiario) {
    this._digitoCodigoBeneficiario = _digitoCodigoBeneficiario;
    return this;
  };

  Beneficiario.prototype.getCarteira = function () {
    return this._carteira;
  };

  Beneficiario.prototype.comCarteira = function (_carteira) {
    this._carteira = _carteira;
    return this;
  };

  Beneficiario.prototype.getNossoNumero = function () {
    return this._nossoNumero;
  };

  Beneficiario.prototype.comNossoNumero = function (_nossoNumero) {
    this._nossoNumero = _nossoNumero;
    return this;
  };

  Beneficiario.prototype.getDigitoNossoNumero = function () {
    return this._digitoNossoNumero;
  };

  Beneficiario.prototype.comDigitoNossoNumero = function (_digitoNossoNumero) {
    this._digitoNossoNumero = _digitoNossoNumero;
    return this;
  };

  Beneficiario.prototype.getNome = function () {
    return this._nome;
  };

  Beneficiario.prototype.comNome = function (_nomeBeneficiario) {
    this._nome = _nomeBeneficiario;
    return this;
  };

  Beneficiario.prototype.getEndereco = function () {
    return this._endereco;
  };

  Beneficiario.prototype.comEndereco = function (_endereco) {
    this._endereco = _endereco;
    return this;
  };

  Beneficiario.prototype.getNumeroConvenio = function () {
    return this._numeroConvenio;
  };

  Beneficiario.prototype.comNumeroConvenio = function (_numeroConvenio) {
    this._numeroConvenio = _numeroConvenio;
    return this;
  };

  Beneficiario.prototype.getDocumento = function () {
    return this._documento;
  };

  Beneficiario.prototype.comDocumento = function (_documento) {
    this._documento = _documento;
    return this;
  };

  Beneficiario.prototype.novoBeneficiario = function () {
    return new Beneficiario().comEndereco(Endereco.novoEndereco());
  };

  Beneficiario.novoBeneficiario = function () {
    return new Beneficiario();
  };

  return Beneficiario;
})();


module.exports = Beneficiario;
