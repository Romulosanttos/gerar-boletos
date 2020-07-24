const PdfGerador = require('../../../lib/pdf-gerador');
var path = require('path'),
	fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Itau = require('../../../lib/boleto/bancos/itau.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js'),
	GeradorDeBoleto = require('../../../lib/boleto/gerador-de-boleto.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boleto,
	beneficiario;

module.exports = {
	setUp: function(done) {
		const datas = Datas.novasDatas();
		datas.comDocumento('03-20-2013');
		datas.comProcessamento('03-20-2013');
		datas.comVencimento('04-01-2013');

		const pagador = Pagador.novoPagador();
		pagador.comNome('Fulano de Tal da Silva');
		pagador.comRegistroNacional('00132781000178');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Gammasoft Desenvolvimento de Software Ltda');
		beneficiario.comRegistroNacional('19950366000150');
		beneficiario.comAgencia('167');
		beneficiario.comCarteira('157');
		beneficiario.comCodigoBeneficiario('45145');
		beneficiario.comNossoNumero('21897666');
		beneficiario.comDigitoNossoNumero('6');

		banco = new Itau();

		boleto = Boleto.novoBoleto();
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(2680.16);
		boleto.comNumeroDoDocumento(575);

		done();
	},

	'Nosso número formatado deve ter oito digitos': function(test) {
		var beneficiario = Beneficiario.novoBeneficiario().comNossoNumero('9000206'),
			numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);

		test.equals(8, numeroFormatado.length);
		test.equals('09000206', numeroFormatado);
		test.done();
	},

	'Carteira formatado deve ter três dígitos': function(test) {
		var beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
			numeroFormatado = banco.getCarteiraFormatado(beneficiario);

		test.equals(3, numeroFormatado.length);
		test.equals('001', numeroFormatado);
		test.done();
	},

	'Conta corrente formatada deve ter cinco dígitos': function(test) {
		var numeroFormatado = banco.getCodigoFormatado(beneficiario);

		test.equals(5, numeroFormatado.length);
		test.equals('45145', numeroFormatado);
		test.done();
	},

	'Verifica geração da linha digitável - 1': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57213 89766.660164 74514.590004 6 56550000268016';

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Verifica geração da linha digitável - 2': function(test) {
		const datas = Datas.novasDatas();
		datas.comDocumento('03-20-2014');
		datas.comProcessamento('03-20-2014');
		datas.comVencimento('04-10-2014');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Mario Amaral');
		beneficiario.comAgencia('8462');
		beneficiario.comCarteira('174');
		beneficiario.comCodigoBeneficiario('05825');
		beneficiario.comNossoNumero('00015135');
		beneficiario.comDigitoNossoNumero('6');

		const pagador = Pagador.novoPagador();
		pagador.comNome('Rodrigo de Sousa');

		boleto = Boleto.novoBoleto();
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(2680.16);
		boleto.comNumeroDoDocumento('575');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.74002 01513.568467 20582.590004 6 60290000268016';

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Verifica geração da linha digitável - 3': function(test) {
		const datas = Datas.novasDatas();
		datas.comDocumento('05-21-2014');
		datas.comProcessamento('05-21-2014');
		datas.comVencimento('05-21-2014');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('181');
		beneficiario.comAgencia('654');
		beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('94588021');
		beneficiario.comDigitoNossoNumero('4');

		const pagador = Pagador.novoPagador();

		boleto = Boleto.novoBoleto();
		boleto.comEspecieDocumento('DSI');
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(575);
		boleto.comNumeroDoDocumento('1');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.81940 58802.140655 40871.130007 4 60700000057500',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 4': function(test) {
		const datas = Datas.novasDatas();
		datas.comDocumento('05-29-2014');
		datas.comProcessamento('05-29-2014');
		datas.comVencimento('06-23-2014');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('89605074');
		beneficiario.comDigitoNossoNumero('2');

		const pagador = Pagador.novoPagador();

		boleto = Boleto.novoBoleto();
		boleto.comEspecieDocumento('DSI');
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(115.38);
		boleto.comNumeroDoDocumento('2');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57890 60507.420655 40871.130007 1 61030000011538',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 5': function(test) {
		const datas = Datas.novasDatas();
		datas.comDocumento('08-20-2014');
		datas.comProcessamento('08-20-2014');
		datas.comVencimento('08-27-2014');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('02891620');
		beneficiario.comDigitoNossoNumero('8');

		const pagador = Pagador.novoPagador();

		boleto = Boleto.novoBoleto();
		boleto.comEspecieDocumento('DSI');
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(115.38);
		boleto.comNumeroDoDocumento('4');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57023 89162.080652 40871.130007 4 61680000011538',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica geração da linha digitável - 6': function(test) {
		const datas = Datas.novasDatas();
		datas.comDocumento('09-19-2014');
		datas.comProcessamento('09-19-2014');
		datas.comVencimento('09-26-2014');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comCarteira('157');
		beneficiario.comAgencia('654');
		beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
		beneficiario.comNossoNumero('07967777');
		beneficiario.comDigitoNossoNumero('4');

		const pagador = Pagador.novoPagador();

		boleto = Boleto.novoBoleto();
		boleto.comEspecieDocumento('FS');
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValorBoleto(230.76);
		boleto.comNumeroDoDocumento('5');
		boleto.comBanco(banco);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '34191.57072 96777.740653 40871.130007 9 61980000023076',
			linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

		test.equal(linhaEsperada, linhaGerada);
		test.done();
	},

	'Verifica nome correto do banco': function(test) {
		test.equals(banco.getNome(), 'Banco Itaú S/A');
		test.done();
	},

	'Verifica a numeração correta do banco': function(test) {
		test.equal(banco.getNumeroFormatadoComDigito(), '341-7');
		test.done();
	},

	'Verifica deve imprimir o nome do banco no boleto': function(test) {
		test.ok(banco.getImprimirNome());
		test.done();
	},

	'Verifica geração do código de barras': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

		test.equal('34196565500002680161572189766660167451459000', codigoDeBarras);
		test.done();
	},

	'Verifica que arquivo de imagem do logotipo existe': function(test){
		test.ok(fs.existsSync(banco.getImagem()));
		test.done();
	},

	'Exibir campo CIP retorna falso': function(test){
		test.equal(banco.exibirCampoCip(), false);
		test.done();
	},

	'Verifica criação de pdf': function(test) { //Mover para teste adequado
		const datas2 = Datas.novasDatas();
		datas2.comDocumento('09-19-2014');
		datas2.comProcessamento('09-19-2014');
		datas2.comVencimento('09-26-2014');

		var beneficiario2 = Beneficiario.novoBeneficiario();
		beneficiario2.comNome('José da Silva');
		beneficiario2.comRegistroNacional('397.861.533-91');
		beneficiario2.comCarteira('157');
		beneficiario2.comAgencia('654');
		beneficiario2.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da conta
		beneficiario2.comNossoNumero('07967777');
		beneficiario2.comDigitoNossoNumero('4');

		var pagador2 = Pagador.novoPagador();
		pagador2.comNome('Asnésio da Silva');

		var boleto2 = Boleto.novoBoleto();
		boleto2.comEspecieDocumento('FS');
		boleto2.comDatas(datas2);
		boleto2.comBeneficiario(beneficiario2);
		boleto2.comBanco(banco);
		boleto2.comPagador(pagador2);
		boleto2.comValorBoleto(230.76);
		boleto2.comNumeroDoDocumento('5');
		boleto2.comBanco(banco);

		var enderecoDoPagador = Endereco.novoEndereco();
		enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
		enderecoDoPagador.comBairro('Barra da Tijuca');
		enderecoDoPagador.comCep('72000000');
		enderecoDoPagador.comCidade('Rio de Janeiro');
		enderecoDoPagador.comUf('RJ');

		pagador2.comEndereco(enderecoDoPagador);

		boleto.comLocaisDePagamento([
			'Pagável em qualquer banco ou casa lotérica até o vencimento',
			'Após o vencimento pagável apenas em agências Itaú'
		]);

		boleto.comInstrucoes([
			'Conceder desconto de R$ 10,00 até o vencimento',
			'Multa de R$ 2,34 após o vencimento',
			'Mora de R$ 0,76 ao dia após o vencimento',
			'Protestar após 10 dias de vencido',
			'Agradecemos a preferência, volte sempre!'
		]);

		// const geradorDeBoleto = new GeradorDeBoleto([boleto, boleto2]);
		new PdfGerador([boleto, boleto2]).pdfFile(
			'../tests/boleto/bancos/boleto-itau.pdf'
		).then(async({path})=>{
			test.ok(fs.existsSync(path));
			test.equal(fs.unlinkSync(path), undefined);
			test.done();
		});
	}
};
