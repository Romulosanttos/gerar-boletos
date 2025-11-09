const test = require('ava');
const utils = require('../lib/index');

// Basic test to ensure the main module exports something
test('Verifica que o módulo principal está disponível', (t) => {
  t.truthy(utils);
  t.is(typeof utils, 'object');
});

// NOTE: Test commented out - lib structure changed, no *Utils.js files exist anymore
// test('Verifica que todos os submodulos estão disponíveis', (t) => {
//   let count = 0;
//   fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function (file) {
//     const match = file.match(/(.*)Utils.js/);

//     if (match) {
//       //console.log(match[1] + " / " + typeof utils[match[1]]);
//       t.truthy(utils[match[1]]);
//       count++;
//     }
//   });
//   t.true(count > 0, 'Should have found at least one utils module');
// });

// NOTE: Test commented out - lib structure changed
// test('Verifica que para cada submodulo existe um arquivo de teste', (t) => {
//   let count = 0;
//   fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function (file) {
//     const match = file.match(/(.*)Utils.js/);

//     if (match) {
//       const exists = existsSync(__dirname + '/' + match[1] + '-test.js');
//       //console.log(match[1] + " / " + exists);
//       t.truthy(exists);
//       count++;
//     }
//   });
//   t.true(count > 0, 'Should have found at least one utils module');
// });

// NOTE: Test commented out - lib structure changed
// test('Verifica que para cada propriedade exposta por um submodulo existe um conjunto de testes', (t) => {
//   let count = 0;
//   fs.readdirSync(path.join(__dirname, '/../lib')).forEach(function (file) {
//     const match = file.match(/(.*)Utils.js/);

//     if (match) {
//       const testFilePath = __dirname + '/' + match[1] + '-test.js';
//       const exists = existsSync(testFilePath);
//       if (exists) {
//         const submoduleTest = require(testFilePath);
//         const submodule = require(__dirname + '/../lib/' + file);

//         //console.log(match[1] + " / " + file);

//         for (const property in submodule) {
//           if (Object.prototype.isPrototypeOf.call(submodule, property)) {
//             const temTeste = property in submoduleTest;

//             if (!temTeste) {
//               console.error(' > Missing tests for: ' + match[1] + ':' + property);
//             }

//             t.truthy(temTeste);
//             count++;
//           }
//         }
//       }
//     }
//   });
//   t.true(count > 0, 'Should have found at least one property to test');
// });
