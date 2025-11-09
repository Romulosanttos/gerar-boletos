const PdfGerador = require('../../../lib/generators/pdf-generator');
const fs = require('fs');
const Boleto = require('../../../lib/core/boleto');
const Sicoob = require('../../../lib/banks/sicoob');
const Datas = require('../../../lib/core/datas');
const Endereco = require('../../../lib/core/endereco');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
let banco, boleto, beneficiario;
const test = require('ava');

test.beforeEach((t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('02-01-2016');
  datas.comProcessamento('02-01-2016');
  datas.comVencimento('02-10-2016');
  const pagador = Pagador.novoPagador();
  pagador.comNome('BASILIO ANTONIO CAMPANHOLO');
  pagador.comRegistroNacional('26018683172');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
  beneficiario.comRegistroNacional('21202793000100');
  beneficiario.comAgencia('4155');
  beneficiario.comCarteira('1');
  beneficiario.comCodigoBeneficiario('101060');
  beneficiario.comNossoNumero('515');
  beneficiario.comDigitoNossoNumero('8');
  banco = new Sicoob();
  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(1200);
  boleto.comNumeroDoDocumento(103);
});

// Testes originalmente comentados - não estavam ativos no nodeunit
// test('Nosso número formatado deve ter oito digitos', (t) => {
//   var beneficiario = Beneficiario.novoBeneficiario().comNossoNumero('9000206'),
//     numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);
//   t.is(numeroFormatado.length, 7);
//   t.is(numeroFormatado, '9000206');
// });

// test('Carteira formatado deve ter três dígitos', (t) => {
//   var beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
//     numeroFormatado = banco.getCarteiraFormatado(beneficiario);
//   t.is(numeroFormatado.length, 1);
//   t.is(numeroFormatado, '1');
// });

// test('Conta corrente formatada deve ter cinco dígitos', (t) => {
//   var numeroFormatado = banco.getCodigoFormatado(beneficiario);
//   t.is(numeroFormatado.length, 7);
//   t.is(numeroFormatado, '0101060');
// });

// Testes originalmente comentados - estavam inativos no nodeunit original
// test('Verifica geração da linha digitável - 1', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.57213 89766.660164 74514.590004 6 56550000268016';
//   t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
// });

// test('Verifica geração da linha digitável - 2', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(20, 03, 2014);
//   datas.comProcessamento(20, 03, 2014);
//   datas.comVencimento(10, 04, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comNome('Mario Amaral');
//   beneficiario.comAgencia('8462');
//   beneficiario.comCarteira('174');
//   beneficiario.comCodigoBeneficiario('05825');
//   beneficiario.comNossoNumero('00015135');
//   beneficiario.comDigitoNossoNumero('6');
//   pagador = Pagador.novoPagador();
//   pagador.comNome('Rodrigo de Sousa');
//   boleto = Boleto.novoBoleto();
//   boleto.comDatas(datas);
//   boleto.comBeneficiario(beneficiario);
//   boleto.comBanco(banco);
//   boleto.comPagador(pagador);
//   boleto.comValorBoleto(2680.16);
//   boleto.comNumeroDoDocumento('575');
//   boleto.comBanco(banco);
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.74002 01513.568467 20582.590004 6 60290000268016';
//   t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
// });

// test('Verifica geração da linha digitável - 3', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(21, 5, 2014);
//   datas.comProcessamento(21, 5, 2014);
//   datas.comVencimento(21, 5, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('181');
//   beneficiario.comAgencia('654');
//   beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
//   beneficiario.comNossoNumero('94588021');
//   beneficiario.comDigitoNossoNumero('4');
//   pagador = Pagador.novoPagador();
//   boleto = Boleto.novoBoleto();
//   boleto.comEspecieDocumento('DSI');
//   boleto.comDatas(datas);
//   boleto.comBeneficiario(beneficiario);
//   boleto.comBanco(banco);
//   boleto.comPagador(pagador);
//   boleto.comValorBoleto(575);
//   boleto.comNumeroDoDocumento('1');
//   boleto.comBanco(banco);
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.81940 58802.140655 40871.130007 4 60700000057500',
//     linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
//   t.is(linhaEsperada, linhaGerada);
// });

// test('Verifica geração da linha digitável - 4', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(29, 5, 2014);
//   datas.comProcessamento(29, 5, 2014);
//   datas.comVencimento(23, 6, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
//   beneficiario.comNossoNumero('89605074');
//   beneficiario.comDigitoNossoNumero('2');
//   pagador = Pagador.novoPagador();
//   boleto = Boleto.novoBoleto();
//   boleto.comEspecieDocumento('DSI');
//   boleto.comDatas(datas);
//   boleto.comBeneficiario(beneficiario);
//   boleto.comBanco(banco);
//   boleto.comPagador(pagador);
//   boleto.comValorBoleto(115.38);
//   boleto.comNumeroDoDocumento('2');
//   boleto.comBanco(banco);
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.57890 60507.420655 40871.130007 1 61030000011538',
//     linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
//   t.is(linhaEsperada, linhaGerada);
// });

