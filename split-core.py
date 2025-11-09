#!/usr/bin/env python3
"""
Separa boletoUtils.js em arquivos individuais
"""
import re
from pathlib import Path

BASE = Path("/Users/romulosantos/workstation/git-hub-portifolio/gerar-boletos")
core_file = BASE / "lib/core/boletoUtils.js"
content = core_file.read_text()

print("🔍 Extraindo classes de boletoUtils.js...")

# Headers comuns
header = """const formatacoes = require('../formatters/formatacoesUtils');
const validacoes = require('../validators/validacoesUtils');
const StringUtils = require('../utils/string');
const { parseISO, parse, isValid } = require('date-fns');
const pad = StringUtils.pad;
"""

# 1. Extrair Pagador
pagador_match = re.search(r'(const Pagador = \(function \(\).*?^\};$)', content, re.MULTILINE | re.DOTALL)
if pagador_match:
    pagador_code = pagador_match.group(1)
    pagador_code += "\n\nmodule.exports = Pagador;\n"
    
    pagador_file = BASE / "lib/core/pagador.js"
    pagador_file.write_text(header + "\n" + pagador_code)
    print(f"✓ pagador.js criado ({len(pagador_code)} chars)")

# 2. Extrair Beneficiario
beneficiario_match = re.search(r'(const Beneficiario = \(function \(\).*?^\};$)', content, re.MULTILINE | re.DOTALL)
if beneficiario_match:
    beneficiario_code = beneficiario_match.group(1)
    beneficiario_code += "\n\nmodule.exports = Beneficiario;\n"
    
    beneficiario_file = BASE / "lib/core/beneficiario.js"
    beneficiario_file.write_text(header + "\n" + beneficiario_code)
    print(f"✓ beneficiario.js criado ({len(beneficiario_code)} chars)")

# 3. Extrair Datas
datas_match = re.search(r'(const Datas = \(function \(\).*?^\};$)', content, re.MULTILINE | re.DOTALL)
if datas_match:
    datas_code = datas_match.group(1)
    datas_code += "\n\nmodule.exports = Datas;\n"
    
    datas_file = BASE / "lib/core/datas.js"
    datas_file.write_text(header + "\n" + datas_code)
    print(f"✓ datas.js criado ({len(datas_code)} chars)")

# 4. Extrair Endereco
endereco_match = re.search(r'(const Endereco = \(function \(\).*?^\};$)', content, re.MULTILINE | re.DOTALL)
if endereco_match:
    endereco_code = endereco_match.group(1)
    endereco_code += "\n\nmodule.exports = Endereco;\n"
    
    endereco_file = BASE / "lib/core/endereco.js"
    endereco_file.write_text(header + "\n" + endereco_code)
    print(f"✓ endereco.js criado ({len(endereco_code)} chars)")

# 5. Criar boleto.js com o resto
print("\n📝 Criando boleto.js com Boleto class e exports...")

# Extrair Boleto
boleto_match = re.search(r'(const Boleto = \(function \(\).*?^\};$)', content, re.MULTILINE | re.DOTALL)
if boleto_match:
    boleto_code = boleto_match.group(1)
    
    # Criar arquivo boleto.js
    boleto_content = f"""{header}
const Pagador = require('./pagador');
const Beneficiario = require('./beneficiario');
const Datas = require('./datas');
const Endereco = require('./endereco');

const Itau = require('../banks/itau');
const Caixa = require('../banks/caixa');
const Bradesco = require('../banks/bradesco');
const BancoBrasil = require('../banks/banco-do-brasil');
const Cecred = require('../banks/cecred');
const Sicoob = require('../banks/sicoob');
const Santander = require('../banks/santander');
const Sicredi = require('../banks/sicredi');

const Gerador = require('../generators/boleto-generator');
const GeradorDeLinhaDigitavel = require('../generators/line-formatter');

const especiesDeDocumento = {{
  DMI: 'Duplicata de Venda Mercantil por Indicação',
  DM: 'Duplicata de Venda Mercantil',
  DSI: 'Duplicata de Prestação de Serviços por Indicação de Comprovante',
  NP: 'Nota Promissória',
  ME: 'Mensalidade Escolar',
  DS: 'Duplicata de Prestação de Serviços Original',
  CT: 'Espécie de Contrato',
  LC: 'Letra de Câmbio',
  CPS: 'Conta de Prestação de Serviços de Profissional Liberal ou Declaração do Profissional',
  EC: 'Encargos Condominiais',
  DD: 'Documento de Dívida',
  CCB: 'Cédula de Crédito Bancário',
  CBI: 'Cédula de Crédito Bancário por Indicação',
  CH: 'Cheque',
  CM: 'Contrato de Mútuo',
  RA: 'Recibo de Aluguel Para Pessoa Jurídica (Contrato Aluguel e Recibo)',
  CD: 'Confissão de Dívida Apenas Para Falência de Declaração do Devedor',
  FS: 'Fatura de Serviço',
  TA: 'Termo de Acordo - Ex. Ação Trabalhista',
  CC: 'Contrato de Câmbio',
  DV: 'Diversos',
}};

const bancos = {{
  Itau, 341: Itau,
  Caixa, 104: Caixa,
  Bradesco, 237: Bradesco,
  BancoBrasil, '001': BancoBrasil,
  Cecred, '085': Cecred,
  Sicoob, 756: Sicoob,
  Santander, '033': Santander,
  Sicredi, 748: Sicredi,
}};

{boleto_code}

module.exports = Boleto;
module.exports.Boleto = Boleto;
module.exports.Pagador = Pagador;
module.exports.Beneficiario = Beneficiario;
module.exports.Datas = Datas;
module.exports.Endereco = Endereco;
module.exports.Gerador = Gerador;
module.exports.especiesDeDocumento = especiesDeDocumento;
module.exports.bancos = bancos;
"""
    
    boleto_file = BASE / "lib/core/boleto.js"
    boleto_file.write_text(boleto_content)
    print(f"✓ boleto.js criado")

# 6. Criar index.js
index_content = """module.exports = require('./boleto');
"""
index_file = BASE / "lib/core/index.js"
index_file.write_text(index_content)
print(f"✓ index.js criado")

print("\n✨ Classes extraídas! Agora precisa atualizar imports...")
