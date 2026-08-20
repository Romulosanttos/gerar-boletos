const { Boleto } = require('../lib');
const fs = require('fs');
const path = require('path');

// Exemplo de configuração do boleto
const boleto = new Boleto({
  banco: {
    codigo: '341',
    nome: 'Itaú',
  },
  pagador: {
    nome: 'Fulano de Tal 2',
    cpf: '123.123.123-00',
    endereco: {
      logradouro: 'Av. André Araujo',
      numero: '999',
      bairro: 'Aleixo',
      cidade: 'Manaus',
      uf: 'AM',
      cep: '69060-000',
    },
  },
  beneficiario: {
    nome: 'Fulano de Tal',
    cpf: '123.456.789-10',
    agencia: '123',
    conta: '54321',
    digitoConta: '01',
    endereco: {
      logradouro: 'Rua Suvaco da Cobra',
      numero: '9',
      bairro: 'Narnia',
      cidade: 'Manaus',
      uf: 'AM',
      cep: '69060-000',
    },
  },
  boleto: {
    numeroDocumento: '123',
    especieDocumento: 'DM',
    valor: 10.99,
    datas: {
      vencimento: '02/01/2001',
      documento: '01/01/2001',
      processamento: '01/01/2001',
    },
    carteira: '157',
    nossoNumero: '123456789',
    instrucoes: ['Sr. Caixa, não receber após o vencimento', 'Protestar após 5 dias do vencimento'],
  },
});

// Gerar HTML
(async () => {
  try {
    const html = await boleto.gerarHTML();

    // Salvar em arquivo
    const outputPath = path.join(__dirname, '../tmp/boleto.html');
    fs.writeFileSync(outputPath, html, 'utf-8');

    console.log('HTML gerado com sucesso:', outputPath);
    console.log('\nPara converter para PDF, você pode:');
    console.log('1. Abrir o HTML no navegador e usar "Imprimir para PDF"');
    console.log('2. Usar puppeteer (npm install puppeteer)');
    console.log('3. Usar html-pdf-node (npm install html-pdf-node)');
  } catch (error) {
    console.error('Erro ao gerar HTML:', error);
  }
})();
