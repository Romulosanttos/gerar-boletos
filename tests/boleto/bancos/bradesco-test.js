const PdfGerador = require('../../../lib/pdf-gerador');
var fs = require('fs'),
	boletos = require('../../../lib/utils/functions/boletoUtils.js'),
	Bradesco = require('../../../lib/boleto/bancos/bradesco.js'),
	geradorDeLinhaDigitavel = require('../../../lib/boleto/gerador-de-linha-digitavel.js'),

	Datas = boletos.Datas,
	Endereco = boletos.Endereco,
	Beneficiario = boletos.Beneficiario,
	Pagador = boletos.Pagador,
	Boleto = boletos.Boleto,

	banco,
	boleto;

module.exports = {
	setUp: function(done) {
		banco = new Bradesco();

		var datas = Datas.novasDatas();
		
		datas.comDocumento('02-04-2020');
		datas.comProcessamento('02-04-2020');
		datas.comVencimento('02-04-2020');

		var beneficiario = Beneficiario.novoBeneficiario();
		beneficiario.comNome('Leonardo Bessa');
		beneficiario.comRegistroNacional('73114004652');
		beneficiario.comAgencia('2949');
		beneficiario.comDigitoAgencia('1');
		beneficiario.comCodigoBeneficiario('6580');
		beneficiario.comDigitoCodigoBeneficiario('3');
		beneficiario.comNumeroConvenio('1207113');
		beneficiario.comCarteira('6');
		beneficiario.comNossoNumero('3');
		beneficiario.comDigitoNossoNumero('7');

		var enderecoDoBeneficiario = Endereco.novoEndereco();
		enderecoDoBeneficiario.comLogradouro('Rua da Programação');
		enderecoDoBeneficiario.comBairro('Zona Rural');
		enderecoDoBeneficiario.comCep('71550050');
		enderecoDoBeneficiario.comCidade('Patos de Minas');
		enderecoDoBeneficiario.comUf('MG');
		beneficiario.comEndereco(enderecoDoBeneficiario);

		var pagador = Pagador.novoPagador();
		pagador.comNome('Fulano');
		pagador.comRegistroNacional('97264269604');

		var enderecoDoPagador = Endereco.novoEndereco();
		enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
		enderecoDoPagador.comBairro('Barra da Tijuca');
		enderecoDoPagador.comCep('72000000');
		enderecoDoPagador.comCidade('Rio de Janeiro');
		enderecoDoPagador.comUf('RJ');
		pagador.comEndereco(enderecoDoPagador);

		boleto = Boleto.novoBoleto();
		boleto.comDatas(datas);
		boleto.comBeneficiario(beneficiario);
		boleto.comBanco(banco);
		boleto.comPagador(pagador);
		boleto.comValor(1);
		boleto.comNumeroDoDocumento('4323');
		boleto.comLocaisDePagamento([
			'Pagável preferencialmente na rede Bradesco ou no Bradesco expresso'
		]);

		done();
	},

	'Nosso número formatado deve ter 11 digitos': function(test) {
		var nossoNumero = banco.getNossoNumeroFormatado(boleto.getBeneficiario());
		test.equals(11, nossoNumero.length);
		test.equals('00000000003', nossoNumero);

		test.done();
	},

	'Carteira formatado deve ter dois dígitos': function(test) {
		var carteiraFormatado = banco.getCarteiraFormatado(boleto.getBeneficiario());

		test.equals(2, carteiraFormatado.length);
		test.equals('06', carteiraFormatado);
		test.done();
	},

	'Conta corrente formatada deve ter sete dígitos': function(test) {
		var codigoFormatado = banco.getCodigoFormatado(boleto.getBeneficiario());

		test.equals(7, codigoFormatado.length);
		test.equals('0006580', codigoFormatado);
		test.done();
	},

	'Testa geração de linha digitavel': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
			linhaEsperada = '23792.94909 60000.000004 03000.658009 9 81550000000100';

		test.equal(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
		test.done();
	},

	'Testa código de barras': function(test) {
		var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);

		test.equal('23799815500000001002949060000000000300065800', codigoDeBarras);
		test.done();
	},

	'Verifica nome correto do banco': function(test) {
		test.equals(banco.getNome(), 'Banco Bradesco S.A.');
		test.done();
	},

	'Verifica a numeração correta do banco': function(test) {
		test.equal(banco.getNumeroFormatadoComDigito(), '237-2');
		test.done();
	},

	'Verifica que arquivo de imagem do logotipo existe': function(test) {
		test.ok(fs.existsSync(banco.getImagem()));
		test.done();
	},

	'Verifica deve imprimir o nome do banco no boleto': function(test) {
		test.ok(!banco.getImprimirNome());
		test.done();
	},

	'Exibir campo CIP retorna verdadeiro': function(test) {
		test.equal(banco.exibirCampoCip(), true);
		test.done();
	},

	'Verifica criação de pdf': function(test) {
		new PdfGerador(boleto).pdfFile(
			'../tests/boleto/bancos/boleto-bradesco.pdf'
		).then(async({path})=>{
			test.ok(fs.existsSync(path));
			test.equal(fs.unlinkSync(path), undefined);
			test.done();
		});
	}
};
