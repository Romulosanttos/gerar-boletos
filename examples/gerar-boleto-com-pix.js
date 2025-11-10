const { Bancos, Boletos, StreamToPromise } = require('../lib/index');

/**
 * Exemplo de geração de boleto com QR Code PIX
 *
 * IMPORTANTE: O código PIX EMV deve ser obtido do banco após o registro do boleto.
 * Este é apenas um exemplo ilustrativo.
 *
 * Para usar em produção:
 * 1. Registre o boleto no banco
 * 2. Solicite a geração do PIX vinculado ao boleto
 * 3. O banco retornará uma string EMV (formato: 00020126...)
 * 4. Use essa string no campo pixEmv do boleto
 */

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
    // Objeto PIX com código EMV e instruções
    pixEmv: {
      emv: pixEmvExemplo,
      instrucoes: ['Pague via PIX usando o QR Code ao lado', 'Instantâneo, seguro e sem taxas'],
    },
  },
};

const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

console.log('🏦 Gerando boleto com QR Code PIX...');

novoBoleto
  .pdfFile('./tmp/boletos', 'boleto-com-pix')
  .then(async ({ stream }) => {
    console.log('✅ Boleto com QR Code PIX gerado com sucesso!');
    console.log('📁 Arquivo salvo em: ./tmp/boletos/boleto-com-pix.pdf');
    console.log('\n💡 NOTA: Esta é uma demonstração. Use um código PIX EMV real em produção.');

    await StreamToPromise(stream);
  })
  .catch((error) => {
    console.error('❌ Erro ao gerar boleto:', error.message);

    if (error.code === 'ENOENT') {
      console.error('📂 Erro: Diretório não encontrado. Criando automaticamente...');
    } else if (error.code === 'EACCES') {
      console.error('🔒 Erro: Sem permissão para escrever no diretório');
    }

    console.error('🔧 Sugestão: Verifique os dados bancários e permissões do sistema');
  });
