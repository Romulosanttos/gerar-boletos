'use strict';

const test = require('ava');
const PixRenderer = require('../lib/generators/pdf/layout/pix-renderer');

// Mock do PDF
class MockPDF {
  constructor() {
    this.operations = [];
  }

  undash() {
    this.operations.push({ type: 'undash' });
    return this;
  }

  moveTo(x, y) {
    this.operations.push({ type: 'moveTo', x, y });
    return this;
  }

  lineTo(x, y) {
    this.operations.push({ type: 'lineTo', x, y });
    return this;
  }

  lineWidth(width) {
    this.operations.push({ type: 'lineWidth', width });
    return this;
  }

  stroke(color) {
    this.operations.push({ type: 'stroke', color });
    return this;
  }

  image(source, x, y, options) {
    this.operations.push({ type: 'image', source, x, y, options });
    return this;
  }

  font(fontName) {
    this.operations.push({ type: 'font', fontName });
    return this;
  }

  fontSize(size) {
    this.operations.push({ type: 'fontSize', size });
    return this;
  }

  text(text, x, y, options) {
    this.operations.push({ type: 'text', text, x, y, options });
    return this;
  }
}

// Mock do Boleto
class MockBoleto {
  constructor(hasPixData = true) {
    this.hasPixData = hasPixData;
    this.pixEmvString =
      '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2f8cd5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D';
    this.pixInstrucoes = ['Pague via PIX', 'Use o QR Code'];
  }

  getPixEmvString() {
    return this.hasPixData ? this.pixEmvString : null;
  }

  getPixInstrucoes() {
    return this.pixInstrucoes;
  }
}

test('PixRenderer - constructor deve inicializar propriedades corretamente', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);

  t.is(renderer.pdf, pdf);
  t.is(renderer.boleto, boleto);
  t.is(renderer.args, args);
  t.is(renderer.TAMANHO_QR_CODE, 100);
  t.is(renderer.TAMANHO_LOGO_PIX, 100);
  t.is(renderer.ESPACAMENTO_LINHA, 11);
  t.is(renderer.LARGURA_TEXTO, 210);
});

test('PixRenderer - calcularPosicoes() deve retornar posições corretas', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 10,
    ajusteY: 20,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 15,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();

  t.truthy(posicoes.linha);
  t.is(typeof posicoes.linha.x, 'number');
  t.is(typeof posicoes.linha.yInicio, 'number');
  t.is(typeof posicoes.linha.yFim, 'number');

  t.truthy(posicoes.logo);
  t.is(typeof posicoes.logo.x, 'number');
  t.is(typeof posicoes.logo.y, 'number');
  t.is(posicoes.logo.width, 100);
  t.is(posicoes.logo.height, 100);

  t.truthy(posicoes.qrCode);
  t.is(typeof posicoes.qrCode.x, 'number');
  t.is(typeof posicoes.qrCode.y, 'number');
  t.is(posicoes.qrCode.width, 100);
  t.is(posicoes.qrCode.height, 100);

  t.truthy(posicoes.texto);
  t.is(typeof posicoes.texto.x, 'number');
  t.is(typeof posicoes.texto.y, 'number');
  t.is(posicoes.texto.width, 0);
  t.is(posicoes.texto.espacamento, 11);
});

test('PixRenderer - renderizarLinha() deve adicionar operações de linha ao PDF', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#FF0000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();

  renderer.renderizarLinha(posicoes);

  const operations = pdf.operations;
  t.true(operations.some((op) => op.type === 'undash'));
  t.true(operations.some((op) => op.type === 'moveTo'));
  t.true(operations.some((op) => op.type === 'lineTo'));
  t.true(operations.some((op) => op.type === 'lineWidth' && op.width === 1));
  t.true(operations.some((op) => op.type === 'stroke' && op.color === '#FF0000'));
});

test('PixRenderer - renderizarLogoPix() deve adicionar imagem ao PDF', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();

  renderer.renderizarLogoPix(posicoes);

  const imageOps = pdf.operations.filter((op) => op.type === 'image');
  t.is(imageOps.length, 1);
  t.true(imageOps[0].source.includes('pix-logo.png'));
  t.is(imageOps[0].options.width, 100);
  t.is(imageOps[0].options.height, 100);
});

test('PixRenderer - renderizarQRCode() deve adicionar QR Code ao PDF', async (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();
  const emvString = boleto.getPixEmvString();

  await renderer.renderizarQRCode(emvString, posicoes);

  const imageOps = pdf.operations.filter((op) => op.type === 'image');
  t.is(imageOps.length, 1);
  t.true(imageOps[0].source.startsWith('data:image/png;base64,'));
  t.is(imageOps[0].options.width, 100);
  t.is(imageOps[0].options.height, 100);
});

test('PixRenderer - renderizarInstrucoes() deve adicionar textos ao PDF', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();
  const instrucoes = boleto.getPixInstrucoes();

  renderer.renderizarInstrucoes(instrucoes, posicoes);

  const textOps = pdf.operations.filter((op) => op.type === 'text');
  t.is(textOps.length, instrucoes.length);
  t.is(textOps[0].text, 'Pague via PIX');
  t.is(textOps[1].text, 'Use o QR Code');
});

test('PixRenderer - render() deve executar toda a renderização', async (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);

  await renderer.render();

  // Verificar se todas as operações foram executadas
  t.true(pdf.operations.some((op) => op.type === 'stroke')); // Linha
  t.true(pdf.operations.filter((op) => op.type === 'image').length >= 2); // Logo + QR Code
  t.true(pdf.operations.some((op) => op.type === 'text')); // Instruções
});

test('PixRenderer - render() deve lançar erro se boleto não tem PIX', async (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto(false); // Criar boleto sem PIX

  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);

  const error = await t.throwsAsync(async () => {
    await renderer.render();
  });

  t.is(error.message, 'Código EMV do PIX não encontrado');
});

test('PixRenderer - renderizarInstrucoes() com array vazio', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 0,
    ajusteY: 0,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 10,
    larguraInstrucoes: 300,
    tituloDaSetimaLinha: 100,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();

  // Renderizar com array vazio
  renderer.renderizarInstrucoes([], posicoes);

  const textOps = pdf.operations.filter((op) => op.type === 'text');
  t.is(textOps.length, 0);
});

test('PixRenderer - calcularPosicoes() com ajustes diferentes', (t) => {
  const pdf = new MockPDF();
  const boleto = new MockBoleto();
  const args = {
    ajusteX: 50,
    ajusteY: 100,
    corDoLayout: '#000000',
    tamanhoDaFonte: 8,
  };
  const basePositions = {
    margemDoSegundoBloco: 20,
    larguraInstrucoes: 400,
    tituloDaSetimaLinha: 150,
  };

  const renderer = new PixRenderer(pdf, boleto, args, basePositions);
  const posicoes = renderer.calcularPosicoes();

  // Verificar que os ajustes são aplicados
  t.true(posicoes.linha.x > 0);
  t.true(posicoes.qrCode.x > args.ajusteX);
  t.true(posicoes.qrCode.y > args.ajusteY);
});
