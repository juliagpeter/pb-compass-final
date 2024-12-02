const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Validando GET /movies', () => {
  test('GET /movies - Valida lista de filmes e estrutura do corpo', async ({ request }) => {
    const response = await request.get(`movies`);

    // Verifica o código de status
    expect(response.status()).toBe(200);

    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Falha ao interpretar o corpo da resposta. Erro: ${error.message}`);
      return;
    }

    if (!Array.isArray(body) || body.length === 0) {
      console.warn('⚠️ Corpo da resposta não é uma lista ou está vazio.');
      return;
    }

    console.log(`✅ Filmes encontrados: ${body.length}`);

    // Variáveis para o resumo
    let filmesValidados = 0;
    const erros = [];

    // valida estrura for each filme
    body.forEach((movie, index) => {
      try {
        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('description');
        expect(movie).toHaveProperty('launchdate');
        expect(movie).toHaveProperty('showtimes');
        expect(movie).toHaveProperty('_id');

        expect(typeof movie.title).toBe('string');
        expect(typeof movie.description).toBe('string');
        expect(typeof movie.launchdate).toBe('string');
        expect(Array.isArray(movie.showtimes)).toBe(true);
        expect(typeof movie._id).toBe('string');

        filmesValidados++;
      } catch (validationError) {
        erros.push(`Filme ${index + 1} inválido: ${validationError.message}`);
      }
    });

    // log final
    console.log(`✅ ${filmesValidados} filmes validados com sucesso.`);
    if (erros.length > 0) {
      console.warn(`⚠️ ${erros.length} filmes apresentaram problemas:\n- ${erros.join('\n- ')}`);
    } else {
      console.log('✅ Todos os filmes passaram na validação.');
    }
  });
});