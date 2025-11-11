'use strict';

const test = require('ava');
const { gerarQRCodePix, gerarQRCodePixDataURL } = require('../lib/generators/qrcode-generator');

// String EMV PIX válida para testes
const VALID_PIX_EMV =
  '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2f8cd5204000053039865802BR5913Fulano de Tal6008BRASILIA62070503***63041D3D';

test('gerarQRCodePix() deve gerar QR Code com dados válidos', async (t) => {
  const buffer = await gerarQRCodePix(VALID_PIX_EMV);

  t.truthy(buffer);
  t.true(Buffer.isBuffer(buffer));
  t.true(buffer.length > 0);
});

test('gerarQRCodePix() deve aceitar opções customizadas', async (t) => {
  const buffer = await gerarQRCodePix(VALID_PIX_EMV, {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'H',
  });

  t.truthy(buffer);
  t.true(Buffer.isBuffer(buffer));
  t.true(buffer.length > 0);
});

test('gerarQRCodePix() deve usar opções padrão quando não especificadas', async (t) => {
  const buffer = await gerarQRCodePix(VALID_PIX_EMV, {});

  t.truthy(buffer);
  t.true(Buffer.isBuffer(buffer));
});

test('gerarQRCodePix() deve rejeitar EMV vazio', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePix('');
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePix() deve rejeitar EMV null', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePix(null);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePix() deve rejeitar EMV undefined', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePix(undefined);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePix() deve rejeitar EMV que não é string', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePix(12345);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePixDataURL() deve gerar Data URL com dados válidos', async (t) => {
  const dataURL = await gerarQRCodePixDataURL(VALID_PIX_EMV);

  t.truthy(dataURL);
  t.is(typeof dataURL, 'string');
  t.true(dataURL.startsWith('data:image/png;base64,'));
});

test('gerarQRCodePixDataURL() deve aceitar opções customizadas', async (t) => {
  const dataURL = await gerarQRCodePixDataURL(VALID_PIX_EMV, {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'H',
  });

  t.truthy(dataURL);
  t.is(typeof dataURL, 'string');
  t.true(dataURL.startsWith('data:image/png;base64,'));
});

test('gerarQRCodePixDataURL() deve usar opções padrão quando não especificadas', async (t) => {
  const dataURL = await gerarQRCodePixDataURL(VALID_PIX_EMV, {});

  t.truthy(dataURL);
  t.is(typeof dataURL, 'string');
});

test('gerarQRCodePixDataURL() deve rejeitar EMV vazio', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePixDataURL('');
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePixDataURL() deve rejeitar EMV null', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePixDataURL(null);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePixDataURL() deve rejeitar EMV undefined', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePixDataURL(undefined);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePixDataURL() deve rejeitar EMV que não é string', async (t) => {
  const error = await t.throwsAsync(async () => {
    await gerarQRCodePixDataURL(12345);
  });

  t.is(error.message, 'String PIX EMV é obrigatória');
});

test('gerarQRCodePix() deve aplicar cor customizada', async (t) => {
  const buffer = await gerarQRCodePix(VALID_PIX_EMV, {
    color: {
      dark: '#FF0000',
      light: '#00FF00',
    },
  });

  t.truthy(buffer);
  t.true(Buffer.isBuffer(buffer));
});

test('gerarQRCodePixDataURL() deve aplicar cor customizada', async (t) => {
  const dataURL = await gerarQRCodePixDataURL(VALID_PIX_EMV, {
    color: {
      dark: '#FF0000',
      light: '#00FF00',
    },
  });

  t.truthy(dataURL);
  t.true(dataURL.startsWith('data:image/png;base64,'));
});
