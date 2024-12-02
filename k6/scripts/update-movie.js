import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = 'http://127.0.0.1:3000/movies';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const options = {
    scenarios: {
        update_movies: {
            executor: 'constant-arrival-rate',
            maxVUs: 100, 
            timeUnit: '1s',
            duration: '1s',  
            preAllocatedVUs: 0,
            rate: 100, 
            exec: 'update_movie', 
        }
    },
    thresholds: {
        // Garantir que 95% das requisições sejam concluídas em menos de 300ms
        http_req_duration: ['p(95)<300', 'p(99)<500'],
        
        // Menos de 1% de falhas
        http_req_failed: ['rate<0.01'],
        
        // Pelo menos 99% das verificações devem ser bem-sucedidas
        'checks{scenario:update_movies}': ['rate>0.99'],
    },
};

export function setup() {
    const setupData = http.get(baseUrl);
    let ids = [];
    if (setupData.status === 200) {
        ids = setupData.json().slice(0, 200).map(item => item._id);
    } else {
        console.error('Falha na consulta dos filmes');
        return null;
    }

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

    return { ids, movies };
}

export default function (setupData) {
    update_movie(setupData);  
}

export function update_movie(setupData) {
    const movieIndex = __ITER % setupData.ids.length;  // Acessa filmes de forma cíclica
    const movieId = setupData.ids[movieIndex];
    const movie = setupData.movies[movieIndex];

    const updatedMovie = {
        title: movie.title,
        description: movie.description,
        launchdate: movie.launchdate,
        showtimes: movie.showtimes,
    };

    const payload = JSON.stringify(updatedMovie);

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.put(`${baseUrl}/${movieId}`, payload, params);

    check(res, {
        'PUT concluído com sucesso': (r) => r.status === 200,
        'Tempo de resposta menor que 300ms': (r) => r.timings.duration < 300,
    });
}

export function handleSummary(data) {
    return {
        'reports/update-movies.html': htmlReport(data),
    };
}