const Gerador = require('../index');
const fs = require('fs');

console.log('run gerar boletos bradesco!');

const init = () => {
	const boleto = createBoleto();

	const dir = '../temp';
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	const writeStream = fs.createWriteStream('../temp/boleto-bradesco.pdf');

	new Gerador.boleto.Gerador(boleto).gerarPDF({
		creditos: '',
		stream: writeStream
	}, (err, pdf) => {
		if (err) return console.error(err);

		writeStream.on('finish', () => {
			console.log('written on temp!');
		});
	});
};

const createBoleto = () => {
	const Datas = Gerador.boleto.Datas;
	const bancos = Gerador.boleto.bancos;
	const pagador = createPagador();
	const beneficiario = createBeneficiario();
	const instrucoes = createInstrucoes();

	return Gerador.boleto.Boleto.novoBoleto()
		.comDatas(Datas.novasDatas()
			.comVencimento('02-04-2019')
			.comProcessamento('02-04-2019')
			.comDocumento('02-04-2019'))
		.comBeneficiario(beneficiario)
		.comPagador(pagador)
		.comBanco(new bancos.Bradesco())
		.comValorBoleto(210.15) //Apenas duas casas decimais
		.comNumeroDoDocumento(1001)
		.comEspecieDocumento('DM') //Duplicata de Venda Mercantil
		.comLocaisDePagamento(['Em qualquer banco até o vencimento'])
		.comInstrucoes(instrucoes);
};

const createPagador = () => {
	const enderecoPagador = Gerador.boleto.Endereco.novoEndereco()
		.comLogradouro('Rua Pedro Lessa, 15')
		.comBairro('Centro')
		.comCidade('Rio de Janeiro')
		.comUf('RJ')
		.comCep('20030-030');

	return Gerador.boleto.Pagador.novoPagador()
		.comNome('José Bonifácio de Andrada')
		.comRegistroNacional('72285732503')
		.comEndereco(enderecoPagador);
};

const createBeneficiario = () => {
	const enderecoBeneficiario = Gerador.boleto.Endereco.novoEndereco()
		.comLogradouro('Rua da Consolação, 1500')
		.comBairro('Consolação')
		.comCidade('São Paulo')
		.comUf('SP')
		.comCep('01301100');

	return Gerador.boleto.Beneficiario.novoBeneficiario()
		.comNome('Empresa Fictícia LTDA')
		.comRegistroNacional('43576788000191')
		.comCarteira('09')
		.comAgencia('0101')
		.comDigitoAgencia('5')
		.comCodigoBeneficiario('0326446')
		.comDigitoCodigoBeneficiario('0')
		.comNossoNumero('00000000061') //11 -digitos // "00000005752"
		.comDigitoNossoNumero('8') // 1 digito // 8
		.comEndereco(enderecoBeneficiario);
};

const createInstrucoes = () => {
	const instrucoes = [];
	instrucoes.push('Após o vencimento Mora dia R$ 1,59');
	instrucoes.push('Após o vencimento, multa de 2%');
	return instrucoes;
};

init();
