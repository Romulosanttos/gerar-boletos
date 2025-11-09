const PdfGerador = require('../../../lib/generators/pdf-generator');
const fs = require('fs');
const Boleto = require('../../../lib/core/boleto');
const Itau = require('../../../lib/banks/itau');
const geradorDeLinhaDigitavel = require('../../../lib/generators/line-formatter');
const Datas = require('../../../lib/core/datas');
const Endereco = require('../../../lib/core/endereco');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
let banco, boleto, beneficiario;
const test = require('ava');

test.beforeEach((t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('03-20-2013');
  datas.comProcessamento('03-20-2013');
  datas.comVencimento('04-01-2013');
  const pagador = Pagador.novoPagador();
  pagador.comNome('Fulano de Tal da Silva');
  pagador.comRegistroNacional('00132781000178');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Gammasoft Desenvolvimento de Software Ltda');
  beneficiario.comRegistroNacional('19950366000150');
  beneficiario.comAgencia('167');
  beneficiario.comCarteira('157');
  beneficiario.comCodigoBeneficiario('45145');
  beneficiario.comNossoNumero('21897666');
  beneficiario.comDigitoNossoNumero('6');
  banco = new Itau();
  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(2680.16);
  boleto.comNumeroDoDocumento(575);
});

test('Nosso número formatado deve ter oito digitos', (t) => {
  const beneficiario = Beneficiario.novoBeneficiario().comNossoNumero('9000206'),
    numeroFormatado = banco.getNossoNumeroFormatado(beneficiario);
  t.is(numeroFormatado.length, 8);
  t.is(numeroFormatado, '09000206');
});

test('Carteira formatado deve ter três dígitos', (t) => {
  const beneficiario = Beneficiario.novoBeneficiario().comCarteira('1'),
    numeroFormatado = banco.getCarteiraFormatado(beneficiario);
  t.is(numeroFormatado.length, 3);
  t.is(numeroFormatado, '001');
});

test('Conta corrente formatada deve ter cinco dígitos', (t) => {
  const numeroFormatado = banco.getCodigoFormatado(beneficiario);
  t.is(numeroFormatado.length, 5);
  t.is(numeroFormatado, '45145');
});

test('Verifica geração da linha digitável - 1', (t) => {
  // Teste seguindo especificação SISPAG CNAB-85 com campo livre de 25 posições
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '34191.57213 89766.680162 74514.590004 3 56550000268016';
  t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
});

test('Verifica geração da linha digitável - 2', (t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('03-20-2014');
  datas.comProcessamento('03-20-2014');
  datas.comVencimento('04-10-2014');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Mario Amaral');
  beneficiario.comAgencia('8462');
  beneficiario.comCarteira('174');
  beneficiario.comCodigoBeneficiario('05825');
  beneficiario.comNossoNumero('00015135');
  beneficiario.comDigitoNossoNumero('6');
  const pagador = Pagador.novoPagador();
  pagador.comNome('Rodrigo de Sousa');
  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(2680.16);
  boleto.comNumeroDoDocumento('575');
  boleto.comBanco(banco);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    // Linha digitável conforme SISPAG CNAB-85
    linhaEsperada = '34191.74002 01513.508463 20582.590004 4 60290000268016';
  t.is(linhaEsperada, geradorDeLinhaDigitavel(codigoDeBarras, banco));
});

test('Verifica geração da linha digitável - 3', (t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('05-21-2014');
  datas.comProcessamento('05-21-2014');
  datas.comVencimento('05-21-2014');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comCarteira('181');
  beneficiario.comAgencia('654');
  beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
  beneficiario.comNossoNumero('94588021');
  beneficiario.comDigitoNossoNumero('4');
  const pagador = Pagador.novoPagador();
  boleto = Boleto.novoBoleto();
  boleto.comEspecieDocumento('DSI');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(575);
  boleto.comNumeroDoDocumento('1');
  boleto.comBanco(banco);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '34191.81940 58802.170652 40871.130007 5 60700000057500',
    linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
  t.is(linhaEsperada, linhaGerada);
});

test('Verifica geração da linha digitável - 4', (t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('05-29-2014');
  datas.comProcessamento('05-29-2014');
  datas.comVencimento('06-23-2014');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comCarteira('157');
  beneficiario.comAgencia('654');
  beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
  beneficiario.comNossoNumero('89605074');
  beneficiario.comDigitoNossoNumero('2');
  const pagador = Pagador.novoPagador();
  boleto = Boleto.novoBoleto();
  boleto.comEspecieDocumento('DSI');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(115.38);
  boleto.comNumeroDoDocumento('2');
  boleto.comBanco(banco);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '34191.57890 60507.450652 40871.130007 1 61030000011538',
    linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
  t.is(linhaEsperada, linhaGerada);
});

