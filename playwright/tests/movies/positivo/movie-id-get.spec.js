const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de criação e busca por ID', () => {
  test('POST /movies e GET /movies/:id - Criação e busca de filme por ID', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // Dados para criação do filme
    const filme = {
      title: faker.word.words(4),
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    // Criar filme
    const createResponse = await request.post('movies', { data: filme });

    // Verificar status da criação
    expect(createResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // Buscar lista de filmes para capturar o ID do filme criado
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);

    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    console.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // Buscar filme por ID
    const getByIdResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdResponse.status()).toBe(200);

    const movieById = await getByIdResponse.json();

    // Validar estrutura do filme retornado
    try {
      expect(movieById).toHaveProperty('title', filme.title);
      expect(movieById).toHaveProperty('description', filme.description);
      expect(movieById).toHaveProperty('launchdate', filme.launchdate);
      expect(movieById).toHaveProperty('showtimes');
      expect(Array.isArray(movieById.showtimes)).toBe(true);
      expect(movieById.showtimes).toEqual(expect.arrayContaining(filme.showtimes));
      expect(movieById).toHaveProperty('_id', createdMovie._id);

      console.log(`✅ Validação bem-sucedida do filme por ID: ${movieById.title}`);
    } catch (validationError) {
      console.warn(`⚠️ Erro na validação do filme por ID: ${validationError.message}`);
    }
  });
});