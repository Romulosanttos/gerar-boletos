const test = require('ava');
const BoletoStringify = require('../lib/stringify/boletoStringify');

// ===========================
// Tests for enderecoPagador()
// ===========================

test('enderecoPagador() deve criar endereco com todos os campos', (t) => {
  const endereco = BoletoStringify.enderecoPagador({
    logradouro: 'Rua Teste 123',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estadoUF: 'SP',
    cep: '01234-567',
  });

  t.truthy(endereco);
  t.is(endereco.getLogradouro(), 'Rua Teste 123');
  t.is(endereco.getBairro(), 'Centro');
  t.is(endereco.getCidade(), 'São Paulo');
  t.is(endereco.getUf(), 'SP');
  t.is(endereco.getCep(), '01234-567');
});

test('enderecoPagador() deve aceitar CEP sem formatação', (t) => {
  const endereco = BoletoStringify.enderecoPagador({
    logradouro: 'Av Principal',
    bairro: 'Jardim',
    cidade: 'Curitiba',
    estadoUF: 'PR',
    cep: '80000000',
  });

  t.truthy(endereco);
  t.is(endereco.getCep(), '80000000');
});

// ===========================
// Tests for createPagador()
// ===========================

test('createPagador() deve criar pagador com endereco completo', (t) => {
  const pagador = BoletoStringify.createPagador({
    nome: 'João Silva',
    registroNacional: '12345678900',
    endereco: {
      logradouro: 'Rua ABC 100',
      bairro: 'Vila Nova',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20000-000',
    },
  });

  t.truthy(pagador);
  t.is(pagador.getNome(), 'João Silva');
  t.is(pagador.getRegistroNacional(), '12345678900');
  t.truthy(pagador.getEndereco());
  t.is(pagador.getEndereco().getCidade(), 'Rio de Janeiro');
});

test('createPagador() deve funcionar com CPF', (t) => {
  const pagador = BoletoStringify.createPagador({
    nome: 'Maria Santos',
    registroNacional: '987.654.321-00',
    endereco: {
      logradouro: 'Rua X',
      bairro: 'Y',
      cidade: 'Z',
      estadoUF: 'MG',
      cep: '30000-000',
    },
  });

  t.truthy(pagador);
  t.is(pagador.getNome(), 'Maria Santos');
  t.is(pagador.getRegistroNacional(), '987.654.321-00');
});

// ===========================
// Tests for createBeneficiario()
// ===========================

test('createBeneficiario() deve criar beneficiario com dados bancarios basicos', (t) => {
  const beneficiario = BoletoStringify.createBeneficiario({
    nome: 'Empresa XYZ LTDA',
    cnpj: '12345678000199',
    endereco: {
      logradouro: 'Av Empresarial 500',
      bairro: 'Distrito Industrial',
      cidade: 'Belo Horizonte',
      estadoUF: 'MG',
      cep: '31000-000',
    },
    dadosBancarios: {
      carteira: '09',
      agencia: '1234',
      agenciaDigito: '5',
      conta: '567890',
      contaDigito: '1',
      nossoNumero: '00000005752',
      nossoNumeroDigito: '8',
    },
  });

  t.truthy(beneficiario);
  t.is(beneficiario.getNome(), 'Empresa XYZ LTDA');
  t.is(beneficiario.getRegistroNacional(), '12345678000199');
  t.is(beneficiario.getCarteira(), '09');
  t.is(beneficiario.getAgencia(), '1234');
  t.is(beneficiario.getDigitoAgencia(), '5');
  t.is(beneficiario.getCodigoBeneficiario(), '567890');
  t.is(beneficiario.getDigitoCodigoBeneficiario(), '1');
  t.is(beneficiario.getNossoNumero(), '00000005752');
  t.is(beneficiario.getDigitoNossoNumero(), '8');
  t.truthy(beneficiario.getEndereco());
});

test('createBeneficiario() deve incluir convenio quando fornecido', (t) => {
  const beneficiario = BoletoStringify.createBeneficiario({
    nome: 'Empresa ABC',
    cnpj: '98765432000188',
    endereco: {
      logradouro: 'Rua Central',
      bairro: 'Centro',
      cidade: 'Porto Alegre',
      estadoUF: 'RS',
      cep: '90000-000',
    },
    dadosBancarios: {
      carteira: '18',
      agencia: '4321',
      agenciaDigito: '0',
      conta: '123456',
      contaDigito: '7',
      nossoNumero: '12345678901',
      nossoNumeroDigito: '9',
      convenio: '1234567', // ← Este é o campo que cobre linhas 39-40
    },
  });

  t.truthy(beneficiario);
  t.is(beneficiario.getNumeroConvenio(), '1234567');
});

test('createBeneficiario() deve funcionar sem convenio', (t) => {
  const beneficiario = BoletoStringify.createBeneficiario({
    nome: 'Empresa Sem Convenio',
    cnpj: '11122233000144',
    endereco: {
      logradouro: 'Av Test',
      bairro: 'B',
      cidade: 'C',
      estadoUF: 'SP',
      cep: '12345-678',
    },
    dadosBancarios: {
      carteira: '01',
      agencia: '9999',
      conta: '888888',
      nossoNumero: '99999999999',
      // Sem convenio
    },
  });

  t.truthy(beneficiario);
  // Se não tem convenio, não deve definir
  // (Dependendo da implementação do Beneficiario, pode retornar undefined ou não ter método)
  t.notThrows(() => beneficiario.getNumeroConvenio());
});

// ===========================
// Tests for createInstrucoes()
// ===========================

test('createInstrucoes() deve retornar array quando já é array', (t) => {
  const instrucoes = ['Instrução 1', 'Instrução 2', 'Instrução 3'];
  const result = BoletoStringify.createInstrucoes(instrucoes);

  t.true(Array.isArray(result));
  t.is(result.length, 3);
  t.deepEqual(result, instrucoes);
});

test('createInstrucoes() deve converter string em array', (t) => {
  const instrucao = 'Pagamento até o vencimento';
  const result = BoletoStringify.createInstrucoes(instrucao);

  // Cobre linhas 47-48
  t.true(Array.isArray(result));
  t.is(result.length, 1);
  t.is(result[0], 'Pagamento até o vencimento');
});

test('createInstrucoes() deve converter null em array', (t) => {
  const result = BoletoStringify.createInstrucoes(null);

  t.true(Array.isArray(result));
  t.is(result.length, 1);
  t.is(result[0], null);
});

test('createInstrucoes() deve converter numero em array', (t) => {
  const result = BoletoStringify.createInstrucoes(123);

  t.true(Array.isArray(result));
  t.is(result.length, 1);
  t.is(result[0], 123);
});

test('createInstrucoes() deve converter objeto em array', (t) => {
  const obj = { text: 'teste' };
  const result = BoletoStringify.createInstrucoes(obj);

  t.true(Array.isArray(result));
  t.is(result.length, 1);
  t.deepEqual(result[0], obj);
});

test('createInstrucoes() deve manter array vazio', (t) => {
  const result = BoletoStringify.createInstrucoes([]);

  t.true(Array.isArray(result));
  t.is(result.length, 0);
});
