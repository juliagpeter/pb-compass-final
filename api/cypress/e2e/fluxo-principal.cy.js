const { faker } = require('@faker-js/faker');

describe('nestjs-cinema - Fluxo Completo', () => {

  it('Criação, Edição e Exclusão de Filmes e Tickets', () => {

    // 1. gera os dados do filme
    const filme = {
      title: faker.word.words(2),
      description: faker.lorem.sentence(),
      launchdate: faker.date.future().toISOString().split('T')[0],
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    cy.log(`🎬 Filme gerado: ${filme.title}`);

    // 2. POST - Cria o filme
    cy.request('POST', 'movies', filme).then((createMovieResponse) => {
      expect(createMovieResponse.status).to.eq(201);
      cy.log('✅ Filme criado com sucesso.');

      // 3. GET - Busca o filme criado
      cy.request('GET', '/movies').then((getMoviesResponse) => {
        expect(getMoviesResponse.status).to.eq(200);
        const createdMovie = getMoviesResponse.body.find(m => m.title === filme.title);
        expect(createdMovie).to.exist;
        cy.log(`✅ Filme encontrado na lista: ${createdMovie.title} (ID: ${createdMovie._id})`);

        // 4. PUT - Edita o filme
        const updatedFilme = {
          title: faker.word.words(3),
          description: faker.lorem.paragraph(),
          launchdate: new Date().toISOString().split('T')[0],
          showtimes: [faker.date.future().toISOString().split('T')[0]],
        };

        cy.request('PUT', `/movies/${createdMovie._id}`, updatedFilme).then((updateMovieResponse) => {
          expect(updateMovieResponse.status).to.eq(200);
          cy.log(`✅ Filme atualizado com sucesso: ${updatedFilme.title}`);

          // 5. POST - Cria um ticket
          const ticket = {
            movieId: createdMovie._id,
            userId: faker.number.int(9999),
            seatNumber: faker.number.int(99),
            price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
            showtime: faker.date.future().toISOString(),
          };

          cy.request('POST', '/tickets', ticket).then((createTicketResponse) => {
            expect(createTicketResponse.status).to.eq(201);
            cy.log(`✅ Ticket criado com sucesso para o filme: ${updatedFilme.title}`);

            // 6. GET - Busca o ticket
            cy.request('GET', '/tickets').then((getTicketsResponse) => {
              expect(getTicketsResponse.status).to.eq(200);
              const createdTicket = getTicketsResponse.body.find(t => t.movieId === createdMovie._id);
              expect(createdTicket).to.exist;
              cy.log(`✅ Ticket encontrado para o filme: ${updatedFilme.title} (ID: ${createdTicket._id})`);

              // 7. PUT - Edita o ticket
              const updatedTicket = {
                ...createdTicket,
                seatNumber: faker.number.int(99),
              };

              cy.request('PUT', `/tickets/${createdTicket._id}`, updatedTicket).then((updateTicketResponse) => {
                expect(updateTicketResponse.status).to.eq(200);
                cy.log(`✅ Ticket atualizado com sucesso. Assento: ${updatedTicket.seatNumber}`);

                // 8. DELETE - Deleta o ticket
                cy.request('DELETE', `/tickets/${createdTicket._id}`).then((deleteTicketResponse) => {
                  expect(deleteTicketResponse.status).to.eq(200);
                  cy.log('✅ Ticket deletado com sucesso.');

                  // 9. DELETE - Deleta o filme
                  cy.request('DELETE', `/movies/${createdMovie._id}`).then((deleteMovieResponse) => {
                    expect(deleteMovieResponse.status).to.eq(200);
                    cy.log('✅ Filme deletado com sucesso.');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
