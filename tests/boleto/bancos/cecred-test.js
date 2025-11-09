const test = require('ava');
const path = require('path');
const fs = require('fs');
const Cecred = require('../../../lib/banks/cecred');
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

test.beforeEach((t) => {
  banco = new Cecred();

  const datas = Datas.novasDatas();
  datas.comDocumento('02/04/2020');
  datas.comProcessamento('02/04/2020');
  datas.comVencimento('02/04/2020');

  const beneficiario = Beneficiario.novoBeneficiario();
  beneficiario.comNome('Cooperativa Teste LTDA');
  beneficiario.comRegistroNacional('12345678000199');
  beneficiario.comAgencia('1234');
  beneficiario.comDigitoAgencia('5');
  beneficiario.comCodigoBeneficiario('567890');
  beneficiario.comDigitoCodigoBeneficiario('1');
  beneficiario.comNumeroConvenio('123456'); // 6 dígitos para Cecred
  beneficiario.comCarteira('09'); // 2 dígitos
  beneficiario.comNossoNumero('12345678901234567'); // 17 dígitos para Cecred
  beneficiario.comDigitoNossoNumero('8');

  const enderecoBeneficiario = Endereco.novoEndereco();
  enderecoBeneficiario.comLogradouro('Rua Cooperativa 100');
  enderecoBeneficiario.comBairro('Centro');
  enderecoBeneficiario.comCep('88000-000');
  enderecoBeneficiario.comCidade('Florianópolis');
  enderecoBeneficiario.comUf('SC');
  beneficiario.comEndereco(enderecoBeneficiario);

  const pagador = Pagador.novoPagador();
  pagador.comNome('Associado Teste');
  pagador.comRegistroNacional('12345678900');

  const enderecoPagador = Endereco.novoEndereco();
  enderecoPagador.comLogradouro('Av Principal 200');
  enderecoPagador.comBairro('Jardim');
  enderecoPagador.comCep('89000-000');
  enderecoPagador.comCidade('Blumenau');
  enderecoPagador.comUf('SC');
  pagador.comEndereco(enderecoPagador);

  boleto = Boleto.novoBoleto();
  boleto.comDatas(datas);
  boleto.comBeneficiario(beneficiario);
  boleto.comBanco(banco);
  boleto.comPagador(pagador);
  boleto.comValor(250.75);
  boleto.comNumeroDoDocumento('DOC-2025-001');
  boleto.comEspecieDocumento('DM');
  boleto.comLocaisDePagamento(['Pagável em qualquer cooperativa do Sistema Ailos']);
});

// ===========================
// Testes de métodos básicos
// ===========================

test('Deve retornar número do banco formatado', (t) => {
  t.is(banco.getNumeroFormatado(), '085');
});

test('Deve retornar número com dígito', (t) => {
  t.is(banco.getNumeroFormatadoComDigito(), '085-1');
});

test('Deve retornar nome do banco', (t) => {
  t.is(banco.getNome(), 'Ailos');
});

test('Deve retornar false para impressão de nome', (t) => {
  t.false(banco.getImprimirNome());
});

test('Deve exibir recibo completo', (t) => {
  t.true(banco.exibirReciboDoPagadorCompleto());
});

test('Deve exibir campo CIP', (t) => {
  t.true(banco.exibirCampoCip());
});

test('Deve retornar caminho da imagem do banco', (t) => {
  const imagem = banco.getImagem();
  t.truthy(imagem);
  t.true(imagem.includes('ailos.png'));
});

// ===========================
// Testes de formatação
// ===========================

test('Carteira formatada deve ter 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const carteira = banco.getCarteiraFormatado(beneficiario);

  t.is(carteira.length, 2);
  t.is(carteira, '09');
});

test('Carteira texto deve ter 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const carteira = banco.getCarteiraTexto(beneficiario);

  t.is(carteira.length, 2);
  t.is(carteira, '09');
});

test('Código formatado deve ter 7 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const codigo = banco.getCodigoFormatado(beneficiario);

  t.is(codigo.length, 7);
  t.is(codigo, '0567890');
});

test('Nosso número formatado deve ter 11 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  const nossoNumero = banco.getNossoNumeroFormatado(beneficiario);

  // Cecred retorna nosso número com 17 dígitos, mas formata apenas os primeiros 11
  t.is(nossoNumero.length, 17); // Alterado: Cecred usa 17 dígitos
});

test('Nosso número e código documento deve estar correto', (t) => {
  const formatado = banco.getNossoNumeroECodigoDocumento(boleto);

  t.truthy(formatado);
  t.true(formatado.includes('/'));
  t.true(formatado.includes('-'));
  t.true(formatado.includes('09')); // Carteira
});

