
const fs = require('fs');
const validacoes = require('./validacoesUtils');
const formatacoes = require('./formatacoesUtils');
const bancos = require('./bancosUtils');
const Boleto = require('./boletoUtils');



const createPagador = (pagador)=>{
	const enderecoPagador = Boleto.Endereco.novoEndereco()
		.comLogradouro('Rua Pedro Lessa, 15')
		.comBairro('Centro')
		.comCidade('Rio de Janeiro')
		.comUf('RJ')
		.comCep('20030-030');

	return Boleto.Pagador.novoPagador()
		.comNome('José Bonifácio de Andrada')
		.comRegistroNacional(pagador.RegistroNacional)
		.comEndereco(enderecoPagador);
};
  
const createBeneficiario = (beneficiario)=>{
	const enderecoBeneficiario = Boleto.Endereco.novoEndereco()
		.comLogradouro('Rua Pedro Lessa, 16')
		.comBairro('Centro')
		.comCidade('Rio de Janeiro')
		.comUf('RJ')
		.comCep('20030-030');

	const {dadosBancarios} = beneficiario;

	let novoBeneficiario =  Boleto.Beneficiario.novoBeneficiario()
		.comNome('Empresa Fictícia LTDA')
		.comRegistroNacional('43576788000191')
		.comCarteira(dadosBancarios.carteira)
		.comAgencia(dadosBancarios.agencia)
		.comDigitoAgencia(dadosBancarios.agenciaDigito)
		.comCodigoBeneficiario(dadosBancarios.conta)
		.comDigitoCodigoBeneficiario(dadosBancarios.contaDigito)
		.comNossoNumero(dadosBancarios.nossoNumero) //11 -digitos // "00000005752"
		.comDigitoNossoNumero(dadosBancarios.nossoNumeroDigito) // 1 digito // 8
		.comEndereco(enderecoBeneficiario);

	if(dadosBancarios.convenio){
		novoBeneficiario.comNumeroConvenio(dadosBancarios.convenio);
	}

	return novoBeneficiario;
};
  
const createInstrucoes = (instrucoes)=>{
  if(!Array.isArray(instrucoes)){
    return [instrucoes];
  }	
	return instrucoes;
};

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
		.comBeneficiario(createBeneficiario(this.beneficiario))
		.comPagador(createPagador(this.pagador))
		.comBanco(this.banco)
		.comValorBoleto(parseFloat(valor).toFixed(2)) 
		.comNumeroDoDocumento(numeroDocumento)
		.comEspecieDocumento(especieDocumento) 
		.comInstrucoes(createInstrucoes(this.instrucoes));
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
