/**
 * Testes para validar a implementação do novo ciclo de fator de vencimento
 * conforme especificação FEBRABAN
 */

const Boleto = require('../lib/core/boleto');
const Datas = require('../lib/core/datas');

module.exports = {
  primeiroCiclo: {
    'deve calcular fator correto para início do período': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(1997, 9, 8)); // 08/10/1997 (dia seguinte à data base)

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '0001');
      test.done();
    },

    'deve calcular fator correto para final do primeiro ciclo': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2025, 1, 21)); // 21/02/2025

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '9999');
      test.done();
    },
  },

  segundoCiclo: {
    'deve reiniciar contador no início do segundo ciclo': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2025, 1, 22)); // 22/02/2025

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '1000'); // FEBRABAN FB-009/2023: reinicia em 1000
      test.done();
    },

    'deve calcular fator correto para data no meio do segundo ciclo': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2030, 0, 1)); // 01/01/2030

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      // Deve ser um valor entre 0000 e 9999, calculado corretamente
      test.ok(/^\d{4}$/.test(fator));
      test.ok(parseInt(fator) >= 0 && parseInt(fator) <= 9999);
      test.done();
    },

    'deve calcular fator correto para final do segundo ciclo': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2049, 9, 13)); // 13/10/2049

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '9999');
      test.done();
    },

    'deve calcular fator correto para início do segundo ciclo + alguns dias': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2025, 1, 23)); // 23/02/2025

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '1001'); // 22/02 = 1000, 23/02 = 1001
      test.done();
    },
    'deve calcular fator correto para data específica (13/10/2049)': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2049, 9, 13)); // 13/10/2049

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator, '9999'); // Final do segundo ciclo
      test.done();
    },
  },

  validacoesEdgeCases: {
    'deve rejeitar data anterior à data base': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(1997, 9, 6)); // 06/10/1997 (anterior à data base)

      boleto.comDatas(datas);

      test.throws(() => {
        boleto.getFatorVencimento();
      }, /Data de vencimento não pode ser anterior/);
      test.done();
    },

    'deve rejeitar data após limite do segundo ciclo': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(2049, 9, 14)); // 14/10/2049 (dia após limite)

      boleto.comDatas(datas);

      test.throws(() => {
        boleto.getFatorVencimento();
      }, /Aguardando nova especificação FEBRABAN/);
      test.done();
    },

    'deve rejeitar data inválida': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas();

      // Simula data inválida
      datas._vencimento = new Date('invalid');
      boleto.comDatas(datas);

      test.throws(() => {
        boleto.getFatorVencimento();
      }, /Data de vencimento inválida/);
      test.done();
    },

    'deve sempre retornar string com 4 dígitos': function (test) {
      const boleto = Boleto.novoBoleto();
      const datas = Datas.novasDatas().comVencimento(new Date(1997, 9, 8)); // Fator 0001

      boleto.comDatas(datas);
      const fator = boleto.getFatorVencimento();

      test.strictEqual(fator.length, 4);
      test.strictEqual(fator, '0001');
      test.done();
    },
  },

  casosEspecificos: {
    'deve demonstrar a transição entre ciclos': function (test) {
      // Último dia do primeiro ciclo
      const boletoFimCiclo1 = Boleto.novoBoleto();
      const datasFimCiclo1 = Datas.novasDatas().comVencimento(new Date(2025, 1, 21));
      boletoFimCiclo1.comDatas(datasFimCiclo1);

      // Primeiro dia do segundo ciclo
      const boletoInicioCiclo2 = Boleto.novoBoleto();
      const datasInicioCiclo2 = Datas.novasDatas().comVencimento(new Date(2025, 1, 22));
      boletoInicioCiclo2.comDatas(datasInicioCiclo2);

      test.strictEqual(boletoFimCiclo1.getFatorVencimento(), '9999');
      test.strictEqual(boletoInicioCiclo2.getFatorVencimento(), '1000'); // FEBRABAN FB-009/2023
      test.done();
    },
  },

  performance: {
    'deve calcular fator rapidamente': function (test) {
      const start = process.hrtime();

      for (let i = 0; i < 1000; i++) {
        const boleto = Boleto.novoBoleto();
        const datas = Datas.novasDatas().comVencimento(new Date(2030, 0, 1));
        boleto.comDatas(datas);
        boleto.getFatorVencimento();
      }

      const [seconds, nanoseconds] = process.hrtime(start);
      const milliseconds = seconds * 1000 + nanoseconds / 1000000;

      // Deve calcular 1000 fatores em menos de 100ms
      test.ok(milliseconds < 100, `Performance inadequada: ${milliseconds}ms para 1000 cálculos`);
      test.done();
    },
  },
};
