//Este submodulo de boletos é inspirado no Stella-Boletos, da Caelum
//https://github.com/caelum/caelum-stella
const formatacoes = require('./formatacoesUtils');
const validacoes = require('../functions/validacoesUtils');
const StringUtils = require('../string-utils');
const moment = require('moment');
const pad = StringUtils.pad;

const Itau = require('../../boleto/bancos/itau');
const Caixa = require('../../boleto/bancos/caixa');
const Bradesco = require('../../boleto/bancos/bradesco');
const BancoBrasil = require('../../boleto/bancos/banco-do-brasil');
const Cecred = require('../../boleto/bancos/cecred');
const Sicoob = require('../../boleto/bancos/sicoob');
const Santander = require('../../boleto/bancos/santander');
const Sicredi = require('../../boleto/bancos/sicredi');

const Gerador = require('../../boleto/gerador-de-boleto');
const GeradorDeLinhaDigitavel = require('../../boleto/gerador-de-linha-digitavel');

module.exports.especiesDeDocumento = {
	//TODO: Ordenar por ordem alfabética
	'DMI': 'Duplicata de Venda Mercantil por Indicação',
	'DM': 'Duplicata de Venda Mercantil',
	'DSI': 'Duplicata de Prestação de Serviços por Indicação de Comprovante',
	'NP': 'Nota Promissória',
	'ME': 'Mensalidade Escolar',
	'DS': 'Duplicata de Prestação de Serviços Original',
	'CT': 'Espécie de Contrato',
	'LC': 'Letra de Câmbio',
	'CPS': 'Conta de Prestação de Serviços de Profissional Liberal ou Declaração do Profissional',
	'EC': 'Encargos Condominiais',
	'DD': 'Documento de Dívida',
	'CCB': 'Cédula de Crédito Bancário',
	'CBI': 'Cédula de Crédito Bancário por Indicação',
	'CH': 'Cheque',
	'CM': 'Contrato de Mútuo',
	'RA': 'Recibo de Aluguel Para Pessoa Jurídica (Contrato Aluguel e Recibo)',
	'CD': 'Confissão de Dívida Apenas Para Falência de Declaração do Devedor',
	'FS': 'Fatura de Serviço',
	'TA': 'Termo de Acordo - Ex. Ação Trabalhista',
	'CC': 'Contrato de Câmbio',
	'DV': 'Diversos',
};

module.exports.bancos = {
	Itau: Itau,
	'341': Itau,

	Caixa: Caixa,
	'104': Caixa,

	Bradesco: Bradesco,
	'237': Bradesco,

	BancoBrasil: BancoBrasil,
	'001': BancoBrasil,

	Cecred: Cecred,
	'085': Cecred,

	Sicoob: Sicoob,
	'756': Sicoob,

	Santander: Santander,
	'033': Santander,

	Sicredi: Sicredi,
	'748': Sicredi
};

module.exports.Gerador = Gerador;

//Baixar depois:
//Logotipo HSBC: http://pt.vector.me/browse/29385/hsbc
//Logotipo UNIBANCO: http://pt.vector.me/browse/27779/unibanco

var Pagador = (function () {
	function Pagador() {

	}

	Pagador.prototype.getNome = function () {
		return this._nome;
	};

	Pagador.prototype.comNome = function (_nome) {
		this._nome = _nome;
		return this;
	};

	Pagador.prototype.getIdentificacao = function () {
		var identificacao = this.getNome(),
			tipo = this.temRegistroNacional();

		// TODO: Inserir novamente o registro nacional depois
		// de implementar mecanismo para o texto não extravassar
		// do campo.

		if (tipo) {
			identificacao += [
				' (',
				tipo.toUpperCase(),
				': ',
				this.getRegistroNacionalFormatado(),
				')'
			].join('') || '';
		}

		return (identificacao || '').toUpperCase();
	};

	Pagador.prototype.getRegistroNacional = function () {
		return this._registroNacional;
	};

	Pagador.prototype.getRegistroNacionalFormatado = function () {
		return formatacoes.registroNacional(this._registroNacional);
	};

	Pagador.prototype.temRegistroNacional = function () {
		return validacoes.eRegistroNacional(this._registroNacional);
	};

	Pagador.prototype.comCNPJ = function (_cnpj) {
		this.comRegistroNacional(_cnpj);
		return this;
	};

	Pagador.prototype.comCPF = function (_cpf) {
		this.comRegistroNacional(_cpf);
		return this;
	};

	Pagador.prototype.comRegistroNacional = function (_registroNacional) {
		this._registroNacional = _registroNacional;
		return this;
	};

	Pagador.prototype.getDocumento = function () {
		return this._documento;
	};

	Pagador.prototype.comDocumento = function (_documento) {
		this._documento = _documento;
		return this;
	};

	Pagador.prototype.getEndereco = function () {
		return this._endereco;
	};

	Pagador.prototype.comEndereco = function (_endereco) {
		this._endereco = _endereco;
		return this;
	};

	Pagador.novoPagador = function () {
		return new Pagador().comEndereco(Endereco.novoEndereco());
	};

	return Pagador;
})();

