describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})// cypress/e2e/nestjs-cinema.cy.js
const { faker } = require('@faker-js/faker');

describe('nestjs-cinema - Fluxo Completo', () => {
  const apiBaseUrl = 'http://localhost:3000';

  it('Criação, Edição e Exclusão de Filmes e Tickets', () => {
    const currentDate = new Date().toISOString().split('T')[0];

    const filme = {
      title: faker.word.words(2),
      description: faker.lorem.sentence(),
      launchdate: currentDate,
      showtimes: [
        faker.date.future().toISOString().split('T')[0],
        faker.date.future().toISOString().split('T')[0],
      ],
    };

    cy.request('POST', `${apiBaseUrl}/movies`, filme).then((response) => {
      expect(response.status).to.eq(201);
      const createdMovie = response.body;
      cy.log('✅ Filme criado com sucesso.');

      // 2. GET - Busca o filme criado
      cy.request('GET', `${apiBaseUrl}/movies`).then((response) => {
        expect(response.status).to.eq(200);
        const movies = response.body;

        const fetchedMovie = movies.find((m) => m.title === filme.title);
        expect(fetchedMovie).to.exist;
        cy.log(`✅ Filme encontrado: ${fetchedMovie.title} (ID: ${fetchedMovie._id})`);

        // 3. PUT - Edita o filme
        const updatedFilme = {
          title: faker.word.words(3),
          description: faker.lorem.paragraph(),
          launchdate: currentDate,
          showtimes: [faker.date.future().toISOString().split('T')[0]],
        };

        cy.request('PUT', `${apiBaseUrl}/movies/${fetchedMovie._id}`, updatedFilme).then((response) => {
          expect(response.status).to.eq(200);
          cy.log(`✅ Filme atualizado com sucesso: ${updatedFilme.title}`);

          // 4. POST - Cria um ticket
          const ticket = {
            movieId: fetchedMovie._id,
            userId: faker.number.int(9999),
            seatNumber: faker.number.int(99),
            price: faker.number.float({ min: 1, max: 60, fractionDigits: 2 }),
            showtime: faker.date.future().toISOString(),
          };

          cy.request('POST', `${apiBaseUrl}/tickets`, ticket).then((response) => {
            expect(response.status).to.eq(201);
            const createdTicket = response.body;
            cy.log(`✅ Ticket criado para o filme: ${updatedFilme.title}`);

            // 5. GET - Busca ticket
            cy.request('GET', `${apiBaseUrl}/tickets`).then((response) => {
              expect(response.status).to.eq(200);
              const tickets = response.body;

              const fetchedTicket = tickets.find((t) => t.movieId === fetchedMovie._id);
              expect(fetchedTicket).to.exist;
              cy.log(`✅ Ticket encontrado (ID: ${fetchedTicket._id})`);

              // 6. PUT - Edita o ticket
              const updatedTicket = {
                ...fetchedTicket,
                seatNumber: faker.number.int(99),
              };

              cy.request('PUT', `${apiBaseUrl}/tickets/${fetchedTicket._id}`, updatedTicket).then((response) => {
                expect(response.status).to.eq(200);
                cy.log(`✅ Ticket atualizado. Assento: ${updatedTicket.seatNumber}`);

                // 7. DELETE - Deleta ticket
                cy.request('DELETE', `${apiBaseUrl}/tickets/${fetchedTicket._id}`).then((response) => {
                  expect(response.status).to.eq(200);
                  cy.log('✅ Ticket deletado com sucesso.');

                  // 8. DELETE - Deleta o filme
                  cy.request('DELETE', `${apiBaseUrl}/movies/${fetchedMovie._id}`).then((response) => {
                    expect(response.status).to.eq(200);
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
