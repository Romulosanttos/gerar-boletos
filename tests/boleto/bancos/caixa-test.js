const PdfGerador = require('../../../lib/pdf-gerador');
var fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Caixa = require('../../../lib/boleto/bancos/caixa.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boletoSinco,
	boletoSicgb,
	beneficiario;

module.exports = {
	setUp: function(done) {
		banco = new Caixa();

		// SINCO
		var datas = Datas.novasDatas();
		datas.comDocumento('04-22-2013');
		datas.comProcessamento('04-22-2013');
		datas.comVencimento('04-29-2013');

		const pagador = Pagador.novoPagador();
		pagador.comNome('Mario Amaral');

		beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Rodrigo Turini');
		beneficiario.comRegistroNacional('19950366000150');
		beneficiario.comAgencia('2873');
		beneficiario.comCarteira('1');
		beneficiario.comCodigoBeneficiario('2359');
		beneficiario.comNossoNumero('990000000003994458');
		beneficiario.comDigitoNossoNumero('0');

		boletoSinco = Boleto.novoBoleto();
		boletoSinco.comDatas(datas);
		boletoSinco.comBeneficiario(beneficiario);
		boletoSinco.comBanco(banco);
		boletoSinco.comPagador(pagador);
		boletoSinco.comValorBoleto(4016.10);
		boletoSinco.comNumeroDoDocumento(3084373);

		// SIGCB
		var datas2 = Datas.novasDatas();
		datas2.comDocumento('02-04-2020');
		datas2.comProcessamento('02-04-2020');
		datas2.comVencimento('02-04-2020');

		var beneficiario2 = Beneficiario.novoBeneficiario();
		beneficiario2.comNome('Gammasoft Desenvolvimento de Software Ltda');
		beneficiario2.comAgencia('589');
		beneficiario2.comCarteira('24');
		beneficiario2.comCodigoBeneficiario('290274');
		beneficiario2.comDigitoCodigoBeneficiario('5');
		beneficiario2.comNossoNumero('900000000000132');
		beneficiario2.comDigitoNossoNumero('3');
		beneficiario2.comRegistroNacional('19950366000150');

		var enderecoDoBeneficiario = Endereco.novoEndereco();
		enderecoDoBeneficiario.comLogradouro('Rua da Programação');
		enderecoDoBeneficiario.comBairro('Zona Rural');
		enderecoDoBeneficiario.comCep('71550050');
		enderecoDoBeneficiario.comCidade('Patos de Minas');
		enderecoDoBeneficiario.comUf('MG');
		beneficiario2.comEndereco(enderecoDoBeneficiario);

		var pagador2 = Pagador.novoPagador();
		pagador2.comNome('Paulo Fulano da Silva');
		pagador2.comRegistroNacional('77134854817');

		var enderecoDoPagador = Endereco.novoEndereco();
		enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
		enderecoDoPagador.comBairro('Barra da Tijuca');
		enderecoDoPagador.comCep('72000000');
		enderecoDoPagador.comCidade('Rio de Janeiro');
		enderecoDoPagador.comUf('RJ');
		pagador2.comEndereco(enderecoDoPagador);

		boletoSicgb = Boleto.novoBoleto();
		boletoSicgb.comDatas(datas2);
		boletoSicgb.comBeneficiario(beneficiario2);
		boletoSicgb.comBanco(banco);
		boletoSicgb.comPagador(pagador2);
		boletoSicgb.comValorBoleto(80.00);
		boletoSicgb.comNumeroDoDocumento('NF100/00000132');
		boletoSicgb.comLocaisDePagamento([
			'PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE'
		]);

		done();
	},

	'Nosso número formatado deve ter 17 digitos': function(test) {
		// var nossoNumeroSinco = banco.getNossoNumeroFormatado(boletoSinco.getBeneficiario());
		// test.equals(17, nossoNumeroSinco.length);
		// test.equals('990000000003994458', nossoNumeroSinco); //Sinco deve ter 18?

		var nossoNumeroSicgb = banco.getNossoNumeroFormatado(boletoSicgb.getBeneficiario());
		test.equals(17, nossoNumeroSicgb.length);
		test.equals('24900000000000132', nossoNumeroSicgb); // Sicgb deve ter 17?

		test.done();
	},

	'Carteira formatado deve ter dois dígitos': function(test) {
		var beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
			numeroFormatado = banco.getCarteiraFormatado(beneficiario);

		test.equals(2, numeroFormatado.length);
		test.equals('01', numeroFormatado);
		test.done();
	},

	'Conta corrente formatada deve ter cinco dígitos': function(test) {
		var numeroFormatado = banco.getCodigoFormatado(beneficiario);

		test.equals(5, numeroFormatado.length);
		test.equals('02359', numeroFormatado);
		test.done();
	},

	// 'Testa código de barras com carteira SINCO': function(test) {
	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco);

	//     test.equal('10492568300004016101002359990000000003994458', codigoDeBarras);
	//     test.done();
	// },

	// 'Linha digitavel com carteira SINCO': function(test) {
	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco),
	//         linhaEsperada = "10491.00231 59990.000008 00039.944582 2 56830000401610";

	//     test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
	//     test.done();
	// },

	'Linha digitavel com carteira SIGCB 1': function(test) {
		var datas2 = Datas.novasDatas();
		datas2.comDocumento('02-04-2020');
		datas2.comProcessamento('02-04-2020');
		datas2.comVencimento('02-04-2020');

		var beneficiario2 = Beneficiario.novoBeneficiario();
		beneficiario2.comNome('AGUINALDO LUIZ TELES - ME');
		beneficiario2.comAgencia('4221');
		beneficiario2.comCarteira('14');
		beneficiario2.comCodigoBeneficiario('648995');
		beneficiario2.comDigitoCodigoBeneficiario('8');
		beneficiario2.comNossoNumero('000000000000007');
		beneficiario2.comDigitoNossoNumero('3');
		beneficiario2.comRegistroNacional('08432498000173');

		var enderecoDoBeneficiario = Endereco.novoEndereco();
		enderecoDoBeneficiario.comLogradouro('Rua da Programação');
		enderecoDoBeneficiario.comBairro('Zona Rural');
		enderecoDoBeneficiario.comCep('71550050');
		enderecoDoBeneficiario.comCidade('Patos de Minas');
		enderecoDoBeneficiario.comUf('MG');
		beneficiario2.comEndereco(enderecoDoBeneficiario);

		var pagador2 = Pagador.novoPagador();
		pagador2.comNome('Paulo Fulano da Silva');
		pagador2.comRegistroNacional('77134854817');

		var enderecoDoPagador = Endereco.novoEndereco();
		enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
		enderecoDoPagador.comBairro('Barra da Tijuca');
		enderecoDoPagador.comCep('72000000');
		enderecoDoPagador.comCidade('Rio de Janeiro');
		enderecoDoPagador.comUf('RJ');
		pagador2.comEndereco(enderecoDoPagador);

		boletoSinco = Boleto.novoBoleto();
		boletoSinco.comDatas(datas2);
		boletoSinco.comBeneficiario(beneficiario2);
		boletoSinco.comBanco(banco);
		boletoSinco.comPagador(pagador2);
		boletoSinco.comValorBoleto(158.76);
		boletoSinco.comNumeroDoDocumento('NF100/00000215');
		boletoSinco.comLocaisDePagamento([
			'PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE'
		]);

		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco),
			linhaEsperada = '10496.48999 58000.100048 00000.000711 7 81550000015876';
		console.log(geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Linha digitavel com carteira SIGCB 2': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSicgb),
			linhaEsperada = '10492.90271 45900.200044 00000.013227 5 81550000008000';

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	// 'Verifica geração da linha digitável - 1': function(test) {
	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = "34191.57213 89766.660164 74514.590004 6 56550000268016";

	//     test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
	//     test.done();
	// },

	// 'Verifica geração da linha digitável - 2': function(test) {
	//     datas = Datas.novasDatas();
	//     datas.comDocumento(20, 03, 2014);
	//     datas.comProcessamento(20, 03, 2014);
	//     datas.comVencimento(10, 04, 2014);

	//     beneficiario = Beneficiario.novoBeneficiario();
	//     beneficiario.comNome('Mario Amaral');
	//     beneficiario.comAgencia('8462');
	//     beneficiario.comCarteira('174');
	//     beneficiario.comCodigoBeneficiario('05825');
	//     beneficiario.comNossoNumero('00015135')
	//     beneficiario.comDigitoNossoNumero('6');

	//     pagador = Pagador.novoPagador();
	//     pagador.comNome('Rodrigo de Sousa');

	//     boleto = Boleto.novoBoleto();
	//     boleto.comDatas(datas);
	//     boleto.comBeneficiario(beneficiario);
	//     boleto.comBanco(banco);
	//     boleto.comPagador(pagador);
	//     boleto.comValorBoleto(2680.16);
	//     boleto.comNumeroDoDocumento('575');
	//     boleto.comBanco(banco);

	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = '34191.74002 01513.568467 20582.590004 6 60290000268016';

	//     test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
	//     test.done();
	// },

	// 'Verifica geração da linha digitável - 3': function(test) {
	//     datas = Datas.novasDatas();
	//     datas.comDocumento(21, 5, 2014);
	//     datas.comProcessamento(21, 5, 2014);
	//     datas.comVencimento(21, 5, 2014);

	//     beneficiario = Beneficiario.novoBeneficiario();
	//     beneficiario.comCarteira('181');
	//     beneficiario.comAgencia('654');
	//     beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
	//     beneficiario.comNossoNumero('94588021')
	//     beneficiario.comDigitoNossoNumero('4');

	//     pagador = Pagador.novoPagador();

	//     boleto = Boleto.novoBoleto();
	//     boleto.comEspecieDocumento('DSI');
	//     boleto.comDatas(datas);
	//     boleto.comBeneficiario(beneficiario);
	//     boleto.comBanco(banco);
	//     boleto.comPagador(pagador);
	//     boleto.comValorBoleto(575);
	//     boleto.comNumeroDoDocumento('1');
	//     boleto.comBanco(banco);

	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = '34191.81940 58802.140655 40871.130007 4 60700000057500',
	//         linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

	//     test.equal(linhaEsperada, linhaGerada);
	//     test.done();
	// },

	// 'Verifica geração da linha digitável - 4': function(test) {
	//     datas = Datas.novasDatas();
	//     datas.comDocumento(29, 5, 2014);
	//     datas.comProcessamento(29, 5, 2014);
	//     datas.comVencimento(23, 6, 2014);

	//     beneficiario = Beneficiario.novoBeneficiario();
	//     beneficiario.comCarteira('157');
	//     beneficiario.comAgencia('654');
	//     beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
	//     beneficiario.comNossoNumero('89605074')
	//     beneficiario.comDigitoNossoNumero('2');

	//     pagador = Pagador.novoPagador();

	//     boleto = Boleto.novoBoleto();
	//     boleto.comEspecieDocumento('DSI');
	//     boleto.comDatas(datas);
	//     boleto.comBeneficiario(beneficiario);
	//     boleto.comBanco(banco);
	//     boleto.comPagador(pagador);
	//     boleto.comValorBoleto(115.38);
	//     boleto.comNumeroDoDocumento('2');
	//     boleto.comBanco(banco);

	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = '34191.57890 60507.420655 40871.130007 1 61030000011538',
	//         linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

	//     test.equal(linhaEsperada, linhaGerada);
	//     test.done();
	// },

	// 'Verifica geração da linha digitável - 5': function(test) {
	//     datas = Datas.novasDatas();
	//     datas.comDocumento(20, 8, 2014);
	//     datas.comProcessamento(20, 8, 2014);
	//     datas.comVencimento(27, 8, 2014);

	//     beneficiario = Beneficiario.novoBeneficiario();
	//     beneficiario.comCarteira('157');
	//     beneficiario.comAgencia('654');
	//     beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
	//     beneficiario.comNossoNumero('02891620')
	//     beneficiario.comDigitoNossoNumero('8');

	//     pagador = Pagador.novoPagador();

	//     boleto = Boleto.novoBoleto();
	//     boleto.comEspecieDocumento('DSI');
	//     boleto.comDatas(datas);
	//     boleto.comBeneficiario(beneficiario);
	//     boleto.comBanco(banco);
	//     boleto.comPagador(pagador);
	//     boleto.comValorBoleto(115.38);
	//     boleto.comNumeroDoDocumento('4');
	//     boleto.comBanco(banco);

	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = '34191.57023 89162.080652 40871.130007 4 61680000011538',
	//         linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

	//     test.equal(linhaEsperada, linhaGerada);
	//     test.done();
	// },

	// 'Verifica geração da linha digitável - 6': function(test) {
	//     datas = Datas.novasDatas();
	//     datas.comDocumento(19, 9, 2014);
	//     datas.comProcessamento(19, 9, 2014);
	//     datas.comVencimento(26, 9, 2014);

	//     beneficiario = Beneficiario.novoBeneficiario();
	//     beneficiario.comCarteira('157');
	//     beneficiario.comAgencia('654');
	//     beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
	//     beneficiario.comNossoNumero('07967777')
	//     beneficiario.comDigitoNossoNumero('4');

	//     pagador = Pagador.novoPagador();

	//     boleto = Boleto.novoBoleto();
	//     boleto.comEspecieDocumento('FS');
	//     boleto.comDatas(datas);
	//     boleto.comBeneficiario(beneficiario);
	//     boleto.comBanco(banco);
	//     boleto.comPagador(pagador);
	//     boleto.comValorBoleto(230.76);
	//     boleto.comNumeroDoDocumento('5');
	//     boleto.comBanco(banco);

	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
	//         linhaEsperada = '34191.57072 96777.740653 40871.130007 9 61980000023076',
	//         linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);

	//     test.equal(linhaEsperada, linhaGerada);
	//     test.done();
	// },

	// 'Verifica nome correto do banco': function(test) {
	//     test.equals(banco.getNome(), 'Banco Itaú S/A');
	//     test.done();
	// },

	'Verifica a numeração correta do banco': function(test) {
		test.equal(banco.getNumeroFormatadoComDigito(), '104-0');
		test.done();
	},

	'Verifica que arquivo de imagem do logotipo existe': function(test) {
		test.ok(fs.existsSync(banco.getImagem()));
		test.done();
	},

	// 'Verifica deve imprimir o nome do banco no boleto': function(test) {
	//     test.ok(banco.getImprimirNome());
	//     test.done();
	// },

	// 'Verifica geração do código de barras': function(test) {
	//     var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

	//     test.equal('34196565500002680161572189766660167451459000', codigoDeBarras);
	//     test.done();
	// },

	'Exibir campo CIP retorna falso': function(test) {
		test.equal(banco.exibirCampoCip(), false);
		test.done();
	},

	'Verifica criação de pdf - SIGCB 1': function(test) {
		new PdfGerador(boletoSicgb).pdfFile(
			'../tests/boleto/bancos/boleto-caixa1.pdf'
		).then(async({path})=>{
			test.ok(fs.existsSync(path));
			test.equal(fs.unlinkSync(path), undefined);
			test.done();
		});
	},

	'Verifica criação de pdf - SIGCB 2': async function(test) {
		new PdfGerador(boletoSicgb).pdfFile(
			'../tests/boleto/bancos/boleto-caixa2.pdf'
		).then(async({path})=>{
			test.ok(fs.existsSync(path));
			test.equal(fs.unlinkSync(path), undefined);
			test.done();
		});
	}
};