module.exports.Pagador = Pagador;

var Beneficiario = (function () {
	function Beneficiario() {

	}

	Beneficiario.prototype.getIdentificacao = function () {
		var identificacao = this.getNome(),
			tipo = this.temRegistroNacional();

		if (tipo) {
			identificacao += [
				' (',
				tipo.toUpperCase(),
				': ',
				this.getRegistroNacionalFormatado(),
				')'
			].join('');
		}

		return (identificacao || '').toUpperCase();
	};

	Beneficiario.prototype.getRegistroNacional = function () {
		return this._registroNacional;
	};

	Beneficiario.prototype.getRegistroNacionalFormatado = function () {
		return formatacoes.registroNacional(this._registroNacional);
	};

	Beneficiario.prototype.temRegistroNacional = function () {
		return validacoes.eRegistroNacional(this._registroNacional);
	};

	Beneficiario.prototype.comCNPJ = function (_cnpj) {
		this.comRegistroNacional(_cnpj);
		return this;
	};

	Beneficiario.prototype.comCPF = function (_cpf) {
		this.comRegistroNacional(_cpf);
		return this;
	};

	Beneficiario.prototype.comRegistroNacional = function (_registroNacional) {
		this._registroNacional = _registroNacional;
		return this;
	};

	Beneficiario.prototype.comAgencia = function (_agencia) {
		this._agencia = _agencia;
		return this;
	};

	Beneficiario.prototype.getAgencia = function () {
		return this._agencia;
	};


	Beneficiario.prototype.comCodPosto = function (_posto) {
		this._posto = _posto;
		return this;
	};

	Beneficiario.prototype.getCodposto = function () {
		return this._posto;
	};

	Beneficiario.prototype.getAgenciaFormatada = function () {
		return pad(this._agencia, 4, '0');
	};

	Beneficiario.prototype.comDigitoAgencia = function (_digitoAgencia) {
		this._digitoAgencia = _digitoAgencia;
		return this;
	};

	Beneficiario.prototype.getDigitoAgencia = function () {
		return this._digitoAgencia;
	};

	Beneficiario.prototype.comCodigoBeneficiario = function (_codigo) {
		this._codigo = _codigo;
		return this;
	};

	Beneficiario.prototype.getCodigoBeneficiario = function () {
		return this._codigo;
	};

	Beneficiario.prototype.getDigitoCodigoBeneficiario = function () {
		return this._digitoCodigoBeneficiario;
	};

	Beneficiario.prototype.comDigitoCodigoBeneficiario = function (_digitoCodigoBeneficiario) {
		this._digitoCodigoBeneficiario = _digitoCodigoBeneficiario;
		return this;
	};

	Beneficiario.prototype.getCarteira = function () {
		return this._carteira;
	};

	Beneficiario.prototype.comCarteira = function (_carteira) {
		this._carteira = _carteira;
		return this;
	};

	Beneficiario.prototype.getNossoNumero = function () {
		return this._nossoNumero;
	};

	Beneficiario.prototype.comNossoNumero = function (_nossoNumero) {
		this._nossoNumero = _nossoNumero;
		return this;
	};

	Beneficiario.prototype.getDigitoNossoNumero = function () {
		return this._digitoNossoNumero;
	};

	Beneficiario.prototype.comDigitoNossoNumero = function (_digitoNossoNumero) {
		this._digitoNossoNumero = _digitoNossoNumero;
		return this;
	};

	Beneficiario.prototype.getNome = function () {
		return this._nome;
	};

	Beneficiario.prototype.comNome = function (_nomeBeneficiario) {
		this._nome = _nomeBeneficiario;
		return this;
	};

	Beneficiario.prototype.getEndereco = function () {
		return this._endereco;
	};

	Beneficiario.prototype.comEndereco = function (_endereco) {
		this._endereco = _endereco;
		return this;
	};

	Beneficiario.prototype.getNumeroConvenio = function () {
		return this._numeroConvenio;
	};

	Beneficiario.prototype.comNumeroConvenio = function (_numeroConvenio) {
		this._numeroConvenio = _numeroConvenio;
		return this;
	};

	Beneficiario.prototype.getDocumento = function () {
		return this._documento;
	};

	Beneficiario.prototype.comDocumento = function (_documento) {
		this._documento = _documento;
		return this;
	};

	Beneficiario.prototype.novoBeneficiario = function () {
		return new Beneficiario().comEndereco(Endereco.novoEndereco());
	};

	Beneficiario.novoBeneficiario = function () {
		return new Beneficiario();
	};

	return Beneficiario;
})();

