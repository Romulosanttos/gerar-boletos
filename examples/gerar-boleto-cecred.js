const Gerador = require('../index');
const { gerarPdf, gerarBoleto} = require('./index');
const streamToPromise = require('../lib/utils/util');

const boleto = {
	banco: new Gerador.boleto.bancos.Cecred(),
	pagador: { RegistroNacional: '12345678' },
	beneficiario: {
		dadosBancarios:{
			carteira: '09',
			convenio: '123456',
			agencia: '0101',
			agenciaDigito: '5',
			conta: '03264467',
			contaDigito: '0' ,
			nossoNumero: '00115290000000004',
			nossoNumeroDigito: '8'
		}
	},
	boleto: {
		numeroDocumento: '1001',
		especieDocumento: 'DM',
		valor: 110.00,
		datas: {
			vencimento: '02-04-2020',
			processamento:  '02-04-2019',
			documentos: '02-04-2019'
		}
	}
};
	
const novoBoleto = gerarBoleto(boleto);
gerarPdf(novoBoleto).then(async({stream})=>{
	// ctx.res.set('Content-type', 'application/pdf');	
	await streamToPromise(stream);
}).catch((error)=>{
	return error;
});
