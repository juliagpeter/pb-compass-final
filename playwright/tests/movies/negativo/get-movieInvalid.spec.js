const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Validação de busca por ID inexistente', () => {
  test('GET /movies/:id - Busca de filme com ID inexistente', async ({ request }) => {

    // ID inexistente
    const invalidId = '000000000000000'; // Substitua por um UUID inválido, se necessário

    // Busca por ID inexistente
    const getByIdResponse = await request.get(`movies/${invalidId}`);
    
    // Valida status 404
    expect(getByIdResponse.status()).toBe(404);
    console.log(`✅ Resposta 404 confirmada para ID inexistente: ${invalidId}`);
    
    // Valida mensagem de erro
    const errorResponse = await getByIdResponse.json();
    expect(errorResponse).toHaveProperty('message', 'Movie not found');
    expect(errorResponse).toHaveProperty('error', 'Not Found');
    expect(errorResponse).toHaveProperty('statusCode', 404);
    console.log('✅ Mensagem de erro validada:', errorResponse.message);
  });
});
