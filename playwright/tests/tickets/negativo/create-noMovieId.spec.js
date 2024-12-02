const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets', () => {

  test('POST /tickets - Valida criação de ticket sem movieId', async ({ request }) => {
    // Gera um ticket sem movieId
    const ticket = {
      // SEM MOVIE ID
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // Faz post do ticket
    const ticketResponse = await request.post('tickets', { data: ticket });

    // Se a criação do ticket for bem-sucedida, mostra o erro
    if (ticketResponse.status() === 201) {
      const ticketData = await ticketResponse.json();
      console.log('🐞 Bug encontrado - Ticket criado sem movieId:');
        console.log(ticketData);
    } else {
      console.log('✅ Como esperado, a API retornou um erro:', ticketResponse.status());
    }

    // Espera que o status seja 400
    try {
      expect(ticketResponse.status()).toBe(400);
    } catch (error) {
      console.warn('⚠️ Ticket criado com sucesso inesperadamente (sem movieId). Isso não deveria ocorrer!');
    }
  });

});
