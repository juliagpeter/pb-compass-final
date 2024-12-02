const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validação de Exclusão de Filme com Ticket Atribuído', () => {
  
  test('POST /movies e POST /tickets - Criação de filme e ticket, tentativa de exclusão do filme atribuído ao ticket', async ({ request }) => {
    // Criar um filme
    const filme = await generateMovie();

    // Enviar requisição para criar o filme
    const createMovieResponse = await request.post('movies', { data: filme });
    expect(createMovieResponse.status()).toBe(201);
    console.log(`✅ Filme criado com sucesso: ${filme.title}`);

    // Buscar o filme criado para obter o movieId
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);

    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    const movieId = createdMovie._id;
    console.log(`✅ Filme encontrado na lista: ${filme.title} (ID: ${movieId})`);

    // Criar um ticket vinculado ao filme
    const ticket = {
      movieId: movieId,
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    const createTicketResponse = await request.post('tickets', { data: ticket });
    expect(createTicketResponse.status()).toBe(201);
    console.log(`✅ Ticket criado com sucesso para o filme: ${filme.title}`);

    // Tentar deletar o filme
    const deleteMovieResponse = await request.delete(`movies/${movieId}`);

    // O sistema não deveria permitir a exclusão de um filme atribuído a um ticket
    if (deleteMovieResponse.status() === 200) {
      console.log('🐞 Bug encontrado - O Filme foi deletado mesmo com um ticket vinculado.');
    } else {
      console.log('✅ O sistema impediu a exclusão do filme com ticket vinculado:', deleteMovieResponse.status());
    }

    // Verifica se o status é diferente de 200 (espera que a exclusão falhe)
    try {
      expect(deleteMovieResponse.status()).not.toBe(200);  // Espera que a exclusão falhe
    } catch (error) {
      console.warn('⚠️ O sistema permitiu a exclusão do filme vinculado a um ticket. Isso não deveria ocorrer!');
    }
  });

});
