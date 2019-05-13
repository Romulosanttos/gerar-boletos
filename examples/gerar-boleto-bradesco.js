import Gerador from '../index';
import fs from 'fs';
import createBoleto from './criarBoleto';


const init = () => {
	const boleto = {
		banco: new Gerador.boleto.bancos.Bradesco(),
		pagador: { RegistroNacional: '12345678' },
		beneficiario: {
			dadosBancarios:{
				carteira: '09',
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
	const novoBoleto = createBoleto(boleto);

	const dir = './tmp/boletos';
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	const writeStream = fs.createWriteStream(`${dir}/boleto-bradesco.pdf`);


	new Gerador.boleto.Gerador(novoBoleto).gerarPDF({
		creditos: '',
		stream: writeStream
	}, (err) => {
		// eslint-disable-next-line no-console
		if (err) return console.error(err);
	});
};


init();
