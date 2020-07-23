const boleto = require('../lib/utils/functions/boletoUtils');
const bancos = boleto.bancos;
const Endereco = boleto.Endereco;
const Gerador = boleto.Gerador;
const Boleto = boleto.Boleto;
const Datas = boleto.Datas;

module.exports = {
	especiesDeDocumento: {
		'Verifica que contém o número correto de espécies': function(test) {
			test.equals(Object.keys(boleto.especiesDeDocumento).length, 21);
			test.done();
		},
	},

	bancos: {
		'Todos os bancos estão disponíveis': function(test) {
			test.ok(new bancos.Itau());
			test.ok(new bancos['341']());

			test.ok(new bancos.Caixa());
			test.ok(new bancos['104']());

			test.ok(new bancos.Bradesco());
			test.ok(new bancos['237']());

			test.ok(new bancos.Sicoob());
			test.ok(new bancos['756']());

			test.ok(new bancos.Cecred());
			test.ok(new bancos['085']());
			console.log(Object.keys(bancos).length);
			test.equals(16, Object.keys(bancos).length);
			test.done();
		},
	},

	Gerador: {
		'Verifica que é possível instanciar o gerador': function(test) {
			test.ok(new Gerador());
			test.done();
		},

		'Verifica que o gerador apresenta as funções esperadas': function(test) {
			var gerador = new Gerador();

			test.equal(typeof gerador.gerarPDF, 'function');
			test.equal(typeof gerador.gerarHTML, 'function');
			test.done();
		},

		'Verifica que a geração de HTML lança uma exceção': function(test) {
			test.throws(function() {
				new Gerador().gerarHTML();
			});

			test.done();
		}
	},

	Pagador: {

	},

	Beneficiario: {

	},

	Datas: {
		'É possível instanciar um objeto de datas': function(test) {
			var datas = Datas.novasDatas();

			test.ok(datas);
			test.done();
		},

		'Deve lançar exceção se as datas forem muito antigas': function(test) {
			test.throws(function() {
				Datas.novasDatas()
					.comDocumento(1, 1, 1996)
					.comVencimento(1, 1, 1996)
					.comProcessamento(1, 1, 1996);
			});

			test.done();
		},

		'Deve lançar exceção se as datas estiverem além de 2024': function(test) {
			test.throws(function() {
				Datas.novasDatas()
					.comDocumento(1, 1, 2024)
					.comVencimento(1, 1, 2024)
					.comProcessamento(1, 1, 2024);
			});

			test.done();
		}
	},

	Endereco: {
		'Deve imprimir endereco completo': function(test) {
			var endereco = Endereco.novoEndereco()
				.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
				.comBairro('PARQTEC ALFA')
				.comCep('88030-000')
				.comCidade('FLORIANÓPOLIS')
				.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), [
				'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
				'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC'
			].join(''));

			test.done();
		},

		'Deve imprimir endereco sem logradouro': function(test) {
			var endereco = Endereco.novoEndereco()
				.comBairro('PARQTEC ALFA')
				.comCep('88030-000')
				.comCidade('FLORIANÓPOLIS')
				.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), 'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC');

			test.done();
		},

		'Deve imprimir endereco sem cep': function(test) {
			var endereco = Endereco.novoEndereco()
				.comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
				.comBairro('PARQTEC ALFA')
				.comCidade('FLORIANÓPOLIS')
				.comUf('SC');

			test.equals(endereco.getEnderecoCompleto(), [
				'RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ',
				'PARQTEC ALFA FLORIANÓPOLIS SC'
			].join(''));

			test.done();
		},

		'Deve imprimir vazio se endereço não preenchido': function(test) {
			var endereco = Endereco.novoEndereco();

			test.equals(endereco.getEnderecoCompleto(), '');
			test.done();
		},
	},

	Boleto: {
		'É possível instanciar um novo boleto': function(test) {
			var boleto = Boleto.novoBoleto();

			test.ok(boleto);
			test.done();
		},

		'Novo boleto deve ter alguns valores padrão': function(test) {
			var boleto = Boleto.novoBoleto();

			test.equals(boleto.getEspecieMoeda(), 'R$');
			test.equals(boleto.getCodigoEspecieMoeda(), 9);
			test.equals(boleto.getAceite(), false);
			test.equals(boleto.getEspecieDocumento(), 'DV');

			test.done();
		},

		'Calcula corretamente o fator de vencimento': function(test) {
			var dataDeVencimento = new Date(2015, 3 - 1, 21, 0, 0, 0, 0),
				datas = Datas.novasDatas().comVencimento(dataDeVencimento),
				boleto = Boleto.novoBoleto().comDatas(datas);

			test.equals(boleto.getFatorVencimento(), '6374');
			test.done();
		},

		'Calcula corretamente o fator de vencimento, ignorando as horas - 1': function(test) {
			var dataDeVencimento = new Date(2008, 5 - 1, 2, 0, 0, 0, 0),
				datas = Datas.novasDatas().comVencimento(dataDeVencimento),
				boleto = Boleto.novoBoleto().comDatas(datas);

			test.equals(boleto.getFatorVencimento(), '3860');
			test.done();
		},

		'Calcula corretamente o fator de vencimento, ignorando as horas - 2': function(test) {
			var dataDeVencimento = new Date(2008, 5 - 1, 2, 23, 59, 59, 999),
				datas = Datas.novasDatas().comVencimento(dataDeVencimento),
				boleto = Boleto.novoBoleto().comDatas(datas);

			test.equals(boleto.getFatorVencimento(), '3860');
			test.done();
		},

		'Lança exceção ao tentar definir um valor negativo para o boleto': function(test) {
			test.throws(function() {
				Boleto.novoBoleto().comValorBoleto(-5);
			});

			test.done();
		},

		'O valor formatado deve ter 10 digitos - 1': function(test) {
			var boleto = Boleto.novoBoleto().comValorBoleto(3),
				valorFormatado = boleto.getValorFormatado();

			test.equals(10, valorFormatado.length);
			test.equals('0000000300', valorFormatado);
			test.done();
		},

		'O valor formatado deve ter 10 digitos - 2': function(test) {
			var boleto = Boleto.novoBoleto().comValorBoleto(3.1),
				valorFormatado = boleto.getValorFormatado();

			test.equals(10, valorFormatado.length);
			test.equals('0000000310', valorFormatado);
			test.done();
		},

		'O valor formatado deve ter 10 digitos - 3': function(test) {
			var boleto = Boleto.novoBoleto().comValorBoleto(3.18),
				valorFormatado = boleto.getValorFormatado();

			test.equals(10, valorFormatado.length);
			test.equals('0000000318', valorFormatado);
			test.done();
		},

		'O valor formatado deve ter 10 digitos - 4': function(test) {
			var boleto = Boleto.novoBoleto().comValorBoleto(300),
				valorFormatado = boleto.getValorFormatado();

			test.equals(10, valorFormatado.length);
			test.equals('0000030000', valorFormatado);
			test.done();
		},

		'São consideradas apenas as primeiras duas casas decimais do valor': function(test) {
			var boleto = Boleto.novoBoleto().comValorBoleto(3.189),
				valorFormatado = boleto.getValorFormatado();

			test.equals(10, valorFormatado.length);
			test.equals('0000000318', valorFormatado);
			test.done();
		},

		'Número do documento formatado deve ter 4 digitos': function(test) {
			var boleto = Boleto.novoBoleto().comNumeroDoDocumento('232'),
				numeroFormatado = boleto.getNumeroDoDocumentoFormatado();

			test.equals(4, numeroFormatado.length);
			test.equals('0232', numeroFormatado);
			test.done();
		},

		'Boleto não deve aceitar mais do que cinco instruções': function(test) {
			test.throws(function() {
				Boleto.novoBoleto().comInstrucoes('', '', '', '', '', '');
			});

			test.throws(function() {
				Boleto.novoBoleto().comInstrucoes(['', '', '', '', '', '']);
			});

			test.done();
		},

		'Boleto não deve aceitar mais do que cinco descrições': function(test) {
			test.throws(function() {
				Boleto.novoBoleto().comDescricoes('', '', '', '', '', '');
			});

			test.throws(function() {
				Boleto.novoBoleto().comDescricoes(['', '', '', '', '', '']);
			});

			test.done();
		},

		'Boleto não deve aceitar mais do que dois locais de pagamento': function(test) {
			test.throws(function() {
				Boleto.novoBoleto().comLocaisDePagamento('', '', '');
			});

			test.throws(function() {
				Boleto.novoBoleto().comLocaisDePagamento(['', '', '']);
			});

			test.done();
		},

		'Não deve ser possivel definir um novo boleto com valor superior a R$ 99.999.999,99': function(test) {
			test.throws(function() {
				var boleto = Boleto.novoBoleto().comValorBoleto(100000000.00);
			});

			test.done();
		},

		'Deve retornar formatação em formato legivel': function(test) {
			var boleto;

			boleto = Boleto.novoBoleto().comValorBoleto(0);
			test.equal('R$ 0,00', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(1);
			test.equal('R$ 1,00', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(1.2);
			test.equal('R$ 1,20', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(1.23);
			test.equal('R$ 1,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(1.235);
			test.equal('R$ 1,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(10.23);
			test.equal('R$ 10,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(100.23);
			test.equal('R$ 100,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(1000.23);
			test.equal('R$ 1.000,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(10002.23);
			test.equal('R$ 10.002,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(210002.23);
			test.equal('R$ 210.002,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(3210002.23);
			test.equal('R$ 3.210.002,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(13210002.23);
			test.equal('R$ 13.210.002,23', boleto.getValorFormatadoBRL());

			boleto = Boleto.novoBoleto().comValorBoleto(99999999.99);
			test.equal('R$ 99.999.999,99', boleto.getValorFormatadoBRL());

			test.done();
		}
	}
};
