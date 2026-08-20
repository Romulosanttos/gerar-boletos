'use strict';

const fs = require('fs');
const path = require('path');
const ObjectUtils = require('../utils/object');
const GeradorDeLinhaDigitavel = require('./line-formatter');

const htmlDefaults = {
  autor: '',
  titulo: '',
  criador: '',
  creditos: '',
};

class GeradorDeHTML {
  constructor(boletos, args = {}) {
    if (!Array.isArray(boletos)) {
      boletos = [boletos];
    }
    this._boletos = boletos;
    this._args = ObjectUtils.merge(htmlDefaults, args);
  }

  gerarBoletoHTML(boleto, indice, total) {
    const banco = boleto.getBanco();
    const pagador = boleto.getPagador();
    const beneficiario = boleto.getBeneficiario();
    const datas = boleto.getDatas();
    const enderecoDoBeneficiario = beneficiario.getEndereco();
    const enderecoDoPagador = pagador.getEndereco();

    const codigoDeBarras = banco.geraCodigoDeBarrasPara(boleto);
    const linhaDigitavel = GeradorDeLinhaDigitavel(codigoDeBarras, banco);

    // Formatar linha digitável com espaços
    const linhaDigitavelFormatada = linhaDigitavel;

    // Gerar QR Code PIX se existir
    let pixHtml = '';
    const pixEmvString = boleto.getPixEmvString ? boleto.getPixEmvString() : null;
    if (pixEmvString) {
      pixHtml = `
        <tr>
          <td colspan="7" class="sem-borda">
            <table style="margin-top: 10px;">
              <tr>
                <td class="sem-borda">
                  <img class="qrcode-pix" src="{{QR_CODE_PIX_${indice}}}" alt="QR Code PIX">
                </td>
                <td class="sem-borda">
                  <div class="pix-copia-cola">
                    <b>Pix Copia e Cola:</b><br>
                    ${pixEmvString}
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    }

    const boletoHTML = `
    <div class="pagina">
        <!-- RECIBO DO PAGADOR -->
        <table>
            <tr>
                <td class="borda-left logo cabecalho">
                    <img src="{{LOGO_BANCO}}" width="32">
                    ${banco.getNome()}
                </td>
                <td class="borda-left cabecalho center">${banco.getNumeroFormatadoComDigito()}</td>
                <td class="sem-borda cabecalho right" colspan="5">
                    Recibo do Pagador<br>
                    ${linhaDigitavelFormatada}
                </td>
            </tr>
            <tr>
                <td class="left" colspan="6">
                    <p>Nome do Pagador</p>
                    ${pagador.getIdentificacao()}
                </td>
                <td class="center">
                    <p>Vencimento</p>
                    ${datas.getVencimentoFormatado()}
                </td>
            </tr>
            <tr>
                <td class="left" colspan="5">
                    <p>Agência/Código Beneficiário</p>
                    ${banco.getAgenciaECodigoBeneficiario(boleto)}
                </td>
                <td class="center" colspan="2">
                    <p>Nosso Número</p>
                    ${banco.getNossoNumeroECodigoDocumento(boleto)}
                </td>
            </tr>
        </table>
        <p class="lb-autenticacao"><b>Autenticação Mecânica</b></p>
        <hr><br>

        <!-- FICHA DE COMPENSAÇÃO -->
        <table>
            <tr>
                <td class="borda-left logo cabecalho">
                    <img src="{{LOGO_BANCO}}" width="32">
                    ${banco.getNome()}
                </td>
                <td class="borda-left cabecalho center">${banco.getNumeroFormatadoComDigito()}</td>
                <td class="sem-borda cabecalho right" colspan="5">
                    ${linhaDigitavelFormatada}
                </td>
            </tr>
            <tr>
                <td class="left" colspan="6">
                    <p>Local de Pagamento</p>
                    Em qualquer banco ou correspondente não bancário mesmo após o vencimento.
                </td>
                <td class="center">
                    <p>Vencimento</p>
                    ${datas.getVencimentoFormatado()}
                </td>
            </tr>
            <tr>
                <td class="left" colspan="6">
                    <p>Beneficiário</p>
                    ${beneficiario.getIdentificacao()}
                    ${enderecoDoBeneficiario ? '<br>' + enderecoDoBeneficiario.getPrimeiraLinha() : ''}
                    ${enderecoDoBeneficiario && enderecoDoBeneficiario.getSegundaLinha() ? '<br>' + enderecoDoBeneficiario.getSegundaLinha() : ''}
                </td>
                <td class="center">
                    <p>Agência/Código Beneficiário</p>
                    ${banco.getAgenciaECodigoBeneficiario(boleto)}
                </td>
            </tr>
            <tr>
                <td class="center">
                    <p>Data do documento</p>
                    ${datas.getDocumentoFormatado()}
                </td>
                <td class="center" colspan="2">
                    <p>Nº do documento</p>
                    ${boleto.getNumeroDoDocumentoFormatado()}
                </td>
                <td class="center">
                    <p>Espécie Doc.</p>
                    ${boleto.getEspecieDocumento()}
                </td>
                <td class="center">
                    <p>Aceite</p>
                    ${boleto.getAceiteFormatado()}
                </td>
                <td class="center">
                    <p>Data Processamento</p>
                    ${datas.getProcessamentoFormatado()}
                </td>
                <td class="center">
                    <p>Nosso Número</p>
                    ${banco.getNossoNumeroECodigoDocumento(boleto)}
                </td>
            </tr>
            <tr>
                <td class="center">
                    <p>Uso do Banco</p>
                    <br>
                </td>
                <td class="center">
                    <p>Carteira</p>
                    ${banco.getCarteiraTexto(beneficiario)}
                </td>
                <td class="center">
                    <p>Espécie</p>
                    ${boleto.getEspecieMoeda()}
                </td>
                <td class="center" colspan="2">
                    <p>Quantidade</p>
                    <br>
                </td>
                <td class="center">
                    <p>Valor</p>
                    <br>
                </td>
                <td class="center">
                    <p>(=) Valor do Documento</p>
                    ${boleto.getValorFormatadoBRL()}
                </td>
            </tr>
            <tr>
                <td class="left" colspan="6" rowspan="4">
                    <p>Instruções</p>
                    ${boleto.getInstrucoes().join('<br>')}
                </td>
                <td class="center">
                    <p>(-) Desconto/Abatimento</p>
                    ${boleto.getValorDescontosFormatadoBRL()}
                </td>
            </tr>
            <tr>
                <td class="center">
                    <p>(-) Outras Deduções</p>
                    ${boleto.getValorDeducoesFormatadoBRL()}
                </td>
            </tr>
            <tr>
                <td class="center">
                    <p>(+) Mora/Multa</p>
                    <br>
                </td>
            </tr>
            <tr>
                <td class="center">
                    <p>(=) Valor Cobrado</p>
                    <br>
                </td>
            </tr>
            <tr>
                <td colspan="7">
                    <table>
                        <tr>
                            <td class="sem-borda"><b>Pagador: </b> ${pagador.getIdentificacao()}</td>
                        </tr>
                        ${
                          enderecoDoPagador && enderecoDoPagador.getPrimeiraLinha()
                            ? `
                        <tr>
                            <td class="sem-borda">${enderecoDoPagador.getPrimeiraLinha()}</td>
                        </tr>
                        `
                            : ''
                        }
                        ${
                          enderecoDoPagador && enderecoDoPagador.getSegundaLinha()
                            ? `
                        <tr>
                            <td class="sem-borda">${enderecoDoPagador.getSegundaLinha()}</td>
                        </tr>
                        `
                            : ''
                        }
                    </table>
                </td>
            </tr>
            ${pixHtml}
        </table>
        <br>
        <table>
            <tr>
                <td class="sem-borda" rowspan="2">
                    <img class="codigo-barras" src="{{CODIGO_BARRAS_${indice}}}" alt="Código de Barras">
                </td>
                <td class="sem-borda cabecalho right">
                    Ficha de Compensação
                </td>
            </tr>
            <tr>
                <td class="sem-borda right">
                    <p class="lb-autenticacao"><b>Autenticação Mecânica</b></p>
                </td>
            </tr>
        </table>
    </div>
    ${indice < total - 1 ? '<div style="page-break-after: always;"></div>' : ''}
    `;

    return boletoHTML;
  }

  async gerar() {
    const templatePath = path.join(__dirname, 'templates', 'boleto-template.html');
    const template = fs.readFileSync(templatePath, 'utf-8');

    const boletosHTML = this._boletos
      .map((boleto, indice) => this.gerarBoletoHTML(boleto, indice, this._boletos.length))
      .join('\n');

    let htmlFinal = template.replace('{{BOLETOS}}', boletosHTML);

    // Substituir metadados
    if (this._args.titulo) {
      htmlFinal = htmlFinal.replace('<title>Boleto</title>', `<title>${this._args.titulo}</title>`);
    }
    if (this._args.autor) {
      htmlFinal = htmlFinal.replace(
        '</head>',
        `  <meta name="author" content="${this._args.autor}">\n  </head>`
      );
    }
    if (this._args.criador) {
      htmlFinal = htmlFinal.replace(
        '</head>',
        `  <meta name="creator" content="${this._args.criador}">\n  </head>`
      );
    }
    if (this._args.creditos) {
      const creditosHTML = `<div style="text-align: center; font-style: italic; font-size: 8pt; margin: 10px 0;">${this._args.creditos}</div>`;
      htmlFinal = htmlFinal.replace('{{BOLETOS}}', creditosHTML + '{{BOLETOS}}');
      htmlFinal = htmlFinal.replace('{{BOLETOS}}', boletosHTML);
    }

    return htmlFinal;
  }
}

module.exports = GeradorDeHTML;
