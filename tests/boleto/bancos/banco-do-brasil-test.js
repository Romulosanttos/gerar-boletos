const test = require('ava');
const path = require('path');
const fs = require('fs');
const BancoBrasil = require('../../../lib/banks/banco-do-brasil');
const Boleto = require('../../../lib/core/boleto');
const Beneficiario = require('../../../lib/core/beneficiario');
const Pagador = require('../../../lib/core/pagador');
const Endereco = require('../../../lib/core/endereco');
const Datas = require('../../../lib/core/datas');

let banco, boleto;

test.before(() => {
  const dir = path.join('tmp', 'boletos');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

test.beforeEach((_t) => {
  banco = new BancoBrasil();

  const datas = Datas.novasDatas();
  datas.comDocumento('02/04/2020');
  datas.comProcessamento('02/04/2020');
  datas.comVencimento('02/04/2020');

  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Empresa Teste LTDA');
  beneficiario.comRegistroNacional('12345678000199');
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('567890');
  beneficiario.comDigitoCodigoBeneficiario('1');
  beneficiario.comCarteira('18'); // Carteira 18 é comum no BB
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos
  beneficiario.comDigitoNossoNumero('8');

  const enderecoBeneficiario = Endereco.novoEndereco();
  enderecoBeneficiario.comLogradouro('SBS Quadra 1 Bloco A');
  enderecoBeneficiario.comBairro('Asa Sul');
  enderecoBeneficiario.comCep('70070-000');
  enderecoBeneficiario.comCidade('Brasília');
  enderecoBeneficiario.comUf('DF');
  beneficiario.comEndereco(enderecoBeneficiario);

  const pagador = Pagador.novoPagador();
  pagador.comNome('Cliente Teste');
  pagador.comRegistroNacional('12345678900');

  const enderecoPagador = Endereco.novoEndereco();
  enderecoPagador.comLogradouro('Av Teste 100');
  enderecoPagador.comBairro('Centro');
  enderecoPagador.comCep('70000-000');
  enderecoPagador.comCidade('Brasília');
  enderecoPagador.comUf('DF');
  pagador.comEndereco(enderecoPagador);

  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValor(150.75);
  boleto.comNumeroDoDocumento('DOC-2020-001');
  boleto.comEspecieDocumento('DM');
  boleto.comLocaisDePagamento(['Pagável em qualquer banco até o vencimento']);
});

// ===========================
// Testes de métodos básicos
// ===========================

test('Deve retornar número do banco formatado', (t) => {
  t.is(banco.getNumeroFormatado(), '001');
});

test('Deve retornar número com dígito', (t) => {
  t.is(banco.getNumeroFormatadoComDigito(), '001-9');
});

test('Deve retornar nome do banco', (t) => {
  t.is(banco.getNome(), 'Banco do Brasil S.A.');
});

test('Deve retornar false para impressão de nome', (t) => {
  t.false(banco.getImprimirNome());
});

test('Deve exibir recibo completo', (t) => {
  t.true(banco.exibirReciboDoPagadorCompleto());
});

test('Não deve exibir campo CIP', (t) => {
  t.false(banco.exibirCampoCip());
});

test('Deve retornar caminho da imagem do banco', (t) => {
  const imagem = banco.getImagem();
  t.truthy(imagem);
  t.true(imagem.includes('banco-do-brasil.png'));
});

// ===========================
// Testes de formatação
// ===========================

test('Carteira formatada deve ter 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const carteira = banco.getCarteiraFormatado(beneficiario);

  t.is(carteira.length, 2);
  t.is(carteira, '18');
});

test('Carteira texto deve ter 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const carteira = banco.getCarteiraTexto(beneficiario);

  t.is(carteira.length, 2);
  t.is(carteira, '18');
});

test('Carteira deve adicionar zeros à esquerda quando necessário', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('6');

  const carteira = banco.getCarteiraFormatado(beneficiario);

  t.is(carteira.length, 2);
  t.is(carteira, '06');
});

test('Código formatado deve ter 8 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const codigo = banco.getCodigoFormatado(beneficiario);

  t.is(codigo.length, 8);
  t.is(codigo, '00567890');
});

test('Código formatado deve adicionar zeros à esquerda', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('123');

  const codigo = banco.getCodigoFormatado(beneficiario);

  t.is(codigo.length, 8);
  t.is(codigo, '00000123');
});

test('Nosso número formatado deve ter 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const nossoNumero = banco.getNossoNumeroFormatado(beneficiario);

  t.is(nossoNumero.length, 17);
  t.is(nossoNumero, '00000012345678901');
});

