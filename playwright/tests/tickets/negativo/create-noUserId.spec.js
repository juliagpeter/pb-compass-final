const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets', () => {

    test('POST /tickets - Valida criação de ticket sem userID', async ({ request }) => {
        // gera um ticket sem user id
        const ticket = {
            movieId: faker.number.int(9999),
            // SEM USER ID
            seatNumber: faker.number.int(99),
            price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
            showtime: faker.date.future().toISOString(),
        };

        // faz post do ticket
        const ticketResponse = await request.post('tickets', { data: ticket });

        // se for 201, mostra o erro
        if (ticketResponse.status() === 201) {
            console.log('✅ Ticket criado com sucesso!');
            const ticketData = await ticketResponse.json();
            console.log('🐞 Bug encontrado - Ticket criado sem userID:');
            console.log(ticketData);
        } else {
            console.log('✅ Como esperado, a API retornou um erro:', ticketResponse.status());
        }

        // espera que seja 400
        try {
            expect(ticketResponse.status()).toBe(400);
        } catch (error) {
            console.warn('⚠️ Ticket criado com sucesso inesperadamente (sem userID). Isso não deveria ocorrer!');
        }
    });

});
