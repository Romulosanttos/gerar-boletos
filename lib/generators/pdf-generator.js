const fs = require('fs');
const path = require('path');
const BoletoGerador = require('./boleto-generator');
const streamUtils = require('../utils/stream');

/**
 * Classe responsável por gerar PDFs de boletos
 */
module.exports = class PdfGenerator {
  constructor(boleto) {
    this.boletoInfo = boleto;
  }

  /**
   * Gera PDF e salva em arquivo
   * @param {string} nameFile - Caminho relativo do arquivo
   * @returns {Promise<{boleto: Object, stream: WriteStream, path: string}>}
   */
  async pdfFile(nameFile) {
    const filePath = path.join(__dirname, nameFile);
    const stream = fs.createWriteStream(filePath);

    const result = await this._generatePDF(stream);
    return { ...result, path: filePath };
  }

  /**
   * Gera PDF e escreve em stream fornecido
   * @param {WriteStream} stream - Stream de escrita
   * @returns {Promise<{boleto: Object, stream: WriteStream}>}
   */
  async pdfStream(stream) {
    return this._generatePDF(stream);
  }

  /**
   * Método privado para gerar PDF (evita duplicação)
   * @private
   * @param {WriteStream} stream - Stream de escrita
   * @returns {Promise<{boleto: Object, stream: WriteStream}>}
   */
  async _generatePDF(stream) {
    try {
      await new BoletoGerador(this.boletoInfo).gerarPDF({
        creditos: '',
        stream,
      });

      await streamUtils(stream);

      return { boleto: this.boletoInfo, stream };
    } catch (error) {
      this._destroyStream(stream);
      throw error;
    }
  }

  /**
   * Destrói stream de forma segura
   * @private
   * @param {WriteStream} stream - Stream a ser destruído
   */
  _destroyStream(stream) {
    if (stream && typeof stream.destroy === 'function') {
      stream.destroy();
    }
  }
};
