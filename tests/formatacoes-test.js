const test = require('ava');
const { formatacoes } = require('../lib/index');

// removerMascara tests
test('removerMascara - Remove mascara de dinheiro', (t) => {
  t.is(formatacoes.removerMascara('R$ 12,23'), '12,23');
});

test('removerMascara - Remove mascaras de porcentagem', (t) => {
  t.is(formatacoes.removerMascara('10%'), '10');
  t.is(formatacoes.removerMascara('8,34 %'), '8,34');
});

test('removerMascara - Remove mascaras de Cnpj', (t) => {
  t.is(formatacoes.removerMascara('18.028.400/0001-70'), '18028400000170');
});

test('removerMascara - Remove mascaras de Cpf', (t) => {
  t.is(formatacoes.removerMascara('934.621.219-52'), '93462121952');
});

test('removerMascara - Remove mascaras de Telefone', (t) => {
  t.is(formatacoes.removerMascara('(61) 8633-3051'), '6186333051');
});

test('removerMascara - Remove mascaras de Placa', (t) => {
  t.is(formatacoes.removerMascara('ABC-2366'), 'ABC2366');
});

test('removerMascara - Remove mascaras de Cep', (t) => {
  t.is(formatacoes.removerMascara('71.530-070'), '71530070');
});

test('removerMascara - Remove espaços em branco no começo e no final', (t) => {
  t.is(formatacoes.removerMascara('    71.420-070  \t'), '71420070');
});

test('removerMascara - Se for passado algo que não é uma string então o mesmo é retornado', (t) => {
  t.is(formatacoes.removerMascara(null), null);
  t.is(formatacoes.removerMascara({}.devolvaUndefined), undefined);
  t.is(formatacoes.removerMascara(123), 123);
});

// dinheiro tests
test('dinheiro - Trata casas decimais por padrão', (t) => {
  t.is(formatacoes.dinheiro(1), 'R$ 1,00');
  t.is(formatacoes.dinheiro(12), 'R$ 12,00');
  t.is(formatacoes.dinheiro(123), 'R$ 123,00');
  t.is(formatacoes.dinheiro(1234), 'R$ 1.234,00');
  t.is(formatacoes.dinheiro(12345), 'R$ 12.345,00');
});

test('dinheiro - Não arredonda, simplesmente corta as casas decimais além do especificado', (t) => {
  t.is(formatacoes.dinheiro(35.855), 'R$ 35,85');
  t.is(formatacoes.dinheiro(35.859), 'R$ 35,85');

  t.is(
    formatacoes.dinheiro(35.855, {
      casasDecimais: 3,
    }),
    'R$ 35,855'
  );

  t.is(
    formatacoes.dinheiro(35.859, {
      casasDecimais: 3,
    }),
    'R$ 35,859'
  );

  t.is(formatacoes.dinheiro(1.005), 'R$ 1,00');
  t.is(
    formatacoes.dinheiro(1.005, {
      casasDecimais: 3,
    }),
    'R$ 1,005'
  );
});

test('dinheiro - É possível passar outro símbolo', (t) => {
  t.is(
    formatacoes.dinheiro(73.315, {
      simbolo: 'BRL ',
    }),
    'BRL 73,31'
  );
});

test('dinheiro - É possível posicionar o símbolo a direita', (t) => {
  t.is(
    formatacoes.dinheiro(859.385, {
      simbolo: 'BRL',
      posicionamento: 'direita',
    }),
    '859,38BRL'
  );
});

// dinheiroPorExtenso tests
test('dinheiroPorExtenso - Escreve o valor R$ 0,00 adequadamente', (t) => {
  t.is(formatacoes.dinheiroPorExtenso(0), 'zero reais');
});

test('dinheiroPorExtenso - Escreve o valor R$ 1,00 adequadamente', (t) => {
  t.is(formatacoes.dinheiroPorExtenso(1), 'um real');
});

test('dinheiroPorExtenso - Escreve o valor R$ 2,00 adequadamente', (t) => {
  t.is(formatacoes.dinheiroPorExtenso(2), 'dois reais');
});

test('dinheiroPorExtenso - Escreve o valor R$ 17,34 adequadamente', (t) => {
  t.is(formatacoes.dinheiroPorExtenso(17.34), 'dezessete reais e trinta e quatro centavos');
});

test('dinheiroPorExtenso - Escreve o valor R$ 432,97 adequadamente', (t) => {
  t.is(
    formatacoes.dinheiroPorExtenso(432.97),
    'quatrocentos e trinta e dois reais e noventa e sete centavos'
  );
});

test('dinheiroPorExtenso - Escreve o valor R$ 1234,56 adequadamente', (t) => {
  t.is(
    formatacoes.dinheiroPorExtenso(1234.56),
    'um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos'
  );
});

test('dinheiroPorExtenso - Escreve o valor R$ 21234,56 adequadamente', (t) => {
  t.is(
    formatacoes.dinheiroPorExtenso(21234.56),
    'vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos'
  );
});

test('dinheiroPorExtenso - Escreve o valor R$ 121234,56 adequadamente', (t) => {
  t.is(
    formatacoes.dinheiroPorExtenso(121234.56),
    'cento e vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos'
  );
});

// numero tests
test('numero - Por padrão não trata casas decimais a menos que você especifique', (t) => {
  t.is(formatacoes.numero(1), '1');
  t.is(formatacoes.numero(1.0), '1');
  t.is(formatacoes.numero(1.01), '1,01');

  t.is(
    formatacoes.numero(1.0, {
      casasDecimais: 2,
    }),
    '1,00'
  );

  t.is(
    formatacoes.numero(1.01, {
      casasDecimais: 3,
    }),
    '1,010'
  );
});

