//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('../formatters');
const validacoes = require('../validators');
const StringUtils = require('../utils/string');
const pad = StringUtils.pad;

const Endereco = require('./endereco');

class Beneficiario {
  getIdentificacao() {
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
  }

  getRegistroNacional() {
    return this._registroNacional;
  }

  getRegistroNacionalFormatado() {
    return formatacoes.registroNacional(this._registroNacional);
  }

  temRegistroNacional() {
    return validacoes.eRegistroNacional(this._registroNacional);
  }

  comCNPJ(_cnpj) {
    this.comRegistroNacional(_cnpj);
    return this;
  }

  comCPF(_cpf) {
    this.comRegistroNacional(_cpf);
    return this;
  }

  comRegistroNacional(_registroNacional) {
    this._registroNacional = _registroNacional;
    return this;
  }

  comAgencia(_agencia) {
    this._agencia = _agencia;
    return this;
  }

  getAgencia() {
    return this._agencia;
  }

  comCodPosto(_posto) {
    this._posto = _posto;
    return this;
  }

  getCodposto() {
    return this._posto;
  }

  getAgenciaFormatada() {
    return pad(this._agencia, 4, '0');
  }

  comDigitoAgencia(_digitoAgencia) {
    this._digitoAgencia = _digitoAgencia;
    return this;
  }

  getDigitoAgencia() {
    return this._digitoAgencia;
  }

  comCodigoBeneficiario(_codigo) {
    this._codigo = _codigo;
    return this;
  }

  getCodigoBeneficiario() {
    return this._codigo;
  }

  getDigitoCodigoBeneficiario() {
    return this._digitoCodigoBeneficiario;
  }

  comDigitoCodigoBeneficiario(_digitoCodigoBeneficiario) {
    this._digitoCodigoBeneficiario = _digitoCodigoBeneficiario;
    return this;
  }

  getCarteira() {
    return this._carteira;
  }

  comCarteira(_carteira) {
    this._carteira = _carteira;
    return this;
  }

  getNossoNumero() {
    return this._nossoNumero;
  }

  comNossoNumero(_nossoNumero) {
    this._nossoNumero = _nossoNumero;
    return this;
  }

  getDigitoNossoNumero() {
    return this._digitoNossoNumero;
  }

  comDigitoNossoNumero(_digitoNossoNumero) {
    this._digitoNossoNumero = _digitoNossoNumero;
    return this;
  }

  getNome() {
    return this._nome;
  }

  comNome(_nomeBeneficiario) {
    this._nome = _nomeBeneficiario;
    return this;
  }

  getEndereco() {
    return this._endereco;
  }

  comEndereco(_endereco) {
    this._endereco = _endereco;
    return this;
  }

  getNumeroConvenio() {
    return this._numeroConvenio;
  }

  comNumeroConvenio(_numeroConvenio) {
    this._numeroConvenio = _numeroConvenio;
    return this;
  }

  getDocumento() {
    return this._documento;
  }

  comDocumento(_documento) {
    this._documento = _documento;
    return this;
  }

  novoBeneficiario() {
    return new Beneficiario().comEndereco(Endereco.novoEndereco());
  }

  static novoBeneficiario() {
    return new Beneficiario();
  }
}

module.exports = Beneficiario;
