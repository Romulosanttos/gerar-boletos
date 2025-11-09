const fs = require('fs');
const Boleto = require('../core/boleto');
const BoletoStringify = require('../stringify/boletoStringify');

module.exports = class Boletos {
  constructor({ banco, pagador, boleto, beneficiario, instrucoes }) {
    this.banco = banco;
    this.pagador = pagador;
    this.boleto = boleto;
    this.beneficiario = beneficiario;
    this.instrucoes = instrucoes;
    this.boletoInfo;
  }

  gerarBoleto() {
    const dataInstance = Boleto.Datas;
    const { datas, valor, especieDocumento, numeroDocumento } = this.boleto;

    this.boletoInfo = Boleto.Boleto.novoBoleto()
      .comDatas(
        dataInstance
          .novasDatas()
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
  }

  pdfFile(dir = './tmp/boletos', filename = 'boleto') {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const stream = fs.createWriteStream(`${dir}/${filename}.pdf`);

    return new Promise((resolve, reject) =>
      new Boleto.Gerador(this.boletoInfo)
        .gerarPDF({
          creditos: '',
          stream,
        })
        .then(() => resolve({ boleto: this.boleto, stream }))
        .catch((err) => {
          reject(err);
        })
    );
  }

  pdfStream(stream) {
    return new Promise((resolve, reject) =>
      new Boleto.Gerador(this.boletoInfo)
        .gerarPDF({
          creditos: '',
          stream,
        })
        .then(() => resolve({ boleto: this.boleto, stream }))
        .catch((err) => {
          reject(err);
        })
    );
  }
};
