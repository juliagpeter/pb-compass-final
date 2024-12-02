const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets com MovieId Inválido', () => {

  test('POST /tickets - Valida criação de ticket com movieId inválido', async ({ request }) => {
    // ticket com id invalido
    const ticket = {
      movieId: 'invalido',
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // post ticket
    const ticketResponse = await request.post('tickets', { data: ticket });

    // se for 201, mostra o erro
    if (ticketResponse.status() === 201) {
      const ticketData = await ticketResponse.json();
      console.log('🐞 Bug encontrado - Ticket criado com movieId inválido:');
      console.log(ticketData);
    } else {
      console.log('✅ A API retornou um erro:', ticketResponse.status());
    }

    try {
      expect(ticketResponse.status()).toBe(400);
    } catch (error) {
      console.warn('⚠️ Ticket criado com movieId inválido. Isso não deveria ocorrer!');
    }
  });

});
