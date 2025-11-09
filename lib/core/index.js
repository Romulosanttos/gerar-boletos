module.exports = {
  // Entities
  Boleto: require('./boleto'),
  Beneficiario: require('./beneficiario'),
  Pagador: require('./pagador'),
  Datas: require('./datas'),
  Endereco: require('./endereco'),

  // Value Objects
  FatorVencimento: require('./FatorVencimento'),
  Valor: require('./Valor'),

  // Infrastructure
  BankRegistry: require('./BankRegistry'),

  // Configuration
  especiesDocumento: require('./especiesDocumento'),
};