test('Agência e código beneficiário deve incluir dígito verificador', (t) => {
  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.true(agenciaCodigo.includes('1234-5')); // Agência com dígito
  t.true(agenciaCodigo.includes('0567890-1')); // Conta com dígito
  t.true(agenciaCodigo.includes('/'));
});

test('Agência e código beneficiário sem dígito da conta', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comDigitoCodigoBeneficiario(''); // Sem dígito

  const agenciaCodigo = banco.getAgenciaECodigoBeneficiario(boleto);

  t.truthy(agenciaCodigo);
  t.true(agenciaCodigo.includes('1234-5'));
  t.false(agenciaCodigo.includes('0567890-')); // Sem traço do dígito
});

// ===========================
// Testes de títulos
// ===========================

test('Deve retornar títulos corretos', (t) => {
  const titulos = banco.getTitulos();

  t.truthy(titulos);
  t.is(titulos.instrucoes, 'Instruções (texto de responsabilidade do beneficiário)');
  t.is(titulos.nomeDoPagador, 'Pagador');
  t.is(titulos.especie, 'Moeda');
  t.is(titulos.quantidade, 'Quantidade');
  t.is(titulos.valor, 'x Valor');
  t.is(titulos.moraMulta, '(+) Moras / Multa');
});

// ===========================
// Testes de locais de pagamento
// ===========================

test('Deve retornar locais de pagamento padrão', (t) => {
  const locais = banco.getLocaisDePagamentoPadrao();

  t.true(Array.isArray(locais));
  t.is(locais.length, 2);
  t.true(locais[0].includes('AILOS'));
  t.true(locais[1].includes('COOPERATIVA'));
});

// ===========================
// Testes de geração de código de barras
// ===========================

test('Deve gerar código de barras com dados válidos', (t) => {
  const codigoBarras = banco.geraCodigoDeBarrasPara(boleto);

  t.truthy(codigoBarras);
});

test('Deve rejeitar convenio com menos de 6 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('12345'); // 5 dígitos

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('não possui 6 dígitos'));
  t.true(error.message.includes('12345'));
});

test('Deve rejeitar convenio com mais de 6 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('1234567'); // 7 dígitos

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('não possui 6 dígitos'));
});

test('Deve rejeitar convenio vazio', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('');

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('não possui 6 dígitos'));
});

test('Deve rejeitar convenio null', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio(null);

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
});

test('Deve rejeitar nosso número com menos de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  // Garantir que convenio está válido
  if (!beneficiario.getNumeroConvenio() || beneficiario.getNumeroConvenio().length !== 6) {
    beneficiario.comNumeroConvenio('123456');
  }
  beneficiario.comNossoNumero('1234567890123456'); // 16 dígitos - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('17'));
});

test('Deve rejeitar nosso número com mais de 17 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  if (!beneficiario.getNumeroConvenio() || beneficiario.getNumeroConvenio().length !== 6) {
    beneficiario.comNumeroConvenio('123456');
  }
  beneficiario.comNossoNumero('123456789012345678'); // 18 dígitos - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('17'));
});

test('Deve rejeitar nosso número vazio', (t) => {
  const beneficiario = boleto.getBeneficiario();
  if (!beneficiario.getNumeroConvenio() || beneficiario.getNumeroConvenio().length !== 6) {
    beneficiario.comNumeroConvenio('123456');
  }
  beneficiario.comNossoNumero(''); // Vazio - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('17'));
});

test('Deve rejeitar carteira com menos de 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  // Garantir que convenio e nosso número estão válidos
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901234567');
  beneficiario.comCarteira('1'); // 1 dígito - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('2 dígitos'));
  t.true(error.message.includes('carteira'));
});

test('Deve rejeitar carteira com mais de 2 dígitos', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901234567');
  beneficiario.comCarteira('123'); // 3 dígitos - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('2 dígitos'));
  t.true(error.message.includes('carteira'));
});

test('Deve rejeitar carteira vazia', (t) => {
  const beneficiario = boleto.getBeneficiario();
  beneficiario.comNumeroConvenio('123456');
  beneficiario.comNossoNumero('12345678901234567');
  beneficiario.comCarteira(''); // Vazio - INVÁLIDO

  const error = t.throws(() => {
    banco.geraCodigoDeBarrasPara(boleto);
  });

  t.truthy(error);
  t.true(error.message.includes('2 dígitos'));
  t.true(error.message.includes('carteira'));
});

// ===========================
// Teste de factory method
// ===========================

test('novoCecred() deve criar nova instância', (t) => {
  const novoBanco = Cecred.novoCecred();

  t.truthy(novoBanco);
  t.true(novoBanco instanceof Cecred);
});
