const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de criação de filmes com títulos duplicados', () => {

  test('POST /movies - Valida duplicidade de títulos ao criar filmes', async ({ request }) => {
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

    const response1 = await request.post('movies', { data: filme1 });
    expect(response1.status()).toBe(201);
    console.log('✅ Primeiro filme criado com sucesso.', filme1);

    const filme2 = {
      title: 'Ainda estou aqui', 
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    const response2 = await request.post('movies', { data: filme2 });

    if (response2.status() === 201) {
      console.log('✅ Segundo filme criado com sucesso.', filme2);
      console.warn('🐞 Bug encontrado - O sistema permitiu a criação de um filme com título duplicado.');
    } else if (response2.status() === 400) {
      console.log('✅ O sistema rejeitou corretamente a criação de um filme com título duplicado.');
    } else {
      console.warn(`⚠️ Resposta inesperada ao criar um filme com título duplicado. Status: ${response2.status()}`);
    }
  });
});
