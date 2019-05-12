import Gerador from '../index';

export default function createBoleto(banco, pagador, boleto){
	const da = Gerador.boleto.Datas;
	const { datas } = boleto;
	const beneficiario = createBeneficiario();
	const instrucoes = createInstrucoes();

	return Gerador.boleto.Boleto.novoBoleto()
		.comDatas(da.novasDatas()
			.comVencimento(datas.vencimento)
			.comProcessamento(datas.processamento)
			.comDocumento(datas.documentos))
		.comBeneficiario(beneficiario)
		.comPagador(createPagador(pagador))
		.comBanco(banco)
		.comValorBoleto(boleto.valor) //Apenas duas casas decimais
		.comNumeroDoDocumento(1001)
		.comEspecieDocumento('DM') //Duplicata de Venda Mercantil
		.comInstrucoes(instrucoes);
}

function createPagador(pagador){
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

function createBeneficiario(){
	const enderecoBeneficiario = Gerador.boleto.Endereco.novoEndereco()
		.comLogradouro('Av romualdo galvao, 359')
		.comBairro('Tirol')
		.comCidade('Natal')
		.comUf('RN')
		.comCep('59020660');

	return Gerador.boleto.Beneficiario.novoBeneficiario()
		.comNome('Ezydoo Pagamentos LTDA')
		.comRegistroNacional('43576788000191')
		.comCarteira('09')
		.comAgencia('0101')
		.comDigitoAgencia('5')
		.comCodigoBeneficiario('0326446')
		.comDigitoCodigoBeneficiario('0')
		.comNossoNumero('00000000061') //11 -digitos // "00000005752"
		.comDigitoNossoNumero('8') // 1 digito // 8
		.comEndereco(enderecoBeneficiario);
}

function createInstrucoes(){
	const instrucoes = [];
	instrucoes.push('Após o vencimento Mora dia R$ 1,59');
	instrucoes.push('Após o vencimento, multa de 2%');
	return instrucoes;
}
