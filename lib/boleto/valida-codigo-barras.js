module.exports.validar = function(codigoDeBarras) {
	if (codigoDeBarras.length != 44) {
		const errorMessage = ['Erro na geração do código de barras.',
			'Número de dígitos diferente de 44.',
			'Verifique se todos os dados foram preenchidos corretamente.',
			'Tamanho encontrado: ' + codigoDeBarras.length,
			'Valor encontrado: ' + codigoDeBarras
		].join(' ');
		throw new Error(errorMessage);
	}

};
