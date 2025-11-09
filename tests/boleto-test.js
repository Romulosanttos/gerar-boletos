const Boleto = require('../lib/core/boleto');
const Datas = require('../lib/core/datas');
const Endereco = require('../lib/core/endereco');
const bancos = require('../lib/banks');
const Gerador = require('../lib/generators/boleto-generator');
const especiesDeDocumento = require('../lib/core/especiesDocumento');
const test = require('ava');

test('Verifica que contém o número correto de espécies', (t) => {
  t.is(Object.keys(especiesDeDocumento).length, 21);
});

test('Todos os bancos estão disponíveis', (t) => {
  t.truthy(new bancos.Itau());
  t.truthy(new bancos['341']());
  t.truthy(new bancos.Caixa());
  t.truthy(new bancos['104']());
  t.truthy(new bancos.Bradesco());
  t.truthy(new bancos['237']());
  t.truthy(new bancos.Sicoob());
  t.truthy(new bancos['756']());
  t.truthy(new bancos.Cecred());
  t.truthy(new bancos['085']());
  console.log(Object.keys(bancos).length);
  t.is(16, Object.keys(bancos).length);
});

test('Verifica que é possível instanciar o gerador', (t) => {
  t.truthy(new Gerador());
});

test('Verifica que o gerador apresenta as funções esperadas', (t) => {
  const gerador = new Gerador();
  t.is(typeof gerador.gerarPDF, 'function');
  t.is(typeof gerador.gerarHTML, 'function');
});

test('Verifica que a geração de HTML lança uma exceção', (t) => {
  t.throws(function () {
    new Gerador().gerarHTML();
  });
});

test('É possível instanciar um objeto de datas', (t) => {
  const datas = Datas.novasDatas();
  t.truthy(datas);
});

test('Deve lançar exceção se as datas forem muito antigas', (t) => {
  t.throws(function () {
    Datas.novasDatas()
      .comDocumento(1, 1, 1996)
      .comVencimento(1, 1, 1996)
      .comProcessamento(1, 1, 1996);
  });
});

test('Deve lançar exceção se as datas estiverem além de 2024', (t) => {
  t.throws(function () {
    Datas.novasDatas()
      .comDocumento(1, 1, 2024)
      .comVencimento(1, 1, 2024)
      .comProcessamento(1, 1, 2024);
  });
});

test('Deve imprimir endereco completo', (t) => {
  const endereco = Endereco.novoEndereco()
    .comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
    .comBairro('PARQTEC ALFA')
    .comCep('88030-000')
    .comCidade('FLORIANÓPOLIS')
    .comUf('SC');
  t.is(
    endereco.getEnderecoCompleto(),
    ['RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ', 'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC'].join('')
  );
});

test('Deve imprimir endereco sem logradouro', (t) => {
  const endereco = Endereco.novoEndereco()
    .comBairro('PARQTEC ALFA')
    .comCep('88030-000')
    .comCidade('FLORIANÓPOLIS')
    .comUf('SC');
  t.is(endereco.getEnderecoCompleto(), 'PARQTEC ALFA 88.030-000 FLORIANÓPOLIS SC');
});

test('Deve imprimir endereco sem cep', (t) => {
  const endereco = Endereco.novoEndereco()
    .comLogradouro('RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA')
    .comBairro('PARQTEC ALFA')
    .comCidade('FLORIANÓPOLIS')
    .comUf('SC');
  t.is(
    endereco.getEnderecoCompleto(),
    ['RODOVIA SC 401, KM 1 - EDIFÍCIO CELTA ', 'PARQTEC ALFA FLORIANÓPOLIS SC'].join('')
  );
});

test('Deve imprimir vazio se endereço não preenchido', (t) => {
  const endereco = Endereco.novoEndereco();
  t.is(endereco.getEnderecoCompleto(), '');
});

test('É possível instanciar um novo boleto', (t) => {
  const boleto = Boleto.novoBoleto();
  t.truthy(boleto);
});

test('Novo boleto deve ter alguns valores padrão', (t) => {
  const boleto = Boleto.novoBoleto();
  t.is(boleto.getEspecieMoeda(), 'R$');
  t.is(boleto.getCodigoEspecieMoeda(), '9'); // Returns string, not number
  t.is(boleto.getAceite(), false);
  t.is(boleto.getEspecieDocumento(), 'DV');
});

test('Calcula corretamente o fator de vencimento', (t) => {
  const dataDeVencimento = new Date(2015, 3 - 1, 21, 0, 0, 0, 0),
    datas = Datas.novasDatas().comVencimento(dataDeVencimento),
    boleto = Boleto.novoBoleto().comDatas(datas);
  t.is(boleto.getFatorVencimento(), '6374');
});

