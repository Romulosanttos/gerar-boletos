const { Bancos, Boletos } = require('../lib/index');

// String PIX EMV de exemplo (substitua pela string real retornada pelo banco)
const pixEmvExemplo =
  '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2f8cd520400005303986540510.005802BR5913EMPRESA LTDA6014BELO HORIZONTE62070503***6304AD38';

// Exemplo de boleto Sicredi demonstrando as correções do PR #38
const boleto = {
  banco: new Bancos.Sicredi(),
  pagador: {
    nome: 'Maria Aparecida Santos',
    RegistroNacional: '98765432100',
    endereco: {
      logradouro: 'Rua das Flores, 789',
      bairro: 'Centro',
      cidade: 'Porto Alegre',
      estadoUF: 'RS',
      cep: '90000-000',
    },
  },
  instrucoes: [
    'Não receber após vencimento',
    'Juros de 0,033% ao dia após vencimento',
    'Multa de 2% após vencimento',
  ],
  beneficiario: {
    nome: 'Cooperativa de Crédito Rural LTDA',
    cnpj: '12345678000195',
    dadosBancarios: {
      carteira: '1', // Sicredi usa carteira de 1 dígito
      agencia: '0123',
      conta: '45678', // Código do beneficiário
      nossoNumero: '12345678', // 8 dígitos
      nossoNumeroDigito: '9',
    },
    endereco: {
      logradouro: 'Av. Cooperativismo, 123',
      bairro: 'Distrito Industrial',
      cidade: 'Porto Alegre',
      estadoUF: 'RS',
      cep: '91000-000',
    },
  },
  boleto: {
    numeroDocumento: '2001',
    especieDocumento: 'DM',
    valor: 250.75,
    datas: {
      vencimento: '12/15/2025',
      processamento: '11/01/2025',
      documentos: '11/01/2025',
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
    const nomeBanco = 'sicredi';

    console.log('🌱 Gerando boleto Sicredi com PIX...');

    // Gerar PDF
    const { filePath: pdfPath } = await novoBoleto.pdfFile('./tmp/boletos', nomeBanco);
    console.log(`✅ PDF gerado: ${pdfPath}`);

    // Gerar PNG
    const pngPaths = await novoBoleto.pngFile('./tmp/boletos', nomeBanco, { scale: 2.0 });
    console.log(`🖼️  PNG gerado: ${pngPaths.join(', ')}`);
  } catch (error) {
    console.error('❌ Erro ao gerar boleto:', error.message);

    if (error.message.includes('44')) {
      console.error('🔧 Erro no código de barras. Verifique os dados do beneficiário.');
    }
  }
}

gerarBoletos();
