const PdfGerador = require('../../../lib/generators/pdf-generator');
const fs = require('fs');
const path = require('path');
const Boleto = require('../../../lib/core/boleto');
const Caixa = require('../../../lib/banks/caixa');
const geradorDeLinhaDigitavel = require('../../../lib/generators/line-formatter');
const Datas = require('../../../lib/core/datas');
const Endereco = require('../../../lib/core/endereco');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
let banco, boletoSinco, boletoSicgb, beneficiario;
const test = require('ava');

test.before(() => {
  const dir = path.join('tmp', 'boletos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test.beforeEach((t) => {
  banco = new Caixa();
  // SINCO
  const datas = Datas.novasDatas();
  datas.comDocumento('04-22-2013');
  datas.comProcessamento('04-22-2013');
  datas.comVencimento('04-29-2013');
  const pagador = Pagador.novoPagador();
  pagador.comNome('Mario Amaral');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Rodrigo Turini');
  beneficiario.comRegistroNacional('19950366000150');
  beneficiario.comAgencia('2873');
  beneficiario.comCarteira('1');
  beneficiario.comCodigoBeneficiario('2359');
  beneficiario.comNossoNumero('990000000003994458');
  beneficiario.comDigitoNossoNumero('0');
  boletoSinco = Boleto.novoBoleto();
  boletoSinco.comDatas(datas);
  boletoSinco.comBeneficiario(beneficiario);
  boletoSinco.comBanco(banco);
  boletoSinco.comPagador(pagador);
  boletoSinco.comValorBoleto(4016.1);
  boletoSinco.comNumeroDoDocumento(3084373);
  // SIGCB
  const datas2 = Datas.novasDatas();
  datas2.comDocumento('02-04-2020');
  datas2.comProcessamento('02-04-2020');
  datas2.comVencimento('02-04-2020');
  const beneficiario2 = Beneficiario.novoBeneficiario();
  beneficiario2.comNome('Gammasoft Desenvolvimento de Software Ltda');
  beneficiario2.comAgencia('589');
  beneficiario2.comCarteira('24');
  beneficiario2.comCodigoBeneficiario('290274');
  beneficiario2.comDigitoCodigoBeneficiario('5');
  beneficiario2.comNossoNumero('900000000000132');
  beneficiario2.comDigitoNossoNumero('3');
  beneficiario2.comRegistroNacional('19950366000150');
  const enderecoDoBeneficiario = Endereco.novoEndereco();
  enderecoDoBeneficiario.comLogradouro('Rua da Programação');
  enderecoDoBeneficiario.comBairro('Zona Rural');
  enderecoDoBeneficiario.comCep('71550050');
  enderecoDoBeneficiario.comCidade('Patos de Minas');
  enderecoDoBeneficiario.comUf('MG');
  beneficiario2.comEndereco(enderecoDoBeneficiario);
  const pagador2 = Pagador.novoPagador();
  pagador2.comNome('Paulo Fulano da Silva');
  pagador2.comRegistroNacional('77134854817');
  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador2.comEndereco(enderecoDoPagador);
  boletoSicgb = Boleto.novoBoleto();
  boletoSicgb.comDatas(datas2);
  boletoSicgb.comBeneficiario(beneficiario2);
  boletoSicgb.comBanco(banco);
  boletoSicgb.comPagador(pagador2);
  boletoSicgb.comValorBoleto(80.0);
  boletoSicgb.comNumeroDoDocumento('NF100/00000132');
  boletoSicgb.comLocaisDePagamento(['PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE']);
});

test('Nosso número formatado deve ter 17 digitos', (t) => {
  // var nossoNumeroSinco = banco.getNossoNumeroFormatado(boletoSinco.getBeneficiario());
  // t.is(nossoNumeroSinco.length, 17);
  // t.is(nossoNumeroSinco, '990000000003994458'); //Sinco deve ter 18?
  const nossoNumeroSicgb = banco.getNossoNumeroFormatado(boletoSicgb.getBeneficiario());
  t.is(nossoNumeroSicgb.length, 17);
  t.is(nossoNumeroSicgb, '24900000000000132'); // Sicgb deve ter 17?
});

test('Carteira formatado deve ter dois dígitos', (t) => {
  const beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
    numeroFormatado = banco.getCarteiraFormatado(beneficiario);
  t.is(numeroFormatado.length, 2);
  t.is(numeroFormatado, '01');
});

test('Conta corrente formatada deve ter cinco dígitos', (t) => {
  const numeroFormatado = banco.getCodigoFormatado(beneficiario);
  t.is(numeroFormatado.length, 5);
  t.is(numeroFormatado, '02359');
});

// Teste originalmente comentado - inativo no nodeunit
// test('Testa código de barras com carteira SINCO', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco);
//   t.is(codigoDeBarras, '10492568300004016101002359990000000003994458');
// });

// Teste originalmente comentado - inativo no nodeunit
// test('Linha digitavel com carteira SINCO', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco),
//     linhaEsperada = '10491.00231 59990.000008 00039.944582 2 56830000401610';
//   t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
// });

test('Linha digitavel com carteira SIGCB 1', (t) => {
  const datas2 = Datas.novasDatas();
  datas2.comDocumento('02-04-2020');
  datas2.comProcessamento('02-04-2020');
  datas2.comVencimento('02-04-2020');
  const beneficiario2 = Beneficiario.novoBeneficiario();
  beneficiario2.comNome('AGUINALDO LUIZ TELES - ME');
  beneficiario2.comAgencia('4221');
  beneficiario2.comCarteira('14');
  beneficiario2.comCodigoBeneficiario('648995');
  beneficiario2.comDigitoCodigoBeneficiario('8');
  beneficiario2.comNossoNumero('000000000000007');
  beneficiario2.comDigitoNossoNumero('3');
  beneficiario2.comRegistroNacional('08432498000173');
  const enderecoDoBeneficiario = Endereco.novoEndereco();
  enderecoDoBeneficiario.comLogradouro('Rua da Programação');
  enderecoDoBeneficiario.comBairro('Zona Rural');
  enderecoDoBeneficiario.comCep('71550050');
  enderecoDoBeneficiario.comCidade('Patos de Minas');
  enderecoDoBeneficiario.comUf('MG');
  beneficiario2.comEndereco(enderecoDoBeneficiario);
  const pagador2 = Pagador.novoPagador();
  pagador2.comNome('Paulo Fulano da Silva');
  pagador2.comRegistroNacional('77134854817');
  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador2.comEndereco(enderecoDoPagador);
  boletoSinco = Boleto.novoBoleto();
  boletoSinco.comDatas(datas2);
  boletoSinco.comBeneficiario(beneficiario2);
  boletoSinco.comBanco(banco);
  boletoSinco.comPagador(pagador2);
  boletoSinco.comValorBoleto(158.76);
  boletoSinco.comNumeroDoDocumento('NF100/00000215');
  boletoSinco.comLocaisDePagamento(['PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE']);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSinco),
    linhaEsperada = '10496.48999 58000.100048 00000.000711 7 81550000015876';
  console.log(geradorDeLinhaDigitavel(codigoDeBarras, banco));
  t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
});

