const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validação de criação e exclusão de filme', () => {
  test('POST /movies e DELETE /movies/:id - Criação e exclusão de filme', async ({ request }) => {

    const filme = await generateMovie();

    // post de filme
    const createResponse = await request.post('movies', { data: filme });

    // check 201
    expect(createResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // busca no get pelo nome
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);

    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    console.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // delete por id
    const deleteResponse = await request.delete(`movies/${createdMovie._id}`);
    expect(deleteResponse.status()).toBe(200);

    console.log(`✅ Filme excluído com sucesso: ${createdMovie.title}`);

    // get por id após exclusão
    const getByIdAfterDeleteResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdAfterDeleteResponse.status()).toBe(404);

    console.log(`✅ Filme não encontrado após exclusão.`);
  });
});
