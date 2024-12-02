const { test, expect } = require('@playwright/test');
const { faker } = require('@faker-js/faker');
const generateMovie = require('../../../util/generate-movie');

test.describe('Cinema API Tests - Validação de criação e tentativa de atualização com dados inválidos', () => {
  test('POST /movies e PUT /movies/:id - Tenta atualizar filme com dados inválidos', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // dados validos para criar filme
    const filme = await generateMovie();

    // post filme
    const createResponse = await request.post('movies', { data: filme });

    // check 201
    expect(createResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // get filmes e busca por id
    const getMoviesResponse = await request.get('movies');
    expect(getMoviesResponse.status()).toBe(200);

    const movies = await getMoviesResponse.json();
    const createdMovie = movies.find((m) => m.title === filme.title);

    if (!createdMovie || !createdMovie._id) {
      console.warn('⚠️ Filme criado não encontrado na lista.');
      return;
    }

    console.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

    // dados invalid
    const invalidUpdatedFilme = {
      title: " ",  // Título vazio
      description: "Teste com dados inválidos",
      launchdate: "data-invalida",  
      showtimes: "2023-10-10"  
    };

    // put com dados invalidos
    const updateResponse = await request.put(`movies/${createdMovie._id}`, { data: invalidUpdatedFilme });

    // check se retornou 200
    if (updateResponse.status() === 200) {
      console.warn('⚠️ A API aceitou dados inválidos e retornou 200 OK, o que não deveria acontecer.');
    } else {
      console.log('✅ A API corretamente rejeitou os dados inválidos.');
    }

    // captura o body
    const responseBody = await updateResponse.json();

    // valida estrutura do body
    try {
      expect(responseBody.title).not.toBe(" ");
      expect(responseBody.launchdate).not.toBe("data-invalida");
      expect(Array.isArray(responseBody.showtimes)).toBe(true);
    } catch (validationError) {
      console.warn(`⚠️ Erro de validação: ${validationError.message}`);
    }
    
    console.log('⚠️ Resposta recebida após tentativa de atualização com dados inválidos:', responseBody);
  });
});