module.exports.Beneficiario = Beneficiario;

var Datas = (function () {
	function removerHoras(data) {
		data.setHours(0);
		data.setMinutes(0);
		data.setSeconds(0);
		data.setMilliseconds(0);

		return data;
	}

	function formatar(data) {
		return [
			pad(data.getDate(), 2, '0'),
			pad(data.getMonth() + 1, 2, '0'),
			data.getFullYear()
		].join('/');
	}

	/**
	 * Valida se uma data está dentro do range suportado pelo sistema
	 * Atualizado para considerar os novos ciclos da FEBRABAN até 2049
	 * @param {Date} data - Data a ser validada
	 * @returns {boolean} true se a data é válida
	 */
	function validarData(data) {
		var ano = data.getFullYear();
		// Range expandido: 1997 até 2049 (conforme novos ciclos FEBRABAN)
		return ano >= 1997 && ano <= 2049;
	}

	/**
	 * Converte diferentes formatos de data para Date usando moment.js
	 * @param {string|Date} data - Data em formato ISO (YYYY-MM-DD) ou brasileiro (DD/MM/YYYY)
	 * @returns {Date} Data convertida para JavaScript Date
	 */
	function converterData(data) {
		if (data instanceof Date) {
			return data;
		}
		
		if (typeof data === 'string') {
			// Define formatos aceitos
			const formatosAceitos = [
				'YYYY-MM-DD',    // ISO: 2025-03-15
				'DD/MM/YYYY'     // Brasileiro: 15/03/2025 
			];
			
			// Usa moment com múltiplos formatos - ele detecta automaticamente
			const momentData = moment(data, formatosAceitos, true); // strict mode
			
			if (momentData.isValid()) {
				return momentData.toDate();
			}
		}
		
		// Fallback - tenta parsear com moment de forma automática
		const momentData = moment(data);
		return momentData.isValid() ? momentData.toDate() : new Date(data);
	}

	function Datas() {

	}

	Datas.prototype.comDocumento = function (_documento) {
		_documento = converterData(_documento);

		if (!validarData(_documento)) {
			throw new Error('O ano do documento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)');
		}

		this._documento = removerHoras(_documento);
		return this;
	};

	Datas.prototype.getDocumento = function () {
		return this._documento;
	};

	Datas.prototype.getDocumentoFormatado = function () {
		return formatar(this.getDocumento());
	};

	Datas.prototype.comProcessamento = function (_processamento) {
		_processamento = converterData(_processamento);

		if (!validarData(_processamento)) {
			throw new Error('O ano de processamento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)');
		}

		this._processamento = removerHoras(_processamento);
		return this;
	};

	Datas.prototype.getProcessamento = function () {
		return this._processamento;
	};

	Datas.prototype.getProcessamentoFormatado = function () {
		return formatar(this.getProcessamento());
	};

	Datas.prototype.comVencimento = function (_vencimento) {
		_vencimento = converterData(_vencimento);

		if(!validarData(_vencimento)){
			throw new Error('O ano de vencimento deve estar entre 1997 e 2049 (range suportado pelos ciclos FEBRABAN)');
		}

		this._vencimento = removerHoras(_vencimento);
		return this;
	};

	Datas.prototype.getVencimento = function(){
		return this._vencimento;
	};

	Datas.prototype.getVencimentoFormatado = function(){
		return formatar(this._vencimento);
	};

	Datas.novasDatas = function(){
		return new Datas();
	};

	return Datas;
})();

