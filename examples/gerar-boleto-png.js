const { Bancos, Boletos } = require('../lib/index');

// String PIX EMV de exemplo (substitua pela string real retornada pelo banco)
const pixEmvExemplo =
  '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff6b2f8cd520400005303986540510.005802BR5913EMPRESA LTDA6014BELO HORIZONTE62070503***6304AD38';

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
    const nomeBanco = 'bradesco';

    console.log('🖼️  Gerando boleto em PNG com PIX...');

    // Gerar apenas PNG (sem PDF)
    const pngPaths = await novoBoleto.pngFile('./tmp/boletos', nomeBanco, { scale: 2.0 });

    console.log('✅ Boleto PNG gerado com sucesso!');
    pngPaths.forEach((path) => console.log(`📁 ${path}`));

    // Exemplo: Gerar PNG em memória (sem salvar em arquivo)
    console.log('\n💾 Gerando PNG em memória...');
    const images = await novoBoleto.pngBuffer({ scale: 3.0 });
    console.log(`✅ ${images.length} página(s) gerada(s) em buffer`);
    images.forEach(({ page, buffer }) => {
      console.log(`   Página ${page}: ${(buffer.length / 1024).toFixed(2)} KB`);
    });
  } catch (error) {
    console.error('❌ Erro ao gerar boleto:', error.message);
  }
}

gerarBoletos();
