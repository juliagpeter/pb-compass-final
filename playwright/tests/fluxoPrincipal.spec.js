const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const generateMovie = require('../util/generate-movie');

test.describe('nestjs-cinema - Fluxo Completo', () => {

  test('Criação, Edição e Exclusão de Filmes e Tickets - Caminho Feliz', async ({ request }) => {

    // 1. gera os dados do filme
    const filme = await generateMovie();

    const createMovieResponse = await request.post('movies', { data: filme });
    expect(createMovieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // 2. GET - busca o filme criado
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);
    const movies = await getMoviesResponse.json();

    const createdMovie = movies.find((m) => m.title === filme.title);
    expect(createdMovie).toBeTruthy();
    console.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // 3. PUT - edita o filme
    const updatedFilme = await generateMovie();

    const updateMovieResponse = await request.put(`movies/${createdMovie._id}`, { data: updatedFilme });
    expect(updateMovieResponse.status()).toBe(200);
    console.log(`✅ Filme atualizado com sucesso: \`${updatedFilme.title}\``);

    // 4. POST - cria um ticket
    const ticket = {
      movieId: createdMovie._id,
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    const createTicketResponse = await request.post('tickets', { data: ticket });
    expect(createTicketResponse.status()).toBe(201);
    console.log(`✅ Ticket criado com sucesso para o filme: ${updatedFilme.title}`);

    // 5. GET - busca ticket
    const getTicketsResponse = await request.get('tickets');
    expect(getTicketsResponse.status()).toBe(200);
    const tickets = await getTicketsResponse.json();

    const createdTicket = tickets.find((t) => t.movieId === createdMovie._id);
    expect(createdTicket).toBeTruthy();
    console.log(`✅ Ticket encontrado para o filme: ${updatedFilme.title} (ID: ${createdTicket._id})`);

    // 6. PUT - edita o ticket
    const updatedTicket = {
      ...createdTicket,
      seatNumber: faker.number.int(99),
    };

    const updateTicketResponse = await request.put(`tickets/${createdTicket._id}`, { data: updatedTicket });
    expect(updateTicketResponse.status()).toBe(200);
    console.log(`✅ Ticket atualizado com sucesso. Assento: ${updatedTicket.seatNumber}`);

    // 7. DELETE - deleta ticket
    const deleteTicketResponse = await request.delete(`tickets/${createdTicket._id}`);
    expect(deleteTicketResponse.status()).toBe(200);
    console.log('✅ Ticket deletado com sucesso.');

    // 8. DELETE - deleta o filme
    const deleteMovieResponse = await request.delete(`movies/${createdMovie._id}`);
    expect(deleteMovieResponse.status()).toBe(200);
    console.log('✅ Filme deletado com sucesso.');
  });

});
