/**
 * Testes de retrocompatibilidade da API publica
 */

const test = require('ava');

test('API antiga - Boletos funciona', (t) => {
  const { Boletos } = require('../lib/index');
  t.is(typeof Boletos, 'function');
});

test('API antiga - Bancos funciona', (t) => {
  const { Bancos } = require('../lib/index');
  t.truthy(Bancos);
  t.is(typeof Bancos.Bradesco, 'function');
});

test('API nova - Banks === Bancos', (t) => {
  const { Banks, Bancos } = require('../lib/index');
  t.is(Banks, Bancos);
});

test('API nova - Boleto === Boletos', (t) => {
  const { Boleto, Boletos } = require('../lib/index');
  t.is(Boleto, Boletos);
});

test('API nova - entities expoe todas entidades', (t) => {
  const { entities } = require('../lib/index');
  t.truthy(entities.Boleto);
  t.truthy(entities.Pagador);
  t.truthy(entities.Beneficiario);
  t.truthy(entities.Datas);
  t.truthy(entities.Endereco);
});
