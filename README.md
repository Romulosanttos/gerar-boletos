# 🏦 gerar-boletos

> Biblioteca Node.js para geração de boletos bancários brasileiros em PDF e PNG com suporte a PIX

[![NPM Version](https://img.shields.io/npm/v/gerar-boletos.svg)](https://npmjs.org/package/gerar-boletos)
[![Downloads](https://img.shields.io/npm/dm/gerar-boletos.svg)](https://npm-stat.com/charts.html?package=gerar-boletos)
[![License](https://img.shields.io/npm/l/gerar-boletos.svg)](LICENSE)
[![Node Version](https://img.shields.io/node/v/gerar-boletos.svg)](package.json)

## 📋 Sobre

Biblioteca completa e robusta para geração de boletos bancários em formato PDF e PNG utilizando [PDFKit](https://pdfkit.org/). Suporta os principais bancos brasileiros com validações de código de barras, linha digitável, QR Code PIX e layout padronizado FEBRABAN.

### 🎯 Novidades

- ✨ **Geração de PNG** - Converta boletos para imagem diretamente
- 📱 **QR Code PIX** - Suporte completo para pagamentos via PIX
- 🚀 **API Simplificada** - Código mais limpo com async/await
- 💾 **Stream em Memória** - Gere imagens sem arquivos temporários

### ✨ Bancos Suportados

| Banco                      | Código | Status       |
| -------------------------- | ------ | ------------ |
| 🏛️ Banco do Brasil         | 001    | ✅ Suportado |
| 🔴 Bradesco                | 237    | ✅ Suportado |
| 🔵 Caixa Econômica Federal | 104    | ✅ Suportado |
| 🟠 Itaú                    | 341    | ✅ Suportado |
| 🟢 Sicoob                  | 756    | ✅ Suportado |
| 🟡 Sicredi                 | 748    | ✅ Suportado |
| 🔴 Santander               | 033    | ✅ Suportado |
| 🟣 Ailos (Cecred)          | 085    | ✅ Suportado |

## 🚀 Instalação

```bash
npm install gerar-boletos
```

```bash
yarn add gerar-boletos
```

```bash
pnpm add gerar-boletos
```

**Requisitos**: Node.js >= 16.0.0

## 📖 Uso Rápido

### Exemplo Básico (PDF + PNG)

```javascript
const { Bancos, Boletos } = require('gerar-boletos');

// Configurar dados do boleto
const boleto = {
  banco: new Bancos.Bradesco(),
  pagador: {
    nome: 'João Silva',
    RegistroNacional: '12345678900',
    endereco: {
      logradouro: 'Rua Exemplo, 123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estadoUF: 'SP',
      cep: '01000-000',
    },
  },
  beneficiario: {
    nome: 'Empresa LTDA',
    cnpj: '12345678000199',
    dadosBancarios: {
      carteira: '09',
      agencia: '1234',
      agenciaDigito: '5',
      conta: '567890',
      contaDigito: '1',
      nossoNumero: '12345678',
      nossoNumeroDigito: '9',
    },
    endereco: {
      logradouro: 'Av. Paulista, 1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      estadoUF: 'SP',
      cep: '01310-100',
    },
  },
  boleto: {
    numeroDocumento: 'DOC-123',
    especieDocumento: 'DM',
    valor: 150.0,
    datas: {
      vencimento: '2025-12-31',
      processamento: '2025-11-09',
      documentos: '2025-11-09',
    },
  },
  instrucoes: [
    'Não aceitar após o vencimento',
    'Multa de 2% após vencimento',
    'Juros de mora de 0,5% ao dia',
  ],
};

// Gerar boleto
const novoBoleto = new Boletos(boleto);
novoBoleto.gerarBoleto();

// Gerar PDF e PNG
async function gerarBoletos() {
  // Gerar PDF
  const { filePath: pdfPath } = await novoBoleto.pdfFile('./boletos', 'bradesco');
  console.log(`PDF: ${pdfPath}`);

  // Gerar PNG
  const pngPaths = await novoBoleto.pngFile('./boletos', 'bradesco', { scale: 2.0 });
  console.log(`PNG: ${pngPaths.join(', ')}`);
}

gerarBoletos();
```

### 📱 Boleto com QR Code PIX

```javascript
const pixEmv = '00020126580014br.gov.bcb.pix0136...'; // String EMV do banco

const boleto = {
  banco: new Bancos.Bradesco(),
  // ... outros dados ...
  boleto: {
    numeroDocumento: 'DOC-123',
    valor: 150.0,
    datas: {
      /* ... */
    },
    // Adicionar PIX
    pixEmv: {
      emv: pixEmv,
      instrucoes: ['Pague via PIX usando o QR Code.'],
    },
  },
};
```

### 🖼️ Gerar apenas PNG (sem PDF)

```javascript
// PNG em arquivo
const pngPaths = await novoBoleto.pngFile('./boletos', 'bradesco', { scale: 2.0 });

// PNG em memória (Buffer)
const images = await novoBoleto.pngBuffer({ scale: 3.0 });
images.forEach(({ page, buffer }) => {
  console.log(`Página ${page}: ${buffer.length} bytes`);
  // Use o buffer como necessário
});
```

### 📄 Usando Stream (PDF)

```javascript
const fs = require('fs');

// Gerar em stream customizado
const stream = fs.createWriteStream('./meu-boleto.pdf');
await novoBoleto.pdfStream(stream);
```

## 🎨 API Completa

### Métodos Disponíveis

```javascript
// PDF
await novoBoleto.pdfFile(dir, filename); // Retorna: { boleto, filePath }
await novoBoleto.pdfStream(stream); // Retorna: { boleto }

// PNG
await novoBoleto.pngFile(dir, filename, opts); // Retorna: [filePaths]
await novoBoleto.pngBuffer(opts); // Retorna: [{ page, buffer, mimeType }]

// Opções PNG
// opts = { scale: 2.0 }  // 1.0 a 3.0 (qualidade da imagem)
```

### Configurações Específicas por Banco

#### 🏛️ Banco do Brasil

```javascript
dadosBancarios: {
  carteira: '17',
  convenio: '1234567',              // 4, 6 ou 7 dígitos
  nossoNumero: '12345678901234567', // 17 dígitos (convênio 7)
  // ou nossoNumero: '12345678901'  // 11 dígitos (convênio 4 ou 6)
}
```

#### 🔴 Bradesco

```javascript
dadosBancarios: {
  carteira: '09',
  agencia: '1234',
  conta: '567890',
  nossoNumero: '12345678',  // 8 a 11 dígitos
}
```

#### 🟡 Sicredi

```javascript
dadosBancarios: {
  carteira: '1',            // 1 dígito
  agencia: '0123',
  conta: '45678',
  nossoNumero: '12345678',  // 8 dígitos
}
```

## 🧪 Testes

A biblioteca possui **184 testes automatizados** com **88% de cobertura**:

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## 🛠️ Desenvolvimento

```bash
# Clonar repositório
git clone https://github.com/Romulosanttos/gerar-boletos.git
cd gerar-boletos

# Instalar dependências
npm install

# Executar exemplos (gera PDF + PNG com PIX)
npm run gerar:Bradesco   # Gera bradesco.pdf e bradesco.png
npm run gerar:Brasil     # Gera banco-do-brasil.pdf e banco-do-brasil.png
npm run gerar:Cecred     # Gera cecred.pdf e cecred.png
npm run gerar:Sicredi    # Gera sicredi.pdf e sicredi.png
npm run gerar:all        # Gera todos os exemplos

# Linting
npm run lint
npm run lint:fix

# Formatação
npm run format
npm run format:check
```

## 📁 Estrutura do Projeto

```
gerar-boletos/
├── lib/
│   ├── banks/           # Implementações dos bancos
│   ├── core/            # Classes principais (Boleto, Datas, etc)
│   ├── generators/      # Geradores de PDF e código de barras
│   ├── formatters/      # Formatadores de dados
│   ├── validators/      # Validadores
│   └── utils/           # Utilitários
├── examples/            # Exemplos de uso
├── tests/               # Testes automatizados
└── tmp/boletos/         # PDFs gerados (gitignored)
```

## 📚 Exemplos

Exemplos completos disponíveis em [`/examples`](./examples):

- [Banco do Brasil](./examples/gerar-boleto-BancoDoBrasil.js) - Com PIX
- [Bradesco](./examples/gerar-boleto-bradesco.js) - Com PIX
- [Cecred (Ailos)](./examples/gerar-boleto-cecred.js) - Com PIX
- [Sicredi](./examples/gerar-boleto-sicredi.js) - Com PIX
- [Boleto com PIX](./examples/gerar-boleto-com-pix.js) - Exemplo completo
- [Apenas PNG](./examples/gerar-boleto-png.js) - Geração de imagem

Todos os exemplos geram automaticamente **PDF + PNG** com **QR Code PIX**.

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- ✅ ESLint + Prettier configurados
- ✅ Testes obrigatórios para novas features
- ✅ Commits semânticos (feat, fix, docs, etc)
- ✅ Cobertura mínima de 80%

## 📄 Licença

Este projeto está licenciado sob [GNU AGPL-3.0](LICENSE) - veja o arquivo LICENSE para detalhes.

## 👤 Autor

- 💼 GitHub: [@Romulosanttos](https://github.com/Romulosanttos)

## 📊 Status do Projeto

- ✅ 184 testes automatizados
- ✅ 88% de cobertura de código
- ✅ 8 bancos suportados
- ✅ Geração de PDF e PNG
- ✅ QR Code PIX integrado
- ✅ Validação completa de códigos de barras
- ✅ Layout padronizado FEBRABAN
- ✅ Stream em memória (sem arquivos temporários)

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
