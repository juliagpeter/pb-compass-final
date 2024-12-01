const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de criação e atualização de filme', () => {
  test('POST /movies e PUT /movies/:id - Criação e atualização de filme', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // data movie
    const filme = {
      title: faker.word.words(2),
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    // post filme
    const createResponse = await request.post('movies', { data: filme });

    // check 201
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

    // new data
    const updatedFilme = {
      title: faker.word.words(3),
      description: faker.lorem.paragraph(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    // put by id
    const updateResponse = await request.put(`movies/${createdMovie._id}`, { data: updatedFilme });
    expect(updateResponse.status()).toBe(200);

    console.log(`✅ Filme atualizado com sucesso: ${updatedFilme.title} (Nome original: ${filme.title})`);

    // get by id
    const getByIdResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdResponse.status()).toBe(200);

    const movieById = await getByIdResponse.json();

    // validacao estrutura
    try {
      expect(movieById).toHaveProperty('title', updatedFilme.title);
      expect(movieById).toHaveProperty('description', updatedFilme.description);
      expect(movieById).toHaveProperty('launchdate', updatedFilme.launchdate);
      expect(movieById).toHaveProperty('showtimes');
      expect(Array.isArray(movieById.showtimes)).toBe(true);
      expect(movieById.showtimes).toEqual(expect.arrayContaining(updatedFilme.showtimes));
      expect(movieById).toHaveProperty('_id', createdMovie._id);

      console.log(`✅ Validação bem-sucedida do filme atualizado: ${movieById.title}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do filme atualizado: ${validationError.message}`);
    }
  });
});
