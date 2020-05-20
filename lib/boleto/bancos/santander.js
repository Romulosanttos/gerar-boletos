const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

var Santander = (function () {
	var NUMERO_SANTANDER = '033',
		DIGITO_SANTANDER = '7';

	function Santander() {

	}

	Santander.prototype.getTitulos = function () {
		return {
			instrucoes: 'Informações de responsabilidade do beneficiário',
			nomeDoPagador: 'Nome do Pagador',
			especie: 'Moeda',
			quantidade: 'Quantidade',
			valor: 'Valor',
			moraMulta: '(+) Juros / Multa'
		};
	};

	Santander.prototype.exibirReciboDoPagadorCompleto = function () {
		return true;
	};

	Santander.prototype.exibirCampoCip = function () {
		return false;
	};

	Santander.prototype.geraCodigoDeBarrasPara = function (boleto) {
		var beneficiario = boleto.getBeneficiario(),
			campoLivre = [];

		campoLivre.push('9');
		campoLivre.push(beneficiario.getCodigoBeneficiario().substring(0, 4));
		campoLivre.push(beneficiario.getCodigoBeneficiario().substring(4));
		campoLivre.push(this.getNossoNumeroFormatado(beneficiario).substring(0, 7));
		campoLivre.push(this.getNossoNumeroFormatado(beneficiario).substring(7));
		campoLivre.push(beneficiario.getDigitoNossoNumero());
		campoLivre.push('0');
		campoLivre.push(this.getCarteiraFormatado(beneficiario));

		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Santander.prototype.getNumeroFormatadoComDigito = function () {
		return [
			NUMERO_SANTANDER,
			DIGITO_SANTANDER
		].join('-');
	};

	Santander.prototype.getNumeroFormatado = function () {
		return NUMERO_SANTANDER;
	};

	Santander.prototype.getCarteiraFormatado = function (beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Santander.prototype.getCarteiraTexto = function (beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Santander.prototype.getCodigoFormatado = function (beneficiario) {
		return pad(beneficiario.getCodigoBeneficiario(), 7, '0');
	};

	Santander.prototype.getImagem = function () {
		return path.join(__dirname, 'logotipos/santander.png');
	};

	Santander.prototype.getNossoNumeroFormatado = function (beneficiario) {
		return pad(beneficiario.getNossoNumero(), 12, '0');
	};

	Santander.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
		var beneficiario = boleto.getBeneficiario();

		return [
			this.getNossoNumeroFormatado(beneficiario),
			beneficiario.getDigitoNossoNumero()
		].join('-');
	};

	Santander.prototype.getNome = function () {
		return 'Banco Santander S.A.';
	};

	Santander.prototype.getImprimirNome = function () {
		return false;
	};

	Santander.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
		var beneficiario = boleto.getBeneficiario(),

			codigo = this.getCodigoFormatado(beneficiario),
			digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

		if (digitoCodigo) {
			codigo += '-' + digitoCodigo;
		}

		return beneficiario.getAgenciaFormatada() + '/' + codigo;
	};

	Santander.novoSantander = function () {
		return new Santander();
	};

	return Santander;
})();

module.exports = Santander;
