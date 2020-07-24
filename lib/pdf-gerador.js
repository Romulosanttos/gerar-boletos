const fs = require('fs');
const path = require('path');
const Boleto = require('./utils/functions/boletoUtils');

module.exports = class Pdf {
  constructor(boleto) {
    this.boletoInfo = boleto;
  }

  pdfFile(nameFile) {
    const caminhoDoArquivo = path.join(__dirname, nameFile);
    const stream = fs.createWriteStream(caminhoDoArquivo);

    return new Promise((resolve) => new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => resolve({ boleto: this.boleto, stream, path: caminhoDoArquivo })));
  }

  pdfStream(stream) {
    return new Promise((resolve) => new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => resolve({ boleto: this.boleto, stream })));
  }
};