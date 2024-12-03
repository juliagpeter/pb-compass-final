<div align="center">
  <img src="./assets/compassBanner.png" alt="Logo" width="100%">
  <h1>Programa de Bolsa: Software Quality Engineer</h1>
</div>

## 📝 Sobre o Projeto

Este projeto é uma suíte de testes de Qualidade para a API [nestjs-cinema](https://github.com/juniorschmitz/nestjs-cinema/tree/main), desenvolvida como challenge final do Programa de Bolsas Software Quality Engineer da Compass UOL na área de QA.

## 👤 Autora

### Olá, eu sou a Júlia Peter! 👋

Estudante de 20 anos do quarto semestre do curso Técnologo em Sistemas para Internet no campus Pelotas no Instituto Federal Sul-riograndense e participante do programa de bolsas de Software Quality Engineer na Compass UOL.
- 😄 Pronomes: ela/dela
- 📫 Contato: juliagpeter0@gmail.com

## 👥 Agradecimentos
Gostaria de agradecer ao suporte dos meus colegas: João, Lucas, Gabrielle, Gabriel, Alisson e Malek que contribuíram para a construção deste projeto.

## 🧰 Ferramentas

- Node: é um ambiente de execução JavaScript que permite executar aplicações desenvolvidas com a linguagem de forma autônoma, sem depender de um navegador. 
- Playwright: é uma poderosa ferramenta de automação de testes web que oferece suporte a múltiplos navegadores, incluindo Chrome, Firefox e Safari.
- Cypress: é uma ferramenta projetada para simplificar o processo de criação, execução e depuração de testes.
- K6: é uma ferramenta de teste de carga de código aberto e gratuita, com isso será capaz de detectar regressões de desempenho e problemas mais cedo, permitindo construir sistemas mais resilientes e aplicativos robustos.
- ChatGPT: é uma ferramenta para processamento de linguagem natural treinada pela OpenAI.
- Copilot: é uma ferramenta de assistência à codificação que usa Inteligência Artificial (IA) para ajudar os desenvolvedores a escrever código de forma mais rápida e eficaz
- GitHub: é uma plataforma de desenvolvimento colaborativo que aloja projetos na nuvem utilizando o sistema de controle de versões chamado Git.
- Postman: é uma ferramenta que dá suporte à documentação das requisições feitas pela API.
- Trello: é uma ferramenta de gerenciamento de equipes, projetos e produtos.

## 📦 Instalação

### Requisitos

Antes de começar, você precisará de algumas ferramentas instaladas em sua máquina:

- [Git](https://git-scm.com/downloads) — para controle de versão e clonagem do repositório.
- [Node.js](https://nodejs.org/) — para gerenciar as dependências e executar os testes.
- [Postman](https://www.postman.com/) — para realizar testes manuais.
- [K6](https://k6.io/) — para realizar testes de desempenho.

### 📝 Passo a Passo

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

## 📜 Plano de Testes

Para facilitar a compreensão dos testes do projeto, acompanhe o plano de testes [aqui](plano-de-teste.md).


## 📁 Estrutura do Diretório

Antes de começar a executar os testes da API, é fundamental entender como esse projeto está estruturado.

```plaintext

PB-COMPASS-FINAL/
│
├── api/                         # Diretório reservado para API
│   └── cypress/        
│       └── e2e/                 # Diretório dos testes cypress
│
├── assets/                      # Arquivos de mídia
│
├── k6/                          # Diretório para scripts de teste de carga com K6
│   ├── reports/
│   │     └── report.pdf         # Relatório gerado pelos testes de carga
│   │
│   ├── run-tests.js             # Script para execução geral de testes
│   │  
│   └── scripts/
│         ├── create-movie.js           # Script para criar filmes
│         ├── create-ticket.js          # Script para criar tickets
│         ├── get-movie.js              # Script para obter um filme específico
│         ├── get-movies-list.js        # Script para listar filmes
│         ├── stress-test.js            # Script para teste de estresse
│         ├── update-movie.js           # Script para atualizar filmes
│         └── zdelete-movie.js          # Script para deletar filmes           
│
├── playwright/                     # Diretório para testes de automação com Playwright
│   └── tests/                      
│      ├── movies/
│      │   ├── negativo/            # Testes negativos relacionados a filmes
│      │   └── positivo/            # Testes positivos relacionados a filmes
│      ├── tickets/
│      │   ├── negativo/            # Testes negativos relacionados a tickets
│      │   └── positivo/            # Testes positivos relacionados a tickets
│      └── fluxoPrincipal.spec.js   # Teste principal cobrindo o fluxo completo
│
├── util/                        # Utilitários e configurações adicionais
│
├── postman/                              # Arquivos para uso com o Postman
│   └── Cinema.postman_collection.json    # Coleção de requisições da API para Postman
│
├── mapa-mental.pdf              # Arquivo com o mapa mental do projeto
├── plano-de-teste.md            # Documento detalhando o plano de testes
│
├── .gitignore                   # Arquivo para ignorar arquivos/diretórios no Git
├── package-lock.json            # Registro das dependências instaladas
├── package.json                 # Dependências e scripts do projeto
├── playwright.config.js         # Configuração do Playwright
└── README.md                    # Documentação principal do projeto
```

# 🚀 Executando os Testes

## Postman

Coleção de testes manuais no Postman está disponivel [aqui](postman/Cinema.postman_collection.json)

Baixe o arquivo e importe dentro do aplicativo do Postman:

![postman1](assets/postman1.png)

![postman2](assets/postman2.png)

Teste as rotas de maneira manual.

## Cypress

Siga o guia de execução clicando [aqui](api/cypress/README.md).

## Playwright

Siga o guia de execução clicando [aqui](playwright/README.md).

## K6

Siga o guia de execução clicando [aqui](k6/README.md).

---

## 💬 Contato

Se você tiver dúvidas ou sugestões, fique à vontade para entrar em contato:

- [GitHub](https://github.com/juliagpeter/pb-compass-final) — GitHub do projeto.
- Abra uma **issue** diretamente no repositório para discutir melhorias ou relatar problemas.

---

> Para mais informações sobre a ferramenta **Playwright**, consulte a [documentação oficial do Playwright](https://playwright.dev/). 
> Para mais informações sobre a ferramenta **K6**, consulte a [documentação oficial do K6](https://grafana.com/docs/k6/latest/). 

---