test('Linha digitavel com carteira SIGCB 2', (t) => {
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boletoSicgb),
    linhaEsperada = '10492.90271 45900.200044 00000.013227 5 81550000008000';
  t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
});

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica geração da linha digitável - 1', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
//     linhaEsperada = '34191.57213 89766.660164 74514.590004 6 56550000268016';
//   t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
// });

// Teste originalmente comentado - inativo no nodeunit
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

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica geração da linha digitável - 3', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(21, 5, 2014);
//   datas.comProcessamento(21, 5, 2014);
//   datas.comVencimento(21, 5, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('181');
//   beneficiario.comAgencia('654');
//   beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
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

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica geração da linha digitável - 4', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(29, 5, 2014);
//   datas.comProcessamento(29, 5, 2014);
//   datas.comVencimento(23, 6, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
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

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica geração da linha digitável - 5', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(20, 8, 2014);
//   datas.comProcessamento(20, 8, 2014);
//   datas.comVencimento(27, 8, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
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

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica geração da linha digitável - 6', (t) => {
//   datas = Datas.novasDatas();
//   datas.comDocumento(19, 9, 2014);
//   datas.comProcessamento(19, 9, 2014);
//   datas.comVencimento(26, 9, 2014);
//   beneficiario = Beneficiario.novoBeneficiario();
//   beneficiario.comCarteira('157');
//   beneficiario.comAgencia('654');
//   beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
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

