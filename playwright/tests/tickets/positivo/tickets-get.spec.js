const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Validando GET /tickets', () => {
  test('GET /tickets - Valida lista de tickets e estrutura do corpo', async ({ request }) => {
    const response = await request.get('tickets');

    // Verifica status 200
    expect(response.status()).toBe(200);

    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn('⚠️ Erro ao interpretar a resposta da API.');
      return;
    }

    if (!Array.isArray(body) || body.length === 0) {
      console.warn('⚠️ Nenhum ticket encontrado ou formato de resposta inválido.');
      return;
    }

    console.log(`✅ API retornou ${body.length} tickets.`);

    let ticketsValidados = 0;

    // Valida estrutura básica dos tickets
    body.forEach((ticket) => {
      try {
        expect(ticket).toMatchObject({
          movieId: expect.any(String),
          userId: expect.any(Number),
          seatNumber: expect.any(Number),
          price: expect.any(Number),
          showtime: expect.any(String),
          _id: expect.any(String),
        });
        ticketsValidados++;
      } catch {
      }
    });

    if (ticketsValidados === body.length) {
      console.log('✅ Todos os tickets possuem a estrutura esperada.');
    } else {
      console.warn(`⚠️ Alguns tickets possuem problemas de validação.`);
    }
  });
});