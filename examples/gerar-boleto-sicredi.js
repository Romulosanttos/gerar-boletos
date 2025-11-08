const { Bancos, Boletos, StreamToPromise } = require('../lib/index');

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
      cep: '90000-000'
    }
  },
  instrucoes: [
    'Não receber após vencimento',
    'Juros de 0,033% ao dia após vencimento',
    'Multa de 2% após vencimento'
  ],
  beneficiario: {
    nome: 'Cooperativa de Crédito Rural LTDA',
    cnpj: '12345678000195',
    dadosBancarios: {
      carteira: '1',              // Sicredi usa carteira de 1 dígito
      agencia: '0123',
      conta: '45678',             // Código do beneficiário
      nossoNumero: '12345678',    // 8 dígitos
      nossoNumeroDigito: '9'
      // Não definimos codposto propositalmente para demonstrar a correção do PR #38
    },
    endereco: {
      logradouro: 'Av. Cooperativismo, 123',
      bairro: 'Distrito Industrial',
      cidade: 'Porto Alegre',
      estadoUF: 'RS',
      cep: '91000-000'
    }
  },
  boleto: {
    numeroDocumento: '2001',
    especieDocumento: 'DM',
    valor: 250.75,
    datas: {
      vencimento: '12/15/2025',
      processamento: '11/01/2025',
      documentos: '11/01/2025'
    }
  }
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

console.log('🌱 Gerando boleto Sicredi...');

// Exemplo usando pdfFile com tratamento de erro melhorado (PR #39)
novoBoleto.pdfFile('./tmp/boletos', 'boleto-sicredi').then(async ({ stream }) => {
  console.log('✅ PDF do Sicredi gerado com sucesso!');
  console.log('📁 Arquivo salvo em: ./tmp/boletos/boleto-sicredi.pdf');
  
  await StreamToPromise(stream);
  
}).catch((error) => {
  console.error('❌ Erro ao gerar boleto Sicredi:', error.message);
  
  if (error.message.includes('44')) {
    console.error('🔧 Erro no código de barras. Verifique os dados do beneficiário.');
  } else if (error.message.includes('getCodposto')) {
    console.error('🔧 Erro relacionado ao código do posto. (Já corrigido no PR #38)');
  }
  
  console.error('📋 Para o Sicredi, certifique-se de que:');
  console.error('   - Carteira tem 1 dígito');
  console.error('   - Nosso número tem 8 dígitos');
  console.error('   - Código do beneficiário está correto');
});

console.log('\n📄 Exemplo alternativo usando pdfStream:');

const fs = require('fs');
const streamOutput = fs.createWriteStream('./tmp/boletos/sicredi-stream.pdf');

novoBoleto.pdfStream(streamOutput).then(async ({ stream }) => {
  console.log('✅ PDF via stream gerado com sucesso!');
  console.log('📁 Arquivo: ./tmp/boletos/sicredi-stream.pdf');
  
  await StreamToPromise(stream);
  
}).catch((error) => {
  console.error('❌ Erro no pdfStream:', error.message);
  
  if (error.code) {
    console.error('🔧 Código do erro:', error.code);
  }
});