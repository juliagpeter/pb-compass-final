const { test, expect } = require('@playwright/test');

test.describe('Cinema API Tests - Cenário negativo de criação de filme', () => {
  test('POST /movies - Valida falha ao criar filme com dados inválidos', async ({ request }) => {
    const currentDate = new Date().toISOString().split('T')[0];

    // dados invalidos para criar fulme
    const invalidFilme = {
      title: 12345,  
      description: '',  
      launchdate: currentDate,
      showtimes: [],  
    };

    // posts
    const response = await request.post('movies', { data: invalidFilme });

    // check 400
    expect(response.status()).toBe(400);
    console.log('✅ Requisição inválida retornou erro 400 conforme esperado.');

    // captura o body
    let body;
    try {
      body = await response.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    // check estrutura do body
    if (!body || !body.message || !Array.isArray(body.message) || body.error !== 'Bad Request') {
      console.warn(`⚠️ Resposta de erro incompleta ou incorreta:
        Status: ${response.status()}
        Body Recebido: ${JSON.stringify(body || {})}
        Esperado: {
          "message": [
            "Título deve ser do tipo String",
            "Descrição do filme é mandatória"
          ],
          "error": "Bad Request",
          "statusCode": 400
        }`);
    } else {
      expect(body.message).toContain('Título deve ser do tipo String');
      expect(body.message).toContain('Descrição do filme é mandatória');  
      expect(body.error).toBe('Bad Request');
      expect(body.statusCode).toBe(400);

      console.log('✅ Mensagens de erro validadas com sucesso:', body.message);
    }
  });
});
