const { faker } = require('@faker-js/faker');

// Função para gerar um filme com dados aleatórios
function generateMovie() {
  const currentDate = new Date().toISOString().split('T')[0]; 
  
  return {
    title: faker.word.words(2), 
    description: faker.lorem.sentence(),
    launchdate: currentDate,
    showtimes: [
      faker.date.future().toISOString().split('T')[0], 
      faker.date.future().toISOString().split('T')[0], 
    ],
  };
}
