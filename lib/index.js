
const fs = require('fs');
const validacoes = require('./validacoesUtils');
const formatacoes = require('./formatacoesUtils');
const bancos = require('./bancosUtils');
const Boleto = require('./boletoUtils');


class BoletoStringify {
  static enderecoPagador({ logradouro, bairro, cidade, estadoUF, cep }) {
    return Boleto.Endereco.novoEndereco()
      .comLogradouro(logradouro)
      .comBairro(bairro)
      .comCidade(cidade)
      .comUf(estadoUF)
      .comCep(cep);
  }

  static createPagador({ endereco, nome, registroNacional }) {
    const enderecoPagador = this.enderecoPagador(endereco);
    return Boleto.Pagador.novoPagador()
      .comNome(nome)
      .comRegistroNacional(registroNacional)
      .comEndereco(enderecoPagador);
  }

  static createBeneficiario({dadosBancarios, endereco, cnpj, nome}) {
    const enderecoBeneficiario = this.enderecoPagador(endereco);

    let novoBeneficiario = Boleto.Beneficiario.novoBeneficiario()
      .comNome(nome)
      .comRegistroNacional(cnpj)
      .comCarteira(dadosBancarios.carteira)
      .comAgencia(dadosBancarios.agencia)
      .comDigitoAgencia(dadosBancarios.agenciaDigito)
      .comCodigoBeneficiario(dadosBancarios.conta)
      .comDigitoCodigoBeneficiario(dadosBancarios.contaDigito)
      .comNossoNumero(dadosBancarios.nossoNumero) //11 -digitos // "00000005752"
      .comDigitoNossoNumero(dadosBancarios.nossoNumeroDigito) // 1 digito // 8
      .comEndereco(enderecoBeneficiario);

    if (dadosBancarios.convenio) {
      novoBeneficiario.comNumeroConvenio(dadosBancarios.convenio);
    }

    return novoBeneficiario;
  }

  static createInstrucoes(instrucoes) {
    if (!Array.isArray(instrucoes)) {
      return [instrucoes];
    }
    return instrucoes;
  }
}

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
      .comDatas(dataInstance.novasDatas()
        .comVencimento(datas.vencimento)
        .comProcessamento(datas.processamento)
        .comDocumento(datas.documentos))
      .comBeneficiario(BoletoStringify.createBeneficiario(this.beneficiario))
      .comPagador(BoletoStringify.createPagador(this.pagador))
      .comBanco(this.banco)
      .comValorBoleto(parseFloat(valor).toFixed(2))
      .comNumeroDoDocumento(numeroDocumento)
      .comEspecieDocumento(especieDocumento)
      .comInstrucoes(BoletoStringify.createInstrucoes(this.instrucoes));
  }

  pdfFile() {
    const dir = './tmp/boletos';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    const stream = fs.createWriteStream(`${dir}/boleto.pdf`);

    return new Promise((resolve) => new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => resolve({ boleto: this.boleto, stream })));
  }

  pdfStream(stream) {
    return new Promise((resolve) => new Boleto.Gerador(this.boletoInfo).gerarPDF({
      creditos: '',
      stream,
    }).then(() => resolve({ boleto: this.boleto, stream })));
  }
};
