const { Bancos, Boletos, StreamToPromise } = require('../lib/index');

const boleto = {
  banco: new Bancos.Cecred(),
  pagador: {
    nome: 'José Bonifácio de Andrada',
    RegistroNacional: '12345678',
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
      carteira: '09',
      convenio: '123456',
      agencia: '0101',
      agenciaDigito: '5',
      conta: '03264467',
      contaDigito: '0',
      nossoNumero: '00115290000000004',
      nossoNumeroDigito: '8',
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
      vencimento: '04/02/2026',
      processamento: '04/02/2025',
      documentos: '04/02/2025',
    },
  },
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

// Exemplo usando pdfFile() com tratamento de erro melhorado (PR #39)
console.log('🚀 Gerando boleto Cecred...');

novoBoleto
  .pdfFile('./tmp/boletos', 'boleto-cecred')
  .then(async ({ stream }) => {
    console.log('✅ PDF do Cecred gerado com sucesso!');
    console.log('📁 Arquivo salvo em: ./tmp/boletos/boleto-cecred.pdf');

    await StreamToPromise(stream);
  })
  .catch((error) => {
    console.error('❌ Erro ao gerar boleto Cecred:', error.message);
    console.error('🔧 Verifique os dados do boleto e permissões de diretório');

    // Com a correção do PR #39, agora temos acesso completo ao erro
    if (error.code) {
      console.error('📋 Código do erro:', error.code);
    }
  });
