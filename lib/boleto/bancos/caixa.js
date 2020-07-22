const path = require('path');
const StringUtils = require('../../utils/string-utils');
const pad = StringUtils.pad;

const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');
const GeradorDeDigitoPadrao = require('../gerador-de-digito-padrao');

var Caixa = (function() {
	var NUMERO_CAIXA = '104',
		DIGITO_CAIXA = '0';

	function Caixa() {

	}

	Caixa.prototype.getTitulos = function() {
		return {
			instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
			nomeDoPagador: 'Nome do Pagador',
			especie: 'Espécie Moeda',
			quantidade: 'Quantidade Moeda',
			valor: 'xValor'
		};
	};

	Caixa.prototype.exibirReciboDoPagadorCompleto = function() {
		return true;
	};

	Caixa.prototype.exibirCampoCip = function() {
		return false;
	};

	Caixa.prototype.geraCodigoDeBarrasPara = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),
			carteira = beneficiario.getCarteira(),
			contaCorrente = pad(beneficiario.getCodigoBeneficiario(), 6, '0'),
			// digitoContaCorrente = pad(beneficiario.getDigitoCodigoBeneficiario(), 1, '0'),
			nossoNumeroFormatado = this.getNossoNumeroFormatado(beneficiario),
			campoLivre = [];

		if (carteira == '14' || carteira == '24') {
			// Carteira 24 é sem registro e carteira 14 é com registro
			// O número 1 significa com registro e o número 2 sem registro

			campoLivre.push(contaCorrente);
			campoLivre.push(beneficiario.getDigitoCodigoBeneficiario());
			campoLivre.push(nossoNumeroFormatado.substring(2, 5));
			campoLivre.push(nossoNumeroFormatado.substring(0, 1));
			campoLivre.push(nossoNumeroFormatado.substring(5, 8));
			campoLivre.push(nossoNumeroFormatado.substring(1, 2));
			campoLivre.push(nossoNumeroFormatado.substring(8));

			var digito = GeradorDeDigitoPadrao.mod11(campoLivre.join(''), {
				de: [0, 10, 11],
				para: 0
			});

			campoLivre.push(digito);
		} else {
			throw new Error('Carteira "', carteira, '" não implementada para o banco Caixa');
		}

		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Caixa.prototype.getNumeroFormatadoComDigito = function() {
		return [NUMERO_CAIXA, DIGITO_CAIXA].join('-');
	};

	Caixa.prototype.getCarteiraFormatado = function(beneficiario) {
		return pad(beneficiario.getCarteira(), 2, '0');
	};

	Caixa.prototype.getCarteiraTexto = function(beneficiario) {
		return {
			1: 'RG',
			14: 'RG',
			2: 'SR',
			24: 'SR'
		}[beneficiario.getCarteira()];
	};

	Caixa.prototype.getCodigoFormatado = function(beneficiario) {
		return pad(beneficiario.getCodigoBeneficiario(), 5, '0');
	};

	Caixa.prototype.getImagem = function() {
		return path.join(__dirname, 'logotipos/caixa-economica-federal.png');
	};

	Caixa.prototype.getNossoNumeroFormatado = function(beneficiario) {
		return [
			pad(beneficiario.getCarteira(), 2, '0'),
			pad(beneficiario.getNossoNumero(), 15, '0')
		].join('');
	};

	Caixa.prototype.getNossoNumeroECodigoDocumento = function(boleto) {
		var beneficiario = boleto.getBeneficiario();

		return [
			this.getNossoNumeroFormatado(beneficiario),
			beneficiario.getDigitoNossoNumero()
		].join('-');
	};

	Caixa.prototype.getNumeroFormatado = function() {
		return NUMERO_CAIXA;
	};

	Caixa.prototype.getNome = function() {
		return 'Caixa Econômica Federal S/A';
	};

	Caixa.prototype.getImprimirNome = function() {
		return false;
	};

	Caixa.prototype.getAgenciaECodigoBeneficiario = function(boleto) {
		var beneficiario = boleto.getBeneficiario(),

			codigo = this.getCodigoFormatado(beneficiario),
			digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();

		if (digitoCodigo) {
			codigo += '-' + digitoCodigo;
		}

		return beneficiario.getAgenciaFormatada() + '/' + codigo;
	};

	Caixa.novoCaixa = function() {
		return new Caixa();
	};

	return Caixa;
})();

module.exports = Caixa;
