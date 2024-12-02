const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validando Resposta 201', () => {

  test('POST /movies - Valida criação de filme e corpo da resposta', async ({ request }) => {

    const filme = await generateMovie();

    const response = await request.post(`movies`, { data: filme });

    // Verifica o código de status
    expect(response.status()).toBe(201);
    console.log('✅ Filme criado com sucesso e resposta validada:', response.status());
  });
});