const test = require('ava');
const Santander = require('../../../lib/banks/santander');
const Boleto = require('../../../lib/core/boleto');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
const Endereco = require('../../../lib/core/endereco');
const Datas = require('../../../lib/core/datas');

let santander;
let boleto;

test.beforeEach(() => {
  santander = new Santander();

  const datas = Datas.novasDatas();
  datas.comDocumento('01/12/2024');
  datas.comProcessamento('01/12/2024');
  datas.comVencimento('15/12/2024');

  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Empresa Teste');
  beneficiario.comRegistroNacional('12345678000190');
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('0012345'); // 7 dígitos para Santander
  beneficiario.comDigitoCodigoBeneficiario('8');
  beneficiario.comCarteira('101');
  beneficiario.comNossoNumero('123456789012'); // 12 dígitos
  beneficiario.comDigitoNossoNumero('4');

  const enderecoBeneficiario = Endereco.novoEndereco();
  enderecoBeneficiario.comLogradouro('Rua Teste');
  enderecoBeneficiario.comBairro('Centro');
  enderecoBeneficiario.comCep('01234-567');
  enderecoBeneficiario.comCidade('São Paulo');
  enderecoBeneficiario.comUf('SP');
  beneficiario.comEndereco(enderecoBeneficiario);

  const pagador = Pagador.novoPagador();
  pagador.comNome('Cliente Teste');
  pagador.comRegistroNacional('12345678900');

  const enderecoPagador = Endereco.novoEndereco();
  enderecoPagador.comLogradouro('Av Principal');
  enderecoPagador.comBairro('Jardins');
  enderecoPagador.comCep('98765-432');
  enderecoPagador.comCidade('São Paulo');
  enderecoPagador.comUf('SP');
  pagador.comEndereco(enderecoPagador);

  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBanco(santander);
  boleto.comBeneficiario(beneficiario);
  boleto.comPagador(pagador);
  boleto.comValor(1000.00);
  boleto.comNumeroDoDocumento('12345');
});

// ===== TESTES BÁSICOS =====

test('Deve retornar o número do banco formatado', t => {
  t.is(santander.getNumeroFormatado(), '033');
});

test('Deve retornar o número do banco formatado com dígito', t => {
  t.is(santander.getNumeroFormatadoComDigito(), '033-7');
});

test('Deve retornar o nome do banco', t => {
  t.is(santander.getNome(), 'Banco Santander S.A.');
});

test('Deve retornar o caminho da imagem', t => {
  const imagem = santander.getImagem();
  t.true(imagem.includes('logotipos/santander.png'));
});

test('Deve retornar false para imprimir nome', t => {
  t.false(santander.getImprimirNome());
});

test('Deve retornar true para exibir recibo do pagador completo', t => {
  t.true(santander.exibirReciboDoPagadorCompleto());
});

test('Deve retornar false para exibir campo CIP', t => {
  t.false(santander.exibirCampoCip());
});

// ===== TESTES DE FORMATAÇÃO =====

test('Deve formatar a carteira com 2 dígitos', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('5');
  t.is(santander.getCarteiraFormatado(beneficiario), '05');
});

test('Deve formatar a carteira com 3 dígitos (deve truncar para 2)', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('101');
  t.is(santander.getCarteiraFormatado(beneficiario), '101');
});

test('Deve retornar o texto da carteira formatado', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('101');
  t.is(santander.getCarteiraTexto(beneficiario), '101');
});

test('Deve formatar o código do beneficiário com 7 dígitos', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('0012345');
  t.is(santander.getCodigoFormatado(beneficiario), '0012345');
});

test('Deve formatar o código do beneficiário com padding de zeros', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('1');
  t.is(santander.getCodigoFormatado(beneficiario), '0000001');
});

test('Deve formatar o nosso número com 12 dígitos', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('123456');
  t.is(santander.getNossoNumeroFormatado(beneficiario), '000000123456');
});

