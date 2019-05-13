import Gerador from '../index';

export default function createBoleto(boleto_info){
	const { banco, pagador, boleto, beneficiario } = boleto_info;
	const { datas, valor, especieDocumento, numeroDocumento } = boleto;
	const da = Gerador.boleto.Datas;
	const instrucoes = createInstrucoes();

	return Gerador.boleto.Boleto.novoBoleto()
		.comDatas(da.novasDatas()
			.comVencimento(datas.vencimento)
			.comProcessamento(datas.processamento)
			.comDocumento(datas.documentos))
		.comBeneficiario(createBeneficiario(beneficiario))
		.comPagador(createPagador(pagador))
		.comBanco(banco)
		.comValorBoleto(parseFloat(valor).toFixed(2)) //Apenas duas casas decimais
		.comNumeroDoDocumento(numeroDocumento)
		.comEspecieDocumento(especieDocumento) //Duplicata de Venda Mercantil
		.comInstrucoes(instrucoes);
}
  
function createPagador(pagador)  {
	const enderecoPagador = Gerador.boleto.Endereco.novoEndereco()
		.comLogradouro('Rua Pedro Lessa, 15')
		.comBairro('Centro')
		.comCidade('Rio de Janeiro')
		.comUf('RJ')
		.comCep('20030-030');

	return Gerador.boleto.Pagador.novoPagador()
		.comNome('José Bonifácio de Andrada')
		.comRegistroNacional(pagador.RegistroNacional)
		.comEndereco(enderecoPagador);
}
  
function createBeneficiario(beneficiario){
	const enderecoBeneficiario = Gerador.boleto.Endereco.novoEndereco()
		.comLogradouro('Rua Pedro Lessa, 16')
		.comBairro('Centro')
		.comCidade('Rio de Janeiro')
		.comUf('RJ')
		.comCep('20030-030');

	const {dadosBancarios} = beneficiario;

	return Gerador.boleto.Beneficiario.novoBeneficiario()
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
}
  
function createInstrucoes(){
	const instrucoes = [];
	instrucoes.push('Após o vencimento Mora dia R$ 1,59');
	instrucoes.push('Após o vencimento, multa de 2%');
	return instrucoes;
}
