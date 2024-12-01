const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Criação de Tickets', () => {

  test('POST /tickets - Valida criação de ticket e corpo da resposta', async ({ request }) => {
    
    const currentDate = new Date().toISOString().split('T')[0];
    // gera dado
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

    // check 201
    expect(movieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // get de movies para pegar o id
    const moviesResponse = await request.get('movies');
    expect(moviesResponse.status()).toBe(200);

    let movies;
    try {
      movies = await moviesResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta de filmes está vazio ou inválido. Erro: ${error.message}`);
      return;
    }

    const movie = movies.find(m => m.title === filme.title);
    if (!movie) {
      console.warn(`⚠️ Filme com o título ${filme.title} não encontrado.`);
      return;
    }
    const movieId = movie._id;
    console.log(`✅ Filme encontrado com ID: ${movieId}`);

    // gera ticket
    const ticket = {
      movieId: movieId, 
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // post ticket
    const ticketResponse = await request.post(`tickets`, { data: ticket });

    // check 201
    expect(ticketResponse.status()).toBe(201);

    // check body
    let body;
    try {
      body = await ticketResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    if (body) {
      expect(body.movieId).toBe(ticket.movieId);
      expect(body.userId).toBe(ticket.userId);
      expect(body.seatNumber).toBe(ticket.seatNumber);
      expect(body.price).toBe(ticket.price);
      expect(body.showtime).toBe(ticket.showtime);

      console.log('✅ Ticket criado com sucesso e os dados retornados estão corretos:', body);

      if (body._id) {
        console.log(`✅ Ticket ID recebido: ${body._id}`);
      } else {
        console.warn('⚠️ ID do ticket não foi retornado na resposta.');
      }
    } else {
      console.warn(`⚠️ Corpo da resposta não contém os dados esperados:
        Status: ${ticketResponse.status()}
        Body Recebido: ${JSON.stringify(body || {})}`);
    }
  });
});
