'use strict';

const QRCode = require('qrcode');

/**
 * Gera QR Code para PIX EMV
 *
 * @param {string} pixEmv - String EMV do PIX
 * @param {Object} options - Opções para geração do QR Code
 * @returns {Promise<Buffer>} Buffer da imagem PNG do QR Code
 */
async function gerarQRCodePix(pixEmv, options = {}) {
  if (!pixEmv || typeof pixEmv !== 'string') {
    throw new Error('String PIX EMV é obrigatória');
  }

  const defaultOptions = {
    errorCorrectionLevel: 'M',
    type: 'png',
    quality: 0.92,
    margin: 1,
    width: 150,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  const qrOptions = { ...defaultOptions, ...options };

  try {
    const buffer = await QRCode.toBuffer(pixEmv, qrOptions);
    return buffer;
  } catch (error) {
    throw new Error(`Erro ao gerar QR Code: ${error.message}`);
  }
}

/**
 * Gera QR Code como Data URL para uso direto no PDF
 *
 * @param {string} pixEmv - String EMV do PIX
 * @param {Object} options - Opções para geração do QR Code
 * @returns {Promise<string>} Data URL da imagem
 */
async function gerarQRCodePixDataURL(pixEmv, options = {}) {
  if (!pixEmv || typeof pixEmv !== 'string') {
    throw new Error('String PIX EMV é obrigatória');
  }

  const defaultOptions = {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    quality: 0.92,
    margin: 1,
    width: 150,
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  };

  const qrOptions = { ...defaultOptions, ...options };

  try {
    const dataURL = await QRCode.toDataURL(pixEmv, qrOptions);
    return dataURL;
  } catch (error) {
    throw new Error(`Erro ao gerar QR Code: ${error.message}`);
  }
}

module.exports = {
  gerarQRCodePix,
  gerarQRCodePixDataURL,
};
