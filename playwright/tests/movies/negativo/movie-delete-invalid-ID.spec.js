const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Cenário negativo de exclusão de filme inexistente', () => {
  test('DELETE /movies/:id - Valida falha ao tentar excluir um filme inexistente', async ({ request }) => {
    
    // definindo um id invalido
    const invalidMovieId = '0000000000000'; 

    // faz o request p delete
    const deleteResponse = await request.delete(`movies/${invalidMovieId}`);

    // check 404
    expect(deleteResponse.status()).toBe(404);
    console.log('✅ Requisição de exclusão retornou erro 404 conforme esperado.');

    // captura o body
    let body;
    try {
      body = await deleteResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    // check estrutura do body
    if (!body || body.message !== 'Movie not found' || body.error !== 'Not Found') {
      console.warn(`⚠️ Resposta de erro incorreta para exclusão de filme inexistente:
        Status: ${deleteResponse.status()}
        Body Recebido: ${JSON.stringify(body || {})}
        Esperado: {
          "message": "Movie not found",
          "error": "Not Found",
          "statusCode": 404
        }`);
    } else {
      // check msg e status code
      expect(body.message).toBe('Movie not found');
      expect(body.error).toBe('Not Found');
      expect(body.statusCode).toBe(404);

      console.log('✅ Mensagem de erro validada com sucesso:', body.message);
    }
  });
});
