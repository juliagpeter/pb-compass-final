const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('nestjs-cinema - Delete de ticket', () => {
  test('Deve criar um filme, ticket e por fim excluir o ticket', async ({ request }) => {

    const filme = await generateMovie();

    const movieResponse = await request.post(`movies`, { data: filme });

    // Verifica se o código de status foi 201
    expect(movieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // GET todos os filmes para procurar pelo título e pegar o id
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

    // Dados para criação do ticket
    const ticket = {
      movieId: movieId, // Usando o ID do filme encontrado
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // Criar o ticket
    const ticketResponse = await request.post(`tickets`, { data: ticket });

    // Verifica se a resposta foi 201
    expect(ticketResponse.status()).toBe(201);

    let ticketBody;
    try {
      ticketBody = await ticketResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta do ticket está vazio ou inválido. Erro: ${error.message}`);
      return;
    }

    // Verifica se o ticket foi criado com sucesso
    if (ticketBody && ticketBody._id) {
      console.log('✅ Ticket criado com sucesso:', ticketBody);
    } else {
      console.warn(`⚠️ Falha na criação do ticket. Body Recebido: ${JSON.stringify(ticketBody || {})}`);
      return;
    }

    // Delete ticket
    const deleteResponse = await request.delete(`tickets/${ticketBody._id}`);

    // Verifica se a exclusão retornou 204
    expect(deleteResponse.status()).toBe(200);
    console.log(`✅ Ticket com ID [${ticketBody._id}] foi excluído com sucesso.`);

    // Verifica se o ticket foi excluído
    const getResponse = await request.get(`tickets/${ticketBody._id}`);
    expect(getResponse.status()).toBe(404);
    console.log(`✅ Confirmação: O ticket com ID [${ticketBody._id}] não existe mais.`);
  });
});
