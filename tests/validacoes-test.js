const {Validacoes:validacoes} = require('../lib/index');

module.exports = {

	eTituloDeEleitor: {
		'É capaz de validar titulos de eleitor': function(test) {
			test.ok(validacoes.eTituloDeEleitor('106644440302'));
			test.ok(validacoes.eTituloDeEleitor('0196 3894 2097'));
			test.ok(validacoes.eTituloDeEleitor('1265934718-72'));
			test.ok(validacoes.eTituloDeEleitor('0043568709/06'));
			test.ok(validacoes.eTituloDeEleitor('2733 9734 0264'));
			test.ok(validacoes.eTituloDeEleitor('  \t 7.232.3\t06.121-78   '));

			test.done();
		},

		'Retorna o estado de origem do titulo eleitoral caso ele seja válido': function(test) {
			test.equal(validacoes.eTituloDeEleitor('1066 4444 0302'), 'RJ');
			test.equal(validacoes.eTituloDeEleitor('0196 3894 2097'), 'DF');
			test.equal(validacoes.eTituloDeEleitor('1265 9347 1872'), 'MT');
			test.equal(validacoes.eTituloDeEleitor('0043 5687 0906'), 'SC');
			test.equal(validacoes.eTituloDeEleitor('2733 9734 0264'), 'MG');
			test.equal(validacoes.eTituloDeEleitor('7232 3061 2178'), 'SE');

			test.done();
		},

		'Retorna ZZ caso seja um titulo de eleitor emitido no exterior': function(test) {
			test.equal(validacoes.eTituloDeEleitor('123412342801'), 'ZZ');

			test.done();
		},
	},

	eEan: {
		'É capaz de validar EAN-8': function(test) {
			test.ok(validacoes.eEan('23734524'));
			test.ok(validacoes.eEan('91459381'));
			test.ok(validacoes.eEan('62999878'));
			test.done();
		},

		'É capaz de validar EAN-12': function(test) {
			test.ok(validacoes.eEan('569265982372'));
			test.ok(validacoes.eEan('666376876870'));
			test.ok(validacoes.eEan('887776655449'));
			test.done();
		},

		'É capaz de validar EAN-13': function(test) {
			test.ok(validacoes.eEan('7898419154154'));
			test.ok(validacoes.eEan('7897424082124'));
			test.ok(validacoes.eEan('7891058020316'));
			test.done();
		},

		'É capaz de validar EAN-14': function(test) {
			test.ok(validacoes.eEan('41412342345348'));
			test.ok(validacoes.eEan('55443423232328'));
			test.ok(validacoes.eEan('88887722635653'));
			test.done();
		},
	},
	ePlaca: {
		'Valida-se placas válidas com ou sem máscara': function(test) {
			test.ok(validacoes.ePlaca('abc1234'));
			test.ok(validacoes.ePlaca('abc-1234'));

			test.ok(validacoes.ePlaca('jjd0931'));
			test.ok(validacoes.ePlaca('jjd-0931'));

			test.ok(validacoes.ePlaca('ddw1177'));
			test.ok(validacoes.ePlaca('ddw-1177'));

			test.done();
		},

		'Placas inválidas não são validadas': function(test) {
			test.ok(!validacoes.ePlaca('ddwd1177'));
			test.ok(!validacoes.ePlaca('ddw11772'));
			test.ok(!validacoes.ePlaca('ddw-a772'));
			test.ok(!validacoes.ePlaca('1dw-3772'));
			test.ok(!validacoes.ePlaca('foo bar'));
			test.ok(!validacoes.ePlaca(new Date()));
			test.ok(!validacoes.ePlaca(12345));

			test.done();
		}
	},

	eCep: {
		'Valida-se ceps válidos com ou sem máscara': function(test) {
			test.ok(validacoes.eCep('71530070'));
			test.ok(validacoes.eCep('71530-070'));
			test.ok(validacoes.eCep('71.530070'));
			test.ok(validacoes.eCep('71.530-070'));

			test.done();
		},

		'Ceps inválidos não são validados': function(test) {
			test.ok(!validacoes.eCep('71530a070'));
			test.ok(!validacoes.eCep('71530-0709'));
			test.ok(!validacoes.eCep('771.530070'));
			test.ok(!validacoes.eCep(' 71.530-070'));

			test.done();
		}
	},

	eRegistroNacional: {
		'Verifica que é possível validar cpfs': function(test) {
			test.equal(validacoes.eRegistroNacional('227.175.903-07'), 'cpf');
			test.equal(validacoes.eRegistroNacional('16511762645'), 'cpf');
			test.equal(validacoes.eRegistroNacional('434.803.222-04'), 'cpf');
			test.equal(validacoes.eRegistroNacional('82647731330'), 'cpf');
			test.equal(validacoes.eRegistroNacional(' 711.477.475-39 '), 'cpf');
			test.equal(validacoes.eRegistroNacional('711.477.475-39'), 'cpf');

			test.done();
		},


		'Verifica que é possível validar cnpjs': function(test) {
			test.equal(validacoes.eRegistroNacional('16.555.517/0001-87'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('14638632000190'), 'cnpj');
			test.equal(validacoes.eRegistroNacional(' 88.142.322/0001-16 '), 'cnpj');
			test.equal(validacoes.eRegistroNacional('88.142.322/0001-16'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('28716876000158'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('13.381.462/0001-48'), 'cnpj');

			test.equal(validacoes.eRegistroNacional('00.000.000/0000-00'), false);
			test.equal(validacoes.eRegistroNacional('11.111.111/1111-11'), false);
			test.equal(validacoes.eRegistroNacional('22.222.222/2222-22'), false);
			test.equal(validacoes.eRegistroNacional('33.333.333/3333-33'), false);
			test.equal(validacoes.eRegistroNacional('44.444.444/4444-44'), false);
			test.equal(validacoes.eRegistroNacional('55.555.555/5555-55'), false);
			test.equal(validacoes.eRegistroNacional('66.666.666/6666-66'), false);
			test.equal(validacoes.eRegistroNacional('77.777.777/7777-77'), false);
			test.equal(validacoes.eRegistroNacional('88.888.888/8888-88'), false);
			test.equal(validacoes.eRegistroNacional('99.999.999/9999-99'), false);

			test.done();
		},

		'Verifica que é possível especificar tipo de registro nacional a ser validado': function(test) {
			test.ok(!validacoes.eRegistroNacional('227.175.903-07', 'cnpj'));
			test.ok(!validacoes.eRegistroNacional('16511762645', 'cnpj'));
			test.ok(!validacoes.eRegistroNacional('434.803.222-04', 'cnpj'));
			test.ok(!validacoes.eRegistroNacional('82647731330', 'cnpj'));
			test.ok(!validacoes.eRegistroNacional(' 711.477.475-39 ', 'cnpj'));
			test.ok(!validacoes.eRegistroNacional('711.477.475-39', 'cnpj'));

			test.ok(!validacoes.eRegistroNacional('16.555.517/0001-87', 'cpf'));
			test.ok(!validacoes.eRegistroNacional('14638632000190', 'cpf'));
			test.ok(!validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cpf'));
			test.ok(!validacoes.eRegistroNacional('88.142.322/0001-16', 'cpf'));
			test.ok(!validacoes.eRegistroNacional('28716876000158', 'cpf'));
			test.ok(!validacoes.eRegistroNacional('13.381.462/0001-48', 'cpf'));

			test.equal(validacoes.eRegistroNacional('227.175.903-07', 'cpf'), 'cpf');
			test.equal(validacoes.eRegistroNacional('16511762645', 'cpf'), 'cpf');
			test.equal(validacoes.eRegistroNacional('434.803.222-04', 'cpf'), 'cpf');
			test.equal(validacoes.eRegistroNacional('82647731330', 'cpf'), 'cpf');
			test.equal(validacoes.eRegistroNacional(' 711.477.475-39 ', 'cpf'), 'cpf');
			test.equal(validacoes.eRegistroNacional('711.477.475-39', 'cpf'), 'cpf');

			test.equal(validacoes.eRegistroNacional('16.555.517/0001-87', 'cnpj'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('14638632000190', 'cnpj'), 'cnpj');
			test.equal(validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cnpj'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('88.142.322/0001-16', 'cnpj'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('28716876000158', 'cnpj'), 'cnpj');
			test.equal(validacoes.eRegistroNacional('13.381.462/0001-48', 'cnpj'), 'cnpj');

			test.done();
		},

		'Retorna \'false\' caso não seja nem cpf nem cnpj': function(test) {
			test.equal(validacoes.eRegistroNacional('foo bar'), false);
			test.equal(validacoes.eRegistroNacional('14.638.632/0001-9'), false);
			test.equal(validacoes.eRegistroNacional('434.803.222-05'), false);
			test.equal(validacoes.eRegistroNacional('13.555.517/0001-87'), false);
			test.equal(validacoes.eRegistroNacional('165.117.626-455'), false);

			test.done();
		}
	},

	eCnpj: {
		'Verifica que é possível validar cnpjs': function(test) {
			test.ok(validacoes.eCnpj('16.555.517/0001-87'));
			test.ok(validacoes.eCnpj('14638632000190'));
			test.ok(validacoes.eCnpj(' 88.142.322/0001-16  '));
			test.ok(validacoes.eCnpj('88.142.322/0001-16'));
			test.ok(validacoes.eCnpj('28716876000158'));
			test.ok(validacoes.eCnpj('13.381.462/0001-48'));

			test.done();
		},

		'Retorna false para cnpj inválido': function(test) {
			test.ok(!validacoes.eCnpj('16.55.517/0001-87'));
			test.ok(!validacoes.eCnpj('146386320001901'));
			test.ok(!validacoes.eCnpj('foo bar'));
			test.ok(!validacoes.eCnpj('2328716876000158'));
			test.ok(!validacoes.eCnpj('a1 3.381.462/0001-48'));

			test.done();
		}
	},

	eMatriz: {
		'Verifica que é possivel identificar uma matriz pelo CNPJ': function(test) {

			test.ok(validacoes.eMatriz('00.132.781/0001-78'));
			test.ok(validacoes.eMatriz('00.000.000/0001-91'));
			test.ok(validacoes.eMatriz('19950366000150'));

			test.equal(validacoes.eMatriz('00123123000209'), false);
			test.equal(validacoes.eMatriz('00123432000513'), false);
			test.equal(validacoes.eMatriz('12123432009982'), false);

			test.done();
		},

		'Verifica que retorna nulo caso não seja passado um CNPJ': function(test) {
			test.equal(validacoes.eMatriz('123456'), null);
			test.equal(validacoes.eMatriz('testando'), null);

			test.done();
		}
	},

	eFilial: {
		'Verifica que é possível identificar uma filial pelo CNPJ, e que o seu número é retornado': function(test) {

			test.equal(validacoes.eFilial('00.132.781/0001-78'), false);
			test.equal(validacoes.eFilial('00.000.000/0001-91'), false);
			test.equal(validacoes.eFilial('19950366000150'), false);

			test.equal(validacoes.eFilial('00123123000209'), 2);
			test.equal(validacoes.eFilial('00123432000513'), 5);
			test.equal(validacoes.eFilial('12123432009982'), 99);

			test.done();
		},

		'Verifica que retorna nulo caso não seja passado um CNPJ': function(test) {
			test.equal(validacoes.eFilial('123456'), null);
			test.equal(validacoes.eFilial('testando'), null);

			test.done();
		}
	},

	eCpf: {
		'Verifica que é possível validar cpfs': function(test) {
			test.ok(validacoes.eCpf('  227.175.903-07   '));
			test.ok(validacoes.eCpf('227.175.903-07'));
			test.ok(validacoes.eCpf('16511762645'));
			test.ok(validacoes.eCpf('434.803.222-04'));
			test.ok(validacoes.eCpf('82647731330'));
			test.ok(validacoes.eCpf('711.477.475-39'));

			test.done();
		},

		'Retorna false para cpf inválido': function(test) {
			test.ok(!validacoes.eCpf('227.175.903-08'));
			test.ok(!validacoes.eCpf('16511762645u'));
			test.ok(!validacoes.eCpf('foo bar'));
			test.ok(!validacoes.eCpf('826471731330'));
			test.ok(!validacoes.eCpf('731.477.475-39'));

			test.done();
		}
	},

	eNit: {
		'Verifica que é apenas um alias para .ePisPasep': function(test) {
			test.equal(validacoes.ePisPasep.toString(), validacoes.eNit.toString());
			test.done();
		}
	},

	ePisPasep: {
		'Verifica que é possível validar PIS/PASEPs': function(test) {
			test.ok(validacoes.ePisPasep('  125.6932.537-8   '));
			test.ok(validacoes.ePisPasep('125.6932.537-8'));
			test.ok(validacoes.ePisPasep('12561040048'));
			test.ok(validacoes.ePisPasep('125.8576.637-5'));
			test.ok(validacoes.ePisPasep('12521311083'));
			test.ok(validacoes.ePisPasep('125.4158.627-4'));
			test.ok(validacoes.ePisPasep('131.42928.27-7'));

			test.done();
		},

		'Retorna false para PIS/PASEP inválido': function(test) {
			test.ok(!validacoes.ePisPasep('PIS is not a valid PIS'));
			test.ok(!validacoes.ePisPasep('125.0407.095-1'));
			test.ok(!validacoes.ePisPasep('125.7720.536-X'));
			test.ok(!validacoes.ePisPasep('125.3587.244-99'));
			test.ok(!validacoes.ePisPasep(' '));

			test.done();
		}
	}
};
