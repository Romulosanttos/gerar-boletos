const path = require('path');
const StringUtils = require('../../utils/string-utils');
const CodigoDeBarrasBuilder = require('../codigo-de-barras-builder');

const Cecred = (function () {
	const NUMERO_CECRED = '085';
	const DIGITO_CECRED = '1';

	function Cecred() { }

	Cecred.prototype.getTitulos = function () {
		return {
			instrucoes: 'Instruções (texto de responsabilidade do beneficiário)',
			nomeDoPagador: 'Pagador',
			especie: 'Moeda',
			quantidade: 'Quantidade',
			valor: 'x Valor',
			moraMulta: '(+) Moras / Multa'
		};
	};

	Cecred.prototype.exibirReciboDoPagadorCompleto = function () {
		return true;
	};

	Cecred.prototype.exibirCampoCip = function () {
		return true;
	};

	Cecred.prototype.geraCodigoDeBarrasPara = boleto => {
		const beneficiario = boleto.getBeneficiario();
		const errorMsg = 'Erro ao gerar código de barras,';

		if (!beneficiario.getNumeroConvenio() || beneficiario.getNumeroConvenio().length != 6)
			throw new Error(`${errorMsg} número convênio da cooperativa não possui 6 dígitos: ${beneficiario.getNumeroConvenio()}`);
		if (!beneficiario.getNossoNumero() || beneficiario.getNossoNumero().length != 17)
			throw new Error(`${errorMsg} nosso número não possui 17 dígitos: ${beneficiario.getNossoNumero()}`);
		if (!beneficiario.getCarteira() || beneficiario.getCarteira().length != 2)
			throw new Error(`${errorMsg} código carteira não possui 2 dígitos: ${beneficiario.getCarteira()}`);

		const campoLivre = [];
		campoLivre.push(beneficiario.getNumeroConvenio());
		campoLivre.push(beneficiario.getNossoNumero());
		campoLivre.push(beneficiario.getCarteira().substring(0, 2));
		return new CodigoDeBarrasBuilder(boleto).comCampoLivre(campoLivre);
	};

	Cecred.prototype.getNumeroFormatadoComDigito = function () {
		return [NUMERO_CECRED, DIGITO_CECRED].join('-');
	};

	Cecred.prototype.getNumeroFormatado = function () {
		return NUMERO_CECRED;
	};

	Cecred.prototype.getCarteiraFormatado = function (beneficiario) {
		return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
	};

	Cecred.prototype.getCarteiraTexto = function (beneficiario) {
		return StringUtils.pad(beneficiario.getCarteira(), 2, '0');
	};

	Cecred.prototype.getCodigoFormatado = function (beneficiario) {
		return StringUtils.pad(beneficiario.getCodigoBeneficiario(), 7, '0');
	};

	Cecred.prototype.getImagem = function () {
		return path.join(__dirname, 'logotipos/ailos.png');
	};

	Cecred.prototype.getNossoNumeroFormatado = function (beneficiario) {
		return StringUtils.pad(beneficiario.getNossoNumero(), 11, '0');
	};

	Cecred.prototype.getNossoNumeroECodigoDocumento = function (boleto) {
		const beneficiario = boleto.getBeneficiario();

		let nossoNumero = this.getNossoNumeroFormatado(beneficiario);
		if (beneficiario.getDigitoNossoNumero()) nossoNumero += `-${beneficiario.getDigitoNossoNumero()}`;

		return nossoNumero;
	};

	Cecred.prototype.getNome = function () {
		return 'Ailos';
	};

	Cecred.prototype.getImprimirNome = function () {
		return false;
	};

	Cecred.prototype.getLocaisDePagamentoPadrao = function () {
		return ['PAGAVEL PREFERENCIALMENTE NAS COOPERATIVAS DO SISTEMA AILOS.', 'APOS VENCIMENTO PAGAR SOMENTE NA COOPERATIVA '];
	};

	Cecred.prototype.getAgenciaECodigoBeneficiario = function (boleto) {
		const beneficiario = boleto.getBeneficiario();
		const digitoCodigo = beneficiario.getDigitoCodigoBeneficiario();
		let codigo = this.getCodigoFormatado(beneficiario);

		if (digitoCodigo) codigo += '-' + digitoCodigo;

		const agenciaComDigito = beneficiario.getAgenciaFormatada() + '-' + beneficiario.getDigitoAgencia();

		return agenciaComDigito + '/' + codigo;
	};

	Cecred.novoCecred = function () {
		return new Cecred();
	};

	return Cecred;
})();

module.exports = Cecred;
