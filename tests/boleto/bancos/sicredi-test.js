const Sicredi = require('../../../lib/banks/sicredi');
const Boleto = require('../../../lib/core/boleto');
const Datas = require('../../../lib/core/datas');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
const test = require('ava');

test('Nosso número formatado deve ter oito digitos', (t) => {
  const sicredi = new Sicredi();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNossoNumero('1234567');
  t.is(sicredi.getNossoNumeroFormatado(beneficiario).length, 8);
  t.is(sicredi.getNossoNumeroFormatado(beneficiario), '01234567');
});

test('Carteira formatado deve ter um dígito', (t) => {
  const sicredi = new Sicredi();
  const beneficiario = Beneficiario.novoBeneficiario();
  // Teste com carteira de 1 dígito
  beneficiario.comCarteira('1');
  t.is(sicredi.getCarteiraFormatado(beneficiario).length, 1);
  t.is(sicredi.getCarteiraFormatado(beneficiario), '1');
  // Teste com carteira de 2 dígitos (deve usar apenas o último)
  beneficiario.comCarteira('01');
  t.is(sicredi.getCarteiraFormatado(beneficiario).length, 1);
  t.is(sicredi.getCarteiraFormatado(beneficiario), '1');
});

test('Código formatado deve ter sete dígitos', (t) => {
  const sicredi = new Sicredi();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comCodigoBeneficiario('123');
  t.is(sicredi.getCodigoFormatado(beneficiario).length, 7);
  t.is(sicredi.getCodigoFormatado(beneficiario), '0000123');
});

test('Testa geração de código de barras - cenário básico', (t) => {
  const boleto = Boleto.novoBoleto();
  const sicredi = new Sicredi();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Empresa Teste');
  beneficiario.comAgencia('1234');
  beneficiario.comCarteira('1');
  beneficiario.comCodigoBeneficiario('123');
  beneficiario.comNossoNumero('12345678');
  beneficiario.comDigitoNossoNumero('9');
  const datas = Datas.novasDatas();
  datas.comVencimento('2025-12-31');
  const pagador = Pagador.novoPagador();
  pagador.comNome('João da Silva');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(sicredi);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(100.0);
  const codigoDeBarras = sicredi.geraCodigoDeBarrasPara(boleto);
  t.is(codigoDeBarras.length, 44);
  t.is(codigoDeBarras.substring(0, 3), '748'); // Código do banco
  t.is(codigoDeBarras.substring(19, 20), '1'); // Primeiro dígito do campo livre
});

test('Testa geração de código de barras - sem getCodposto (PR #38)', (t) => {
  const boleto = Boleto.novoBoleto();
  const sicredi = new Sicredi();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Empresa Teste');
  beneficiario.comAgencia('0456');
  beneficiario.comCarteira('01'); // Carteira com 2 dígitos
  beneficiario.comCodigoBeneficiario('1234');
  beneficiario.comNossoNumero('87654321');
  beneficiario.comDigitoNossoNumero('7');
  // getCodposto() será undefined - mas não deve quebrar
  const datas = Datas.novasDatas();
  datas.comVencimento('2025-12-31');
  const pagador = Pagador.novoPagador();
  pagador.comNome('João da Silva');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(sicredi);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(150.75);
  // Deve gerar sem erro
  const codigoDeBarras = sicredi.geraCodigoDeBarrasPara(boleto);
  t.is(codigoDeBarras.length, 44);
  t.is(codigoDeBarras.substring(0, 3), '748'); // Código do banco
  t.truthy(!codigoDeBarras.includes('undefined')); // Não deve conter "undefined"
});

test('Verifica nome correto do banco', (t) => {
  const sicredi = new Sicredi();
  t.is(sicredi.getNome(), 'Sicredi');
});

test('Verifica a numeração correta do banco', (t) => {
  const sicredi = new Sicredi();
  t.is(sicredi.getNumeroFormatado(), '748');
});