test('numero - Pocisiona separador de milhar padrão', (t) => {
  t.is(formatacoes.numero(1234.2), '1.234,2');
  t.is(formatacoes.numero(12345.2), '12.345,2');
  t.is(
    formatacoes.numero(1112345.2, {
      casasDecimais: 2,
    }),
    '1.112.345,20'
  );
});

// data tests
test('data - Verifica formatação correta', (t) => {
  const data = new Date(2014, 10, 20);
  t.is(formatacoes.data(data), '20/11/2014');
});

test('data - Caso não seja uma data válida retorna o que foi passado', (t) => {
  const data = new Date('inválido');
  const result = formatacoes.data(data);
  t.true(result instanceof Date);
  t.true(isNaN(result.getTime()));
});

// hora tests
test('hora - Verifica formatação correta', (t) => {
  const data = new Date(2014, 10, 20, 23, 34, 45);
  t.is(formatacoes.hora(data), '23:34:45');
});

test('hora - Pode-se formatar sem os segundos', (t) => {
  const data = new Date(2014, 10, 20, 23, 34, 45);
  t.is(
    formatacoes.hora(data, {
      comSegundos: false,
    }),
    '23:34'
  );
});

test('hora - Caso não seja uma data válida retorna o que foi passado', (t) => {
  const data = new Date('inválido');
  const result = formatacoes.hora(data);
  t.true(result instanceof Date);
  t.true(isNaN(result.getTime()));
});

// dataEHora tests
test('dataEHora - Verifica formatação correta', (t) => {
  const data = new Date(2014, 10, 20, 23, 34, 45);
  t.is(formatacoes.dataEHora(data), '20/11/2014 23:34:45');
});

test('dataEHora - Caso não seja uma data válida retorna o que foi passado', (t) => {
  const data = new Date('inválido');
  const result = formatacoes.dataEHora(data);
  t.true(result instanceof Date);
  t.true(isNaN(result.getTime()));
});

// tituloDeEleitor tests
test('tituloDeEleitor - Formata de acordo com a formatação impressa no título de eleitor', (t) => {
  t.is(formatacoes.tituloDeEleitor('273397340264'), '2733 9734 0264');
  t.is(formatacoes.tituloDeEleitor('\t2 7 3-39-734026-4   '), '2733 9734 0264');
});

// linhaDigitavel tests
test('linhaDigitavel - Formata a linha digitavel de um boleto se tiver 47 caracteres', (t) => {
  const esperado = '34191.57213 89766.660164 74514.590004 6 56550000268016',
    original = '34191572138976666016474514590004656550000268016';

  t.is(formatacoes.linhaDigitavel(original), esperado);
});

// boletoBancario tests
test('boletoBancario - Verifica que é apenas um alias para .linhaDigitavel', (t) => {
  const linhaDigitavel = formatacoes.linhaDigitavel.toString(),
    boletoBancario = formatacoes.boletoBancario.toString();

  t.is(linhaDigitavel, boletoBancario);
});

// nit tests
test('nit - Verifica que é apenas um alias para .pisPasep', (t) => {
  t.is(formatacoes.pisPasep.toString(), formatacoes.nit.toString());
});

// pisPasep tests
test('pisPasep - Verifica que a máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.pisPasep('12541586274'), '125.4158.627-4');
  t.is(formatacoes.pisPasep('\t   12541586274  '), '125.4158.627-4');
});

// cnpj tests
test('cnpj - Verifica que a máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.cnpj('18028400000170'), '18.028.400/0001-70');
  t.is(formatacoes.cnpj(' 18028400000170 '), '18.028.400/0001-70');
});

test('cnpj - Se passa algo que não era cnpj retorna o que foi passado anteriormente', (t) => {
  t.is(formatacoes.cnpj('18028400000171'), '18028400000171');
  t.is(formatacoes.cnpj('a8028400000170'), 'a8028400000170');
});

// cpf tests
test('cpf - Verifica que a máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.cpf('93462121952'), '934.621.219-52');
  t.is(formatacoes.cpf(' 93462121952 '), '934.621.219-52');
});

test('cpf - Se passa algo que não era cpf retorna o que foi passado anteriormente', (t) => {
  t.is(formatacoes.cnpj('foo bar'), 'foo bar');
  t.is(formatacoes.cnpj('93462121953'), '93462121953');
});

// registroNacional tests
test('registroNacional - Verifica que a máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.registroNacional('18028400000170'), '18.028.400/0001-70');
  t.is(formatacoes.registroNacional(' 18028400000170 '), '18.028.400/0001-70');

  t.is(formatacoes.registroNacional('93462121952'), '934.621.219-52');
  t.is(formatacoes.registroNacional(' 93462121952 '), '934.621.219-52');
});

// placa tests
test('placa - Verifica que máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.placa('abc2366'), 'ABC-2366');
  t.is(formatacoes.placa('abc-2343'), 'ABC-2343');
});

test('placa - Verifica que retorna a mesma coisa quando texto não é placa', (t) => {
  t.is(formatacoes.placa('abcd-2366'), 'abcd-2366');
  t.is(formatacoes.placa('foo'), 'foo');
});

// cep tests
test('cep - Verifica que máscara é aplicada corretamente', (t) => {
  t.is(formatacoes.cep('71530070'), '71.530-070');
  t.is(formatacoes.cep('71.530070'), '71.530-070');
  t.is(formatacoes.cep('71530-070'), '71.530-070');
});

test('cep - Verifica que retorna a mesma coisa quando texto não é cep', (t) => {
  t.is(formatacoes.cep('715300700'), '715300700');
  t.is(formatacoes.cep('foo'), 'foo');
});
