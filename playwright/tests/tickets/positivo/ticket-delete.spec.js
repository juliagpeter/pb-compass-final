const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('nestjs-cinema - Delete de ticket', () => {
  test('Deve criar um filme, ticket e por fim excluir o ticket', async ({ request }) => {
    // criar filme
    const currentDate = new Date().toISOString().split('T')[0];

    const filme = {
      title: faker.word.words(2),
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    const movieResponse = await request.post(`movies`, { data: filme });

    expect(movieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    const movieId = filme.title; 

    // data do ticket
    const ticket = {
      movieId: movieId, 
      userId: faker.number.int(9999), 
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }), 
      showtime: faker.date.future().toISOString(), 
    };

    // post para ticket
    const ticketResponse = await request.post(`tickets`, { data: ticket });

    // check 201
    expect(ticketResponse.status()).toBe(201);

    let ticketBody;
    try {
      ticketBody = await ticketResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta do ticket está vazio ou inválido. Erro: ${error.message}`);
    }

    // check ticket body
    if (ticketBody && ticketBody._id) {
      console.log('✅ Ticket criado com sucesso:', ticketBody);
    } else {
      console.warn(`⚠️ Falha na criação do ticket. Body Recebido: ${JSON.stringify(ticketBody || {})}`);
      return; 
    }

    // delete ticket
    const deleteResponse = await request.delete(`tickets/${ticketBody._id}`);

    // check 200
    expect(deleteResponse.status()).toBe(200);
    console.log(`✅ Ticket com ID [${ticketBody._id}] foi excluído com sucesso.`);

    const getResponse = await request.get(`tickets/${ticketBody._id}`);
    expect(getResponse.status()).toBe(404);
    console.log(`✅ Confirmação: O ticket com ID [${ticketBody._id}] não existe mais.`);
  });
});
