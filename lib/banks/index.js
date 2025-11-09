const BankRegistry = require('../core/BankRegistry');

// Import all bank implementations
const Bradesco = require('./bradesco');
const BancoDoBrasil = require('./banco-do-brasil');
const Itau = require('./itau');
const Caixa = require('./caixa');
const Santander = require('./santander');
const Sicoob = require('./sicoob');
const Sicredi = require('./sicredi');
const Cecred = require('./cecred');

// Register banks with their identifiers
BankRegistry.register('Bradesco', Bradesco);
BankRegistry.register('237', Bradesco);

BankRegistry.register('BancoDoBrasil', BancoDoBrasil);
BankRegistry.register('001', BancoDoBrasil);

BankRegistry.register('Itau', Itau);
BankRegistry.register('341', Itau);

BankRegistry.register('Caixa', Caixa);
BankRegistry.register('104', Caixa);

BankRegistry.register('Santander', Santander);
BankRegistry.register('033', Santander);

BankRegistry.register('Sicoob', Sicoob);
BankRegistry.register('756', Sicoob);

BankRegistry.register('Sicredi', Sicredi);
BankRegistry.register('748', Sicredi);

BankRegistry.register('Cecred', Cecred);
BankRegistry.register('085', Cecred);

// Export individual bank classes for backward compatibility
module.exports = {
  Bradesco,
  237: Bradesco,
  BancoDoBrasil,
  '001': BancoDoBrasil,
  Itau,
  341: Itau,
  Caixa,
  104: Caixa,
  Santander,
  '033': Santander,
  Sicoob,
  756: Sicoob,
  Sicredi,
  748: Sicredi,
  Cecred,
  '085': Cecred,
};
