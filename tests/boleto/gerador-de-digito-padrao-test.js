const test = require('ava');
const GeradorDeDigitoPadrao = require('../../lib/generators/digit-generator');

test('Verifica a geração de dígitos mod11', (t) => {
  t.is(GeradorDeDigitoPadrao.mod11('0019386000000040000000001207113000900020618'), 5);
  t.is(GeradorDeDigitoPadrao.mod11('2379316800000001002949060000000000300065800'), 6);
  t.is(GeradorDeDigitoPadrao.mod11('0000039104766'), 3);
  t.is(GeradorDeDigitoPadrao.mod11('3999100100001200000351202000003910476618602'), 3);
  t.is(GeradorDeDigitoPadrao.mod11('3999597400000001002461722000000001934404542'), 1);
});

test('Verifica a geração de dígitos mod10', (t) => {
  t.is(GeradorDeDigitoPadrao.mod10('237929490'), 9);
  t.is(GeradorDeDigitoPadrao.mod10('6000000000'), 4);
  t.is(GeradorDeDigitoPadrao.mod10('0300065800'), 9);
  t.is(GeradorDeDigitoPadrao.mod10('399903512'), 8);
});
