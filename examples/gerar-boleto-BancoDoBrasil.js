const { Bancos, Boletos } = require('../lib/index');

// String PIX EMV de exemplo (substitua pela string real retornada pelo banco)
const pixEmvExemplo =
  '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2f8cd520400005303986540510.005802BR5913EMPRESA LTDA6014BELO HORIZONTE62070503***6304AD38';

const boleto = {
  banco: new Bancos.BancoDoBrasil(),
  pagador: {
    nome: 'José Bonifácio de Andrada',
    registroNacional: '12345678',
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030',
    },
  },
  instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
  beneficiario: {
    nome: 'Empresa Fictícia LTDA',
    cnpj: '43576788000191',
    dadosBancarios: {
      carteira: '17',
      convenio: '1234567', // Convênio de 7 dígitos
      agencia: '1845',
      agenciaDigito: '4',
      conta: '12771',
      contaDigito: '6',
      nossoNumero: '12345678901234567', // 17 dígitos para convênio de 7 dígitos
      nossoNumeroDigito: '5',
    },
    endereco: {
      logradouro: 'Rua Pedro Lessa, 15',
      bairro: 'Centro',
      cidade: 'Rio de Janeiro',
      estadoUF: 'RJ',
      cep: '20030-030',
    },
  },
  boleto: {
    numeroDocumento: '1001',
    especieDocumento: 'DM',
    valor: 110.0,
    datas: {
      vencimento: '02-04-2026',
      processamento: '02-04-2025',
      documentos: '02-04-2025',
    },
    pixEmv: {
      emv: pixEmvExemplo,
      instrucoes: ['Pague via PIX usando o QR Code.'],
    },
  },
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

async function gerarBoletos() {
  try {
    const nomeBanco = 'banco-do-brasil';

    console.log('🏛️  Gerando boleto Banco do Brasil com PIX...');

    // Gerar PDF
    const { filePath: pdfPath } = await novoBoleto.pdfFile('./tmp/boletos', nomeBanco);
    console.log(`✅ PDF gerado: ${pdfPath}`);

    // Gerar PNG
    const pngPaths = await novoBoleto.pngFile('./tmp/boletos', nomeBanco, { scale: 2.0 });
    console.log(`🖼️  PNG gerado: ${pngPaths.join(', ')}`);
  } catch (error) {
    console.error('❌ Erro ao gerar boleto:', error.message);
  }
}

gerarBoletos();
