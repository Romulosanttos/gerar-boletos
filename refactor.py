#!/usr/bin/env python3
import os
import re
import shutil
from pathlib import Path

BASE = Path("/Users/romulosantos/workstation/git-hub-portifolio/gerar-boletos")
LIB = BASE / "lib"

print("🚀 Iniciando refatoração completa...")

# 1. Criar estrutura
print("\n📁 Criando estrutura de pastas...")
(LIB / "banks").mkdir(exist_ok=True)
(LIB / "core").mkdir(exist_ok=True)
(LIB / "generators").mkdir(exist_ok=True)
(LIB / "validators").mkdir(exist_ok=True)
(LIB / "formatters").mkdir(exist_ok=True)

# 2. Renomear utils
print("\n📝 Renomeando utils...")
utils_renames = {
    "string-utils.js": "string.js",
    "math-utils.js": "math.js",
    "array-utils.js": "array.js",
    "date-utils.js": "date.js",
    "object-utils.js": "object.js",
    "stream-utils.js": "stream.js",
}
for old, new in utils_renames.items():
    old_path = LIB / "utils" / old
    new_path = LIB / "utils" / new
    if old_path.exists() and not new_path.exists():
        shutil.move(str(old_path), str(new_path))
        print(f"  ✓ {old} → {new}")

# 3. Renomear generators
print("\n📝 Renomeando generators...")
gen_renames = {
    "codigo-de-barras-builder.js": "barcode-builder.js",
    "gerador-de-digito-padrao.js": "digit-generator.js",
    "gerador-de-linha-digitavel.js": "line-formatter.js",
    "gerador-de-boleto.js": "boleto-generator.js",
}
for old, new in gen_renames.items():
    old_path = LIB / "boleto" / old
    new_path = LIB / "generators" / new
    if old_path.exists():
        shutil.move(str(old_path), str(new_path))
        print(f"  ✓ {old} → {new}")

# 4. Mover pdf-gerador
if (LIB / "pdf-gerador.js").exists():
    shutil.move(str(LIB / "pdf-gerador.js"), str(LIB / "generators" / "pdf-generator.js"))
    print("  ✓ pdf-gerador.js → pdf-generator.js")

# 5. Mover fontes e imagens
for folder in ["fontes", "imagens"]:
    src = LIB / "boleto" / folder
    if src.exists():
        shutil.move(str(src), str(LIB / "generators" / folder))
        print(f"  ✓ {folder} → generators/")

# 6. Mover bancos (sem renomear por enquanto - manter nomes PT)
print("\n📝 Movendo bancos...")
bancos_path = LIB / "boleto" / "bancos"
if bancos_path.exists():
    for banco in bancos_path.glob("*.js"):
        shutil.copy(str(banco), str(LIB / "banks" / banco.name))
        print(f"  ✓ {banco.name}")
    
    # Mover logotipos
    logos = bancos_path / "logotipos"
    if logos.exists():
        shutil.copytree(str(logos), str(LIB / "banks" / "logotipos"), dirs_exist_ok=True)
        print("  ✓ logotipos/")

# 7. Mover core files
print("\n📝 Movendo core...")
shutil.copy(str(LIB / "utils" / "functions" / "boletoUtils.js"), str(LIB / "core" / "boletoUtils.js"))
print("  ✓ boletoUtils.js")

# 8. Mover validators
print("\n📝 Movendo validators...")
shutil.copy(str(LIB / "utils" / "functions" / "validacoesUtils.js"), str(LIB / "validators" / "validacoesUtils.js"))
print("  ✓ validacoesUtils.js")

# 9. Mover formatters
print("\n📝 Movendo formatters...")
shutil.copy(str(LIB / "utils" / "functions" / "formatacoesUtils.js"), str(LIB / "formatters" / "formatacoesUtils.js"))
print("  ✓ formatacoesUtils.js")

# 10. Atualizar todos os imports
print("\n🔧 Atualizando imports...")

def update_imports(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Utils renames
    content = re.sub(r"require\(['\"](.*)string-utils['\"]\)", r"require('\1string')", content)
    content = re.sub(r"require\(['\"](.*)math-utils['\"]\)", r"require('\1math')", content)
    content = re.sub(r"require\(['\"](.*)array-utils['\"]\)", r"require('\1array')", content)
    content = re.sub(r"require\(['\"](.*)date-utils['\"]\)", r"require('\1date')", content)
    content = re.sub(r"require\(['\"](.*)object-utils['\"]\)", r"require('\1object')", content)
    content = re.sub(r"require\(['\"](.*)stream-utils['\"]\)", r"require('\1stream')", content)
    
    # Generators renames
    content = re.sub(r"codigo-de-barras-builder", "barcode-builder", content)
    content = re.sub(r"gerador-de-digito-padrao", "digit-generator", content)
    content = re.sub(r"gerador-de-linha-digitavel", "line-formatter", content)
    content = re.sub(r"gerador-de-boleto", "boleto-generator", content)
    content = re.sub(r"pdf-gerador", "pdf-generator", content)
    
    # Path updates
    content = re.sub(r"utils/functions/boletoUtils", "core/boletoUtils", content)
    content = re.sub(r"utils/functions/validacoesUtils", "validators/validacoesUtils", content)
    content = re.sub(r"utils/functions/formatacoesUtils", "formatters/formatacoesUtils", content)
    content = re.sub(r"utils/functions/bancosUtils", "utils/bancosUtils", content)
    content = re.sub(r"boleto/bancos/", "banks/", content)
    content = re.sub(r"\.\./boleto/", "../generators/", content)
    content = re.sub(r"\./boleto/", "./generators/", content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

# Atualizar todos os arquivos .js
for js_file in LIB.rglob("*.js"):
    if update_imports(js_file):
        print(f"  ✓ {js_file.relative_to(LIB)}")

# Atualizar testes
tests_dir = BASE / "tests"
for js_file in tests_dir.rglob("*.js"):
    if update_imports(js_file):
        print(f"  ✓ tests/{js_file.relative_to(tests_dir)}")

print("\n✨ Refatoração concluída!")
print("\n🧪 Rodando testes...")
os.system(f"cd {BASE} && npm test 2>&1 | grep 'OK:'")
