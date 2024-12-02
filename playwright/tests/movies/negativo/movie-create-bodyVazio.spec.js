const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Verificação de resposta vazia no POST /movies', () => {
  test('POST /movies - Verifica que a resposta da criação não retorna corpo', async ({ request }) => {
    const filmeValido = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      launchdate: new Date().toISOString().split('T')[0],
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    const response = await request.post('movies', { data: filmeValido });

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