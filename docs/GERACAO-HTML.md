# Geração de Boletos em HTML

Este módulo permite gerar boletos bancários usando templates HTML, além do método tradicional com PDFKit.

## Métodos Disponíveis

### 1. `gerarHTML()`

Gera o HTML do boleto como string.

```javascript
const { Boleto } = require('gerar-boletos');

const boleto = new Boleto(configuracao);
const html = await boleto.gerarHTML();

// Salvar em arquivo
const fs = require('fs');
fs.writeFileSync('boleto.html', html, 'utf-8');
```

### 2. `gerarPDFFromHTML(options)`

Converte o HTML do boleto para PDF usando Puppeteer.

**Requer instalação do Puppeteer:**

```bash
npm install puppeteer
```

**Uso:**

```javascript
const { Boleto } = require('gerar-boletos');

const boleto = new Boleto(configuracao);

// Retorna Buffer do PDF
const pdfBuffer = await boleto.gerarPDFFromHTML();

// Ou salva direto em arquivo
await boleto.gerarPDFFromHTML({
  outputPath: './boleto.pdf',
});

// Com opções customizadas
await boleto.gerarPDFFromHTML({
  outputPath: './boleto.pdf',
  format: 'A4',
  printBackground: true,
  margin: {
    top: '5mm',
    right: '5mm',
    bottom: '5mm',
    left: '5mm',
  },
});
```

### 3. `gerarPDF()` (Método Original)

Gera PDF usando PDFKit (método tradicional).

```javascript
const boleto = new Boleto(configuracao);
const stream = fs.createWriteStream('boleto.pdf');
await boleto.gerarPDF({ stream });
```

## Comparação entre os Métodos

| Característica     | HTML        | PDF via HTML | PDF Tradicional   |
| ------------------ | ----------- | ------------ | ----------------- |
| Dependências       | Nenhuma     | Puppeteer    | PDFKit (incluído) |
| Customização       | Fácil (CSS) | Fácil (CSS)  | Código            |
| Performance        | Rápida      | Média        | Rápida            |
| Tamanho do arquivo | Pequeno     | Médio        | Pequeno           |
| Suporte PIX        | Sim         | Sim          | Sim               |

## Template HTML

O template HTML está localizado em:

```
lib/generators/templates/boleto-template.html
```

Você pode customizar o template editando:

- Estilos CSS
- Estrutura HTML
- Layout dos campos

## Exemplos

Veja os exemplos completos em:

- `examples/gerar-boleto-html.js` - Exemplo básico de HTML
- `examples/gerar-boleto-html-completo.js` - Exemplo completo com todos os métodos

## Suporte a PIX

O template HTML inclui suporte automático para QR Code PIX:

```javascript
const boleto = new Boleto({
  // ... configuração normal
  pix: {
    chavePix: 'meuemail@exemplo.com',
    emv: 'código EMV aqui',
  },
});

const html = await boleto.gerarHTML();
// O QR Code PIX e o campo "Pix Copia e Cola" serão incluídos automaticamente
```

## Conversão HTML para PDF sem Puppeteer

Se você não quiser instalar o Puppeteer, pode:

1. **Usar o navegador:**
   - Abrir o arquivo HTML
   - Usar "Imprimir para PDF" (Ctrl+P)

2. **Usar outras bibliotecas:**

   ```bash
   npm install html-pdf-node
   ```

3. **Usar serviços online:**
   - wkhtmltopdf
   - WeasyPrint
   - Prince XML

## Troubleshooting

### Erro: "Puppeteer não está instalado"

```bash
npm install puppeteer
```

### Imagens não aparecem no PDF

Certifique-se de que as imagens (logo do banco, código de barras) estão usando caminhos absolutos ou data URLs.

### Layout quebrado

Verifique se os estilos CSS estão sendo aplicados corretamente. O template usa estilos inline para garantir compatibilidade.
