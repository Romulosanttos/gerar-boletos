const { formatacoes } = require('../lib/index');

module.exports = {

	removerMascara: {
		'Remove mascara de dinheiro': function(test) {
			test.equal(formatacoes.removerMascara('R$ 12,23'), '12,23');
			test.done();
		},
		'Remove mascaras de porcentagem': function(test) {
			test.equal(formatacoes.removerMascara('10%'), '10');
			test.equal(formatacoes.removerMascara('8,34 %'), '8,34');
			test.done();
		},
		'Remove mascaras de Cnpj': function(test) {
			test.equal(formatacoes.removerMascara('18.028.400/0001-70'), '18028400000170');
			test.done();
		},
		'Remove mascaras de Cpf': function(test) {
			test.equal(formatacoes.removerMascara('934.621.219-52'), '93462121952');
			test.done();
		},
		'Remove mascaras de Telefone': function(test) {
			test.equal(formatacoes.removerMascara('(61) 8633-3051'), '6186333051');
			test.done();
		},
		'Remove mascaras de Placa': function(test) {
			test.equal(formatacoes.removerMascara('ABC-2366'), 'ABC2366');
			test.done();
		},
		'Remove mascaras de Cep': function(test) {
			test.equal(formatacoes.removerMascara('71.530-070'), '71530070');
			test.done();
		},

		'Remove espaços em branco no começo e no final': function(test) {
			test.equal(formatacoes.removerMascara('    71.420-070  \t'), '71420070');
			test.done();
		},

		'Se for passado algo que não é uma string então o mesmo é retornado': function(test) {
			test.equal(formatacoes.removerMascara(null), null);
			test.equal(formatacoes.removerMascara({}.devolvaUndefined), undefined);
			test.equal(formatacoes.removerMascara(123), 123);
			test.done();
		}
	},

	dinheiro: {
		'Trata casas decimais por padrão': function(test) {
			test.equal(formatacoes.dinheiro(1), 'R$ 1,00');
			test.equal(formatacoes.dinheiro(12), 'R$ 12,00');
			test.equal(formatacoes.dinheiro(123), 'R$ 123,00');
			test.equal(formatacoes.dinheiro(1234), 'R$ 1.234,00');
			test.equal(formatacoes.dinheiro(12345), 'R$ 12.345,00');
			test.done();
		},

		'Não arredonda, simplesmente corta as casas decimais além do especificado': function(test) {
			test.equal(formatacoes.dinheiro(35.855), 'R$ 35,85');
			test.equal(formatacoes.dinheiro(35.859), 'R$ 35,85');

			test.equal(formatacoes.dinheiro(35.855, {
				casasDecimais: 3
			}), 'R$ 35,855');

			test.equal(formatacoes.dinheiro(35.859, {
				casasDecimais: 3
			}), 'R$ 35,859');

			test.equal(formatacoes.dinheiro(1.005), 'R$ 1,00');
			test.equal(formatacoes.dinheiro(1.005, {
				casasDecimais: 3
			}), 'R$ 1,005');

			test.done();
		},

		'É possível passar outro símbolo': function(test) {
			test.equal(formatacoes.dinheiro(73.315, {
				simbolo: 'BRL '
			}), 'BRL 73,31');

			test.done();
		},

		'É possível posicionar o símbolo a direita': function(test) {
			test.equal(formatacoes.dinheiro(859.385, {
				simbolo: 'BRL',
				posicionamento: 'direita'
			}), '859,38BRL');

			test.done();
		},
	},

	dinheiroPorExtenso: {
		'Escreve o valor R$ 0,00 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(0), 'zero reais');
			test.done();
		},

		'Escreve o valor R$ 1,00 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(1), 'um real');
			test.done();
		},

		'Escreve o valor R$ 2,00 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(2), 'dois reais');
			test.done();
		},

		'Escreve o valor R$ 17,34 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(17.34), 'dezessete reais e trinta e quatro centavos');
			test.done();
		},

		'Escreve o valor R$ 432,97 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(432.97), 'quatrocentos e trinta e dois reais e noventa e sete centavos');
			test.done();
		},

		'Escreve o valor R$ 1234,56 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(1234.56), 'um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');
			test.done();
		},

		'Escreve o valor R$ 21234,56 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(21234.56), 'vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');
			test.done();
		},

		'Escreve o valor R$ 121234,56 adequadamente': function(test) {
			test.equal(formatacoes.dinheiroPorExtenso(121234.56), 'cento e vinte e um mil e duzentos e trinta e quatro reais e cinquenta e seis centavos');
			test.done();
		},
	},

	numero: {
		'Por padrão não trata casas decimais a menos que você especifique': function(test) {
			test.equal(formatacoes.numero(1), '1');
			test.equal(formatacoes.numero(1.00), '1');
			test.equal(formatacoes.numero(1.010), '1,01');

			test.equal(formatacoes.numero(1.00, {
				casasDecimais: 2
			}), '1,00');

			test.equal(formatacoes.numero(1.010, {
				casasDecimais: 3
			}), '1,010');

			test.done();
		},

		'Pocisiona separador de milhar padrão': function(test) {
			test.equal(formatacoes.numero(1234.2), '1.234,2');
			test.equal(formatacoes.numero(12345.2), '12.345,2');
			test.equal(formatacoes.numero(1112345.2, {
				casasDecimais: 2
			}), '1.112.345,20');
			test.done();
		},

		// 'É possível omitir separador de milhar': function(test) {
		//     test.equal(formatacoes.numero(1112345.2, {
		//         separadorDeMilhar: ''
		//     }), '1112345,20');

		//     test.done();
		// }
	},

	data: {
		'Verifica formatação correta': function(test) {
			var data = new Date(2014, 10, 20);
			test.equal(formatacoes.data(data), '20/11/2014');
			test.done();
		},

		'Caso não seja uma data válida retorna o que foi passado': function(test) {
			var data = new Date('inválido');
			test.equal(formatacoes.data(data), 'Invalid Date');
			test.done();
		},
	},

	hora: {
		'Verifica formatação correta': function(test) {
			var data = new Date(2014, 10, 20, 23, 34, 45);
			test.equal(formatacoes.hora(data), '23:34:45');
			test.done();
		},

		'Pode-se formatar sem os segundos': function(test) {
			var data = new Date(2014, 10, 20, 23, 34, 45);
			test.equal(formatacoes.hora(data, {
				comSegundos: false
			}), '23:34');
			test.done();
		},

		'Caso não seja uma data válida retorna o que foi passado': function(test) {
			var data = new Date('inválido');
			test.equal(formatacoes.hora(data), 'Invalid Date');
			test.done();
		},
	},

	dataEHora: {
		'Verifica formatação correta': function(test) {
			var data = new Date(2014, 10, 20, 23, 34, 45);
			test.equal(formatacoes.dataEHora(data), '20/11/2014 23:34:45');
			test.done();
		},

		'Caso não seja uma data válida retorna o que foi passado': function(test) {
			var data = new Date('inválido');
			test.equal(formatacoes.dataEHora(data), 'Invalid Date');
			test.done();
		},
	},

	tituloDeEleitor: {
		'Formata de acordo com a formatação impressa no título de eleitor': function(test) {
			test.equal(formatacoes.tituloDeEleitor('273397340264'), '2733 9734 0264');
			test.equal(formatacoes.tituloDeEleitor('\t2 7 3-39-734026-4   '), '2733 9734 0264');
			test.done();
		},
	},

	linhaDigitavel: {
		'Formata a linha digitavel de um boleto se tiver 47 caracteres': function(test) {

			var esperado = '34191.57213 89766.660164 74514.590004 6 56550000268016',
				original = '34191572138976666016474514590004656550000268016';

			test.equal(formatacoes.linhaDigitavel(original), esperado);
			test.done();
		}
	},

	boletoBancario: {
		'Verifica que é apenas um alias para .linhaDigitavel': function(test) {
			var linhaDigitavel = formatacoes.linhaDigitavel.toString(),
				boletoBancario = formatacoes.boletoBancario.toString();

			test.equal(linhaDigitavel, boletoBancario);
			test.done();
		},
	},

	nit: {
		'Verifica que é apenas um alias para .pisPasep': function(test) {
			test.equal(formatacoes.pisPasep.toString(), formatacoes.nit.toString());
			test.done();
		}
	},

	pisPasep: {
		'Verifica que a máscara é aplicada corretamente': function(test) {
			test.equal(formatacoes.pisPasep('12541586274'), '125.4158.627-4');
			test.equal(formatacoes.pisPasep('\t   12541586274  '), '125.4158.627-4');
			test.done();
		}
	},

	cnpj: {
		'Verifica que a máscara é aplicada corretamente': function(test) {

			test.equal(formatacoes.cnpj('18028400000170'), '18.028.400/0001-70');
			test.equal(formatacoes.cnpj(' 18028400000170 '), '18.028.400/0001-70');

			test.done();
		},

		'Se passa algo que não era cnpj retorna o que foi passado anteriormente': function(test) {

			test.equal(formatacoes.cnpj('18028400000171'), '18028400000171');
			test.equal(formatacoes.cnpj('a8028400000170'), 'a8028400000170');

			test.done();
		}
	},

	cpf: {
		'Verifica que a máscara é aplicada corretamente': function(test) {

			test.equal(formatacoes.cpf('93462121952'), '934.621.219-52');
			test.equal(formatacoes.cpf(' 93462121952 '), '934.621.219-52');

			test.done();
		},

		'Se passa algo que não era cpf retorna o que foi passado anteriormente': function(test) {

			test.equal(formatacoes.cnpj('foo bar'), 'foo bar');
			test.equal(formatacoes.cnpj('93462121953'), '93462121953');

			test.done();
		}
	},

	registroNacional: {
		'Verifica que a máscara é aplicada corretamente': function(test) {

			test.equal(formatacoes.registroNacional('18028400000170'), '18.028.400/0001-70');
			test.equal(formatacoes.registroNacional(' 18028400000170 '), '18.028.400/0001-70');

			test.equal(formatacoes.registroNacional('93462121952'), '934.621.219-52');
			test.equal(formatacoes.registroNacional(' 93462121952 '), '934.621.219-52');

			test.done();
		}
	},

	placa: {
		'Verifica que máscara é aplicada corretamente': function(test) {
			test.equal(formatacoes.placa('abc2366'), 'ABC-2366');
			test.equal(formatacoes.placa('abc-2343'), 'ABC-2343');

			test.done();
		},

		'Verifica que retorna a mesma coisa quando texto não é placa': function(test) {
			test.equal(formatacoes.placa('abcd-2366'), 'abcd-2366');
			test.equal(formatacoes.placa('foo'), 'foo');

			test.done();
		}
	},

	cep: {
		'Verifica que máscara é aplicada corretamente': function(test) {
			test.equal(formatacoes.cep('71530070'), '71.530-070');
			test.equal(formatacoes.cep('71.530070'), '71.530-070');
			test.equal(formatacoes.cep('71530-070'), '71.530-070');

			test.done();
		},

		'Verifica que retorna a mesma coisa quando texto não é cep': function(test) {
			test.equal(formatacoes.cep('715300700'), '715300700');
			test.equal(formatacoes.cep('foo'), 'foo');

			test.done();
		}
	}
};
