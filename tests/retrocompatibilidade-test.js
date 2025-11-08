/**
 * Testes de retrocompatibilidade da API publica
 */

module.exports = {
  'API antiga - Boletos funciona': function (test) {
    const { Boletos } = require('../lib/index');
    test.strictEqual(typeof Boletos, 'function');
    test.done();
  },

  'API antiga - Bancos funciona': function (test) {
    const { Bancos } = require('../lib/index');
    test.ok(Bancos);
    test.strictEqual(typeof Bancos.Bradesco, 'function');
    test.done();
  },

  'API nova - Banks === Bancos': function (test) {
    const { Banks, Bancos } = require('../lib/index');
    test.strictEqual(Banks, Bancos);
    test.done();
  },

  'API nova - Boleto === Boletos': function (test) {
    const { Boleto, Boletos } = require('../lib/index');
    test.strictEqual(Boleto, Boletos);
    test.done();
  },

  'API nova - entities expoe todas entidades': function (test) {
    const { entities } = require('../lib/index');
    test.ok(entities.Boleto);
    test.ok(entities.Pagador);
    test.ok(entities.Beneficiario);
    test.ok(entities.Datas);
    test.ok(entities.Endereco);
    test.done();
  },
};
