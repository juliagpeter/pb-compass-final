const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validando Resposta 201', () => {

  test('POST /movies - Valida criação de filme e resposta sem corpo', async ({ request }) => {
    // Gerando dados válidos para criar um filme
    const filme = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      launchdate: faker.date.future(),
      showtimes : [
        faker.date.future().toISOString(),
        faker.date.future().toISOString()
    ]
    };

    const response = await request.post('movies', { data: filme });

    expect(response.status()).toBe(201);
    console.log('✅ Filme criado com sucesso e resposta validada:', response.status());

    const responseBody = await response.body();
    expect(responseBody).toHaveLength(0);
    console.log('✅ Corpo da resposta está vazio conforme esperado.');
  });

  test('POST /movies - Tenta criar filme sem título', async ({ request }) => {
    const filmeSemTitulo = {
      description: faker.lorem.sentence(),
      launchdate: faker.date.future(),
      showtimes : [
        faker.date.future().toISOString(),
        faker.date.future().toISOString()
    ]
    };

    const response = await request.post('movies', { data: filmeSemTitulo });

    expect(response.status()).toBe(400);
    console.log('✅ Comportamento validado. Tentativa de criar filme sem título retorna status 400.');
  });

  test('POST /movies - Tenta criar filme sem launchdate', async ({ request }) => {
    const filmeSemData = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      showtimes : [
        faker.date.future().toISOString(),
        faker.date.future().toISOString()
    ]
    };

    const response = await request.post('movies', { data: filmeSemData });

    expect(response.status()).toBe(400);
    console.log('✅ Comportamento validado. Tentativa de criar filme sem launchdate retorna status 400.');
  });

  test('POST /movies - Tenta criar filme sem showtimes', async ({ request }) => {
    const filmeSemShowtimes = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      launchdate: faker.date.future(),
    };

    const response = await request.post('movies', { data: filmeSemShowtimes });

    expect(response.status()).toBe(400);
    console.log('✅ Comportamento validado. Tentativa de criar filme sem showtimes retorna status 400.');
  });

  test('POST /movies - Valida persistência de filme criado', async ({ request }) => {
    const filme = {
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      launchdate: faker.date.future(),
      showtimes : [
        faker.date.future().toISOString(),
        faker.date.future().toISOString()
    ]
    };

    const response = await request.post('movies', { data: filme });
    expect(response.status()).toBe(201);

    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);

    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);
    
    expect(createdMovie).toBeTruthy();
    console.log(`✅ Filme validado no banco de dados: ${createdMovie.title}`);
  });

});