// test('Verifica geração da linha digitável - 5', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(20, 8, 2014);
//   datas.comProcessamento(20, 8, 2014);
//   datas.comVencimento(27, 8, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
//   beneficiario.comNossoNumero('02891620');
//   beneficiario.comDigitoNossoNumero('8');
//   pagador = Pagador.novoPagador();
//   boleto = Boleto.novoBoleto();
//   boleto.comEspecieDocumento('DSI');
//   boleto.comDatas(datas);
//   boleto.comBeneficiario(beneficiario);
//   boleto.comBanco(banco);
//   boleto.comPagador(pagador);
//   boleto.comValorBoleto(115.38);
//   boleto.comNumeroDoDocumento('4');
//   boleto.comBanco(banco);
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.57023 89162.080652 40871.130007 4 61680000011538',
//     linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
//   t.is(linhaEsperada, linhaGerada);
// });

// test('Verifica geração da linha digitável - 6', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(19, 9, 2014);
//   datas.comProcessamento(19, 9, 2014);
//   datas.comVencimento(26, 9, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comContaCorrente('8711'); //Não se deve indicar o dígito da agencia
//   beneficiario.comNossoNumero('07967777');
//   beneficiario.comDigitoNossoNumero('4');
//   pagador = Pagador.novoPagador();
//   boleto = Boleto.novoBoleto();
//   boleto.comEspecieDocumento('FS');
//   boleto.comDatas(datas);
//   boleto.comBeneficiario(beneficiario);
//   boleto.comBanco(banco);
//   boleto.comPagador(pagador);
//   boleto.comValorBoleto(230.76);
//   boleto.comNumeroDoDocumento('5');
//   boleto.comBanco(banco);
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.57072 96777.740653 40871.130007 9 61980000023076',
//     linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
//   t.is(linhaEsperada, linhaGerada);
// });

// test('Verifica nome correto do banco', (t) => {
//   t.is(banco.getNome(), 'Banco Itaú S/A');
// });

// test('Verifica a numeração correta do banco', (t) => {
//   t.is(banco.getNumeroFormatadoComDigito(), '341-7');
// });

// test('Verifica deve imprimir o nome do banco no boleto', (t) => {
//   t.truthy(banco.getImprimirNome());
// });

// test('Verifica geração do código de barras', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
//   t.is(codigoDeBarras, '34196565500002680161572189766660167451459000');
// });

test('Verifica que arquivo de imagem do logotipo existe', (t) => {
  t.truthy(fs.existsSync(banco.getImagem()));
});

// Teste originalmente comentado - inativo no nodeunit
// test('Exibir campo CIP retorna falso', (t) => {
//   t.is(banco.exibirCampoCip(), false);
// });

test('Verifica criação de pdf', async (t) => {
  //Mover para teste adequado
  const datas2 = Datas.novasDatas();
  datas2.comDocumento('09-19-2014');
  datas2.comProcessamento('09-19-2014');
  datas2.comVencimento('09-26-2014');
  const beneficiario2 = Beneficiario.novoBeneficiario();
  beneficiario2.comNome('GREENSTONE DES. E PROC. DE DADOS MINERAIS LTDA ME');
  beneficiario2.comRegistroNacional('21202793000100');
  beneficiario2.comAgencia('4155');
  beneficiario2.comCarteira('1');
  beneficiario2.comCodigoBeneficiario('101060');
  beneficiario2.comNossoNumero('515');
  beneficiario2.comDigitoNossoNumero('8');
  const pagador2 = Pagador.novoPagador();
  pagador2.comNome('Asnésio da Silva');
  const boleto2 = Boleto.novoBoleto();
  boleto2.comEspecieDocumento('FS');
  boleto2.comDatas(datas2);
  boleto2.comBeneficiario(beneficiario2);
  boleto2.comBanco(banco);
  boleto2.comPagador(pagador2);
  boleto2.comValorBoleto(1200);
  boleto2.comNumeroDoDocumento('5');
  boleto2.comBanco(banco);
  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador2.comEndereco(enderecoDoPagador);
  boleto.comLocaisDePagamento(['Pagável em qualquer banco ou casa lotérica até o vencimento']);
  boleto.comInstrucoes([
    'Conceder desconto de R$ 10,00 até o vencimento',
    'Multa de R$ 2,34 após o vencimento',
    'Mora de R$ 0,76 ao dia após o vencimento',
    'Protestar após 10 dias de vencido',
    'Agradecemos a preferência, volte sempre!',
  ]);
  const { path } = await new PdfGerador([boleto, boleto2]).pdfFile('../tests/banks/boleto-sicoob.pdf');
  t.truthy(fs.existsSync(path));
  t.is(fs.unlinkSync(path), undefined);
});