test('Calcula corretamente o fator de vencimento, ignorando as horas - 1', (t) => {
  const dataDeVencimento = new Date(2008, 5 - 1, 2, 0, 0, 0, 0),
    datas = Datas.novasDatas().comVencimento(dataDeVencimento),
    boleto = Boleto.novoBoleto().comDatas(datas);
  t.is(boleto.getFatorVencimento(), '3860');
});

test('Calcula corretamente o fator de vencimento, ignorando as horas - 2', (t) => {
  const dataDeVencimento = new Date(2008, 5 - 1, 2, 23, 59, 59, 999),
    datas = Datas.novasDatas().comVencimento(dataDeVencimento),
    boleto = Boleto.novoBoleto().comDatas(datas);
  t.is(boleto.getFatorVencimento(), '3860');
});

test('Lança exceção ao tentar definir um valor negativo para o boleto', (t) => {
  t.throws(function () {
    Boleto.novoBoleto().comValorBoleto(-5);
  });
});

test('O valor formatado deve ter 10 digitos - 1', (t) => {
  const boleto = Boleto.novoBoleto().comValorBoleto(3),
    valorFormatado = boleto.getValorFormatado();
  t.is(10, valorFormatado.length);
  t.is('0000000300', valorFormatado);
});

test('O valor formatado deve ter 10 digitos - 2', (t) => {
  const boleto = Boleto.novoBoleto().comValorBoleto(3.1),
    valorFormatado = boleto.getValorFormatado();
  t.is(10, valorFormatado.length);
  t.is('0000000310', valorFormatado);
});

test('O valor formatado deve ter 10 digitos - 3', (t) => {
  const boleto = Boleto.novoBoleto().comValorBoleto(3.18),
    valorFormatado = boleto.getValorFormatado();
  t.is(10, valorFormatado.length);
  t.is('0000000318', valorFormatado);
});

test('O valor formatado deve ter 10 digitos - 4', (t) => {
  const boleto = Boleto.novoBoleto().comValorBoleto(300),
    valorFormatado = boleto.getValorFormatado();
  t.is(10, valorFormatado.length);
  t.is('0000030000', valorFormatado);
});

test('São consideradas apenas as primeiras duas casas decimais do valor', (t) => {
  const boleto = Boleto.novoBoleto().comValorBoleto(3.189),
    valorFormatado = boleto.getValorFormatado();
  t.is(10, valorFormatado.length);
  t.is('0000000318', valorFormatado);
});

test('Número do documento formatado deve ter 4 digitos', (t) => {
  const boleto = Boleto.novoBoleto().comNumeroDoDocumento('232'),
    numeroFormatado = boleto.getNumeroDoDocumentoFormatado();
  t.is(4, numeroFormatado.length);
  t.is('0232', numeroFormatado);
});

test('Boleto não deve aceitar mais do que cinco instruções', (t) => {
  t.throws(function () {
    Boleto.novoBoleto().comInstrucoes('', '', '', '', '', '');
  });
  t.throws(function () {
    Boleto.novoBoleto().comInstrucoes(['', '', '', '', '', '']);
  });
});

test('Boleto não deve aceitar mais do que cinco descrições', (t) => {
  t.throws(function () {
    Boleto.novoBoleto().comDescricoes('', '', '', '', '', '');
  });
  t.throws(function () {
    Boleto.novoBoleto().comDescricoes(['', '', '', '', '', '']);
  });
});

test('Boleto não deve aceitar mais do que dois locais de pagamento', (t) => {
  t.throws(function () {
    Boleto.novoBoleto().comLocaisDePagamento('', '', '');
  });
  t.throws(function () {
    Boleto.novoBoleto().comLocaisDePagamento(['', '', '']);
  });
});

test('Deve retornar formatação em formato legivel', (t) => {
  let boleto;
  boleto = Boleto.novoBoleto().comValorBoleto(0);
  t.is('R$ 0,00', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(1);
  t.is('R$ 1,00', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(1.2);
  t.is('R$ 1,20', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(1.23);
  t.is('R$ 1,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(1.235);
  t.is('R$ 1,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(10.23);
  t.is('R$ 10,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(100.23);
  t.is('R$ 100,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(1000.23);
  t.is('R$ 1.000,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(10002.23);
  t.is('R$ 10.002,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(210002.23);
  t.is('R$ 210.002,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(3210002.23);
  t.is('R$ 3.210.002,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(13210002.23);
  t.is('R$ 13.210.002,23', boleto.getValorFormatadoBRL());
  boleto = Boleto.novoBoleto().comValorBoleto(99999999.99);
  t.is('R$ 99.999.999,99', boleto.getValorFormatadoBRL());
});
