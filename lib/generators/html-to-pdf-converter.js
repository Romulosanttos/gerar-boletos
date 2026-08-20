'use strict';

/**
 * Conversor de HTML para PDF usando Puppeteer
 * Requer: npm install puppeteer
 */
class HTMLtoPDFConverter {
  /**
   * Converte HTML string para PDF
   * @param {string} html - HTML string para converter
   * @param {object} options - Opções de conversão
   * @returns {Promise<Buffer>} Buffer do PDF
   */
  static async convert(html, options = {}) {
    try {
      const puppeteer = require('puppeteer');

      const defaultOptions = {
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0mm',
          right: '0mm',
          bottom: '0mm',
          left: '0mm',
        },
      };

      const pdfOptions = { ...defaultOptions, ...options };

      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf(pdfOptions);

      await browser.close();

      return pdfBuffer;
    } catch (error) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new Error('Puppeteer não está instalado. Execute: npm install puppeteer');
      }
      throw error;
    }
  }

  /**
   * Converte HTML para PDF e salva em arquivo
   * @param {string} html - HTML string para converter
   * @param {string} outputPath - Caminho do arquivo de saída
   * @param {object} options - Opções de conversão
   */
  static async convertToFile(html, outputPath, options = {}) {
    const fs = require('fs');
    const pdfBuffer = await this.convert(html, options);
    fs.writeFileSync(outputPath, pdfBuffer);
  }
}

module.exports = HTMLtoPDFConverter;
