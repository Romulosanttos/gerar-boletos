const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

var Bradesco = (function() {
	var NUMERO_BRADESCO = '237',
		DIGITO_BRADESCO = '2';

	function Bradesco() {

	}

	Bradesco.prototype.getTitulos = function() {
		return {
			instrucoes: 'Informações de responsabilidade do beneficiário',
			nomeDoPagador: 'Nome do Pagador',
			especie: 'Moeda',
			quantidade: 'Quantidade',
			valor: 'Valor',
			moraMulta: '(+) Juros / Multa'
		};
	};

	Bradesco.prototype.exibirReciboDoPagadorCompleto = function() {
		return true;
	};

	Bradesco.prototype.exibirCampoCip = function() {
		return true;
	};

	Bradesco.prototype.geraCodigoDeBarrasPara = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),
			campoLivre = [];

		campoLivre.push(beneficiario.getAgenciaFormatada());
		campoLivre.push(this.getCarteiraFormatado(beneficiario));
		campoLivre.push(this.getNossoNumeroFormatado(beneficiario));
		campoLivre.push(this.getCodigoFormatado(beneficiario));
		campoLivre.push('0');

		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Bradesco.prototype.getNumeroFormatadoComDigito = function() {
		return [
			NUMERO_BRADESCO,
			DIGITO_BRADESCO
		].join('-');
	};

	Bradesco.prototype.getNumeroFormatado = function() {
		return NUMERO_BRADESCO;
	};

	Bradesco.prototype.getCarteiraFormatado = function(beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Bradesco.prototype.getCarteiraTexto = function(beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Bradesco.prototype.getCodigoFormatado = function(beneficiario) {
		return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
	};

	Bradesco.prototype.getImagem = function() {
		return path.join(__dirname, 'logotipos/bradesco.png');
	};

	Bradesco.prototype.getNossoNumeroFormatado = function(beneficiario) {
		return pad(beneficiario.getNossoNumero(), 11, '0');
	};

	Bradesco.prototype.getNossoNumeroECodigoDocumento = function(boleto) {
		var beneficiario = boleto.getBeneficiario();

		return this.getCarteiraFormatado(beneficiario) + '/' + [
			this.getNossoNumeroFormatado(beneficiario),
			beneficiario.getDigitoNossoNumero()
		].join('-');
	};

	Bradesco.prototype.getNome = function() {
		return 'Banco Bradesco S.A.';
	};

	Bradesco.prototype.getImprimirNome = function() {
		return false;
	};

	Bradesco.prototype.getAgenciaECodigoBeneficiario = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),

			codigo = this.getCodigoFormatado(beneficiario),
			digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

		if (digitoCodigo) {
			codigo += '-' + digitoCodigo;
		}

		return beneficiario.getAgenciaFormatada() + '/' + codigo;
	};

	Bradesco.novoBradesco = function() {
		return new Bradesco();
	};

	return Bradesco;
})();

module.exports = Bradesco;