test('Verifica geração da linha digitável - 5', (t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('08-20-2014');
  datas.comProcessamento('08-20-2014');
  datas.comVencimento('08-27-2014');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comCarteira('157');
  beneficiario.comAgencia('654');
  beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
  beneficiario.comNossoNumero('02891620');
  beneficiario.comDigitoNossoNumero('8');
  const pagador = Pagador.novoPagador();
  boleto = Boleto.novoBoleto();
  boleto.comEspecieDocumento('DSI');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(115.38);
  boleto.comNumeroDoDocumento('4');
  boleto.comBanco(banco);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '34191.57023 89162.010659 40871.130007 9 61680000011538',
    linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
  t.is(linhaEsperada, linhaGerada);
});

test('Verifica geração da linha digitável - 6', (t) => {
  const datas = Datas.novasDatas();
  datas.comDocumento('09-19-2014');
  datas.comProcessamento('09-19-2014');
  datas.comVencimento('09-26-2014');
  beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comCarteira('157');
  beneficiario.comAgencia('654');
  beneficiario.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da agencia
  beneficiario.comNossoNumero('07967777');
  beneficiario.comDigitoNossoNumero('4');
  const pagador = Pagador.novoPagador();
  boleto = Boleto.novoBoleto();
  boleto.comEspecieDocumento('FS');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(230.76);
  boleto.comNumeroDoDocumento('5');
  boleto.comBanco(banco);
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto),
    linhaEsperada = '34191.57072 96777.770650 40871.130007 1 61980000023076',
    linhaGerada = geradorDeLinhaDigitavel(codigoDeBarras, banco);
  t.is(linhaEsperada, linhaGerada);
});

test('Verifica nome correto do banco', (t) => {
  t.is(banco.getNome(), 'Banco Itaú S/A');
});

test('Verifica a numeração correta do banco', (t) => {
  t.is(banco.getNumeroFormatadoComDigito(), '341-7');
});

test('Verifica deve imprimir o nome do banco no boleto', (t) => {
  t.truthy(banco.getImprimirNome());
});

test('Verifica geração do código de barras', (t) => {
  const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
  // Código de barras conforme especificação SISPAG CNAB-85
  t.is(codigoDeBarras, '34191619800000230761570796777770654087113000');
});

test('Verifica que arquivo de imagem do logotipo existe', (t) => {
  t.truthy(fs.existsSync(banco.getImagem()));
});

test('Exibir campo CIP retorna falso', (t) => {
  t.is(banco.exibirCampoCip(), false);
});

test('Verifica criação de pdf', async (t) => {
  //Mover para teste adequado
  const datas2 = Datas.novasDatas();
  datas2.comDocumento('09-19-2014');
  datas2.comProcessamento('09-19-2014');
  datas2.comVencimento('09-26-2014');
  const beneficiario2 = Beneficiario.novoBeneficiario();
  beneficiario2.comNome('José da Silva');
  beneficiario2.comRegistroNacional('397.861.533-91');
  beneficiario2.comCarteira('157');
  beneficiario2.comAgencia('654');
  beneficiario2.comCodigoBeneficiario('8711'); //Não se deve indicar o dígito da conta
  beneficiario2.comNossoNumero('07967777');
  beneficiario2.comDigitoNossoNumero('4');
  const pagador2 = Pagador.novoPagador();
  pagador2.comNome('Asnésio da Silva');
  const boleto2 = Boleto.novoBoleto();
  boleto2.comEspecieDocumento('FS');
  boleto2.comDatas(datas2);
  boleto2.comBeneficiario(beneficiario2);
  boleto2.comBanco(banco);
  boleto2.comPagador(pagador2);
  boleto2.comValorBoleto(230.76);
  boleto2.comNumeroDoDocumento('5');
  boleto2.comBanco(banco);
  const enderecoDoPagador = Endereco.novoEndereco();
  enderecoDoPagador.comLogradouro('Avenida dos Testes Unitários');
  enderecoDoPagador.comBairro('Barra da Tijuca');
  enderecoDoPagador.comCep('72000000');
  enderecoDoPagador.comCidade('Rio de Janeiro');
  enderecoDoPagador.comUf('RJ');
  pagador2.comEndereco(enderecoDoPagador);
  boleto.comLocaisDePagamento([
    'Pagável em qualquer banco ou casa lotérica até o vencimento',
    'Após o vencimento pagável apenas em agências Itaú',
  ]);
  boleto.comInstrucoes([
    'Conceder desconto de R$ 10,00 até o vencimento',
    'Multa de R$ 2,34 após o vencimento',
    'Mora de R$ 0,76 ao dia após o vencimento',
    'Protestar após 10 dias de vencido',
    'Agradecemos a preferência, volte sempre!',
  ]);
  // const geradorDeBoleto = new GeradorDeBoleto([boleto, boleto2]);
  const { path } = await new PdfGerador([boleto, boleto2]).pdfFile('../tests/banks/boleto-itau.pdf');
  t.truthy(fs.existsSync(path));
  t.is(fs.unlinkSync(path), undefined);
});
