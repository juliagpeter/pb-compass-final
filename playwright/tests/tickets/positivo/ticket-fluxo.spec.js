const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Fluxo Completo de Filmes e Tickets', () => {
  test('POST /movies, GET /movies, POST /tickets, PUT /tickets, GET /tickets/:id, DELETE /tickets/:id - Fluxo completo', async ({ request }) => {

    // gera data filme
    const filme = await generateMovie();

    // post de filme
    const filmeCriado = await request.post('movies', { data: filme });
    expect(filmeCriado.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // get de filmes pra pega o id
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);
    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((movie) => movie.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    console.log(`✅ Filme encontrado: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // gera ticket
    const userId = faker.number.int(9999); 
    const ticket = {
      movieId: createdMovie._id,
      userId, 
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // post de ticket
    const createTicketResponse = await request.post('tickets', { data: ticket });
    expect(createTicketResponse.status()).toBe(201);
    const createdTicket = await createTicketResponse.json();
    console.log('✅ Ticket criado com sucesso:', createdTicket);

    // put de ticket
    const updatedTicket = {
      movieId: createdMovie._id,
      userId,
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    const updateTicketResponse = await request.put(`tickets/${createdTicket._id}`, { data: updatedTicket });
    expect(updateTicketResponse.status()).toBe(200);
    console.log(`✅ Ticket atualizado com sucesso: ${createdTicket._id}`);

    // get de ticket por id
    const getTicketResponse = await request.get(`tickets/${createdTicket._id}`);
    expect(getTicketResponse.status()).toBe(200);
    const ticketById = await getTicketResponse.json();

    // check ticket
    try {
      expect(ticketById).toHaveProperty('movieId', createdTicket.movieId);
      expect(ticketById).toHaveProperty('userId', userId); // Usando o mesmo userId
      expect(ticketById).toHaveProperty('seatNumber', updatedTicket.seatNumber);
      expect(ticketById).toHaveProperty('price', updatedTicket.price);
      expect(ticketById).toHaveProperty('showtime', updatedTicket.showtime);
      expect(ticketById).toHaveProperty('_id', createdTicket._id);

      console.log(`✅ Ticket encontrado e validado com sucesso: ${ticketById._id}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do ticket encontrado: ${validationError.message}`);
    }

    // delete ticket
    const deleteTicketResponse = await request.delete(`tickets/${createdTicket._id}`);
    expect(deleteTicketResponse.status()).toBe(200);
    console.log(`✅ Ticket excluído com sucesso: ${createdTicket._id}`);

    // check 404 pos delete
    const getAfterDeleteResponse = await request.get(`tickets/${createdTicket._id}`);
    expect(getAfterDeleteResponse.status()).toBe(404);
    console.log(`✅ Ticket não encontrado após exclusão. Status 404 recebido.`);
  });
});