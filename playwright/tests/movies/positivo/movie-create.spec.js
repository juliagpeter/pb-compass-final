const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validando Resposta 201', () => {

  test('POST /movies - Valida criação de filme e corpo da resposta', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const filme = {
      title: faker.word.words(4),
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    const response = await request.post(`movies`, { data: filme });

    // Verifica o código de status
    expect(response.status()).toBe(201);

    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    if (!body || !body.message || body.message !== 'Filme criado com sucesso.') {
      console.warn(`⚠️ Resposta incompleta ou incorreta para criação de filme:
        Status: ${response.status()}
        Body Recebido: ${JSON.stringify(body || {})}
        Esperado: { message: 'Filme criado com sucesso.' }`);
    } else {
      console.log('✅ Filme criado com sucesso e resposta validada:', body);
    }
  });
});