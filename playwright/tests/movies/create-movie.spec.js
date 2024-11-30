const { test, expect } = require('@playwright/test');
const { generateMovie } = require('../../util/generate-movie');

test('[POST] Criação de um filme válido com resposta sem corpo', async ({ request }) => {
  const movie = generateMovie();

  const response = await request.post('movies', { data: movie });

  // Validar o status da resposta
  expect(response.status()).toBe(201);

  // Obter o corpo da resposta
  const body = await response.body();

  // Permitir que o corpo da resposta seja vazio
  expect(body.length).toBe(0);

  console.log('Filme criado com sucesso, mas sem corpo na resposta.');
});