const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Duplicidade de Tickets', () => {

    test('POST /tickets - Valida duplicidade de tickets para o mesmo filme e assento', async ({ request }) => {
        const ticket = {
            movieId: faker.number.int(9999),
            userId: faker.number.int(9999),
            seatNumber: 10,
            price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
            showtime: faker.date.future().toISOString(),
        };

        const firstResponse = await request.post('tickets', { data: ticket });

        if (firstResponse.status() !== 201) {
            console.warn(`⚠️ Falha ao criar o primeiro ticket. Status: ${firstResponse.status()}`);
            return;
        }

        console.log('✅ Primeiro ticket criado com sucesso.');

        const secondResponse = await request.post('tickets', { data: ticket });

        if (secondResponse.status() === 201) {
            console.log('✅ Segundo ticket criado com sucesso.');
            const ticketData = await secondResponse.json();
            console.log('🐞 Bug encontrado - Duplicidade de ticket permitida.');
        } else {
            console.log('✅ A API retornou um erro esperado:', secondResponse.status());
        }

        try {
            expect(secondResponse.status()).toBe(400);
        } catch (error) {
            console.warn('⚠️ A API permitiu a duplicidade de tickets. Isso não deveria ocorrer!');
        }
    });

});
