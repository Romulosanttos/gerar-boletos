# CI/CD Pipeline - GitHub Actions

Este projeto utiliza GitHub Actions para automação de CI/CD.

## Workflows

### 1. CI (Integração Contínua) - `ci.yml`

Executado em:

- Push para branches: `master`, `main`, `develop`
- Pull Requests para branches: `master`, `main`, `develop`

**Jobs:**

#### Lint

- Valida o código com ESLint
- Verifica formatação com Prettier

#### Tests

- Executa testes em múltiplas versões do Node.js (14, 16, 18, 20)
- Garante compatibilidade entre versões

#### Coverage

- Gera relatório de cobertura de código
- Salva artefatos do relatório de cobertura por 30 dias
- Relatórios acessíveis via aba "Actions" do GitHub

### 2. Release (Versionamento) - `release.yml`

**⚠️ Dependência:** Só executa **após o CI passar com sucesso**

Executado em:

- Após conclusão bem-sucedida do workflow CI
- Branches: `master`, `main`
- **Bloqueado automaticamente** se CI falhar

**Fluxo:**

1. **Validação (já feita pelo CI)**
   - ✅ Lint passou
   - ✅ Todos os testes passaram
   - ✅ Cobertura de código OK

2. **Versionamento Automático**
   - Analisa mensagem do commit para determinar o tipo de versão:
     - `breaking:` ou `major:` → versão MAJOR (1.0.0 → 2.0.0)
     - `feat:` ou `feature:` ou `minor:` → versão MINOR (1.0.0 → 1.1.0)
     - `fix:`, `patch:`, `chore:`, `docs:`, etc → versão PATCH (1.0.0 → 1.0.1)

3. **Publicação**
   - Atualiza `package.json`
   - Cria tag Git
   - Gera changelog automático
   - Cria release no GitHub
   - (Opcional) Publica no NPM usando **Trusted Publishers** (OIDC)
     - Sem necessidade de tokens de longa duração
     - Autenticação segura via OpenID Connect
     - Provenance automático para pacotes públicos

## Convenção de Commits

Para o versionamento automático funcionar corretamente, use:

```bash
# Para versão MAJOR (breaking changes)
git commit -m "major: descrição da mudança"
git commit -m "breaking: descrição da mudança"

# Para versão MINOR (novas funcionalidades)
git commit -m "feat: adiciona nova funcionalidade"
git commit -m "feature: adiciona nova funcionalidade"
git commit -m "minor: adiciona nova funcionalidade"

# Para versão PATCH (correções e melhorias)
git commit -m "fix: corrige bug"
git commit -m "patch: corrige problema"
git commit -m "chore: atualiza dependências"
git commit -m "docs: atualiza documentação"
```

## Configuração Necessária

### Publicação no NPM com Trusted Publishers (Recomendado)

O workflow está configurado para usar **Trusted Publishers**, que é a forma mais segura de publicar pacotes no NPM, eliminando a necessidade de tokens de longa duração.

#### Passo 1: Configurar Trusted Publisher no NPM

1. Acesse [npmjs.com](https://www.npmjs.com/) e faça login
2. Vá para as configurações do seu pacote `gerar-boletos`
3. Encontre a seção "Trusted Publisher"
4. Clique em "GitHub Actions"
5. Configure:
   - **Organization or user**: `Romulosanttos`
   - **Repository**: `gerar-boletos`
   - **Workflow filename**: `release.yml` (apenas o nome do arquivo, com extensão)
   - **Environment name**: deixe em branco (opcional)
6. Salve a configuração

#### Passo 2: Ativar publicação no workflow

No arquivo `.github/workflows/release.yml`, altere:

```yaml
- name: Publish to NPM (optional)
  if: false # ← Mude para true
```

#### Requisitos:

- ✅ NPM CLI 11.5.1+ (instalado automaticamente no workflow)
- ✅ Permissão `id-token: write` (já configurada)
- ✅ GitHub-hosted runners (já configurado - ubuntu-latest)
- ✅ Repositório público (gera provenance automático)

#### Vantagens do Trusted Publishers:

- 🔒 Sem tokens de longa duração para gerenciar
- 🔐 Autenticação OIDC de curta duração e específica do workflow
- 📜 Provenance automático (prova criptográfica de origem)
- ✨ Sem risco de exposição de credenciais em logs
- 🎯 Zero configuração de secrets necessária

### Método Alternativo: Token NPM (Não Recomendado)

Se preferir usar tokens tradicionais (não recomendado):

1. Gere um token de automação no [NPM](https://www.npmjs.com/settings/[seu-usuario]/tokens)
2. Adicione como secret `NPM_TOKEN` no GitHub
3. Modifique o workflow para usar `NODE_AUTH_TOKEN`

**⚠️ Atenção:** Tokens tradicionais são menos seguros e requerem rotação manual.

### Permissões

O workflow de release precisa de permissões para:

- Criar tags
- Criar releases
- Fazer commit de mudanças de versão
- **Gerar tokens OIDC para publicação no NPM** (`id-token: write`)

Essas permissões já estão configuradas no workflow.

### Segurança Adicional (Opcional)

Após configurar Trusted Publishers, você pode aumentar a segurança:

1. **No NPM:** Settings → Publishing access → "Require two-factor authentication and disallow tokens"
   - Isso desabilita tokens tradicionais, mantendo apenas OIDC
2. **No GitHub:** Configure [deployment environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) para requerer aprovação manual
3. **No GitHub:** Configure [tag protection rules](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/configuring-tag-protection-rules) para controlar quem pode criar tags de release

## Status Badges

Adicione ao README.md:

```markdown
![CI](https://github.com/Romulosanttos/gerar-boletos/workflows/CI/badge.svg)
![Release](https://github.com/Romulosanttos/gerar-boletos/workflows/Release%20and%20Versioning/badge.svg)
```

## Exemplo de Uso

1. **Desenvolvimento normal:**

   ```bash
   git add .
   git commit -m "fix: corrige validação de data"
   git push
   ```

   → Executa CI, cria versão PATCH (1.8.0 → 1.8.1)

2. **Nova funcionalidade:**

   ```bash
   git add .
   git commit -m "feat: adiciona suporte ao Banco Inter"
   git push
   ```

   → Executa CI, cria versão MINOR (1.8.0 → 1.9.0)

3. **Breaking change:**
   ```bash
   git add .
   git commit -m "breaking: remove suporte ao Node.js 12"
   git push
   ```
   → Executa CI, cria versão MAJOR (1.8.0 → 2.0.0)

## Pular CI/CD

Para commits que não devem triggerar release:

```bash
git commit -m "docs: atualiza README [skip ci]"
```