module.exports.Datas = Datas;

var Endereco = (function () {
	function Endereco() {

	}

	Endereco.prototype.getLogradouro = function () {
		return this._logradouro || '';
	};

	Endereco.prototype.comLogradouro = function (_logradouro) {
		this._logradouro = _logradouro;
		return this;
	};

	Endereco.prototype.getBairro = function () {
		return this._bairro || '';
	};

	Endereco.prototype.comBairro = function (_bairro) {
		this._bairro = _bairro;
		return this;
	};

	Endereco.prototype.getCep = function () {
		return this._cep || '';
	};

	Endereco.prototype.getCepFormatado = function () {
		return formatacoes.cep(this.getCep());
	};

	Endereco.prototype.comCep = function (_cep) {
		this._cep = _cep;
		return this;
	};

	Endereco.prototype.getCidade = function () {
		return this._cidade || '';
	};

	Endereco.prototype.comCidade = function (_cidade) {
		this._cidade = _cidade;
		return this;
	};

	Endereco.prototype.getUf = function () {
		return this._uf || '';
	};

	Endereco.prototype.comUf = function (_uf) {
		this._uf = _uf;
		return this;
	};

	Endereco.prototype.getPrimeiraLinha = function () {
		var resultado = '';

		if (this.getLogradouro()) {
			resultado += this.getLogradouro();
		}

		if (this.getLogradouro() && this.getBairro()) {
			resultado += ', ';
		}

		if (this.getBairro()) {
			resultado += this.getBairro();
		}

		return resultado;
	};

	Endereco.prototype.getSegundaLinha = function () {
		var resultado = '';

		if (this.getCidade()) {
			resultado += this.getCidade();
		}

		if (this.getCidade() && this.getUf()) {
			resultado += '/';
		}

		if (this.getUf()) {
			resultado += this.getUf();
		}

		if (resultado && this.getCep()) {
			resultado += ' — ';
		}

		if (this.getCep()) {
			resultado += this.getCepFormatado();
		}

		return resultado;
	};

	Endereco.prototype.getEnderecoCompleto = function () {
		var enderecoCompleto = [];

		this.getLogradouro() && enderecoCompleto.push(this.getLogradouro());
		this.getBairro() && enderecoCompleto.push(this.getBairro());
		this.getCep() && enderecoCompleto.push(this.getCepFormatado());
		this.getCidade() && enderecoCompleto.push(this.getCidade());
		this.getUf() && enderecoCompleto.push(this.getUf());

		return enderecoCompleto.join(' ');
	};

	Endereco.novoEndereco = function () {
		return new Endereco();
	};

	return Endereco;
})();

module.exports.Endereco = Endereco;

