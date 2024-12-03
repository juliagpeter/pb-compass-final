<div align="center">
  <img src="../assets/compassBanner.png" alt="Logo" width="100%">
  <h1>Programa de Bolsa: Software Quality Engineer</h1>
</div>

# 🤖 Cypress

Cypress é um framework de testes automatizados end-to-end, que usa a linguagem JavaScript e roda em vários navegadores, como Chrome, Firefox, Edge, entre outros. Com o Cypress, é possível automatizar os testes de qualquer aplicação que possa ser acessada via navegador, seja ela uma API REST, um site, um aplicativo web ou um sistema.

## 📁 Estrutura do diretório

Os testes em Cypress estão organizados da seguinte maneira:

```plaintext

├── api/                         # Diretório reservado para API
│   └── cypress/        
│       └── e2e/                 # Diretório dos testes cypress

```

### Executando o teste

Certifique=se de estar no diretório da API

```bash
cd api
npx cypress open
```

### 📊 Gerando Relatório no Playwright

Os relatórios são gerados automaticamente e estão no diretório "results/".
