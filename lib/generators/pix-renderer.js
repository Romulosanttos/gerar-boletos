'use strict';

const path = require('path');
const { gerarQRCodePixDataURL } = require('./qrcode-generator');

/**
 * Classe responsável pela renderização de elementos PIX no boleto
 */
class PixRenderer {
  constructor(pdf, boleto, args, basePositions) {
    this.pdf = pdf;
    this.boleto = boleto;
    this.args = args;
    this.margemDoSegundoBloco = basePositions.margemDoSegundoBloco;
    this.larguraInstrucoes = basePositions.larguraInstrucoes;
    this.tituloDaSetimaLinha = basePositions.tituloDaSetimaLinha;

    // Constantes de layout
    this.TAMANHO_QR_CODE = 100;
    this.TAMANHO_LOGO_PIX = 100;
    this.ESPACAMENTO_LINHA = 11;
    this.LARGURA_TEXTO = 210;
  }

  /**
   * Calcula posições exatas para todos os elementos PIX
   * Valores EXATOS do código original funcionando
   */
  calcularPosicoes() {
    // Posicionar QR Code (movido mais para esquerda)
    const qrCodeX = this.args.ajusteX + this.margemDoSegundoBloco + this.larguraInstrucoes + 60;
    const qrCodeY = this.args.ajusteY + this.tituloDaSetimaLinha + 12;

    // Linha vertical contínua à esquerda da imagem PIX (mais à esquerda)
    const linhaVerticalX =
      this.args.ajusteX + this.margemDoSegundoBloco + this.larguraInstrucoes - 40;

    // Imagem PIX ao lado esquerdo do QR Code (mesmo tamanho 100x100)
    const imagemPixX = linhaVerticalX + 3; // Mais próximo da linha
    const imagemPixY = qrCodeY; // Alinhado verticalmente com QR Code

    // Texto das instruções PIX acima do QR Code (mais visível)
    const espacamentoEntreLinhas = 11;
    const textoPixY = qrCodeY + 70; // Mais acima e com mais espaçamento
    const textoPixX = linhaVerticalX + 20; // Alinhado com início da área PIX

    return {
      linha: {
        x: linhaVerticalX,
        yInicio: qrCodeY - 13,
        yFim: qrCodeY + 103,
      },
      logo: {
        x: imagemPixX,
        y: imagemPixY,
        width: this.TAMANHO_LOGO_PIX,
        height: this.TAMANHO_LOGO_PIX,
      },
      qrCode: {
        x: qrCodeX,
        y: qrCodeY,
        width: this.TAMANHO_QR_CODE,
        height: this.TAMANHO_QR_CODE,
      },
      texto: {
        x: textoPixX,
        y: this.args.ajusteY + textoPixY,
        width: 0, // Largura para cobrir logo + QR Code
        espacamento: espacamentoEntreLinhas,
      },
    };
  }

  /**
   * Renderiza a linha vertical separadora
   */
  renderizarLinha(posicoes) {
    this.pdf
      .undash() // Garantir linha contínua
      .moveTo(posicoes.linha.x, posicoes.linha.yInicio)
      .lineTo(posicoes.linha.x, posicoes.linha.yFim)
      .lineWidth(1)
      .stroke(this.args.corDoLayout);
  }

  /**
   * Renderiza a logo PIX
   */
  renderizarLogoPix(posicoes) {
    try {
      const caminhoImagemPix = path.join(__dirname, '../banks/logotipos/pix-logo.png');
      this.pdf.image(caminhoImagemPix, posicoes.logo.x, posicoes.logo.y, {
        width: posicoes.logo.width,
        height: posicoes.logo.height,
      });
    } catch (error) {
      console.error('Erro ao carregar imagem PIX:', error);
    }
  }

  /**
   * Renderiza o QR Code PIX
   */
  async renderizarQRCode(emvString, posicoes) {
    const qrCodeDataURL = await gerarQRCodePixDataURL(emvString, {
      width: this.TAMANHO_QR_CODE,
      margin: 1,
    });

    this.pdf.image(qrCodeDataURL, posicoes.qrCode.x, posicoes.qrCode.y, {
      width: posicoes.qrCode.width,
      height: posicoes.qrCode.height,
    });
  }

  /**
   * Renderiza as instruções PIX
   */
  renderizarInstrucoes(instrucoesPixArray, posicoes) {
    instrucoesPixArray.forEach((instrucao, indice) => {
      this.pdf
        .font('normal')
        .fontSize(this.args.tamanhoDaFonte)
        .text(instrucao, posicoes.texto.x, posicoes.texto.y + indice * posicoes.texto.espacamento, {
          width: posicoes.texto.width,
          align: 'center',
          lineBreak: false,
        });
    });
  }

  /**
   * Método principal que orquestra toda a renderização PIX
   */
  async render() {
    try {
      // Obter dados PIX
      const emvString = this.boleto.getPixEmvString();
      const instrucoesPixArray = this.boleto.getPixInstrucoes();

      if (!emvString) {
        throw new Error('Código EMV do PIX não encontrado');
      }

      // Calcular todas as posições de uma vez
      const posicoes = this.calcularPosicoes();

      // Renderizar elementos na ordem correta
      this.renderizarLinha(posicoes);
      this.renderizarLogoPix(posicoes);
      await this.renderizarQRCode(emvString, posicoes);
      this.renderizarInstrucoes(instrucoesPixArray, posicoes);
    } catch (error) {
      console.error('Erro ao gerar área PIX:', error);
      throw error;
    }
  }
}

module.exports = PixRenderer;
