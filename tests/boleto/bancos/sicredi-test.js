const Sicredi = require('../../../lib/banks/sicredi');
const { Datas, Beneficiario, Pagador, Boleto } = require('../../../lib/core/boleto');

module.exports = {
  'Nosso número formatado deve ter oito digitos': function (test) {
    const sicredi = new Sicredi();
    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comNossoNumero('1234567');

    test.equal(sicredi.getNossoNumeroFormatado(beneficiario).length, 8);
    test.equal(sicredi.getNossoNumeroFormatado(beneficiario), '01234567');
    test.done();
  },

  'Carteira formatado deve ter um dígito': function (test) {
    const sicredi = new Sicredi();
    const beneficiario = Beneficiario.novoBeneficiario();

    // Teste com carteira de 1 dígito
    beneficiario.comCarteira('1');
    test.equal(sicredi.getCarteiraFormatado(beneficiario).length, 1);
    test.equal(sicredi.getCarteiraFormatado(beneficiario), '1');

    // Teste com carteira de 2 dígitos (deve usar apenas o último)
    beneficiario.comCarteira('01');
    test.equal(sicredi.getCarteiraFormatado(beneficiario).length, 1);
    test.equal(sicredi.getCarteiraFormatado(beneficiario), '1');

    test.done();
  },

  'Código formatado deve ter sete dígitos': function (test) {
    const sicredi = new Sicredi();
    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comCodigoBeneficiario('123');

    test.equal(sicredi.getCodigoFormatado(beneficiario).length, 7);
    test.equal(sicredi.getCodigoFormatado(beneficiario), '0000123');
    test.done();
  },

  'Testa geração de código de barras - cenário básico': function (test) {
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

    test.equal(codigoDeBarras.length, 44);
    test.equal(codigoDeBarras.substring(0, 3), '748'); // Código do banco
    test.equal(codigoDeBarras.substring(19, 20), '1'); // Primeiro dígito do campo livre
    test.done();
  },

  'Testa geração de código de barras - sem getCodposto (PR #38)': function (test) {
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

    test.equal(codigoDeBarras.length, 44);
    test.equal(codigoDeBarras.substring(0, 3), '748'); // Código do banco
    test.ok(!codigoDeBarras.includes('undefined')); // Não deve conter "undefined"
    test.done();
  },

  'Verifica nome correto do banco': function (test) {
    const sicredi = new Sicredi();

    test.equal(sicredi.getNome(), 'Sicredi');
    test.done();
  },

  'Verifica a numeração correta do banco': function (test) {
    const sicredi = new Sicredi();

    test.equal(sicredi.getNumeroFormatado(), '748');
    test.done();
  },

  'Verifica deve imprimir o nome do banco no boleto': function (test) {
    const sicredi = new Sicredi();

    test.equal(sicredi.getImprimirNome(), false);
    test.done();
  },

  'Verifica que arquivo de imagem do logotipo existe': function (test) {
    const sicredi = new Sicredi(),
      fs = require('fs');

    test.doesNotThrow(function () {
      fs.readFileSync(sicredi.getImagem());
    }, 'Arquivo de imagem do logotipo do Sicredi não existe');

    test.done();
  },

  'Exibir campo CIP retorna falso': function (test) {
    const sicredi = new Sicredi();

    test.equal(sicredi.exibirCampoCip(), false);
    test.done();
  },

  'Testa formatação da agência e código do beneficiário': function (test) {
    const sicredi = new Sicredi();
    const boleto = Boleto.novoBoleto();

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comAgencia('1234');
    beneficiario.comCodigoBeneficiario('56789');
    beneficiario.comDigitoCodigoBeneficiario('0');

    boleto.comBeneficiario(beneficiario);

    const agenciaECodigo = sicredi.getAgenciaECodigoBeneficiario(boleto);

    // Formato esperado: agencia/codigo-digito (com getCodigoFormatado)
    test.equal(agenciaECodigo, '1234/0056789-0');
    test.done();
  },

  'Testa formatação da agência e código sem dígito': function (test) {
    const sicredi = new Sicredi();
    const boleto = Boleto.novoBoleto();

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comAgencia('5678');
    beneficiario.comCodigoBeneficiario('123');

    boleto.comBeneficiario(beneficiario);

    const agenciaECodigo = sicredi.getAgenciaECodigoBeneficiario(boleto);

    // Formato esperado: agencia/codigo (com getCodigoFormatado, sem dígito)
    test.equal(agenciaECodigo, '5678/0000123');
    test.done();
  },

  'Testa nosso número e código do documento formatado': function (test) {
    const sicredi = new Sicredi();
    const boleto = Boleto.novoBoleto();

    const beneficiario = Beneficiario.novoBeneficiario();
    beneficiario.comNossoNumero('1234567');
    beneficiario.comDigitoNossoNumero('8');

    boleto.comBeneficiario(beneficiario);

    const nossoNumeroFormatado = sicredi.getNossoNumeroECodigoDocumento(boleto);

    // Formato esperado: XX/XXXXXX-D (primeiros 2 / resto-dígito)
    // Com nosso número "1234567" formatado para "01234567"
    test.equal(nossoNumeroFormatado, '01/234567-8');
    test.done();
  },

  'Verifica que recibo do pagador é completo': function (test) {
    const sicredi = new Sicredi();

    test.equal(sicredi.exibirReciboDoPagadorCompleto(), true);
    test.done();
  },

  'Verifica títulos específicos do Sicredi': function (test) {
    const sicredi = new Sicredi();
    const titulos = sicredi.getTitulos();

    test.equal(titulos.instrucoes, 'Informações de responsabilidade do beneficiário');
    test.equal(titulos.nomeDoPagador, 'Nome do Pagador');
    test.equal(titulos.especie, 'Moeda');
    test.equal(titulos.quantidade, 'Quantidade');
    test.equal(titulos.valor, 'Valor');
    test.equal(titulos.moraMulta, '(+) Juros / Multa');
    test.done();
  },

  'Testa que array de pesos foi expandido (PR #38)': function (test) {
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
    test.equal(codigoDeBarras.length, 44);
    test.done();
  },
};
