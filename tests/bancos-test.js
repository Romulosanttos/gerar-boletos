const test = require('ava');
const bancos = require('../lib/utils/bancosUtils');

// itau tests
test('itau - calcularDigitoVerificador', (t) => {
  t.is(bancos.itau.calcularDigitoVerificador('0654', '08711'), '3');
});

test('itau - validarAgenciaEConta', (t) => {
  t.truthy(bancos.itau.validarAgenciaEConta('0654', '087113'));
});

test('itau - validarAgencia - Verifica que sempre retorna falso', (t) => {
  //O itaú utiliza apenas um DV para agência e conta, este método está disponível
  //apenas para se adequar a interface
  t.is(bancos.itau.validarAgencia('0654'), false);
});

test('itau - validarConta - Verifica que sempre retorna falso', (t) => {
  //O itaú utiliza apenas um DV para agência e conta, este método está disponível
  //apenas para se adequar a interface
  t.is(bancos.itau.validarConta('087113'), false);
});

// 341 tests
test('341 - Verifica que mesmas funções disposniveis em bancos.itau estão disponiveis em banco["341"]', (t) => {
  t.is(
    bancos.itau.calcularDigitoVerificador.toString(),
    bancos['341'].calcularDigitoVerificador.toString()
  );
  t.is(bancos.itau.validarAgenciaEConta.toString(), bancos['341'].validarAgenciaEConta.toString());
  t.is(bancos.itau.validarAgencia.toString(), bancos['341'].validarAgencia.toString());
  t.is(bancos.itau.validarConta.toString(), bancos['341'].validarConta.toString());
});

// bancoDoBrasil tests
test('bancoDoBrasil - calcularDigitoVerificador - Verifica que cálculo funciona para agência', (t) => {
  t.is(bancos.bancoDoBrasil.calcularDigitoVerificador('1507'), '5');
});

test('bancoDoBrasil - calcularDigitoVerificador - Verifica que cálculo funciona para conta', (t) => {
  t.is(bancos.bancoDoBrasil.calcularDigitoVerificador('33203'), '8');
});

test('bancoDoBrasil - validarAgenciaEConta', (t) => {
  t.truthy(bancos.bancoDoBrasil.validarAgenciaEConta('15075', '332038'));
});

test('bancoDoBrasil - validarAgencia', (t) => {
  t.truthy(bancos.bancoDoBrasil.validarAgencia('15075'));
});

test('bancoDoBrasil - validarConta', (t) => {
  t.truthy(bancos.bancoDoBrasil.validarConta('332038'));
});

// 001 tests
test('001 - Verifica que mesmas funções disposniveis em bancos.bancoDoBrasil estão disponiveis em banco["001"]', (t) => {
  t.is(
    bancos.bancoDoBrasil.calcularDigitoVerificador.toString(),
    bancos['001'].calcularDigitoVerificador.toString()
  );
  t.is(
    bancos.bancoDoBrasil.validarAgenciaEConta.toString(),
    bancos['001'].validarAgenciaEConta.toString()
  );
  t.is(bancos.bancoDoBrasil.validarAgencia.toString(), bancos['001'].validarAgencia.toString());
  t.is(bancos.bancoDoBrasil.validarConta.toString(), bancos['001'].validarConta.toString());
});

/*bradesco: {
	'calcularDigitoVerificador - Verifica que cálculo funciona para agência': function(test) {
		test.equal(bancos.bradesco.calcularDigitoVerificador('655'), '0');
		test.done();
	},

	'calcularDigitoVerificador - Verifica que cálculo funciona para conta': function(test) {
		test.equal(bancos.bradesco.calcularDigitoVerificador('3'), '5');
		test.done();
	},

	'validarAgenciaEConta': function(test) {
		test.ok(bancos.bradesco.validarAgenciaEConta('6550', '35'));
		test.done();
	},

	'validarAgencia': function(test) {
		test.ok(bancos.bradesco.validarAgencia('6550'));
		test.done();
	},

	'validarConta': function(test) {
		test.equal(bancos.bradesco.validarConta('35'));
		test.done();
	}
},

'237': {
	'Verifica que mesmas funções disposniveis em bancos.bradesco estão disponiveis em banco["237"]': function(test) {
		test.equal(bancos.bradesco.calcularDigitoVerificador.toString(), bancos['237'].calcularDigitoVerificador.toString());
		test.equal(bancos.bradesco.validarAgenciaEConta.toString(), bancos['237'].validarAgenciaEConta.toString());
		test.equal(bancos.bradesco.validarAgencia.toString(), bancos['237'].validarAgencia.toString());
		test.equal(bancos.bradesco.validarConta.toString(), bancos['237'].validarConta.toString());

		test.done();
	}
}*/