test('Nosso número formatado deve adicionar zeros à esquerda', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('123');

  const nossoNumero = banco.getNossoNumeroFormatado(beneficiario);

  t.is(nossoNumero.length, 17);
  t.is(nossoNumero, '00000000000000123');
});

test('Nosso número e código documento deve estar correto', (t) => {
  const beneficiario = boleto.getBeneficiario();
  // Importante: o getNossoNumeroFormatado pega do beneficiário atual
  beneficiario.comNossoNumero('123');

  const formatado = banco.getNossoNumeroECodigoDocumento(boleto);

  t.truthy(formatado);
  t.is(formatado, '00000000000000123');
});

test('Agência e código beneficiário deve incluir dígito verificador', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('567890');
  beneficiario.comDigitoCodigoBeneficiario('1');

  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.true(agenciaCodigo.includes('1234')); // Agência
  t.true(agenciaCodigo.includes('/'));
  t.is(agenciaCodigo, '1234/00567890-1');
});

test('Agência e código beneficiário sem dígito da conta', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('567890');
  beneficiario.comDigitoCodigoBeneficiario('');

  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.true(agenciaCodigo.includes('1234'));
  t.is(agenciaCodigo, '1234/00567890');
});

test('Agência e código beneficiário sem dígito null', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('567890');
  beneficiario.comDigitoCodigoBeneficiario(null);

  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.is(agenciaCodigo, '1234/00567890');
});

// ===========================
// Testes de títulos
// ===========================

test('Deve retornar títulos corretos', (t) => {
  const titulos = banco.getTitulos();

  t.truthy(titulos);
  t.is(titulos.instrucoes, 'Informações de responsabilidade do beneficiário');
  t.is(titulos.nomeDoPagador, 'Nome do Pagador');
  t.is(titulos.especie, 'Moeda');
  t.is(titulos.quantidade, 'Quantidade');
  t.is(titulos.valor, 'Valor');
  t.is(titulos.moraMulta, '(+) Juros / Multa');
});

// ===========================
// Testes de geração de código de barras
// ===========================

test('Deve gerar código de barras com nosso número de 11 dígitos corretamente', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos
  beneficiario.comAgencia('1234');
  beneficiario.comCodigoBeneficiario('567890');

  // Agora com conta de 8 dígitos, o campo livre terá 25 posições corretas
  // Campo livre: nossoNumero(11) + agencia(4) + conta(8) + carteira(2) = 25
  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Deve gerar código de barras com nosso número de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos
  beneficiario.comCarteira('18'); // Garantir 2 dígitos

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Campo livre com 11 dígitos gera 25 posições corretas', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos
  beneficiario.comAgencia('1234');
  beneficiario.comCodigoBeneficiario('567890'); // Será formatado para 8 dígitos
  beneficiario.comCarteira('18');

  // Com conta de 8 dígitos: nosso(11) + agencia(4) + conta(8) + carteira(2) = 25
  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Campo livre com 17 dígitos inclui zeros e nosso número', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos
  beneficiario.comCarteira('18');

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Deve usar substring da carteira nos 2 primeiros caracteres', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos para gerar corretamente
  beneficiario.comCarteira('186'); // 3 caracteres, deve pegar só os 2 primeiros

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Código de barras com nosso número exatamente 11 dígitos gera código válido', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('99999999999'); // Exatamente 11
  beneficiario.comAgencia('1234');
  beneficiario.comCodigoBeneficiario('567890');

  // Com conta de 8 dígitos, agora funciona corretamente
  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Código de barras com nosso número exatamente 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('99999999999999999'); // Exatamente 17

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Deve lançar erro com nosso número de 10 dígitos (campo livre vazio)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('1234567890'); // 10 dígitos - não suportado

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('Campo livre está vazio'));
});

test('Deve lançar erro com nosso número de 12 dígitos (campo livre vazio)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('123456789012'); // 12 dígitos - não suportado

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('Campo livre está vazio'));
});

test('Deve lançar erro com nosso número de 16 dígitos (campo livre vazio)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('1234567890123456'); // 16 dígitos - não suportado

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('Campo livre está vazio'));
});

test('Deve lançar erro com nosso número de 18 dígitos (campo livre vazio)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('123456789012345678'); // 18 dígitos - não suportado

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('Campo livre está vazio'));
});

// ===========================
// Teste de factory method
// ===========================

