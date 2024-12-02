const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Verificação de resposta vazia no POST /movies', () => {
  test('POST /movies - Verifica que a resposta da criação não retorna corpo', async ({ request }) => {
    const filme = await generateMovie();

    const response = await request.post('movies', { data: filme });

    expect(response.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    const body = await response.text(); 
    if (body) {
      console.warn(`⚠️ A resposta da API contém dados inesperados: ${body}`);
    } else {
      console.log('✅ A resposta da API está vazia, como esperado.');
    }

    expect(body).toBe(''); 
  });
});