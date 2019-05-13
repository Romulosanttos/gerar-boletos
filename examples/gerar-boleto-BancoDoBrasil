import Gerador from '../index';
import fs from 'fs';
import createBoleto from './criarBoleto';


const init = () => {
	const boleto = {
		banco: new Gerador.boleto.bancos.BancoBrasil(),
		pagador: { RegistroNacional: '12345678' },
		beneficiario: {
			dadosBancarios:{
				carteira: '09',
				agencia: '18455',
				agenciaDigito: '4',
				conta: '1277165',
				contaDigito: '1' ,
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
