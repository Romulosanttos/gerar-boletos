const { Bancos, Boletos, streamToPromise } = require('../lib/index');
const QrCode = require("qrcode");

gerarBoletoBB();

async function gerarBoletoBB(){
  const boleto = {
    banco: new Bancos.BancoBrasil(),
    pagador: {
      nome: 'José Bonifácio de Andrada',
      registroNacional: '12345678',
      endereco: {
        logradouro: 'Rua Pedro Lessa, 15',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estadoUF: 'RJ',
        cep: '20030-030'
      }
    },
    instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
    beneficiario: {
      nome: 'Empresa Fictícia LTDA',
      cnpj:'43576788000191',
      dadosBancarios: {
        carteira: '09',
        agencia: '18455',
        agenciaDigito: '4',
        conta: '1277165',
        contaDigito: '1',
        nossoNumero: '00000000061',
        nossoNumeroDigito: '8'
      },
      endereco: {
        logradouro: 'Rua Pedro Lessa, 15',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        estadoUF: 'RJ',
        cep: '20030-030'
      }
    },
    boleto: {
      numeroDocumento: '1001',
      especieDocumento: 'DM',
      valor: 110.00,
      datas: {
        vencimento: '02-04-2020',
        processamento: '02-04-2019',
        documentos: '02-04-2019'
      },
      emv: "teste.com.br", //preencher aqui com o texto do Pix Copia e Copia,
      imagemQrCode: "",
    }
  };

  if (boleto.boleto.emv){
    boleto.boleto.imagemQrCode = await gerarQrCodePix(boleto.boleto.emv);
  }

  const novoBoleto = new Boletos(boleto);
  novoBoleto.gerarBoleto();

  novoBoleto.pdfFile().then(async ({ stream }) => {
    // ctx.res.set('Content-type', 'application/pdf');	
    await streamToPromise(stream);
  }).catch((error) => {
    return error;
  });
}

async function gerarQrCodePix(emv) {
  return QrCode.toDataURL(emv, { errorCorrectionLevel: "H" });
}
