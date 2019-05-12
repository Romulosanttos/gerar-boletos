const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;
const insert = StringUtils.insert;


const GeradorDeDigitoPadrao = require('../gerador-de-digito-padrao');
const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');


//Varias coisas implementadas inclusive arquivos de retorno
//https://github.com/kivanio/brcobranca
//https://github.com/pagarme/node-boleto

//Várias validações
//http://ghiorzi.org/DVnew.htm

var Itau = (function() {
	var NUMERO_ITAU = '341',
		DIGITO_ITAU = '7';

	function Itau() {

	}

	Itau.prototype.getTitulos = function() {
		return {};
	};

	Itau.prototype.exibirReciboDoPagadorCompleto = function() {
		return false;
	};

	Itau.prototype.exibirCampoCip = function() {
		return false;
	};

	Itau.prototype.geraCodigoDeBarrasPara = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),
			campoLivre = [];

		campoLivre.push(this.getCarteiraFormatado(beneficiario));
		campoLivre.push(this.getNossoNumeroFormatado(beneficiario));
		campoLivre.push(beneficiario.getAgenciaFormatada());
		campoLivre.push(this.getCodigoFormatado(beneficiario));
		campoLivre.push('000');

		campoLivre = campoLivre.join('');

		var digito1 = GeradorDeDigitoPadrao.mod10(campoLivre.substring(11, 20));
		campoLivre = insert(campoLivre, 20, digito1);

		var digito2 = GeradorDeDigitoPadrao.mod10(campoLivre.substring(11, 20) + campoLivre.substring(0, 11));
		campoLivre = insert(campoLivre, 11, digito2);

		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Itau.prototype.getNumeroFormatadoComDigito = function() {
		return [NUMERO_ITAU, DIGITO_ITAU].join('-');
	};

	Itau.prototype.getCarteiraFormatado = function(beneficiario) {
		return pad(beneficiario.getCarteira(), 3, '0');
	};

	Itau.prototype.getCarteiraTexto = function(beneficiario) {
		return this.getCarteiraFormatado(beneficiario);
	};

	Itau.prototype.getCodigoFormatado = function(beneficiario) {
		return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
	};

	Itau.prototype.getImagem = function() {
		return path.join(__dirname, 'logotipos/itau.png');
	};

	Itau.prototype.getNossoNumeroFormatado = function(beneficiario) {
		return pad(beneficiario.getNossoNumero(), 8, '0');
	};

	Itau.prototype.getNossoNumeroECodigoDocumento = function(boleto) {
		var beneficiario = boleto.getBeneficiario();

		return [
			beneficiario.getCarteira(),
			this.getNossoNumeroFormatado(beneficiario),
		].join('/') + '-' + beneficiario.getDigitoNossoNumero();
	};

	Itau.prototype.getNumeroFormatado = function() {
		return NUMERO_ITAU;
	};

	Itau.prototype.getNome = function() {
		return 'Banco Itaú S/A';
	};

	Itau.prototype.getImprimirNome = function() {
		return true;
	};

	Itau.prototype.getAgenciaECodigoBeneficiario = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),

			codigo = this.getCodigoFormatado(beneficiario),
			digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

		if (digitoCodigo) {
			codigo += '-' + digitoCodigo;
		}

		return beneficiario.getAgenciaFormatada() + '/' + codigo;
	};

	Itau.novoItau = function() {
		return new Itau();
	};

	return Itau;
})();

module.exports = Itau;
