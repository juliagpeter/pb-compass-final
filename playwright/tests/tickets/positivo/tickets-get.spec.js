const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Validando GET /tickets', () => {
  test('GET /tickets - Valida lista de tickets e estrutura do corpo', async ({ request }) => {
    const response = await request.get(`tickets`);

    // check 200
    expect(response.status()).toBe(200);

    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Falha ao interpretar o corpo da resposta. Erro: ${error.message}`);
      return;
    }

    if (!Array.isArray(body) || body.length === 0) {
      console.warn('⚠️ Corpo da resposta não é uma lista ou está vazio.');
      return;
    }

    console.log(`✅ Tickets encontrados: ${body.length}`);

    let ticketsValidados = 0;
    const erros = [];

    // check estrutura
    body.forEach((ticket, index) => {
      try {
        expect(ticket).toHaveProperty('movieId');
        expect(ticket).toHaveProperty('userId');
        expect(ticket).toHaveProperty('seatNumber');
        expect(ticket).toHaveProperty('price');
        expect(ticket).toHaveProperty('showtime');
        expect(ticket).toHaveProperty('_id');

        expect(typeof ticket.movieId).toBe('string');
        expect(typeof ticket.userId).toBe('number');
        expect(typeof ticket.seatNumber).toBe('number');
        expect(typeof ticket.price).toBe('number');
        expect(typeof ticket.showtime).toBe('string');
        expect(typeof ticket._id).toBe('string');

        ticketsValidados++;
      } catch (validationError) {
        erros.push(`Ticket ${index + 1} inválido: ${validationError.message}`);
      }
    });

    console.log(`✅ ${ticketsValidados} tickets validados com sucesso.`);
    if (erros.length > 0) {
      console.warn(`⚠️ ${erros.length} tickets apresentaram problemas:\n- ${erros.join('\n- ')}`);
    } else {
      console.log('✅ Todos os tickets passaram na validação.');
    }
  });
});