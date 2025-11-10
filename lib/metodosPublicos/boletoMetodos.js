const fs = require('fs');
const Boleto = require('../core/boleto');
const Datas = require('../core/datas');
const BoletoStringify = require('../stringify/boletoStringify');
const BoletoGerador = require('../generators/boleto-generator');
const streamUtils = require('../utils/stream');

module.exports = class Boletos {
  constructor({ banco, pagador, boleto, beneficiario, instrucoes }) {
    this.banco = banco;
    this.pagador = pagador;
    this.boleto = boleto;
    this.beneficiario = beneficiario;
    this.instrucoes = instrucoes;
    this.boletoInfo = null;
  }

  gerarBoleto() {
    const { datas, valor, especieDocumento, numeroDocumento, pixEmv } = this.boleto;

    this.boletoInfo = Boleto.novoBoleto()
      .comDatas(
        Datas.novasDatas()
          .comVencimento(datas.vencimento)
          .comProcessamento(datas.processamento)
          .comDocumento(datas.documentos)
      )
      .comBeneficiario(BoletoStringify.createBeneficiario(this.beneficiario))
      .comPagador(BoletoStringify.createPagador(this.pagador))
      .comBanco(this.banco)
      .comValorBoleto(parseFloat(valor).toFixed(2))
      .comNumeroDoDocumento(numeroDocumento)
      .comEspecieDocumento(especieDocumento)
      .comInstrucoes(BoletoStringify.createInstrucoes(this.instrucoes));

    // Adicionar código PIX EMV se fornecido
    if (pixEmv) {
      this.boletoInfo.comPixEmv(pixEmv);
    }

    return this;
  }

  /**
   * Gera PDF e escreve em arquivo
   * @param {string} dir - Diretório onde o PDF será salvo
   * @param {string} filename - Nome do arquivo sem extensão
   * @returns {Promise<{boleto: Object, filePath: string}>}
   */
  async pdfFile(dir = './tmp/boletos', filename = 'boleto') {
    this._ensureDirectoryExists(dir);
    const filePath = `${dir}/${filename}.pdf`;
    const stream = fs.createWriteStream(filePath);

    try {
      await new BoletoGerador(this.boletoInfo).gerarPDF({
        creditos: '',
        stream,
      });

      await streamUtils(stream);

      return { boleto: this.boleto, filePath };
    } catch (err) {
      this._destroyStream(stream);
      throw err;
    }
  }

  /**
   * Gera PDF e escreve em stream fornecido
   * @param {WriteStream} stream - Stream de escrita
   * @returns {Promise<{boleto: Object}>}
   */
  async pdfStream(stream) {
    try {
      await new BoletoGerador(this.boletoInfo).gerarPDF({
        creditos: '',
        stream,
      });

      await streamUtils(stream);

      return { boleto: this.boleto };
    } catch (err) {
      this._destroyStream(stream);
      throw err;
    }
  }

  /**
   * Gera PNG do boleto (direto em memória, sem arquivos temporários)
   * @param {Object} options - Opções de geração (scale, etc)
   * @returns {Promise<Array<{page: number, buffer: Buffer, mimeType: string}>>}
   */
  async pngBuffer(options = {}) {
    return new BoletoGerador(this.boletoInfo).gerarPNG(options);
  }

  /**
   * Gera PNG e salva em arquivo(s)
   * @param {string} dir - Diretório onde o(s) PNG(s) será(ão) salvo(s)
   * @param {string} filename - Nome base do arquivo sem extensão
   * @param {Object} options - Opções de geração (scale, etc)
   * @returns {Promise<Array<string>>} - Array com paths dos arquivos gerados
   */
  async pngFile(dir = './tmp/boletos', filename = 'boleto', options = {}) {
    this._ensureDirectoryExists(dir);

    const images = await this.pngBuffer(options);
    const filePaths = [];

    for (const { page, buffer } of images) {
      const filePath =
        images.length > 1 ? `${dir}/${filename}-page${page}.png` : `${dir}/${filename}.png`;

      fs.writeFileSync(filePath, buffer);
      filePaths.push(filePath);
    }

    return filePaths;
  }

  /**
   * Cria diretório se não existir
   * @private
   */
  _ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Destrói stream de forma segura
   * @private
   */
  _destroyStream(stream) {
    if (stream && typeof stream.destroy === 'function') {
      stream.destroy();
    }
  }
};
