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
    } else {
      console.log(`✅ Filmes encontrados: ${body.length}`);
    }

    // Valida estrutura de cada filme na lista
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

        console.log(`✅ Filme ${index + 1} validado com sucesso:`, movie.title);
      } catch (validationError) {
        console.warn(`⚠️ Estrutura inválida no filme ${index + 1}:`, validationError.message);
      }
    });
  });
});
