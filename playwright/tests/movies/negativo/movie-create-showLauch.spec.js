const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de campos de data', () => {

  test('POST /movies - Verifica se o sistema aceita valores inválidos para launchdate e showtimes', async ({ request }) => {
    const filmeInvalido = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      launchdate: 'data-invalida', 
      showtimes: [
        'horario-invalido', 
        'outra-hora-invalida',
      ],
    };

    // post do filme com datas inválidas
    const response = await request.post(`movies`, { data: filmeInvalido });

    // check 201
    if (response.status() === 201) {
      console.warn('⚠️ O sistema permitiu a criação de um filme com datas inválidas.');
    } else {
      expect(response.status()).toBe(400);
      console.log('✅ O sistema corretamente rejeitou a criação de um filme com datas inválidas.');
    }

    // check body
    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    if (body && body.message && response.status() !== 201) {
      console.log(`✅ Resposta da API para erro de validação: ${body.message}`);
    } else {
      console.warn('⚠️ A API aceitou valores inválidos para os campos de data.');
    }
  });
});
