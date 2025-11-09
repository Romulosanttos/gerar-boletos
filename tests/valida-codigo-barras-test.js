const test = require('ava');
const { validar } = require('../lib/generators/valida-codigo-barras');

// ===========================
// Testes com códigos válidos
// ===========================

test('validar() deve aceitar codigo com exatamente 44 digitos', (t) => {
  const codigoValido = '12345678901234567890123456789012345678901234';

  t.notThrows(() => {
    validar(codigoValido);
  });
});

test('validar() deve aceitar codigo numerico valido', (t) => {
  const codigoValido = '00000000000000000000000000000000000000000000';

  t.notThrows(() => {
    validar(codigoValido);
  });
});

test('validar() deve aceitar codigo com todos os 9s', (t) => {
  const codigoValido = '99999999999999999999999999999999999999999999';

  t.notThrows(() => {
    validar(codigoValido);
  });
});

// ===========================
// Testes com códigos inválidos
// ===========================

test('validar() deve rejeitar codigo com menos de 44 digitos', (t) => {
  const codigoCurto = '123456789012345678901234567890123456789012'; // 42 dígitos

  const error = t.throws(() => {
    validar(codigoCurto);
  });

  t.truthy(error);
  t.true(error.message.includes('Número de dígitos diferente de 44'));
  t.true(error.message.includes('Tamanho encontrado: 42'));
  t.true(error.message.includes('Valor encontrado: ' + codigoCurto));
});

test('validar() deve rejeitar codigo com mais de 44 digitos', (t) => {
  const codigoLongo = '123456789012345678901234567890123456789012345'; // 45 dígitos

  const error = t.throws(() => {
    validar(codigoLongo);
  });

  t.truthy(error);
  t.true(error.message.includes('Número de dígitos diferente de 44'));
  t.true(error.message.includes('Tamanho encontrado: 45'));
});

test('validar() deve rejeitar codigo vazio', (t) => {
  const codigoVazio = '';

  const error = t.throws(() => {
    validar(codigoVazio);
  });

  t.truthy(error);
  t.true(error.message.includes('Número de dígitos diferente de 44'));
  t.true(error.message.includes('Tamanho encontrado: 0'));
});

test('validar() deve rejeitar codigo com apenas 1 digito', (t) => {
  const codigo = '1';

  const error = t.throws(() => {
    validar(codigo);
  });

  t.truthy(error);
  t.true(error.message.includes('Tamanho encontrado: 1'));
});

test('validar() deve rejeitar codigo com 43 digitos', (t) => {
  const codigo = '1234567890123456789012345678901234567890123'; // 43

  const error = t.throws(() => {
    validar(codigo);
  });

  t.truthy(error);
  t.true(error.message.includes('Tamanho encontrado: 43'));
});

test('validar() deve incluir mensagem de erro completa', (t) => {
  const codigo = '123';

  const error = t.throws(() => {
    validar(codigo);
  });

  t.true(error.message.includes('Erro na geração do código de barras'));
  t.true(error.message.includes('Número de dígitos diferente de 44'));
  t.true(error.message.includes('Verifique se todos os dados foram preenchidos corretamente'));
  t.true(error.message.includes('Tamanho encontrado: 3'));
  t.true(error.message.includes('Valor encontrado: 123'));
});

// ===========================
// Testes de edge cases
// ===========================

test('validar() deve aceitar codigo com caracteres especiais (44 chars)', (t) => {
  // Nota: A função valida apenas o tamanho, não o conteúdo
  const codigo = 'ABCD'.repeat(11); // 44 caracteres

  t.notThrows(() => {
    validar(codigo);
  });
});

test('validar() deve aceitar codigo com espaços (44 chars)', (t) => {
  const codigo = '                                            '; // 44 espaços

  t.notThrows(() => {
    validar(codigo);
  });
});

test('validar() deve aceitar mix de letras e numeros (44 chars)', (t) => {
  const codigo = '12345678901234567890123456789012345678901234'; // Exatamente 44

  t.is(codigo.length, 44); // Confirma que tem 44
  t.notThrows(() => {
    validar(codigo);
  });
});
