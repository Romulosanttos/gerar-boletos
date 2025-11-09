const test = require('ava');
const { Validacoes: validacoes } = require('../lib/index');

// eTituloDeEleitor tests
test('eTituloDeEleitor - É capaz de validar titulos de eleitor', (t) => {
  t.truthy(validacoes.eTituloDeEleitor('106644440302'));
  t.truthy(validacoes.eTituloDeEleitor('0196 3894 2097'));
  t.truthy(validacoes.eTituloDeEleitor('1265934718-72'));
  t.truthy(validacoes.eTituloDeEleitor('0043568709/06'));
  t.truthy(validacoes.eTituloDeEleitor('2733 9734 0264'));
  t.truthy(validacoes.eTituloDeEleitor('  \t 7.232.3\t06.121-78   '));
});

test('eTituloDeEleitor - Retorna o estado de origem do titulo eleitoral caso ele seja válido', (t) => {
  t.is(validacoes.eTituloDeEleitor('1066 4444 0302'), 'RJ');
  t.is(validacoes.eTituloDeEleitor('0196 3894 2097'), 'DF');
  t.is(validacoes.eTituloDeEleitor('1265 9347 1872'), 'MT');
  t.is(validacoes.eTituloDeEleitor('0043 5687 0906'), 'SC');
  t.is(validacoes.eTituloDeEleitor('2733 9734 0264'), 'MG');
  t.is(validacoes.eTituloDeEleitor('7232 3061 2178'), 'SE');
});

test('eTituloDeEleitor - Retorna ZZ caso seja um titulo de eleitor emitido no exterior', (t) => {
  t.is(validacoes.eTituloDeEleitor('123412342801'), 'ZZ');
});

// eEan tests
test('eEan - É capaz de validar EAN-8', (t) => {
  t.truthy(validacoes.eEan('23734524'));
  t.truthy(validacoes.eEan('91459381'));
  t.truthy(validacoes.eEan('62999878'));
});

test('eEan - É capaz de validar EAN-12', (t) => {
  t.truthy(validacoes.eEan('569265982372'));
  t.truthy(validacoes.eEan('666376876870'));
  t.truthy(validacoes.eEan('887776655449'));
});

test('eEan - É capaz de validar EAN-13', (t) => {
  t.truthy(validacoes.eEan('7898419154154'));
  t.truthy(validacoes.eEan('7897424082124'));
  t.truthy(validacoes.eEan('7891058020316'));
});

test('eEan - É capaz de validar EAN-14', (t) => {
  t.truthy(validacoes.eEan('41412342345348'));
  t.truthy(validacoes.eEan('55443423232328'));
  t.truthy(validacoes.eEan('88887722635653'));
});

// ePlaca tests
test('ePlaca - Valida-se placas válidas com ou sem máscara', (t) => {
  t.truthy(validacoes.ePlaca('abc1234'));
  t.truthy(validacoes.ePlaca('abc-1234'));
  t.truthy(validacoes.ePlaca('jjd0931'));
  t.truthy(validacoes.ePlaca('jjd-0931'));
  t.truthy(validacoes.ePlaca('ddw1177'));
  t.truthy(validacoes.ePlaca('ddw-1177'));
});

test('ePlaca - Placas inválidas não são validadas', (t) => {
  t.falsy(validacoes.ePlaca('ddwd1177'));
  t.falsy(validacoes.ePlaca('ddw11772'));
  t.falsy(validacoes.ePlaca('ddw-a772'));
  t.falsy(validacoes.ePlaca('1dw-3772'));
  t.falsy(validacoes.ePlaca('foo bar'));
  t.falsy(validacoes.ePlaca(new Date()));
  t.falsy(validacoes.ePlaca(12345));
});

// eCep tests
test('eCep - Valida-se ceps válidos com ou sem máscara', (t) => {
  t.truthy(validacoes.eCep('71530070'));
  t.truthy(validacoes.eCep('71530-070'));
  t.truthy(validacoes.eCep('71.530070'));
  t.truthy(validacoes.eCep('71.530-070'));
});

test('eCep - Ceps inválidos não são validados', (t) => {
  t.falsy(validacoes.eCep('71530a070'));
  t.falsy(validacoes.eCep('71530-0709'));
  t.falsy(validacoes.eCep('771.530070'));
  t.falsy(validacoes.eCep(' 71.530-070'));
});

// eRegistroNacional tests
test('eRegistroNacional - Verifica que é possível validar cpfs', (t) => {
  t.is(validacoes.eRegistroNacional('227.175.903-07'), 'cpf');
  t.is(validacoes.eRegistroNacional('16511762645'), 'cpf');
  t.is(validacoes.eRegistroNacional('434.803.222-04'), 'cpf');
  t.is(validacoes.eRegistroNacional('82647731330'), 'cpf');
  t.is(validacoes.eRegistroNacional(' 711.477.475-39 '), 'cpf');
  t.is(validacoes.eRegistroNacional('711.477.475-39'), 'cpf');
});

