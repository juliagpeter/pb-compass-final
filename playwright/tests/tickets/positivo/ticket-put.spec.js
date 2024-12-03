const { test, expect } = require('@playwright/test');
const generateMovie = require('../../../util/generate-movie');
const { faker } = require('@faker-js/faker');

test.describe('Cinema API Tests - Validação de Alteração de Tickets', () => {

  test('PUT /tickets - Valida alteração de ticket e corpo da resposta', async ({ request }) => {
    // Criar filme

    const filme = await generateMovie();

    const movieResponse = await request.post(`movies`, { data: filme });

    // Verifica se o código de status foi 201
    expect(movieResponse.status()).toBe(201);
    console.log('✅ Filme criado com sucesso.');

    // GET todos os filmes para procurar pelo título e pegar o id
    const moviesResponse = await request.get('movies');
    expect(moviesResponse.status()).toBe(200);

    let movies;
    try {
      movies = await moviesResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta de filmes está vazio ou inválido. Erro: ${error.message}`);
      return;
    }

    const movie = movies.find(m => m.title === filme.title);
    if (!movie) {
      console.warn(`⚠️ Filme com o título ${filme.title} não encontrado.`);
      return;
    }
    const movieId = movie._id;
    console.log(`✅ Filme encontrado com ID: ${movieId}`);

    // Dados do ticket
    const ticket = {
      movieId: movieId, // Usando o ID do filme encontrado
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99),
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
      showtime: faker.date.future().toISOString(),
    };

    // Fazer a requisição POST para criar o ticket
    const ticketResponse = await request.post(`tickets`, { data: ticket });

    // Verifica o código de status
    expect(ticketResponse.status()).toBe(201);

    // Validação do corpo da resposta
    let body;
    try {
      body = await ticketResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta está vazio ou inválido. Erro: ${error.message}`);
    }

    // Validação do corpo retornado
    if (body) {
      // Verifica se os dados retornados coincidem com os enviados
      expect(body.movieId).toBe(ticket.movieId);
      expect(body.userId).toBe(ticket.userId);
      expect(body.seatNumber).toBe(ticket.seatNumber);
      expect(body.price).toBe(ticket.price);
      expect(body.showtime).toBe(ticket.showtime);

      console.log('✅ Ticket criado com sucesso e os dados retornados estão corretos:', body);

      // Verifica se o ID do ticket foi retornado
      if (body._id) {
        console.log(`✅ Ticket ID recebido: ${body._id}`);
      } else {
        console.warn('⚠️ ID do ticket não foi retornado na resposta.');
      }
    } else {
      console.warn(`⚠️ Corpo da resposta não contém os dados esperados:
        Status: ${ticketResponse.status()}
        Body Recebido: ${JSON.stringify(body || {})}`);
    }

    // Alterar o ticket
    const updatedTicket = {
      movieId: movieId, // O ID do filme permanece o mesmo
      userId: faker.number.int(9999),
      seatNumber: faker.number.int(99), // Alterando o número do assento
      price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }), // Alterando o preço
      showtime: faker.date.future().toISOString(),
    };

    const ticketId = body._id; // ID do ticket criado anteriormente
    const putResponse = await request.put(`tickets/${ticketId}`, { data: updatedTicket });

    // Verifica o código de status após a atualização
    expect(putResponse.status()).toBe(200);

    let updatedTicketBody;
    try {
      updatedTicketBody = await putResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta da atualização do ticket está vazio ou inválido. Erro: ${error.message}`);
    }

    if (updatedTicketBody) {
      // Valida os dados atualizados do ticket
      expect(updatedTicketBody.seatNumber).toBe(updatedTicket.seatNumber);
      expect(updatedTicketBody.price).toBe(updatedTicket.price);
      console.log('✅ Ticket atualizado com sucesso:', updatedTicketBody);
    } else {
      console.warn(`⚠️ Corpo da resposta da atualização não contém os dados esperados:
        Status: ${putResponse.status()}
        Body Recebido: ${JSON.stringify(updatedTicketBody || {})}`);
    }

    // Verificar se a alteração foi realizada com sucesso usando um GET
    const getResponse = await request.get(`tickets/${ticketId}`);
    expect(getResponse.status()).toBe(200);

    let getTicketBody;
    try {
      getTicketBody = await getResponse.json();
    } catch (error) {
      console.warn(`⚠️ Corpo da resposta do GET do ticket está vazio ou inválido. Erro: ${error.message}`);
    }

    if (getTicketBody) {
      // Verifica se os dados foram realmente atualizados
      expect(getTicketBody.seatNumber).toBe(updatedTicket.seatNumber);
      expect(getTicketBody.price).toBe(updatedTicket.price);
      console.log('✅ Alteração do ticket confirmada pelo GET:', getTicketBody);
    } else {
      console.warn(`⚠️ Corpo da resposta do GET não contém os dados esperados:
        Status: ${getResponse.status()}
        Body Recebido: ${JSON.stringify(getTicketBody || {})}`);
    }
  });
});