var Boleto = (function () {
	/**
	 * Data base para cálculo do fator de vencimento conforme padrão FEBRABAN
	 * 07 de outubro de 1997 - Data inicial do sistema de cobrança bancária
	 */
	var DATA_BASE = new Date(1997, 10 - 1, 7);
	
	/**
	 * Constantes para o ciclo do fator de vencimento
	 * FEBRABAN definiu que após atingir 9999, o contador reinicia em 1000
	 */
	var FATOR_VENCIMENTO = {
		LIMITE_MAXIMO: 9999,
		CICLO_RESET: 10000,
		INICIO_SEGUNDO_CICLO: 1000, // FEBRABAN FB-009/2023: reinicia em 1000
		DIGITOS_FATOR: 4,
		// Data limite do primeiro ciclo: 21/02/2025
		DATA_LIMITE_PRIMEIRO_CICLO: new Date(2025, 1, 21),
		// Data limite do segundo ciclo: 13/10/2049 (recalculado com início em 1000)
		DATA_LIMITE_SEGUNDO_CICLO: new Date(2049, 9, 13)
	};

	function Boleto() {

	}

	function formatarValor(valor) {
		var valorArray = valor.toString().split('.'),
			inteiros = valorArray[0],
			decimais = valorArray.length > 1 ? valorArray[1] : '00';

		decimais = pad(decimais, 2, '0', 'right').substr(0, 2);

		return pad(inteiros + decimais, 10, '0');
	}

	function formatarBRL(valor) {
		var zeroAEsquerda = true,
			i = -1;

		return 'R$ ' + (valor.substr(0, 8).split('').reduce(function (acc, cur) {
			if (cur === '0' && zeroAEsquerda) {
				return acc;
			}

			zeroAEsquerda = false;
			return acc + cur;
		}, '').split('').reduceRight(function (acc, cur) {
			i++;
			return cur + (i !== 0 && i % 3 === 0 ? '.' : '') + acc;
		}, '') || 0) + ',' + valor.substr(8, 2);
	}

	/**
	 * Calcula o fator de vencimento conforme especificação FEBRABAN
	 * 
	 * Regras implementadas (FB-009/2023):
	 * - Período 1 (07/10/1997 a 21/02/2025): Fator 0001 a 9999
	 * - Período 2 (22/02/2025 a 13/10/2049): Fator 1000 a 9999 (reinicia em 1000)
	 * - Após 13/10/2049: Aguardando nova definição FEBRABAN
	 * 
	 * @returns {string} Fator de vencimento com 4 dígitos (ex: "0001", "1000", "9999")
	 * @throws {Error} Para datas inválidas ou fora do range suportado
	 */
	Boleto.prototype.getFatorVencimento = function () {
		var vencimento = this.getDatas().getVencimento();
		
		// Validações básicas
		if (!vencimento || !(vencimento instanceof Date) || isNaN(vencimento.getTime())) {
			throw new Error('Data de vencimento inválida');
		}
		
		if (vencimento < DATA_BASE) {
			throw new Error('Data de vencimento não pode ser anterior a ' + DATA_BASE.toLocaleDateString('pt-BR'));
		}
		
		// Calcula diferença em dias desde a data base
		var diferencaEmDias = Math.floor((vencimento.getTime() - DATA_BASE.getTime()) / (1000 * 60 * 60 * 24));
		
		// Aplica lógica do ciclo conforme FEBRABAN
		var fatorVencimento = this._calcularFatorComCiclo(diferencaEmDias, vencimento);
		
		// Garante formato com 4 dígitos
		return fatorVencimento.toString().padStart(FATOR_VENCIMENTO.DIGITOS_FATOR, '0');
	};
	
	/**
	 * Calcula o fator considerando os ciclos definidos pela FEBRABAN
	 * @private
	 * @param {number} diasDesdeBase - Dias desde 07/10/1997
	 * @param {Date} dataVencimento - Data de vencimento do boleto
	 * @returns {number} Fator de vencimento calculado
	 */
	Boleto.prototype._calcularFatorComCiclo = function(diasDesdeBase, dataVencimento) {
		// Primeiro ciclo (1997-2025): usa valor direto até 9999
		if (diasDesdeBase <= FATOR_VENCIMENTO.LIMITE_MAXIMO) {
			return diasDesdeBase;
		}
		
		// Segundo ciclo (2025-2049): subtrai 10000 e soma 1000 (conforme FB-009/2023)
		if (dataVencimento <= FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO) {
			var fatorSegundoCiclo = (diasDesdeBase - FATOR_VENCIMENTO.CICLO_RESET) + FATOR_VENCIMENTO.INICIO_SEGUNDO_CICLO;
			
			// Valida se ainda está no range válido do segundo ciclo
			if (fatorSegundoCiclo > FATOR_VENCIMENTO.LIMITE_MAXIMO) {
				throw new Error('Data de vencimento excede o limite do segundo ciclo (até ' + 
					FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') + ')');
			}
			
			return fatorSegundoCiclo;
		}
		
		// Após 2052: aguardando nova definição FEBRABAN
		throw new Error('Data de vencimento após ' + 
			FATOR_VENCIMENTO.DATA_LIMITE_SEGUNDO_CICLO.toLocaleDateString('pt-BR') + 
			'. Aguardando nova especificação FEBRABAN para terceiro ciclo.');
	};

	Boleto.prototype.comEspecieMoeda = function (_especieMoeda) {
		this._especieMoeda = _especieMoeda;
		return this;
	};

	Boleto.prototype.getEspecieMoeda = function () {
		return this._especieMoeda;
	};

	Boleto.prototype.getCodigoEspecieMoeda = function () {
		return this._codigoEspecieMoeda;
	};

	Boleto.prototype.comCodigoEspecieMoeda = function (_codigoEspecieMoeda) {
		this._codigoEspecieMoeda = _codigoEspecieMoeda.toString();
		return this;
	};

	Boleto.prototype.getAceite = function () {
		return this._aceite;
	};

	Boleto.prototype.getAceiteFormatado = function () {
		return this._aceite ? 'S' : 'N';
	};

	Boleto.prototype.comAceite = function (_aceite) {
		this._aceite = _aceite;
		return this;
	};

	Boleto.prototype.getEspecieDocumento = function () {
		return this._especieDocumento;
	};

	Boleto.prototype.comEspecieDocumento = function (_especieDocumento) {
		this._especieDocumento = _especieDocumento;
		return this;
	};

	Boleto.prototype.getDatas = function () {
		return this._datas;
	};

	Boleto.prototype.comDatas = function (_datas) {
		this._datas = _datas;
		return this;
	};

	Boleto.prototype.getValorFormatado = function () {
		return formatarValor(this._valorBoleto);
	};

	Boleto.prototype.getValorFormatadoBRL = function () {
		return formatarBRL(this.getValorFormatado());
	};

	Boleto.prototype.getValorBoleto = function () {
		return this._valorBoleto;
	};

	Boleto.prototype.comValorBoleto = function (_valorBoleto) {
		if (_valorBoleto < 0) {
			throw new Error('Valor deve ser maior ou igual a zero');
		}

		if (_valorBoleto > 99999999.99) {
			throw new Error('Valor deve ser menor do que noventa e nove milhoes');
		}

		this._valorBoleto = _valorBoleto;
		return this;
	};

	Boleto.prototype.comValor = function (_valorBoleto) {
		this.comValorBoleto(_valorBoleto);
	};

	Boleto.prototype.getNumeroDoDocumentoFormatado = function () {
		return pad(this._numeroDoDocumento || '', 4, '0');
	};

	Boleto.prototype.getNumeroDoDocumento = function () {
		return this._numeroDoDocumento || '';
	};

	Boleto.prototype.comNumeroDoDocumento = function (_numeroDoDocumento) {
		this._numeroDoDocumento = _numeroDoDocumento;
		return this;
	};

	Boleto.prototype.getInstrucoes = function () {
		return this._instrucoes || [];
	};

	Boleto.prototype.comInstrucoes = function (_instrucoes) {
		if (arguments.length > 1) {
			_instrucoes = Array.prototype.slice.call(arguments, 0);
		}

		if (typeof _instrucoes === 'string') {
			_instrucoes = [_instrucoes];
		}

		if (_instrucoes.length > 5) {
			throw new Error('Máximo de cinco instruções permitidas');
		}

		this._instrucoes = _instrucoes;
		return this;
	};

	Boleto.prototype.getDescricoes = function () {
		return this._descricoes || [];
	};

	Boleto.prototype.comDescricoes = function (_descricoes) {
		if (arguments.length > 1) {
			_descricoes = Array.prototype.slice.call(arguments, 0);
		}

		if (typeof _descricoes === 'string') {
			_descricoes = [_descricoes];
		}

		if (_descricoes.length > 5) {
			throw new Error('Máximo de cinco instruções permitidas');
		}

		this._descricoes = _descricoes;
		return this;
	},

	Boleto.prototype.getLocaisDePagamento = function () {
		if (this._locaisDePagamento) return this._locaisDePagamento;
		if (this.getBanco().getLocaisDePagamentoPadrao) return this.getBanco().getLocaisDePagamentoPadrao();
		return [];
	};

	Boleto.prototype.comLocaisDePagamento = function (_locaisDePagamento) {
		if (arguments.length > 1) {
			_locaisDePagamento = Array.prototype.slice.call(arguments, 0);
		}

		if (typeof _locaisDePagamento === 'string') {
			_locaisDePagamento = [_locaisDePagamento];
		}

		if (_locaisDePagamento.length > 2) {
			throw new Error('Máximo de dois locais de pagamento permitidos');
		}

		this._locaisDePagamento = _locaisDePagamento;
		return this;
	};

	Boleto.prototype.getQuantidadeDeMoeda = function () {
		return this._quantidadeDeMoeda;
	};

	Boleto.prototype.comQuantidadeDeMoeda = function (_quantidadeDeMoeda) {
		this._quantidadeDeMoeda = _quantidadeDeMoeda;
		return this;
	};

	Boleto.prototype.getBanco = function () {
		return this._banco;
	};

	Boleto.prototype.comBanco = function (_banco) {
		this._banco = _banco;
		return this;
	};

	Boleto.prototype.getPagador = function () {
		return this._pagador;
	};

	Boleto.prototype.comPagador = function (_pagador) {
		this._pagador = _pagador;
		return this;
	};

	Boleto.prototype.getBeneficiario = function () {
		return this._beneficiario;
	};

	Boleto.prototype.comBeneficiario = function (_beneficiario) {
		this._beneficiario = _beneficiario;
		return this;
	};

	Boleto.prototype.getValorDescontosFormatadoBRL = function () {
		if (!this.getValorDescontos()) {
			return '';
		}

		return formatarBRL(formatarValor(this.getValorDescontos()));
	};

	Boleto.prototype.getValorDescontos = function () {
		return this._valorDescontos || 0;
	};

	Boleto.prototype.comValorDescontos = function (_valorDescontos) {
		this._valorDescontos = _valorDescontos;
		return this;
	};

	Boleto.prototype.getValorDeducoesFormatadoBRL = function () {
		if (!this.getValorDeducoes()) {
			return '';
		}

		return formatarBRL(formatarValor(this.getValorDeducoes()));
	};

	Boleto.prototype.getValorDeducoes = function () {
		return this._valorDeducoes || 0;
	};

	Boleto.prototype.comValorDeducoes = function (_valorDeducoes) {
		this._valorDeducoes = _valorDeducoes;
		return this;
	};

	Boleto.prototype.getValorMultaFormatadoBRL = function () {
		return formatarBRL(formatarValor(this.getValorMulta()));
	};

	Boleto.prototype.getValorMulta = function () {
		return this._valorMulta || 0;
	};

	Boleto.prototype.comValorMulta = function (_valorMulta) {
		this._valorMulta = _valorMulta;
		return this;
	};

	Boleto.prototype.getValorAcrescimosFormatadoBRL = function () {
		return formatarBRL(formatarValor(this.getValorAcrescimos()));
	};

	Boleto.prototype.getValorAcrescimos = function () {
		return this._valorAcrescimos || 0;
	};

	Boleto.prototype.comValorAcrescimos = function (_valorAcrescimos) {
		this._valorAcrescimos = _valorAcrescimos;
		return this;
	};
	
	Boleto.prototype.getLinhaDigitavelFormatado = function () {
		const numeroDocumento = this.getNumeroDoDocumentoFormatado();
		const linha = GeradorDeLinhaDigitavel(this._banco.geraCodigoDeBarrasPara(this), this._banco);
		const linhaDigitavel = {linha, numeroDocumento};
		return linhaDigitavel;
	};

	Boleto.novoBoleto = function () {
		return new Boleto()
			.comEspecieMoeda('R$')
			.comCodigoEspecieMoeda(9)
			.comAceite(false)
			.comEspecieDocumento('DV');
	};

	return Boleto;
})();

module.exports.Boleto = Boleto;
