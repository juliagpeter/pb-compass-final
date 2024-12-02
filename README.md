![bannerCompass](./assets/compassBanner.png)

# Programa de Bolsa: Software Quality Engineer

Desafio final do programa de bolsa Software Quality Engineer da Compass UOL utilizando a API [nestjs-cinema](https://github.com/juniorschmitz/nestjs-cinema/tree/main).

---

## 📦 Instalação

### Requisitos

Antes de começar, você precisará de algumas ferramentas instaladas em sua máquina:

- [Git](https://git-scm.com/downloads) — para controle de versão e clonagem do repositório.
- [Node.js](https://nodejs.org/) — para gerenciar as dependências e executar os testes.
- [Postman](https://www.postman.com/) — para realizar testes manuais.
- [K6](https://k6.io/) — para realizar testes de desempenho.

### Passo a Passo

Siga as etapas abaixo para configurar o projeto e iniciar o servidor.

1. **Clone o repositório**
   Clone este repositório para a sua máquina local:
   ```bash
   git clone https://github.com/juliagpeter/pb-compass-final
   git remote remove origin   # Para evitar conflitos 
   ```

2. **Instale as dependências da API**
   Navegue até o diretório da API e instale as dependências necessárias:
   ```bash
   cd api
   npm install
   ```

3. **Inicie a API localmente**
   ```bash
   npm run start
   ```
   > O servidor será iniciado na URL [http://localhost:3000](http://localhost:3000) por padrão (a menos que a porta já esteja em uso).

4. **Instale as dependências do Playwright**
   
   Para facilitar a execução do projeto, dentro do Visual Studio Code, inicie outro terminal:

   ![terminal](assets/terminal.png)

   Navegue até o diretório do Playwright e instale as dependências necessárias:

      ```bash
   cd playwright
   npm install
   ```

   Pronto! Agora está tudo pronto para começar a executar os testes.

---

## 🚀 Executando os Testes

### Playwright

#### Todos os Testes

Para executar **todos** os testes automatizados, execute o seguinte comando:

Certifique=se de estar no diretório do Playwright

```bash
npx playwright test
```

> **Atenção**: Todos os testes serão executados nos três navegadores suportados (Chromium, Firefox e WebKit), o que pode levar algum tempo.

#### Testes Individuais

Para rodar um teste específico, use o comando abaixo:

```bash
npx playwright test nomeDoTeste
```

Exemplo:

```bash
npx playwright test loginok
```

Após a execução, o terminal exibirá os resultados dos testes, como mostrado abaixo:

![testeOk](assets/loginok.png)


### 📊 Gerando Relatório no Playwright

Você pode gerar um relatório detalhado dos testes utilizando o Allure. Siga os passos abaixo:

#### 1. Gerar Relatório

Após rodar os testes, use o seguinte comando para gerar o relatório de resultados:

```bash
allure generate ./allure-results -o ./allure-report
```

#### 2. Abrir o Relatório

Para visualizar o relatório gerado no navegador, execute:

```bash
allure open ./allure-report
```

### K6

#### Todos os testes

Para executar **todos** os testes automatizados, execute o seguinte comando:

Certifique-se de estar no diretório do K6.

```bash
node run-tests.js
```

> **Atenção**: Todos os testes serão executados e pode levar algum tempo.

#### Testes Individuais

Para rodar um teste específico, use o comando abaixo:

```bash
k6 run nomeDoTeste.js
```

Exemplo:

```bash
k6 run stress-test.js
```

---

## 📁 Estrutura do Diretório

A estrutura do projeto está organizada da seguinte forma:

```plaintext
(EM DESENVOLVIMENTO)
```

---

## 📘 Comandos Adicionais

Aqui estão alguns comandos úteis para auxiliar na manutenção do projeto:

- **Limpar Relatórios Antigos do Allure**:
   Caso você precise limpar os resultados anteriores do Allure, use o seguinte comando:
   ```bash
   allure generate ./allure-results --clean
   ```

---

## 💬 Contato

Se você tiver dúvidas ou sugestões, fique à vontade para entrar em contato:

- [GitHub](https://github.com/juliagpeter/pb-compass-final) — GitHub do projeto.
- Abra uma **issue** diretamente no repositório para discutir melhorias ou relatar problemas.

---

> Para mais informações sobre a ferramenta **Playwright**, consulte a [documentação oficial do Playwright](https://playwright.dev/). 
> Para mais informações sobre a ferramenta **K6**, consulte a [documentação oficial do K6](https://grafana.com/docs/k6/latest/). 

---
