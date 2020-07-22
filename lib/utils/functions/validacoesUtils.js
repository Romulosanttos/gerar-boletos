const formatacoes = require('../functions/formatacoesUtils');
const StringUtils = require('../string-utils');
const MathUtils = require('../math-utils');
const mod = MathUtils.mod;


function eTituloDeEleitor(tituloDeEleitor) {
	if(typeof tituloDeEleitor !== 'string') {
		return false;
	}

	tituloDeEleitor = formatacoes.removerMascara(tituloDeEleitor);

	if(tituloDeEleitor.length !== 12) {
		return false;
	}

	let base = tituloDeEleitor.substring(0, 10);
	let primeiraBase = tituloDeEleitor.substring(0, 8);
	let estado = tituloDeEleitor.substring(8, 10);
	let segundaBase = tituloDeEleitor.substring(8, 10);

	estado = parseInt(estado, 10);

	if(estado < 1 || estado > 28) {
		return false;
	}

	var primeiroResto = mod(primeiraBase),
		primeiroDigito;

	if(primeiroResto === 0 && estado < 3) {
		primeiroDigito = 0;
	} else {
		primeiroDigito = primeiroResto < 2 ? 0 : 11 - primeiroResto;
	}

	var segundoResto = mod(segundaBase + primeiroDigito, [2, 3, 4]),
		segundoDigito;

	if(segundoResto === 0 && estado < 3) {
		segundoDigito = 0;
	} else {
		segundoDigito = segundoResto < 2 ? 0 : 11 - segundoResto;
	}

	if(tituloDeEleitor === base + primeiroDigito + segundoDigito) {
		return {
			1: 'SP', 2: 'MG', 3: 'RJ', 4: 'RS',
			5: 'BA', 6: 'PR', 7: 'CE', 8: 'PE',
			9: 'SC', 10: 'GO', 11: 'MA', 12: 'PB',
			13: 'PA', 14: 'ES', 15: 'PI', 16: 'RN',
			17: 'AL', 18: 'MT', 19: 'MS', 20: 'DF',
			21: 'SE', 22: 'AM', 23: 'RS', 24: 'AC',
			25: 'AP', 26: 'RR', 27: 'TO', 28: 'ZZ',
		}[estado];
	}

	return false;
}
module.exports.eTituloDeEleitor = eTituloDeEleitor;

function eEan(ean) {
	if(typeof ean !== 'string' || !/^(?:\d{8}|\d{12,14})$/.test(ean)) {
		return false;
	}

	ean = ean.split('').map(Number);

	var peso = 1,
		digitoVerificador = ean.pop(),
		soma = ean.reduceRight(function(anterior, atual) {
			peso = 4 - peso;
			return anterior + (atual * peso);
		}, 0),
		digitoVerificadorCalculado = (soma + ((10 - (soma % 10)) % 10)) - soma;

	return digitoVerificador === digitoVerificadorCalculado;
}
module.exports.eEan = eEan;

function eRegistroNacional(rn, tipo){
	if(typeof rn !== 'string') {
		return false;
	}

	rn = formatacoes.removerMascara(rn);

	if(typeof tipo === 'undefined') {
		if(rn.length === 14 && eCnpj(rn)) {
			return 'cnpj';
		}

		if(rn.length === 11 && eCpf(rn)) {
			return 'cpf';
		}
	} else if(['cpf', 'cnpj'].indexOf(tipo.toLowerCase()) > -1) {
		var fn = module.exports['e' + StringUtils.capitalize(tipo)];

		if(fn(rn)) {
			return tipo;
		}
	}

	return false;
}
module.exports.eRegistroNacional = eRegistroNacional;

var casosTriviaisDeCnpjFalsos = [
	'000000000000',
	'111111111111',
	'222222222222',
	'333333333333',
	'444444444444',
	'555555555555',
	'666666666666',
	'777777777777',
	'888888888888',
	'999999999999'
];

function eCnpj(cnpj){
	if(typeof cnpj !== 'string') return false;
	cnpj = formatacoes.removerMascara(cnpj);
	if(cnpj.length !== 14) return false;

	var base = cnpj.substring(0, 12);

	if(casosTriviaisDeCnpjFalsos.indexOf(base) > -1) {
		return false;
	}

	var primeiroResto = mod(base);
	var primeiroDigito = primeiroResto < 2 ? 0 : 11 - primeiroResto;

	var segundoResto = mod(base + primeiroDigito);
	var segundoDigito = segundoResto < 2 ? 0 : 11 - segundoResto;

	return cnpj === base + primeiroDigito + segundoDigito;
}
module.exports.eCnpj = eCnpj;

var regexParaMatrizEFilial = /^[0-9]{8}([0-9]{4})[0-9]{2}$/;

function eMatriz(cnpj) {
	//retorna null caso não seja passado um cnpj
	//retorna true caso seja uma matriz
	//retorna false caso não seja uma matriz

	if(!eCnpj(cnpj)) {
		return null;
	}

	var matches = regexParaMatrizEFilial.exec(formatacoes.removerMascara(cnpj));

	return (matches !== null && matches.length === 2 && matches[1] === '0001');
}
module.exports.eMatriz = eMatriz;

function eFilial(cnpj) {
	//retorna null caso não seja passado um cnpj
	//retorna o número da filial caso seja passado um cnpj válido
	//retorna false caso não seja uma filial

	if(!eCnpj(cnpj)) {
		return null;
	}

	var matches = regexParaMatrizEFilial.exec(formatacoes.removerMascara(cnpj));

	if(matches !== null && matches.length === 2 && matches[1] !== '0001') {
		return parseInt(matches[1], 10);
	} else {
		return false;
	}
}
module.exports.eFilial = eFilial;

function eCpf(cpf){
	if(typeof cpf !== 'string') return false;
	cpf = formatacoes.removerMascara(cpf);
	if(cpf.length !== 11) return false;

	var base = cpf.substring(0, 9);
	var multiplicadores = [2, 3, 4, 5, 6, 7, 8, 9, 10];

	var primeiroResto = mod(base, multiplicadores);
	var primeiroDigito = primeiroResto < 2 ? 0 : 11 - primeiroResto;

	multiplicadores.push(11);

	var segundoResto = mod(base + primeiroDigito, multiplicadores);
	var segundoDigito = segundoResto < 2 ? 0 : 11 - segundoResto;

	return cpf === base + primeiroDigito + segundoDigito;
}
module.exports.eCpf = eCpf;

function ePisPasep(pisPasep){
	if(typeof pisPasep !== 'string') return false;
	pisPasep = formatacoes.removerMascara(pisPasep);
	if(pisPasep.length !== 11) return false;

	var base = pisPasep.substring(0,10);
	var multiplicadores = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

	var resto = mod(base, multiplicadores, 11, 'leftToRight');
	var subtracao = 11 - resto;
	var digito = subtracao == 10 || subtracao == 11 ? 0 : subtracao;

	return pisPasep === base + digito;
}
module.exports.ePisPasep = ePisPasep;
module.exports.eNit = ePisPasep;

var regexDePlacaValida = /^[a-zA-Z]{3}-?[0-9]{4}$/;
module.exports.ePlaca = function(placa){
	return regexDePlacaValida.test(placa);
};


var regexDeCepValido = /^\d{2}\.?\d{3}-?\d{3}$/;
module.exports.eCep = function(cep){
	return regexDeCepValido.test(cep);
};
