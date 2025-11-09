//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('../formatters');
const validacoes = require('../validators');

const Endereco = require('./endereco');

class Pagador {
  getNome() {
    return this._nome;
  }

  comNome(_nome) {
    this._nome = _nome;
    return this;
  }

  getIdentificacao() {
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

  getDocumento() {
    return this._documento;
  }

  comDocumento(_documento) {
    this._documento = _documento;
    return this;
  }

  getEndereco() {
    return this._endereco;
  }

  comEndereco(_endereco) {
    this._endereco = _endereco;
    return this;
  }

  static novoPagador() {
    return new Pagador().comEndereco(Endereco.novoEndereco());
  }
}

module.exports = Pagador;
