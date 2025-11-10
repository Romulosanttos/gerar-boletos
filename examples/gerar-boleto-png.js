const { Bancos, Boletos } = require('../lib/index');

const boleto = {
  banco: new Bancos.Bradesco(),
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
      agencia: '0101',
      agenciaDigito: '5',
      conta: '0326446',
      contaDigito: '0',
      nossoNumero: '00000000061',
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
      processamento: '04/02/2020',
      documentos: '04/02/2020',
    },
  },
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

console.log('🖼️  Gerando boleto em PNG...');

// Gerar PNG direto em arquivo
novoBoleto
  .pngFile('./tmp/boletos', 'boleto', { scale: 2.0 })
  .then((filePaths) => {
    console.log('✅ Boleto PNG gerado com sucesso!');
    filePaths.forEach((path) => console.log(`📁 ${path}`));
  })
  .catch((error) => {
    console.error('❌ Erro ao gerar boleto:', error.message);
  });
