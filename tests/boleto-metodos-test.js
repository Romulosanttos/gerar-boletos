const test = require('ava');
const fs = require('fs');
const path = require('path');
const Boletos = require('../lib/metodosPublicos/boletoMetodos');
const Bradesco = require('../lib/banks/bradesco');

// Helper para criar dados de teste padrão
function createTestData(overrides = {}) {
  return {
    banco: new Bradesco(),
    pagador: {
      nome: 'Teste Pagador',
      registroNacional: '12345678900',
      endereco: {
        logradouro: 'Rua Teste, 123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estadoUF: 'SP',
        cep: '01000-000',
      },
      ...overrides.pagador,
    },
    beneficiario: {
      nome: 'Teste Beneficiario',
      cnpj: '12345678000199',
      endereco: {
        logradouro: 'Av. Teste, 456',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estadoUF: 'SP',
        cep: '01310-100',
      },
      dadosBancarios: {
        carteira: '09',
        agencia: '1234',
        agenciaDigito: '5',
        conta: '567890',
        contaDigito: '1',
        nossoNumero: '12345678',
        nossoNumeroDigito: '9',
        ...(overrides.beneficiario && overrides.beneficiario.dadosBancarios),
      },
      ...overrides.beneficiario,
    },
    boleto: {
      valor: 100.0,
      numeroDocumento: 'DOC-123',
      especieDocumento: 'DM',
      datas: {
        vencimento: '2025-12-31',
        processamento: '2025-11-09',
        documentos: '2025-11-09',
      },
      ...overrides.boleto,
    },
    instrucoes: ['Não aceitar após vencimento'],
    ...overrides,
  };
}

