const fs = require('fs');
const path = require('path');
const Boleto = require('../lib');

// Configuração do boleto
const configuracao = {
  banco: {
    codigo: '001',
    nome: 'Banco do Brasil',
    agencia: '1234-5',
    conta: '12345678',
    digito: '9',
  },
  pagador: {
    nome: 'João da Silva',
    cpf: '123.456.789-00',
    endereco: {
      logradouro: 'Rua das Flores, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01234-567',
    },
  },
  beneficiario: {
    nome: 'Empresa XPTO Ltda',
    cnpj: '12.345.678/0001-90',
    endereco: {
      logradouro: 'Av. Paulista, 1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
    },
    agencia: '1234',
    conta: '12345678',
    digito: '9',
  },
  boleto: {
    valor: 1250.0,
    numeroDoDocumento: '00001',
    especieDocumento: 'DM',
    aceite: 'N',
    datas: {
      vencimento: '15/01/2026',
      documento: '06/01/2026',
      processamento: '06/01/2026',
    },
    carteira: '109',
    nossoNumero: '12345678',
    instrucoes: [
      'Não receber após o vencimento',
      'Multa de 2% após o vencimento',
      'Juros de mora de 1% ao mês',
    ],
  },
};

// Argumentos compatíveis com gerarPDF
const args = {
  // Metadados do documento
  autor: 'Sistema de Cobrança XPTO',
  titulo: 'Boleto Bancário - Documento 00001',
  criador: 'Módulo de Cobrança v2.0',
  creditos: 'Gerado automaticamente pelo sistema de cobrança',

  // Argumentos específicos para PDF (quando usar gerarPDFFromHTML)
  format: 'A4',
  landscape: false,
  printBackground: true,
  margin: {
    top: '0mm',
    right: '0mm',
    bottom: '0mm',
    left: '0mm',
  },
};

async function gerarBoletosComArgs() {
  try {
    console.log('='.repeat(60));
    console.log('DEMONSTRAÇÃO: Usando mesmos args em todos os métodos');
    console.log('='.repeat(60));
    console.log();

    const boleto = new Boleto(configuracao);
    const outputDir = path.join(__dirname, '..', 'tmp', 'boletos');

    // Garantir que o diretório existe
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Gerar PDF tradicional (PDFKit)
    console.log('1. Gerando PDF tradicional com args...');
    const pdfPath = path.join(outputDir, 'boleto-tradicional-com-args.pdf');
    const pdfStream = fs.createWriteStream(pdfPath);
    await boleto.gerarPDF({
      ...args,
      stream: pdfStream,
    });
    console.log(`   ✓ PDF salvo em: ${pdfPath}`);
    console.log(`   - Autor: ${args.autor}`);
    console.log(`   - Título: ${args.titulo}`);
    console.log();

    // 2. Gerar HTML com os mesmos args
    console.log('2. Gerando HTML com args...');
    const html = await boleto.gerarHTML(args);
    const htmlPath = path.join(outputDir, 'boleto-com-args.html');
    fs.writeFileSync(htmlPath, html, 'utf-8');
    console.log(`   ✓ HTML salvo em: ${htmlPath}`);
    console.log(`   - Autor: ${args.autor}`);
    console.log(`   - Título: ${args.titulo}`);
    console.log();

    // 3. Gerar PDF a partir do HTML com os mesmos args
    console.log('3. Gerando PDF a partir do HTML com args...');
    try {
      const pdfFromHTMLPath = path.join(outputDir, 'boleto-html-com-args.pdf');
      await boleto.gerarPDFFromHTML({
        ...args,
        outputPath: pdfFromHTMLPath,
      });
      console.log(`   ✓ PDF (via HTML) salvo em: ${pdfFromHTMLPath}`);
      console.log(`   - Autor: ${args.autor}`);
      console.log(`   - Título: ${args.titulo}`);
      console.log(`   - Formato: ${args.format}`);
      console.log();
    } catch (error) {
      if (error.message.includes('Puppeteer')) {
        console.log('   ⚠ Puppeteer não instalado. Execute: npm install puppeteer');
        console.log();
      } else {
        throw error;
      }
    }

    // 4. Demonstrar uso sem args (valores padrão)
    console.log('4. Gerando HTML sem args (padrões)...');
    const htmlSemArgs = await boleto.gerarHTML();
    const htmlSemArgsPath = path.join(outputDir, 'boleto-sem-args.html');
    fs.writeFileSync(htmlSemArgsPath, htmlSemArgs, 'utf-8');
    console.log(`   ✓ HTML salvo em: ${htmlSemArgsPath}`);
    console.log('   - Usando valores padrão');
    console.log();

    console.log('='.repeat(60));
    console.log('✓ Todos os boletos foram gerados com sucesso!');
    console.log('='.repeat(60));
    console.log();
    console.log('RESUMO:');
    console.log('- Os métodos gerarHTML() e gerarPDFFromHTML() agora aceitam');
    console.log('  os mesmos argumentos que gerarPDF()');
    console.log('- Args suportados: autor, titulo, criador, creditos');
    console.log('- gerarPDFFromHTML() também aceita: format, landscape,');
    console.log('  printBackground, margin, outputPath, stream');
    console.log();
  } catch (error) {
    console.error('Erro ao gerar boletos:', error);
    process.exit(1);
  }
}

// Executar
gerarBoletosComArgs();
