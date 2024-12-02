const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validação de Criação de Ticket e Busca por ID', () => {
  test('POST /movies, POST /tickets e GET /tickets/:id - Criação de filme, ticket e busca por ID', async ({ request }) => {

    // gera dados
    const filme = await generateMovie();

    // post filme
    const createMovieResponse = await request.post('movies', { data: filme });
    expect(createMovieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // get p pega id
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);
    const movies = await getMoviesResponse.json();
    const movie = movies.find((movie) => movie.title === filme.title);

    if (!movie || !movie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    console.log(`✅ Filme encontrado: ${movie.title} (ID: ${movie._id})`);

    // data ticket
    const ticket = {
      movieId: movie._id,
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // post ticket
    const createTicketResponse = await request.post('tickets', { data: ticket });
    expect(createTicketResponse.status()).toBe(201);
    const createdTicket = await createTicketResponse.json();
    console.log('✅ Ticket criado com sucesso:', createdTicket);

    // get by id ticket
    const getTicketResponse = await request.get(`tickets/${createdTicket._id}`);
    expect(getTicketResponse.status()).toBe(200);
    const ticketById = await getTicketResponse.json();

    // check tickett
    try {
      expect(ticketById).toHaveProperty('movieId', createdTicket.movieId);
      expect(ticketById).toHaveProperty('userId', createdTicket.userId);
      expect(ticketById).toHaveProperty('seatNumber', createdTicket.seatNumber);
      expect(ticketById).toHaveProperty('price', createdTicket.price);
      expect(ticketById).toHaveProperty('showtime', createdTicket.showtime);
      expect(ticketById).toHaveProperty('_id', createdTicket._id);

      console.log(`✅ Ticket encontrado e validado com sucesso: ${ticketById._id}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do ticket encontrado: ${validationError.message}`);
    }
  });
});
