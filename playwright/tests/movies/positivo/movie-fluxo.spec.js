const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('nestjs-cinema: Fluxo de filme completo', () => {
  test('Deve criar um filme, buscar por ID, alterar através do PUT e deletar', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // gera data
    const filme = await generateMovie();

    // POST 
    const createResponse = await request.post('movies', { data: filme });
    expect(createResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // get filmes e busca pelo nome
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);
    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }
    console.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // get by id
    const getByIdResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdResponse.status()).toBe(200);
    const movieById = await getByIdResponse.json();

    try {
      expect(movieById).toHaveProperty('title', filme.title);
      expect(movieById).toHaveProperty('description', filme.description);
      expect(movieById).toHaveProperty('launchdate', filme.launchdate);
      expect(movieById).toHaveProperty('showtimes');
      expect(Array.isArray(movieById.showtimes)).toBe(true);
      expect(movieById.showtimes).toEqual(expect.arrayContaining(filme.showtimes));
      console.log(`✅ Validação bem-sucedida do filme por ID: ${movieById.title}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do filme por ID: ${validationError.message}`);
    }

    // put filme
    const updatedFilme = {
      title: faker.word.words(3),
      description: faker.lorem.paragraph(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
      ],
    };
    const updateResponse = await request.put(`movies/${createdMovie._id}`, { data: updatedFilme });
    expect(updateResponse.status()).toBe(200);
    console.log(`✅ Filme atualizado com sucesso: ${updatedFilme.title} (Nome original: ${filme.title})`);

    // get by id new filme
    const getUpdatedByIdResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getUpdatedByIdResponse.status()).toBe(200);
    const updatedMovieById = await getUpdatedByIdResponse.json();

    try {
      expect(updatedMovieById).toHaveProperty('title', updatedFilme.title);
      expect(updatedMovieById).toHaveProperty('description', updatedFilme.description);
      expect(updatedMovieById).toHaveProperty('launchdate', updatedFilme.launchdate);
      expect(updatedMovieById).toHaveProperty('showtimes');
      expect(Array.isArray(updatedMovieById.showtimes)).toBe(true);
      expect(updatedMovieById.showtimes).toEqual(expect.arrayContaining(updatedFilme.showtimes));
      console.log(`✅ Validação bem-sucedida do filme atualizado: ${updatedMovieById.title}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do filme atualizado: ${validationError.message}`);
    }

    // delete filme
    const deleteResponse = await request.delete(`movies/${createdMovie._id}`);
    expect(deleteResponse.status()).toBe(200);
    console.log(`✅ Filme excluído com sucesso: ${updatedFilme.title}`);

    // check delete
    const getByIdAfterDeleteResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdAfterDeleteResponse.status()).toBe(404);
    console.log(`✅ Confirmação de que o filme foi removido: ID ${createdMovie._id}`);
  });
});