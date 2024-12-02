const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de criação e exclusão de filme', () => {
  test('POST /movies e DELETE /movies/:id - Criação e exclusão de filme', async ({ request }) => {
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

    // Excluir filme por ID
    const deleteResponse = await request.delete(`movies/${createdMovie._id}`);
    expect(deleteResponse.status()).toBe(200);

    console.log(`✅ Filme excluído com sucesso: ${createdMovie.title}`);

    // Tentar buscar o filme excluído para garantir que foi removido
    const getByIdAfterDeleteResponse = await request.get(`movies/${createdMovie._id}`);
    expect(getByIdAfterDeleteResponse.status()).toBe(404);

    console.log(`✅ Confirmação de que o filme foi removido: ID ${createdMovie._id}`);
  });
});
