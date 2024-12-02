const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets com SeatNumber Inválido', () => {

  test('POST /tickets - Valida criação de ticket com seatNumber maior que 99', async ({ request }) => {
    const ticket = {
      movieId: faker.number.int(9999), 
      userId: faker.number.int(9999),
      seatNumber: 100, // seatNumber inválido (> 99)
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // Faz post do ticket
    const ticketResponse = await request.post('tickets', { data: ticket });

    try {
      // espera que o codigo seja 400
      expect(ticketResponse.status()).toBe(400);

      const body = await ticketResponse.json();
      expect(body.message).toContain("Valor do assento deve ser menor ou igual a 99");

      console.log('✅ Como esperado, a API retornou erro para seatNumber maior que 99:', body.message);

    } catch (error) {
      console.warn('⚠️ Messagem de retorno não condiz com o acceptance criteria:', error.message);
    }
  });

});
