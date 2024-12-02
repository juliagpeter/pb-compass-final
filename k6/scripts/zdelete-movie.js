import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = 'http://127.0.0.1:3000/movies';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// config
export const options = {
    scenarios: {
        delete_movies: {
            executor: 'constant-arrival-rate',
            maxVUs: 100, 
            timeUnit: '1s',
            duration: '1s',  
            preAllocatedVUs: 0,
            rate: 100, 
            exec: 'delete_movie', 
        }
    }
};

// gerar filmes
export function setup() {
    const setupData = http.get(baseUrl);
    let ids = [];
    if (setupData.status === 200) {
        ids = setupData.json().slice(0, 200).map(item => item._id);
    } else {
        console.error('Falha na consulta dos filmes');
        return null;
    }
    return { ids };
}

// funcao principal
export default function (setupData) {
    delete_movie(setupData); 
}

export function delete_movie(setupData) {
    const movieIndex = __ITER % setupData.ids.length;
    const movieId = setupData.ids[movieIndex];

    const res = http.del(`${baseUrl}/${movieId}`);

    check(res, {
        'DELETE concluÍdo': (r) => r.status === 200,
        'Tempo de resposta menor que 400ms': (r) => r.timings.duration < 400,
    });

}

export function handleSummary(data) {
    return {
      // Gera o relatório HTML na pasta 'reports' com o nome baseado no script
      'reports/delete-movies.html': htmlReport(data),
    };
  }