test('Verifica deve imprimir o nome do banco no boleto', (t) => {
  const sicredi = new Sicredi();
  t.is(sicredi.getImprimirNome(), false);
});

test('Verifica que arquivo de imagem do logotipo existe', (t) => {
  const sicredi = new Sicredi(),
    fs = require('fs');
  t.notThrows(function () {
    fs.readFileSync(sicredi.getImagem());
  }, 'Arquivo de imagem do logotipo do Sicredi não existe');
});

test('Exibir campo CIP retorna falso', (t) => {
  const sicredi = new Sicredi();
  t.is(sicredi.exibirCampoCip(), false);
});

test('Testa formatação da agência e código do beneficiário', (t) => {
  const sicredi = new Sicredi();
  const boleto = Boleto.novoBoleto();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comAgencia('1234');
  beneficiario.comCodigoBeneficiario('56789');
  beneficiario.comDigitoCodigoBeneficiario('0');
  boleto.comBeneficiario(beneficiario);
  const agenciaECodigo = sicredi.getAgenciaECodigoBeneficiario(boleto);
  // Formato esperado: agencia/codigo-digito (com getCodigoFormatado)
  t.is(agenciaECodigo, '1234/0056789-0');
});

test('Testa formatação da agência e código sem dígito', (t) => {
  const sicredi = new Sicredi();
  const boleto = Boleto.novoBoleto();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comAgencia('5678');
  beneficiario.comCodigoBeneficiario('123');
  boleto.comBeneficiario(beneficiario);
  const agenciaECodigo = sicredi.getAgenciaECodigoBeneficiario(boleto);
  // Formato esperado: agencia/codigo (com getCodigoFormatado, sem dígito)
  t.is(agenciaECodigo, '5678/0000123');
});

test('Testa nosso número e código do documento formatado', (t) => {
  const sicredi = new Sicredi();
  const boleto = Boleto.novoBoleto();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNossoNumero('1234567');
  beneficiario.comDigitoNossoNumero('8');
  boleto.comBeneficiario(beneficiario);
  const nossoNumeroFormatado = sicredi.getNossoNumeroECodigoDocumento(boleto);
  // Formato esperado: XX/XXXXXX-D (primeiros 2 / resto-dígito)
  // Com nosso número "1234567" formatado para "01234567"
  t.is(nossoNumeroFormatado, '01/234567-8');
});

test('Verifica que recibo do pagador é completo', (t) => {
  const sicredi = new Sicredi();
  t.is(sicredi.exibirReciboDoPagadorCompleto(), true);
});

test('Verifica títulos específicos do Sicredi', (t) => {
  const sicredi = new Sicredi();
  const titulos = sicredi.getTitulos();
  t.is(titulos.instrucoes, 'Informações de responsabilidade do beneficiário');
  t.is(titulos.nomeDoPagador, 'Nome do Pagador');
  t.is(titulos.especie, 'Moeda');
  t.is(titulos.quantidade, 'Quantidade');
  t.is(titulos.valor, 'Valor');
  t.is(titulos.moraMulta, '(+) Juros / Multa');
});

test('Testa que array de pesos foi expandido (PR #38)', (t) => {
  const sicredi = new Sicredi();
  const boleto = Boleto.novoBoleto();
  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comAgencia('1234');
  beneficiario.comCarteira('01'); // 2 dígitos para forçar string maior
  beneficiario.comCodigoBeneficiario('123456');
  beneficiario.comNossoNumero('12345678');
  beneficiario.comDigitoNossoNumero('9');
  const datas = Datas.novasDatas();
  datas.comVencimento('2025-12-31');
  const pagador = Pagador.novoPagador();
  pagador.comNome('João da Silva');
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(sicredi);
  boleto.comPagador(pagador);
  boleto.comValorBoleto(200.0); // Definir valor do boleto
  // Deve gerar sem erro mesmo com string de cálculo maior
  const codigoDeBarras = sicredi.geraCodigoDeBarrasPara(boleto);
  t.is(codigoDeBarras.length, 44);
});