// Teste originalmente comentado - inativo no nodeunit
// This test was commented in original - uses undefined 'boleto' variable
// test('Verifica nome correto do banco', (t) => {
//   t.is(banco.getNome(), 'Banco Itaú S/A');
// });

test('Verifica a numeração correta do banco', (t) => {
  t.is(banco.getNumeroFormatadoComDigito(), '104-0');
});

test('Verifica que arquivo de imagem do logotipo existe', (t) => {
  t.truthy(fs.existsSync(banco.getImagem()));
});

// Teste originalmente comentado - inativo no nodeunit
// test('Verifica deve imprimir o nome do banco no boleto', (t) => {
//   t.truthy(banco.getImprimirNome());
// });
// });

// Teste originalmente comentado - inativo no nodeunit
// This test was commented in original - uses undefined 'boleto' variable  
// test('Verifica geração do código de barras', (t) => {
//   var codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
//   t.is(codigoDeBarras, '34196565500002680161572189766660167451459000');
// });

test('Exibir campo CIP retorna falso', (t) => {
  t.is(banco.exibirCampoCip(), false);
});

test('Verifica criação de pdf - SIGCB 1', async (t) => {
  // SIGCB
  const datas2 = Datas.novasDatas();
  datas2.comDocumento('02-04-2020');
  datas2.comProcessamento('02-04-2020');
  datas2.comVencimento('02-04-2020');

  const beneficiario2 = Beneficiario.novoBeneficiario();
  beneficiario2.comNome('Gammasoft Desenvolvimento de Software Ltda');
  beneficiario2.comAgencia('589');
  beneficiario2.comCarteira('24');
  beneficiario2.comCodigoBeneficiario('290274');
  beneficiario2.comDigitoCodigoBeneficiario('5');
  beneficiario2.comNossoNumero('900000000000132');
  beneficiario2.comDigitoNossoNumero('3');
  beneficiario2.comRegistroNacional('19950366000150');

  const enderecoDoBeneficiario = Endereco.novoEndereco();
  enderecoDoBeneficiario.comLogradouro('Rua da Programação');
  enderecoDoBeneficiario.comBairro('Zona Rural');
  enderecoDoBeneficiario.comCep('71550050');
  enderecoDoBeneficiario.comCidade('Patos de Minas');
  enderecoDoBeneficiario.comUf('MG');
  beneficiario2.comEndereco(enderecoDoBeneficiario);

  const pagador2 = Pagador.novoPagador();
  pagador2.comNome('Paulo Fulano da Silva');
  pagador2.comRegistroNacional('77134854817');

  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador2.comEndereco(enderecoDoPagador);

  const boletoSicgb = Boleto.novoBoleto();
  boletoSicgb.comDatas(datas2);
  boletoSicgb.comBeneficiario(beneficiario2);
  boletoSicgb.comBanco(banco);
  boletoSicgb.comPagador(pagador2);
  boletoSicgb.comValorBoleto(80.0);
  boletoSicgb.comNumeroDoDocumento('NF100/00000132');
  boletoSicgb.comLocaisDePagamento(['PREFERENCIALMENTE NAS CASAS LOTÉRICAS ATÉ O VALOR LIMITE']);

  const dir = path.join('tmp', 'boletos');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (err) {
    // Diretório já existe, ignora
  }
  await new PdfGerador(boletoSicgb).pdfFile('../../tmp/boletos/boleto-caixa1.pdf');
  const expectedPath = path.join('tmp', 'boletos', 'boleto-caixa1.pdf');
  t.truthy(fs.existsSync(expectedPath));
  try {
    fs.unlinkSync(expectedPath);
  } catch (err) {
    // Arquivo não existe, ignora
  }
  t.pass();
});
