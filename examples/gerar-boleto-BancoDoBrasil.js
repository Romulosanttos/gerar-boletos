const { Bancos, Boletos, StreamToPromise } = require('../lib/index');

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
      cep: '20030-030',
    },
  },
  instrucoes: ['Após o vencimento Mora dia R$ 1,59', 'Após o vencimento, multa de 2%'],
  beneficiario: {
    nome: 'Empresa Fictícia LTDA',
    cnpj: '43576788000191',
    dadosBancarios: {
      carteira: '09',
      agencia: '18455',
      agenciaDigito: '4',
      conta: '1277165',
      contaDigito: '1',
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
      vencimento: '02-04-2020',
      processamento: '02-04-2019',
      documentos: '02-04-2019',
    },
  },
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

// Exemplo com tratamento de erro melhorado (PR #39)
console.log('🏛️ Gerando boleto Banco do Brasil...');

// Demonstrando diferentes formas de uso
async function gerarBoleto() {
  try {
    // Usando pdfFile com async/await
    const { stream } = await novoBoleto.pdfFile('./tmp/boletos', 'boleto-bb');

    console.log('✅ PDF do Banco do Brasil gerado com sucesso!');
    console.log('📁 Arquivo salvo em: ./tmp/boletos/boleto-bb.pdf');

    await StreamToPromise(stream);
  } catch (error) {
    console.error('❌ Erro ao gerar boleto Banco do Brasil:', error.message);

    switch (error.code) {
      case 'ENOENT':
        console.error('📂 Diretório não encontrado. Verifique o caminho especificado.');
        break;
      case 'EACCES':
        console.error('🔒 Sem permissão para escrever no diretório.');
        break;
      default:
        console.error('🔧 Erro desconhecido. Verifique os dados do boleto.');
        if (error.stack) {
          console.error('📋 Stack trace:', error.stack.split('\n')[0]);
        }
    }
  }
}

// Executar a função
gerarBoleto();