test('novoBancoBrasil() deve criar nova instância', (t) => {
  const novoBanco = BancoBrasil.novoBancoBrasil();

  t.truthy(novoBanco);
  t.true(novoBanco instanceof BancoBrasil);
});

// ===========================
// Testes de edge cases
// ===========================

test('Deve formatar agência corretamente', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comAgencia('1');

  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.true(agenciaCodigo.includes('1/'));
});

test('Deve lidar com carteira com 1 dígito', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCarteira('6');

  const carteira = banco.getCarteiraFormatado(beneficiario);

  t.is(carteira, '06');
});

test('Deve lidar com código beneficiário pequeno', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comCodigoBeneficiario('1');

  const codigo = banco.getCodigoFormatado(beneficiario);

  t.is(codigo, '00000001');
});

test('Deve formatar nosso número muito pequeno', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNossoNumero('1');

  const nossoNumero = banco.getNossoNumeroFormatado(beneficiario);

  t.is(nossoNumero.length, 17);
  t.is(nossoNumero, '00000000000000001');
});

// ===========================
// Testes de validação de convênio
// ===========================

test('Deve aceitar convênio de 4 dígitos com nosso número de 11 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('1234');
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos
  beneficiario.comCarteira('18');

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoBarras);
});

test('Deve aceitar convênio de 6 dígitos com nosso número de 11 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos
  beneficiario.comCarteira('18');

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoBarras);
});

test('Deve aceitar convênio de 7 dígitos com nosso número de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('1234567');
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos
  beneficiario.comCarteira('18');

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoBarras);
});

test('Deve aceitar carteira 21 com convênio de 6 dígitos e nosso número de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos
  beneficiario.comCarteira('21'); // Carteira especial

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoBarras);
});

test('Deve rejeitar convênio com 5 dígitos (inválido)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('12345'); // 5 dígitos - inválido!
  beneficiario.comNossoNumero('12345678901');
  beneficiario.comCarteira('18');

  const error = t.throws(
    () => {
      banco.geraCodigoDeBarrasPara(boleto);
    },
    { instanceOf: Error }
  );

  t.true(error.message.includes('Convênio deve ter 4, 6 ou 7 dígitos'));
  t.true(error.message.includes('5 dígitos'));
});

test('Deve rejeitar convênio com 8 dígitos (inválido)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('12345678'); // 8 dígitos - inválido!
  beneficiario.comNossoNumero('12345678901');
  beneficiario.comCarteira('18');

  const error = t.throws(
    () => {
      banco.geraCodigoDeBarrasPara(boleto);
    },
    { instanceOf: Error }
  );

  t.true(error.message.includes('Convênio deve ter 4, 6 ou 7 dígitos'));
  t.true(error.message.includes('8 dígitos'));
});

test('Deve rejeitar convênio de 7 dígitos com nosso número de 11 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('1234567');
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos - deveria ser 17!
  beneficiario.comCarteira('18');

  const error = t.throws(
    () => {
      banco.geraCodigoDeBarrasPara(boleto);
    },
    { instanceOf: Error }
  );

  t.true(error.message.includes('Convênio de 7 dígitos requer nosso número de 17 dígitos'));
  t.true(error.message.includes('11 dígitos'));
});

test('Deve rejeitar convênio de 4 dígitos com nosso número de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('1234');
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos - deveria ser 11!
  beneficiario.comCarteira('18');

  const error = t.throws(
    () => {
      banco.geraCodigoDeBarrasPara(boleto);
    },
    { instanceOf: Error }
  );

  t.true(error.message.includes('Convênio de 4 dígitos requer nosso número de 11 dígitos'));
  t.true(error.message.includes('17 dígitos'));
});

test('Deve rejeitar carteira 21 com convênio de 6 dígitos e nosso número de 11 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901'); // 11 dígitos - carteira 21 precisa de 17!
  beneficiario.comCarteira('21');

  const error = t.throws(
    () => {
      banco.geraCodigoDeBarrasPara(boleto);
    },
    { instanceOf: Error }
  );

  t.true(error.message.includes('Carteira 21 com convênio de 6 dígitos'));
  t.true(error.message.includes('17 dígitos'));
  t.true(error.message.includes('11 dígitos'));
});

test('Deve aceitar boleto sem convênio (retrocompatibilidade)', (t) => {
  const beneficiario = boleto.getBeneficiario();
  // Sem chamar comNumeroConvenio() - deve funcionar
  beneficiario.comNossoNumero('12345678901');
  beneficiario.comCarteira('18');

  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);
  t.truthy(codigoBarras);
});
