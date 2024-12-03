<div align="center">
  <img src="../assets/compassBanner.png" alt="Logo" width="100%">
  <h1>Programa de Bolsa: Software Quality Engineer</h1>
</div>

# ⚙️ k6

O k6 é uma ferramenta de código aberto construída em JavaScript que facilita a criação, execução e análise de testes de carga e performance.

## 📁 Estrutura do diretório

Os testes em k6 estão organizados da seguinte maneira:

```plaintext

├── k6/                          # Diretório para scripts 
│   ├── reports/
│   │     └── report.pdf         # Relatório
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

```

### Todos os Testes

Para executar **todos** os testes automatizados, execute o seguinte comando:

Certifique-se de estar no diretório do K6.

```bash
node run-tests.js
```

> **Atenção**: Todos os testes serão executados e pode levar algum tempo.

### Testes Individuais

Para rodar um teste específico, use o comando abaixo:

```bash
k6 run nomeDoTeste.js
```

Exemplo:

```bash
k6 run stress-test.js
```

### 📊 Gerando Relatório no k6

Todos os relatórios são feitos automaticamente e estão [aqui](reports/Report%20dos%20testes%20em%20K6.pdf)
