const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets', () => {

  test('POST /tickets - Valida criação de ticket e corpo da resposta', async ({ request }) => {
    // Dados do ticket
    const ticket = {
        movieId: 'HmFdzfesJjGgdWyg', 
        userId: faker.number.int(9999), 
        seatNumber: faker.number.int(99),
        price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }), 
        showtime: faker.date.future().toISOString(), 
      };

    // Fazer a requisição POST para criar o ticket
    const response = await request.post(`tickets`, { data: ticket });

    // Verifica o código de status
    expect(response.status()).toBe(201);

    // Validação do corpo da resposta
    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    // Validação do corpo retornado
    if (body) {
      // Verifica se os dados retornados coincidem com os enviados
      expect(body.movieId).toBe(ticket.movieId);
      expect(body.userId).toBe(ticket.userId);
      expect(body.seatNumber).toBe(ticket.seatNumber);
      expect(body.price).toBe(ticket.price);
      expect(body.showtime).toBe(ticket.showtime);

      console.log('✅ Ticket criado com sucesso e os dados retornados estão corretos:', body);

      // Verifica se o ID do ticket foi retornado
      if (body._id) {
        console.log(`✅ Ticket ID recebido: ${body._id}`);
      } else {
        console.warn('⚠️ ID do ticket não foi retornado na resposta.');
      }
    } else {
      console.warn(`⚠️ Corpo da resposta não contém os dados esperados:
        Status: ${response.status()}
        Body Recebido: ${JSON.stringify(body || {})}`);
    }
  });
});
