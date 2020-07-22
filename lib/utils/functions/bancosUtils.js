const formatacoes = require('../functions/formatacoesUtils');

function retornaFalso() {
	return false;
}

function calcularDVDoBradescoOuDoBancoDoBrasil(agenciaOuConta) {
	var size = agenciaOuConta.length,
		result = 0,
		mult = 2;

	for (let i = size - 1; i >= 0; i--) {
		var temp = agenciaOuConta.charAt(i) * mult;

		result += temp;
		mult++;

		if (mult > 9) {
			mult = 2;
		}
	}

	return ((result * 10) % 11).toString();
}

function calcularDVDoItau(agencia, conta) {
	conta = '0000000000' + conta;
	conta = conta.substring(conta.length - 9, conta.length);
	conta = agencia + conta;

	var total = 0,
		fator = 2,
		i;

	for (i = conta.length - 1; i >= 0; i--) {
		var num = conta.charAt(i),
			temp = num * fator,
			temp2 = Math.floor(temp / 10) + (temp % 10);

		total += temp2;
		fator = fator == 2 ? 1 : 2;
	}

	return (10 - (total % 10)).toString();
}

module.exports.itau = {
	validarAgenciaEConta: function(agencia, conta) {
		//a conta deve informar o digito verificador

		if (typeof agencia !== 'string' || typeof conta !== 'string') {
			return false;
		}

		agencia = formatacoes.removerMascara(agencia);
		conta = formatacoes.removerMascara(conta);

		var digitoInformado = conta.substr(conta.length - 1),
			digitoCalculado = calcularDVDoItau(agencia, conta.substr(0, conta.length - 1));

		return digitoInformado === digitoCalculado;
	},

	validarAgencia: retornaFalso,

	validarConta: retornaFalso,

	calcularDigitoVerificador: calcularDVDoItau
};

module.exports['341'] = module.exports.itau;

function validarAgenciaOuContaDoBradescoOuBancoDoBrasil(agenciaOuConta) {
	if (typeof agenciaOuConta !== 'string') {
		return false;
	}

	agenciaOuConta = formatacoes.removerMascara(agenciaOuConta);

	var digitoInformado = agenciaOuConta.substr(agenciaOuConta.length - 1),
		digitoCalculado = calcularDVDoBradescoOuDoBancoDoBrasil(agenciaOuConta.substr(0, agenciaOuConta.length - 1));

	return digitoInformado === digitoCalculado;
}

module.exports.bancoDoBrasil = {
	validarAgenciaEConta: function(agencia, conta) {
		return validarAgenciaOuContaDoBradescoOuBancoDoBrasil(agencia) &&
      validarAgenciaOuContaDoBradescoOuBancoDoBrasil(conta);
	},

	validarAgencia: validarAgenciaOuContaDoBradescoOuBancoDoBrasil,

	validarConta: validarAgenciaOuContaDoBradescoOuBancoDoBrasil,

	calcularDigitoVerificador: calcularDVDoBradescoOuDoBancoDoBrasil
};

module.exports['001'] = module.exports.bancoDoBrasil;

//bradesco tem as mesmas regras que bb
//module.exports.bradesco = module.exports.bancoDoBrasil;

//module.exports['237'] = module.exports.bradesco;
