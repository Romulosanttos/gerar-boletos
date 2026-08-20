/**
 * Exemplo completo de geração de boleto em HTML e PDF usando o template HTML
 *
 * Este exemplo mostra 3 formas de gerar boletos:
 * 1. HTML puro (arquivo .html)
 * 2. PDF a partir do HTML usando Puppeteer
 * 3. PDF tradicional usando PDFKit (método original)
 */

const { Boleto } = require('../lib');
const fs = require('fs');
const path = require('path');

// Criar diretório de saída se não existir
const outputDir = path.join(__dirname, '../tmp/boletos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Configuração do boleto
const configuracao = {
  banco: {
    codigo: '341',
    nome: 'Itaú Unibanco S.A.',
  },
  pagador: {
    nome: 'João da Silva Santos',
    cpf: '123.456.789-00',
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Apto 123',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    },
  },
  beneficiario: {
    nome: 'Empresa Exemplo LTDA',
    cnpj: '12.345.678/0001-00',
    agencia: '1234',
    conta: '56789',
    digitoConta: '0',
    endereco: {
      logradouro: 'Rua do Comércio',
      numero: '500',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01000-000',
    },
  },
  boleto: {
    numeroDocumento: '12345',
    especieDocumento: 'DM',
    valor: 1250.5,
    datas: {
      vencimento: '15/02/2026',
      documento: '06/01/2026',
      processamento: '06/01/2026',
    },
    carteira: '109',
    nossoNumero: '12345678',
    instrucoes: [
      'Não receber após o vencimento',
      'Multa de 2% após o vencimento',
      'Juros de mora de 1% ao mês',
      'Protestar após 10 dias do vencimento',
    ],
    locaisDePagamento: ['Pagável em qualquer banco até o vencimento'],
  },
};

async function gerarBoletos() {
  try {
    console.log('Iniciando geração de boletos...\n');

    // Criar instância do boleto
    const boleto = new Boleto(configuracao);

    // 1. Gerar HTML
    console.log('1. Gerando HTML...');
    const html = await boleto.gerarHTML({
      autor: 'Minha Empresa',
      titulo: 'Boleto Bancário',
      criador: 'Sistema de Cobrança v1.0',
      creditos: 'Gerado pelo sistema automatizado de cobrança',
    });
    const htmlPath = path.join(outputDir, 'boleto.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`   ✓ HTML salvo em: ${htmlPath}\n`);

    // 2. Gerar PDF a partir do HTML (requer puppeteer)
    console.log('2. Gerando PDF a partir do HTML...');
    try {
      const pdfFromHTMLPath = path.join(outputDir, 'boleto-from-html.pdf');
      await boleto.gerarPDFFromHTML({
        outputPath: pdfFromHTMLPath,
        autor: 'Minha Empresa',
        titulo: 'Boleto Bancário',
        format: 'A4',
        landscape: false,
        printBackground: true,
      });
      console.log(`   ✓ PDF (via HTML) salvo em: ${pdfFromHTMLPath}\n`);
    } catch (error) {
      if (error.message.includes('Puppeteer')) {
        console.log('   ⚠ Puppeteer não instalado. Execute: npm install puppeteer');
        console.log('   (Pulando geração de PDF via HTML)\n');
      } else {
        throw error;
      }
    }

    // 3. Gerar PDF tradicional (método original com PDFKit)
    console.log('3. Gerando PDF tradicional (PDFKit)...');
    const pdfTradicionalPath = path.join(outputDir, 'boleto-tradicional.pdf');
    const pdfStream = fs.createWriteStream(pdfTradicionalPath);
    await boleto.gerarPDF({ stream: pdfStream });
    console.log(`   ✓ PDF tradicional salvo em: ${pdfTradicionalPath}\n`);

    console.log('✅ Todos os boletos foram gerados com sucesso!');
    console.log(`\nArquivos gerados em: ${outputDir}`);
  } catch (error) {
    console.error('❌ Erro ao gerar boletos:', error.message);
    console.error(error);
  }
}

// Executar
gerarBoletos();
