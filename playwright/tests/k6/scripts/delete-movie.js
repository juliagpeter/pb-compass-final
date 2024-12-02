import http from 'k6/http';
import { check } from 'k6';

const baseUrl = 'http://127.0.0.1:3000/movies';

function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// config
export const options = {
    scenarios: {
        delete_movies: {
            executor: 'constant-arrival-rate',
            rate: 60, 
            timeUnit: '1s',
            duration: '1s',  
            preAllocatedVUs: 0,
            maxVUs: 60,
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
        'Exclusão de filme com sucesso': (r) => r.status === 200,
        'Tempo de resposta em menos de 400 milissegundos': (r) => r.timings.duration < 400,
    });

}