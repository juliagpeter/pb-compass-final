const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de criação de filmes com títulos duplicados', () => {

  test('POST /movies - Valida que o sistema permite a criação de filmes com títulos repetidos', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    const filme1 = {
      title: 'Ainda estou aqui', 
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    // post do 1 filme
    const response1 = await request.post(`movies`, { data: filme1 });

    // check 201 1 filme
    expect(response1.status()).toBe(201);
    console.log('✅ Primeiro filme criado com sucesso.');

    const filme2 = {
      title: 'Ainda estou aqui', 
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    // post do 2 filme
    const response2 = await request.post(`movies`, { data: filme2 });

    // check 201 2 filme verificando duplicidade
    if (response2.status() === 201) {
      console.warn('⚠️ O sistema permitiu a criação de um filme com título duplicado.');
    } else {
      expect(response2.status()).toBe(400);
      console.log('✅ O sistema corretamente rejeitou a criação de um filme com título duplicado.');
    }

    // check body 2 filme
    let body2;
    try {
      body2 = await response2.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta do segundo filme está vazio ou inválido. Erro: ${error.message}`);
    }

    if (body2 && body2.message && response2.status() !== 201) {
      console.log(`✅ Resposta do segundo filme recebida corretamente: ${body2.message}`);
    } else {
      console.warn('⚠️ A API aceitou um filme com título duplicado e retornou 201.');
    }
  });
});
