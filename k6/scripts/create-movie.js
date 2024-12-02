import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = 'http://127.0.0.1:3000/movies';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Opções com Thresholds
export const options = {
    scenarios: {
        create_movies: {
            executor: 'constant-arrival-rate',
            maxVUs: 100, 
            timeUnit: '1s',
            duration: '1s',  
            preAllocatedVUs: 0,
            rate: 100, 
            exec: 'create_movie', 
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<300', 'p(99)<500'], // 95% das requisições em menos de 300ms, 99% em menos de 500ms
        http_req_failed: ['rate<0.01'],                // Menos de 1% das requisições podem falhar
        'checks{scenario:create_movies}': ['rate>0.99'], // Pelo menos 99% das validações devem passar no cenário create_movies
    },
};

// Gerar 200 filmes
export function setup() {
    const movies = [];
    for (let i = 0; i < 200; i++) {
        const movie = {
            title: `Filme ${i + 1}`,
            description: `Descrição do filme ${i + 1}`,
            launchdate: `2024-11-${randomNum(1, 30)}T16:24:39.184Z`,
            showtimes: [
                `${randomNum(18, 23)}:00`, 
                `${randomNum(18, 23)}:00`
            ],
        };
        movies.push(movie);
    }
    return movies; 
}

export default function (setupData) {
    create_movie(setupData);
}

export function create_movie(setupData) {
    const movieIndex = __ITER % setupData.length; 
    const movie = setupData[movieIndex]; 

    const payload = JSON.stringify({
        title: movie.title,
        description: movie.description,
        launchdate: movie.launchdate,
        showtimes: movie.showtimes,
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(baseUrl, payload, params);
    
    check(res, {
        'POST de filme': (r) => r.status === 201,
        'Tempo de resposta menor que 200ms': (r) => r.timings.duration < 200,
    });
}

// Função para gerar o relatório HTML
export function handleSummary(data) {
  return {
    // Gera o relatório HTML na pasta 'reports' com o nome baseado no script
    'reports/create-movie-report.html': htmlReport(data),
  };
}