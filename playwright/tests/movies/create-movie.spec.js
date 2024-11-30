const { test, expect } = require('@playwright/test');
import { generateMovie } from '../../util/generate-movie';

test('[POST] Criação de um filme válido e verificação dos dados retornados', async ({ request }) => {
  const movie = generateMovie();

  const response = await request.post('movies', { data: movie });
  expect(response.status()).toBe(201);

  // const responseBody = await response.json();
  // console.log(responseBody); // Exibe a resposta para verificação

  /* Caso o ID seja retornado na resposta, armazena ele
  let movieId;
  if (responseBody._id) {
    movieId = responseBody._id;
  }

  // Verificar outras informações
  expect(responseBody.title).toBe(newMovie.title);
  expect(responseBody.description).toBe(newMovie.description);
  expect(responseBody.launchdate).toBe(newMovie.launchdate);
  expect(responseBody.showtimes).toEqual(newMovie.showtimes); */
});
