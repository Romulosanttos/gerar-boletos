const StringUtils = require('../string-utils');
const ObjectUtils = require('../object-utils');
const DateUtils = require('../date-utils');
const pad = StringUtils.pad;
const insert = StringUtils.insert;
const merge = ObjectUtils.merge;
const isValidDate = DateUtils.isValidDate;
const validacoes = require('../functions/validacoesUtils');

function dinheiro(_numero, args) {
	if(isNaN(_numero)) {
		return _numero;
	}
	args = merge({
		separadorDecimal: ',',
		separadorDeMilhar: '.',
		casasDecimais: 2,
		simbolo: 'R$ ',
		posicionamento: 'esquerda'
	}, args);

	if(args.posicionamento === 'esquerda') {
		return args.simbolo + numero(_numero, args);
	} else {
		return numero(_numero, args) + args.simbolo;
	}
}
module.exports.dinheiro = dinheiro;

function dinheiroPorExtenso(numero) {
	/*
        O código desta função foi obtido em http://jsfromhell.com/pt/string/extenso
        ---------------------------------------------------------------------------

        + Carlos R. L. Rodrigues
        @ http://jsfromhell.com/string/extenso [rev. #3]

        "Copyright: Autorizamos a cópia e modificação de todos os códigos contidos no site, desde que se mantenha os créditos do autor original."
    */

	var ex = [
		['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'],
		['dez', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'],
		['cem', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'],
		['mil', 'milhão', 'bilhão', 'trilhão', 'quadrilhão', 'quintilhão', 'sextilhão', 'setilhão', 'octilhão', 'nonilhão', 'decilhão', 'undecilhão', 'dodecilhão', 'tredecilhão', 'quatrodecilhão', 'quindecilhão', 'sedecilhão', 'septendecilhão', 'octencilhão', 'nonencilhão']
	];

	numero = numero.toString();
	numero = numero.replace('.', ',');
	var c = true;

	var a, n, v, i, n = numero.replace(c ? /[^,\d]/g : /\D/g, '').split(','), e = ' e ', $ = 'real', d = 'centavo', sl;

	for(var f = n.length - 1, l, j = -1, r = [], s = [], t = ''; ++j <= f; s = []){
		j && (n[j] = (('.' + n[j]) * 1).toFixed(2).slice(2));
		if(!(a = (v = n[j]).slice((l = v.length) % 3).match(/\d{3}/g), v = l % 3 ? [v.slice(0, l % 3)] : [], v = a ? v.concat(a) : v).length) continue;
		for(a = -1, l = v.length; ++a < l; t = ''){
			if(!(i = v[a] * 1)) continue;
			i % 100 < 20 && (t += ex[0][i % 100]) ||
            i % 100 + 1 && (t += ex[1][(i % 100 / 10 >> 0) - 1] + (i % 10 ? e + ex[0][i % 10] : ''));
			s.push((i < 100 ? t : !(i % 100) ? ex[2][i == 100 ? 0 : i / 100 >> 0] : (ex[2][i / 100 >> 0] + e + t)) +
            ((t = l - a - 2) > -1 ? ' ' + (i > 1 && t > 0 ? ex[3][t].replace('?o', '?es') : ex[3][t]) : ''));
		}
		a = ((sl = s.length) > 1 ? (a = s.pop(), s.join(' ') + e + a) : s.join('') || ((!j && (n[j + 1] * 1 > 0) || r.length) ? '' : ex[0][0]));
		a && r.push(a + (c ? (' ' + (v.join('') * 1 > 1 ? j ? d + 's' : (/0{6,}$/.test(n[0]) ? 'de ' : '') + $.replace('l', 'is') : j ? d : $)) : ''));
	}

	var resultado = r.join(e);

	if(resultado === 'zero real') {
		return 'zero reais';
	}

	return resultado;
}

module.exports.dinheiroPorExtenso = dinheiroPorExtenso;

function numero(numero, args) {
	if(isNaN(numero)) {
		return numero;
	}

	var casasDecimaisOriginais = numero.toString().split('.');
	if(casasDecimaisOriginais.length > 1) {
		casasDecimaisOriginais = casasDecimaisOriginais[1].length;
	} else {
		casasDecimaisOriginais = 0;
	}

	args = merge({
		separadorDecimal: ',',
		separadorDeMilhar: '.',
		casasDecimais: casasDecimaisOriginais
	}, args);

	function _format(n, x, s, c) {
		//http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
			num = numero.toString().replace(new RegExp('\\.([\\d]{' + args.casasDecimais + '})[\\d]*?$'), '.$1');

		num = parseFloat(num).toFixed(args.casasDecimais);
		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	}

	return _format(args.casasDecimais, 3, args.separadorDeMilhar, args.separadorDecimal);
}
module.exports.numero = numero;

function removerMascara(texto) {
	if(typeof texto !== 'string') {
		return texto;
	}

	return texto
		.trim()
		.replace(/\(/g, '')
		.replace(/\)/g, '')
		.replace(/\./g, '')
		.replace(/\//g, '')
		.replace(/-/g, '')
		.replace(/\s/g, '')
		.replace(/R\$/g, '')
		.replace(/%/g, '')
		.trim();
}
module.exports.removerMascara = removerMascara;

function linhaDigitavel(valor) {
	valor = removerMascara(valor);

	if(valor.length !== 47) {
		return valor;
	}

	valor = insert(valor, 5, '.');
	valor = insert(valor, 11, ' ');
	valor = insert(valor, 17, '.');
	valor = insert(valor, 24, ' ');
	valor = insert(valor, 30, '.');
	valor = insert(valor, 37, ' ');
	valor = insert(valor, 39, ' ');

	return valor;
}
module.exports.linhaDigitavel = linhaDigitavel;
module.exports.boletoBancario = linhaDigitavel;

function hora(data, args) {
	if(!isValidDate(data)) {
		return data;
	}

	args = merge({
		comSegundos: true
	}, args);

	var componentes = [
		pad(data.getHours(), 2, '0'),
		pad(data.getMinutes(), 2, '0'),
	];

	if(args.comSegundos) {
		componentes.push(pad(data.getSeconds(), 2, '0'));
	}

	return componentes.join(':');
}
module.exports.hora = hora;

function data(data) {
	if(!isValidDate(data)) {
		return data;
	}

	return [
		pad(data.getDate(), 2, '0'),
		pad(data.getMonth() + 1, 2, '0'),
		data.getFullYear()
	].join('/');
}
module.exports.data = data;

function dataEHora(_data, args) {
	if(!isValidDate(_data)) {
		return _data;
	}

	return [
		data(_data),
		hora(_data, args)
	].join(' ');
}
module.exports.dataEHora = dataEHora;

function tituloDeEleitor(texto) {
	if(!validacoes.eTituloDeEleitor(texto)) {
		return texto;
	}

	return removerMascara(texto).match(/.{4}/g).join(' ');
}
module.exports.tituloDeEleitor = tituloDeEleitor;

function cnpj(texto) {
	if(!validacoes.eCnpj(texto)) return texto;
	if(texto.trim().length > 14) return texto;

	texto = texto.trim();

	return texto.substr(0, 2) + '.' +
        texto.substr(2, 3) + '.' +
        texto.substr(5, 3) + '/' +
        texto.substr(8, 4) + '-' +
        texto.substr(12, 2);
}
module.exports.cnpj = cnpj;

function cpf(texto) {
	if(!validacoes.eCpf(texto)) return texto;
	if(texto.trim().length > 11) return texto;

	texto = texto.trim();

	return texto.substr(0, 3) + '.' +
        texto.substr(3, 3) + '.' +
        texto.substr(6, 3) + '-' +
        texto.substr(9, 2);
}
module.exports.cpf = cpf;

function pisPasep(texto){
	if(!validacoes.ePisPasep(texto)) return texto;
	if(texto.trim().length > 11) return texto;

	texto = texto.trim();

	return texto.substr(0, 3) + '.' +
		texto.substr(3, 4) + '.' +
		texto.substr(7, 3) + '-' +
		texto.substr(10, 1);
}
module.exports.nit = pisPasep;
module.exports.pisPasep = pisPasep;

module.exports.registroNacional = registroNacional;
function registroNacional(texto) {
	var tipo = validacoes.eRegistroNacional(texto);

	if(!tipo) {
		return texto;
	}

	return this[tipo](texto);
}

module.exports.placa = placa;
function placa(texto) {
	if(!validacoes.ePlaca(texto)) return texto;

	texto = texto.trim().replace(/-/g, '');

	return texto.substr(0, 3).toUpperCase() + '-' + texto.substr(3, 4);
}

module.exports.cep = cep;
function cep(texto) {
	if(!validacoes.eCep(texto)) return texto;

	texto = texto.trim().replace(/-/g, '').replace(/\./g, '');

	return texto.substr(0, 2) + '.' + texto.substr(2, 3) + '-' + texto.substr(5, 3);
}
