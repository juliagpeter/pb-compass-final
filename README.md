# Programa de bolsa: Software Quality Engineer

![bannerCompass](./assets/compassBanner.png)

## 📦 Instalação

### Requisitos

- [Git](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/)

### Passo a Passo

1. **Clone o repositório**
```bash
   git clone https://github.com/juliagpeter/pb-compass-final
```

2. **Instale as dependências**
```bash
   npm install
```

3. **Inicie o ServeRest localmente**
Em outro terminal, execute o seguinte comando:
```bash
   npx serverest@latest
```
> O servidor será iniciado por padrão na URL [http://localhost:3000](http://localhost:3000) (a menos que a porta já esteja em uso).

---

## 🚀 Executando os Testes

### Todos os testes

Para executar **todos** os testes, use:
```bash
   npx playwright test
```

> Obs: Todos os testes serão executados nos três navegadores suportados, o que pode levar algum tempo.

### Testes individuais

Para executar um teste específico:
```bash
   npx playwright test nomeDoTeste
```

Exemplo:
```bash
   npx playwright test loginok
```

O terminal exibirá os resultados como na imagem abaixo:

![testeOk](assets/testeok.png)

---

## 📊 Gerar Relatório

Após executar os testes, você pode gerar um relatório de resultados com o Allure:

1. **Gerar relatório**:
```bash
   allure generate ./allure-results -o ./allure-report
```

2. **Abrir o relatório**:
```bash
   allure open ./allure-report
```

---

## 📁 Estrutura do Diretório

```plaintext
(EM DESENVOLVIMENTO)
```

---

## 📘 Adicional

### Comandos Úteis

- **Limpar relatórios antigos do Allure**:
```bash
   allure generate ./allure-results --clean
```

## 💬 Contato

Para dúvidas ou sugestões, entre em contato comigo através do GitLab ou abra uma issue no repositório.

---

> **Nota**: Consulte o [site oficial do Playwright](https://playwright.dev/) para mais informações sobre a ferramenta.