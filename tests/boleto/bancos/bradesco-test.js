const PdfGerador = require('../../../lib/generators/pdf-generator');
const fs = require('fs');
const path = require('path');
const Boleto = require('../../../lib/core/boleto');
const Bradesco = require('../../../lib/banks/bradesco');
const geradorDeLinhaDigitavel = require('../../../lib/generators/line-formatter');
const Datas = require('../../../lib/core/datas');
const Endereco = require('../../../lib/core/endereco');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
let banco, boleto;
const test = require('ava');

test.before(() => {
  const dir = path.join('tmp', 'boletos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test.beforeEach((t) => {
  banco = new Bradesco();
  const datas = Datas.novasDatas();
  datas.comDocumento('02-04-2020');
  datas.comProcessamento('02-04-2020');
  datas.comVencimento('02-04-2020');
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Leonardo Bessa');
  beneficiario.comRegistroNacional('73114004652');
  beneficiario.comAgencia('2949');
  beneficiario.comDigitoAgencia('1');
  beneficiario.comCodigoBeneficiario('6580');
  beneficiario.comDigitoCodigoBeneficiario('3');
  beneficiario.comNumeroConvenio('1207113');
  beneficiario.comCarteira('6');
  beneficiario.comNossoNumero('3');
  beneficiario.comDigitoNossoNumero('7');
  const enderecoDoBeneficiario = Endereco.novoEndereco();
  enderecoDoBeneficiario.comLogradouro('Rua da Programação');
  enderecoDoBeneficiario.comBairro('Zona Rural');
  enderecoDoBeneficiario.comCep('71550050');
  enderecoDoBeneficiario.comCidade('Patos de Minas');
  enderecoDoBeneficiario.comUf('MG');
  beneficiario.comEndereco(enderecoDoBeneficiario);
  const pagador = Pagador.novoPagador();
  pagador.comNome('Fulano');
  pagador.comRegistroNacional('97264269604');
  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador.comEndereco(enderecoDoPagador);
  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValor(1);
  boleto.comNumeroDoDocumento('4323');
  boleto.comLocaisDePagamento([
    'Pagável preferencialmente na rede Bradesco ou no Bradesco expresso',
  ]);
});

test('Nosso número formatado deve ter 11 digitos', (t) => {
  const nossoNumero = banco.getNossoNumeroFormatado(boleto.getBeneficiario());
  t.is(nossoNumero.length, 11);
  t.is(nossoNumero, '00000000003');
});

test('Carteira formatado deve ter dois dígitos', (t) => {
  const carteiraFormatado = banco.getCarteiraFormatado(boleto.getBeneficiario());
  t.is(carteiraFormatado.length, 2);
  t.is(carteiraFormatado, '06');
});

test('Conta corrente formatada deve ter sete dígitos', (t) => {
  const codigoFormatado = banco.getCodigoFormatado(boleto.getBeneficiario());
  t.is(codigoFormatado.length, 7);
  t.is(codigoFormatado, '0006580');
});

test('Testa geração de linha digitavel', (t) => {
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '23792.94909 60000.000004 03000.658009 9 81550000000100';
  t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
});

test('Testa código de barras', (t) => {
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.is(codigoDeBarras, '23799815500000001002949060000000000300065800');
});

test('Verifica nome correto do banco', (t) => {
  t.is(banco.getNome(), 'Banco Bradesco S.A.');
});

test('Verifica a numeração correta do banco', (t) => {
  t.is(banco.getNumeroFormatadoComDigito(), '237-2');
});

test('Verifica que arquivo de imagem do logotipo existe', (t) => {
  t.truthy(fs.existsSync(banco.getImagem()));
});

test('Verifica deve imprimir o nome do banco no boleto', (t) => {
  t.truthy(!banco.getImprimirNome());
});

test('Exibir campo CIP retorna verdadeiro', (t) => {
  t.is(banco.exibirCampoCip(), true);
});

test('Verifica criação de pdf', async (t) => {
  const dir = path.join('tmp', 'boletos');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    // Diretório já existe, ignora
  }
  await new PdfGerador(boleto).pdfFile('../../tmp/boletos/boleto-bradesco.pdf');
  const expectedPath = path.join('tmp', 'boletos', 'boleto-bradesco.pdf');
  t.truthy(fs.existsSync(expectedPath));
  try {
    fs.unlinkSync(expectedPath);
  } catch (err) {
    // Arquivo não existe, ignora
  }
  t.pass();
});
