//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('../formatters');

class Endereco {
  getLogradouro() {
    return this._logradouro || '';
  }

  comLogradouro(_logradouro) {
    this._logradouro = _logradouro;
    return this;
  }

  getBairro() {
    return this._bairro || '';
  }

  comBairro(_bairro) {
    this._bairro = _bairro;
    return this;
  }

  getCep() {
    return this._cep || '';
  }

  getCepFormatado() {
    return formatacoes.cep(this.getCep());
  }

  comCep(_cep) {
    this._cep = _cep;
    return this;
  }

  getCidade() {
    return this._cidade || '';
  }

  comCidade(_cidade) {
    this._cidade = _cidade;
    return this;
  }

  getUf() {
    return this._uf || '';
  }

  comUf(_uf) {
    this._uf = _uf;
    return this;
  }

  getPrimeiraLinha() {
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
  }

  getSegundaLinha() {
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
  }

  getEnderecoCompleto() {
    const enderecoCompleto = [];

    this.getLogradouro() && enderecoCompleto.push(this.getLogradouro());
    this.getBairro() && enderecoCompleto.push(this.getBairro());
    this.getCep() && enderecoCompleto.push(this.getCepFormatado());
    this.getCidade() && enderecoCompleto.push(this.getCidade());
    this.getUf() && enderecoCompleto.push(this.getUf());

    return enderecoCompleto.join(' ');
  }

  static novoEndereco() {
    return new Endereco();
  }
}

module.exports = Endereco;