test('eRegistroNacional - Verifica que é possível validar cnpjs', (t) => {
  t.is(validacoes.eRegistroNacional('16.555.517/0001-87'), 'cnpj');
  t.is(validacoes.eRegistroNacional('14638632000190'), 'cnpj');
  t.is(validacoes.eRegistroNacional(' 88.142.322/0001-16 '), 'cnpj');
  t.is(validacoes.eRegistroNacional('88.142.322/0001-16'), 'cnpj');
  t.is(validacoes.eRegistroNacional('28716876000158'), 'cnpj');
  t.is(validacoes.eRegistroNacional('13.381.462/0001-48'), 'cnpj');

  t.is(validacoes.eRegistroNacional('00.000.000/0000-00'), false);
  t.is(validacoes.eRegistroNacional('11.111.111/1111-11'), false);
  t.is(validacoes.eRegistroNacional('22.222.222/2222-22'), false);
  t.is(validacoes.eRegistroNacional('33.333.333/3333-33'), false);
  t.is(validacoes.eRegistroNacional('44.444.444/4444-44'), false);
  t.is(validacoes.eRegistroNacional('55.555.555/5555-55'), false);
  t.is(validacoes.eRegistroNacional('66.666.666/6666-66'), false);
  t.is(validacoes.eRegistroNacional('77.777.777/7777-77'), false);
  t.is(validacoes.eRegistroNacional('88.888.888/8888-88'), false);
  t.is(validacoes.eRegistroNacional('99.999.999/9999-99'), false);
});