test.before(() => {
  const dir = path.join('tmp', 'boletos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test('Deve criar instância com dados válidos', (t) => {
  const boleto = new Boletos(createTestData());

  t.truthy(boleto);
  t.is(typeof boleto.gerarBoleto, 'function');
  t.is(typeof boleto.pdfFile, 'function');
  t.is(typeof boleto.pdfStream, 'function');
});

test('Deve inicializar com boletoInfo null', (t) => {
  const boleto = new Boletos({
    banco: new Bradesco(),
    pagador: {
      nome: 'Teste',
      registroNacional: '123',
      endereco: {
        logradouro: 'Rua Test',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estadoUF: 'SP',
        cep: '01000-000',
      },
    },
    beneficiario: {
      nome: 'Teste',
      cnpj: '123',
      endereco: {
        logradouro: 'Av Test',
        bairro: 'Centro',
        cidade: 'São Paulo',
        estadoUF: 'SP',
        cep: '01000-000',
      },
      dadosBancarios: {
        carteira: '09',
        agencia: '1234',
        conta: '567890',
        nossoNumero: '12345678',
      },
    },
    boleto: {
      valor: 100,
      numeroDocumento: 'DOC',
      especieDocumento: 'DM',
      datas: {
        vencimento: '2025-12-31',
        processamento: '2025-11-09',
        documentos: '2025-11-09',
      },
    },
    instrucoes: [],
  });

  t.is(boleto.boletoInfo, null);
});

test('gerarBoleto() deve criar objeto boletoInfo', (t) => {
  const data = createTestData();
  data.boleto.valor = 150.5;
  data.boleto.numeroDocumento = 'DOC-456';

  const boleto = new Boletos(data);

  t.is(boleto.boletoInfo, null);

  const resultado = boleto.gerarBoleto();

  t.truthy(boleto.boletoInfo);
  t.is(resultado, boleto); // Deve retornar this para chaining
});

test('gerarBoleto() deve formatar valor corretamente', (t) => {
  const data = createTestData();
  data.boleto.valor = 99.9;

  const boleto = new Boletos(data);

  boleto.gerarBoleto();

  t.truthy(boleto.boletoInfo);
  t.is(boleto.boletoInfo.getValorFormatadoBRL(), 'R$ 99,90');
});

test('pdfFile() deve criar diretório se não existir', async (t) => {
  const testDir = path.join('tmp', 'test-dir-' + Date.now());
  const boleto = new Boletos(createTestData());

  boleto.gerarBoleto();

  t.false(fs.existsSync(testDir));

  const result = await boleto.pdfFile(testDir, 'test-boleto');

  t.true(fs.existsSync(testDir));
  t.truthy(result.boleto);
  t.truthy(result.filePath);
  t.is(result.filePath, path.join(testDir, 'test-boleto.pdf'));

  // Limpar
  const filePath = path.join(testDir, 'test-boleto.pdf');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  if (fs.existsSync(testDir)) {
    fs.rmdirSync(testDir);
  }
});

test('pdfFile() deve gerar PDF no caminho especificado', async (t) => {
  const testDir = path.join('tmp', 'boletos');
  const filename = 'test-boleto-metodos-' + Date.now();
  const filePath = path.join(testDir, `${filename}.pdf`);

  const data = createTestData();
  data.boleto.valor = 200.5;
  data.boleto.numeroDocumento = 'DOC-789';
  data.instrucoes = ['Teste instrução 1', 'Teste instrução 2'];

  const boleto = new Boletos(data);

  boleto.gerarBoleto();

  const result = await boleto.pdfFile(testDir, filename);

  t.truthy(result);
  t.truthy(result.boleto);
  t.truthy(result.filePath);
  t.is(result.filePath, filePath);
  t.true(fs.existsSync(filePath));

  const stats = fs.statSync(filePath);
  t.true(stats.size > 0);

  // Limpar
  fs.unlinkSync(filePath);
});

test('pdfFile() deve usar defaults quando não especificado', async (t) => {
  const defaultDir = './tmp/boletos';
  const filename = 'boleto'; // default
  const filePath = path.join(defaultDir, `${filename}.pdf`);

  const boleto = new Boletos(createTestData());
  boleto.gerarBoleto();

  const result = await boleto.pdfFile(); // Sem parâmetros

  t.truthy(result);
  t.truthy(result.filePath);
  t.true(fs.existsSync(filePath));

  // Limpar
  fs.unlinkSync(filePath);
});

test('pdfStream() deve gerar PDF em stream customizado', async (t) => {
  const testDir = path.join('tmp', 'boletos');
  const filename = 'test-stream-' + Date.now() + '.pdf';
  const filePath = path.join(testDir, filename);

  const data = createTestData();
  data.boleto.valor = 300;
  data.boleto.numeroDocumento = 'STREAM-001';
  data.instrucoes = ['Stream test'];

  const boleto = new Boletos(data);

  boleto.gerarBoleto();

  const stream = fs.createWriteStream(filePath);
  const result = await boleto.pdfStream(stream);

  t.truthy(result);
  t.truthy(result.boleto);
  t.true(fs.existsSync(filePath));

  // Limpar
  fs.unlinkSync(filePath);
});

test('_ensureDirectoryExists() não deve falhar se diretório já existe', (t) => {
  const testDir = path.join('tmp', 'boletos');
  const boleto = new Boletos(createTestData());

  // Garantir que existe
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Não deve lançar erro
  t.notThrows(() => {
    boleto._ensureDirectoryExists(testDir);
  });
});

test('_destroyStream() deve destruir stream com segurança', (t) => {
  const boleto = new Boletos(createTestData());

  const mockStream = {
    destroy: () => {},
  };

  t.notThrows(() => {
    boleto._destroyStream(mockStream);
  });
});

test('_destroyStream() não deve falhar com stream null', (t) => {
  const boleto = new Boletos(createTestData());

  t.notThrows(() => {
    boleto._destroyStream(null);
  });
});

test('_destroyStream() não deve falhar com stream sem método destroy', (t) => {
  const boleto = new Boletos(createTestData());

  const mockStream = {}; // Sem método destroy

  t.notThrows(() => {
    boleto._destroyStream(mockStream);
  });
});

test('Deve retornar this em gerarBoleto() para permitir chaining', (t) => {
  const boleto = new Boletos(createTestData());

  const result = boleto.gerarBoleto();

  t.is(result, boleto);
  t.truthy(result.boletoInfo);
});
