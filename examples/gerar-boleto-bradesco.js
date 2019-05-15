import Gerador from '../index';
import { gerarPdf, gerarBoleto} from './index';
import streamToPromise from '../lib/utils/util';


const boleto = {
	banco: new Gerador.boleto.bancos.Bradesco(),
	pagador: { RegistroNacional: '12345678' },
	beneficiario: {
		dadosBancarios:{
			carteira: '09',
			agencia: '0101',
			agenciaDigito: '5',
			conta: '0326446',
			contaDigito: '0' ,
			nossoNumero: '00000000061',
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