test('eRegistroNacional - Verifica que é possível especificar tipo de registro nacional a ser validado', (t) => {
  t.falsy(validacoes.eRegistroNacional('227.175.903-07', 'cnpj'));
  t.falsy(validacoes.eRegistroNacional('16511762645', 'cnpj'));
  t.falsy(validacoes.eRegistroNacional('434.803.222-04', 'cnpj'));
  t.falsy(validacoes.eRegistroNacional('82647731330', 'cnpj'));
  t.falsy(validacoes.eRegistroNacional(' 711.477.475-39 ', 'cnpj'));
  t.falsy(validacoes.eRegistroNacional('711.477.475-39', 'cnpj'));

  t.falsy(validacoes.eRegistroNacional('16.555.517/0001-87', 'cpf'));
  t.falsy(validacoes.eRegistroNacional('14638632000190', 'cpf'));
  t.falsy(validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cpf'));
  t.falsy(validacoes.eRegistroNacional('88.142.322/0001-16', 'cpf'));
  t.falsy(validacoes.eRegistroNacional('28716876000158', 'cpf'));
  t.falsy(validacoes.eRegistroNacional('13.381.462/0001-48', 'cpf'));

  t.is(validacoes.eRegistroNacional('227.175.903-07', 'cpf'), 'cpf');
  t.is(validacoes.eRegistroNacional('16511762645', 'cpf'), 'cpf');
  t.is(validacoes.eRegistroNacional('434.803.222-04', 'cpf'), 'cpf');
  t.is(validacoes.eRegistroNacional('82647731330', 'cpf'), 'cpf');
  t.is(validacoes.eRegistroNacional(' 711.477.475-39 ', 'cpf'), 'cpf');
  t.is(validacoes.eRegistroNacional('711.477.475-39', 'cpf'), 'cpf');

  t.is(validacoes.eRegistroNacional('16.555.517/0001-87', 'cnpj'), 'cnpj');
  t.is(validacoes.eRegistroNacional('14638632000190', 'cnpj'), 'cnpj');
  t.is(validacoes.eRegistroNacional(' 88.142.322/0001-16 ', 'cnpj'), 'cnpj');
  t.is(validacoes.eRegistroNacional('88.142.322/0001-16', 'cnpj'), 'cnpj');
  t.is(validacoes.eRegistroNacional('28716876000158', 'cnpj'), 'cnpj');
  t.is(validacoes.eRegistroNacional('13.381.462/0001-48', 'cnpj'), 'cnpj');
});

test("eRegistroNacional - Retorna 'false' caso não seja nem cpf nem cnpj", (t) => {
  t.is(validacoes.eRegistroNacional('foo bar'), false);
  t.is(validacoes.eRegistroNacional('14.638.632/0001-9'), false);
  t.is(validacoes.eRegistroNacional('434.803.222-05'), false);
  t.is(validacoes.eRegistroNacional('13.555.517/0001-87'), false);
  t.is(validacoes.eRegistroNacional('165.117.626-455'), false);
});

// eCnpj tests
test('eCnpj - Verifica que é possível validar cnpjs', (t) => {
  t.truthy(validacoes.eCnpj('16.555.517/0001-87'));
  t.truthy(validacoes.eCnpj('14638632000190'));
  t.truthy(validacoes.eCnpj(' 88.142.322/0001-16  '));
  t.truthy(validacoes.eCnpj('88.142.322/0001-16'));
  t.truthy(validacoes.eCnpj('28716876000158'));
  t.truthy(validacoes.eCnpj('13.381.462/0001-48'));
});

test('eCnpj - Retorna false para cnpj inválido', (t) => {
  t.falsy(validacoes.eCnpj('16.55.517/0001-87'));
  t.falsy(validacoes.eCnpj('146386320001901'));
  t.falsy(validacoes.eCnpj('foo bar'));
  t.falsy(validacoes.eCnpj('2328716876000158'));
  t.falsy(validacoes.eCnpj('a1 3.381.462/0001-48'));
});

// eMatriz tests
test('eMatriz - Verifica que é possivel identificar uma matriz pelo CNPJ', (t) => {
  t.truthy(validacoes.eMatriz('00.132.781/0001-78'));
  t.truthy(validacoes.eMatriz('00.000.000/0001-91'));
  t.truthy(validacoes.eMatriz('19950366000150'));

  t.is(validacoes.eMatriz('00123123000209'), false);
  t.is(validacoes.eMatriz('00123432000513'), false);
  t.is(validacoes.eMatriz('12123432009982'), false);
});

test('eMatriz - Verifica que retorna nulo caso não seja passado um CNPJ', (t) => {
  t.is(validacoes.eMatriz('123456'), null);
  t.is(validacoes.eMatriz('testando'), null);
});

// eFilial tests
test('eFilial - Verifica que é possível identificar uma filial pelo CNPJ, e que o seu número é retornado', (t) => {
  t.is(validacoes.eFilial('00.132.781/0001-78'), false);
  t.is(validacoes.eFilial('00.000.000/0001-91'), false);
  t.is(validacoes.eFilial('19950366000150'), false);

  t.is(validacoes.eFilial('00123123000209'), 2);
  t.is(validacoes.eFilial('00123432000513'), 5);
  t.is(validacoes.eFilial('12123432009982'), 99);
});

test('eFilial - Verifica que retorna nulo caso não seja passado um CNPJ', (t) => {
  t.is(validacoes.eFilial('123456'), null);
  t.is(validacoes.eFilial('testando'), null);
});

// eCpf tests
test('eCpf - Verifica que é possível validar cpfs', (t) => {
  t.truthy(validacoes.eCpf('  227.175.903-07   '));
  t.truthy(validacoes.eCpf('227.175.903-07'));
  t.truthy(validacoes.eCpf('16511762645'));
  t.truthy(validacoes.eCpf('434.803.222-04'));
  t.truthy(validacoes.eCpf('82647731330'));
  t.truthy(validacoes.eCpf('711.477.475-39'));
});

test('eCpf - Retorna false para cpf inválido', (t) => {
  t.falsy(validacoes.eCpf('227.175.903-08'));
  t.falsy(validacoes.eCpf('16511762645u'));
  t.falsy(validacoes.eCpf('foo bar'));
  t.falsy(validacoes.eCpf('826471731330'));
  t.falsy(validacoes.eCpf('731.477.475-39'));
});

// eNit tests
test('eNit - Verifica que é apenas um alias para .ePisPasep', (t) => {
  t.is(validacoes.ePisPasep.toString(), validacoes.eNit.toString());
});

// ePisPasep tests
test('ePisPasep - Verifica que é possível validar PIS/PASEPs', (t) => {
  t.truthy(validacoes.ePisPasep('  125.6932.537-8   '));
  t.truthy(validacoes.ePisPasep('125.6932.537-8'));
  t.truthy(validacoes.ePisPasep('12561040048'));
  t.truthy(validacoes.ePisPasep('125.8576.637-5'));
  t.truthy(validacoes.ePisPasep('12521311083'));
  t.truthy(validacoes.ePisPasep('125.4158.627-4'));
  t.truthy(validacoes.ePisPasep('131.42928.27-7'));
});

test('ePisPasep - Retorna false para PIS/PASEP inválido', (t) => {
  t.falsy(validacoes.ePisPasep('PIS is not a valid PIS'));
  t.falsy(validacoes.ePisPasep('125.0407.095-1'));
  t.falsy(validacoes.ePisPasep('125.7720.536-X'));
  t.falsy(validacoes.ePisPasep('125.3587.244-99'));
  t.falsy(validacoes.ePisPasep(' '));
});
