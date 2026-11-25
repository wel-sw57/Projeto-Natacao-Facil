# 🏊 Natação Fácil — Site Oficial

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

> **Maior escola de natação em águas abertas da Bahia.**  
> Aulas no Porto da Barra e Itapuã, Salvador/BA.  
> Metodologia acolhedora desenvolvida especialmente para adultos que estão começando do absoluto zero ou que têm medo/trauma do mar.

---

## 🚀 Publicação no Netlify via [https://app.netlify.com/start](https://app.netlify.com/start)

Esta versão foi especialmente configurada com o arquivo `netlify.toml` na raiz, suporte a Git contínuo e arquitetura sem dependências pesadas de build.

### Opção 1: Deploy Contínuo via Repositório Git (Recomendado)

1. **Crie um repositório** no seu [GitHub](https://github.com/new) (ou GitLab / Bitbucket), por exemplo: `natacao-facil`.
2. **Envie os arquivos do projeto** para o repositório executando os seguintes comandos no terminal:
   ```bash
   git init -b main
   git add .
   git commit -m "feat: versão de produção pronta para Netlify"
   git remote add origin https://github.com/SEU_USUARIO/natacao-facil.git
   git push -u origin main
   ```
3. **Acesse o Netlify Start**:
   - Abra [https://app.netlify.com/start](https://app.netlify.com/start) no navegador.
   - Faça login com sua conta do GitHub (ou crie sua conta gratuita).
   - Clique em **"Import an existing project"** (ou escolha o GitHub).
   - Selecione o repositório `natacao-facil`.
4. **Configurações de Build (Detectadas Automaticamente)**:
   - **Branch to deploy**: `main`
   - **Publish directory**: `.` (já configurado no `netlify.toml`)
   - **Build command**: `echo 'Build concluído com sucesso.'`
5. Clique em **"Deploy site"**.
   - Em menos de 30 segundos seu site estará no ar com **SSL/HTTPS grátis**, CDN global de altíssima velocidade e atualizações automáticas a cada novo `git push`!

---

### Opção 2: Deploy Direto via Netlify CLI

Se preferir publicar diretamente pelo terminal da sua máquina:

```bash
# 1. Instale o Netlify CLI ou execute via npx
npx netlify-cli deploy --prod
```

Siga os prompts na tela para autorizar sua conta e selecionar o diretório atual (`.`).

---

### Opção 3: Deploy Manual via Netlify Drop

Você também pode utilizar o arquivo pré-empacotado:
1. Abra [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Arraste e solte o arquivo `natacao-facil-netlify.zip`.
3. O site é publicado instantaneamente.

---

## 🛠️ Executando Localmente

Para testar o site no seu computador:

- **Opção rápida**: Dê dois cliques no arquivo `index.html` para abrir diretamente no seu navegador.
- **Servidor local com recarregamento**:
  ```bash
  npm start
  ```
  O servidor estará disponível em `http://localhost:3000`.

---

## 📁 Estrutura de Arquivos

```
Projeto_Natação_Fácil/
├── index.html            # Estrutura HTML semântica (WCAG 2.2 AA, Schema.org)
├── style.css             # Sistema de design puro (paleta oceânica, responsivo)
├── script.js             # Módulos JS nativos (canvas, quiz, abas, acessibilidade)
├── netlify.toml          # Configuração oficial Netlify (headers de segurança e cache)
├── package.json          # Metadados do projeto e scripts locais
├── .gitignore            # Arquivos ignorados pelo controle de versão
├── Logo.jpg              # Logo oficial circular da escola
├── manifest.webmanifest  # Manifesto PWA para instalação no celular
├── robots.txt            # Diretivas de indexação para buscadores
├── sitemap.xml           # Mapa do site canônico para SEO
└── foto-*.jpg            # Fotografias reais de alta resolução das praias e turmas
```

---

## 🌊 Contatos Oficiais da Natação Fácil

- **WhatsApp**: [(71) 98482-3681](https://wa.me/5571984823681)
- **Instagram**: [@natacaofacil](https://www.instagram.com/natacaofacil/)
- **Locais**: Praia do Porto da Barra e Praia de Itapuã — Salvador/BA

---

## 👨‍💻 Créditos de Desenvolvimento

Desenvolvido por **WELTON CIRQUEIRA** — [pedrograve.com](https://pedrograve.com)
