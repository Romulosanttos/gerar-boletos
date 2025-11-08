const fs = require('fs');
const path = require('path');
const Boleto = require('./utils/functions/boletoUtils');

module.exports = class Pdf {
  constructor(boleto) {
    this.boletoInfo = boleto;
  }

  async pdfFile(nameFile) {
    const caminhoDoArquivo = path.join(__dirname, nameFile);
    const stream = fs.createWriteStream(caminhoDoArquivo);

    try {
      await new Boleto.Gerador(this.boletoInfo).gerarPDF({
        creditos: '',
        stream,
      });

      return { boleto: this.boletoInfo, stream, path: caminhoDoArquivo };
    } catch (error) {
      stream.destroy();
      throw error;
    }
  }

  async pdfStream(stream) {
    try {
      await new Boleto.Gerador(this.boletoInfo).gerarPDF({
        creditos: '',
        stream,
      });

      return { boleto: this.boletoInfo, stream };
    } catch (error) {
      if (stream.destroy) {
        stream.destroy();
      }
      throw error;
    }
  }
};