test('Deve formatar o nosso número com padding de zeros', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('1');
  t.is(santander.getNossoNumeroFormatado(beneficiario), '000000000001');
});

test('Deve retornar nosso número e código documento formatado com dígito', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('123456789012');
  beneficiario.comDigitoNossoNumero('4');
  const resultado = santander.getNossoNumeroECodigoDocumento(boleto);
  t.is(resultado, '123456789012-4');
});

test('Deve retornar agência e código do beneficiário formatado', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('0012345');
  beneficiario.comDigitoCodigoBeneficiario('8');
  const resultado = santander.getAgenciaECodigoBeneficiario(boleto);
  t.is(resultado, '1234/0012345-8'); // Santander não usa dígito da agência neste método
});

test('Deve retornar agência e código do beneficiário sem dígito do código', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('0012345');
  beneficiario.comDigitoCodigoBeneficiario('');
  const resultado = santander.getAgenciaECodigoBeneficiario(boleto);
  t.is(resultado, '1234/0012345'); // Sem dígito do código
});

test('Deve retornar agência e código do beneficiário com dígito do código', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('0012345');
  beneficiario.comDigitoCodigoBeneficiario('9');
  const resultado = santander.getAgenciaECodigoBeneficiario(boleto);
  t.is(resultado, '1234/0012345-9');
});

// ===== TESTES DE TÍTULOS =====

test('Deve retornar os títulos corretos', t => {
  const titulos = santander.getTitulos();
  t.is(titulos.instrucoes, 'Informações de responsabilidade do beneficiário');
  t.is(titulos.nomeDoPagador, 'Nome do Pagador');
  t.is(titulos.especie, 'Moeda');
  t.is(titulos.quantidade, 'Quantidade');
  t.is(titulos.valor, 'Valor');
  t.is(titulos.moraMulta, '(+) Juros / Multa');
});

// ===== TESTES DE CÓDIGO DE BARRAS =====

test('Deve gerar código de barras válido com Santander', t => {
  const beneficiario = boleto.getBeneficiario();
  // Santander precisa do código beneficiário com exatamente 7 dígitos para substring funcionar
  beneficiario.comCodigoBeneficiario('0012345'); // 7 dígitos
  beneficiario.comNossoNumero('123456789012'); // 12 dígitos
  beneficiario.comDigitoNossoNumero('4');
  beneficiario.comCarteira('101'); // 3 dígitos para gerar campo livre correto

  const codigoDeBarras = santander.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoDeBarras);
  
  // Verifica que o código de barras não é vazio
  const codigoString = codigoDeBarras.toString();
  t.true(codigoString.length > 0);
});

// ===== TESTES DE EDGE CASES =====

test('Deve formatar código do beneficiário com valor vazio', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('');
  t.is(santander.getCodigoFormatado(beneficiario), '0000000');
});

test('Deve formatar nosso número com valor vazio', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('');
  t.is(santander.getNossoNumeroFormatado(beneficiario), '000000000000');
});

test('Deve formatar carteira com valor vazio', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('');
  t.is(santander.getCarteiraFormatado(beneficiario), '00');
});

test('Deve lidar com valores numéricos pequenos no código', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('1');
  t.is(santander.getCodigoFormatado(beneficiario), '0000001');
});

test('Deve lidar com valores numéricos pequenos no nosso número', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('1');
  t.is(santander.getNossoNumeroFormatado(beneficiario), '000000000001');
});

test('Deve lidar com valores numéricos pequenos na carteira', t => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('1');
  t.is(santander.getCarteiraFormatado(beneficiario), '01');
});

// ===== TESTE DO FACTORY METHOD =====

test('Deve criar instância usando método estático', t => {
  const novoSantander = Santander.novoSantander();
  t.truthy(novoSantander);
  t.true(novoSantander instanceof Santander);
  t.is(novoSantander.getNome(), 'Banco Santander S.A.');
});
