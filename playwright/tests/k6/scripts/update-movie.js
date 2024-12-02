import http from 'k6/http';
import { check } from 'k6';

const baseUrl = 'http://127.0.0.1:3000/movies';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const options = {
    scenarios: {
        update_movies: {
            executor: 'constant-arrival-rate',
            rate: 100,  
            timeUnit: '1s',
            duration: '1s',  
            preAllocatedVUs: 0,
            maxVUs: 100,
            exec: 'update_movie', 
        }
    }
};

// pega os 200 primeiros
export function setup() {
    const setupData = http.get(baseUrl);
    let ids = [];
    if (setupData.status === 200) {
        ids = setupData.json().slice(0, 200).map(item => item._id);
    } else {
        console.error('Falha na consulta dos filmes');
        return null;
    }

    // gerar filmes
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

// funcao principal
export default function (setupData) {
    update_movie(setupData);  
}

// update
export function update_movie(setupData) {
    const movieIndex = __ITER % setupData.ids.length;  
    const movieId = setupData.ids[movieIndex];
    const movie = setupData.movies[movieIndex];

    // gerar dados
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

    // solicitacao com put
    const res = http.put(`${baseUrl}/${movieId}`, payload, params);

    check(res, {
        'Atualização de filme com sucesso': (r) => r.status === 200,
        'Tempo de resposta em menos de 300 milissegundos': (r) => r.timings.duration < 300,
    });

}