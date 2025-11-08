const { Bancos, Boletos, StreamToPromise } = require('../lib/index');

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

console.log('🏦 Gerando boleto Bradesco...');

novoBoleto
  .pdfFile('./tmp/boletos', 'boleto-bradesco')
  .then(async ({ stream }) => {
    console.log('✅ PDF do Bradesco gerado com sucesso!');
    console.log('📁 Arquivo salvo em: ./tmp/boletos/boleto-bradesco.pdf');

    await StreamToPromise(stream);
  })
  .catch((error) => {
    console.error('❌ Erro ao gerar boleto Bradesco:', error.message);

    if (error.code === 'ENOENT') {
      console.error('📂 Erro: Diretório não encontrado. Criando automaticamente...');
    } else if (error.code === 'EACCES') {
      console.error('🔒 Erro: Sem permissão para escrever no diretório');
    }

    console.error('🔧 Sugestão: Verifique os dados bancários e permissões do sistema');
  });
