
const Boleto = require('./utils/functions/boletoUtils');
const StreamToPromise = require('../lib/utils/stream-utils');
const Boletos = require('./metodosPublicos/boletoMetodos');

module.exports = {
  Boletos,
  Bancos: Boleto.bancos,
  Formatacoes: Boleto.formatacoes,
  Validacoes: Boleto.validacoes,
  StreamToPromise,
};

