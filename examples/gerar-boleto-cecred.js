import Gerador from '../index';
import fs from 'fs';
import createBoleto from './criarBoleto';


const init = () => {
	const banco = new Gerador.boleto.bancos.Cecred();
	const pagador = {
		RegistroNacional: '12345678'
	};
	const boleto_info = {
		valor: 100.00,
		datas: {
			vencimento: '02-04-2020',
			processamento: '02-04-2019',
			documentos: '02-04-2019'
		}
	};
	const boleto = createBoleto(banco, pagador, boleto_info);

	const dir = './tmp/boletos';
	if(!fs.existsSync(dir)) fs.mkdirSync(dir);
	const writeStream = fs.createWriteStream(`${dir}/boleto-cecred.pdf`);


	new Gerador.boleto.Gerador(boleto).gerarPDF({
		creditos: '',
		stream: writeStream
	}, (err) => {
		// eslint-disable-next-line no-console
		if(err) return console.error(err);
	});
};


init();
