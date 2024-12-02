import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = 'http://127.0.0.1:3000/movies';

// Função auxiliar para gerar números aleatórios
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Configuração do teste
export const options = {
    scenarios: {
        delete_movies: {
            executor: 'constant-arrival-rate',
            maxVUs: 100, 
            timeUnit: '1s',  
            duration: '1s', 
            rate: 100,  
            preAllocatedVUs: 0,  
            exec: 'delete_movie', 
        }
    }
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
    return { ids };
}

export default function (setupData) {
    delete_movie(setupData); 
}

// Função de deletação de filme
export function delete_movie(setupData) {
    const movieIndex = __ITER % setupData.ids.length; 
    const movieId = setupData.ids[movieIndex]; 

    const res = http.del(`${baseUrl}/${movieId}`);

    check(res, {
        'DELETE concluído com sucesso': (r) => r.status === 200, 
        'Tempo de resposta menor que 400ms': (r) => r.timings.duration < 400,
    });
}

export function handleSummary(data) {
    return {
        'reports/delete-movies.html': htmlReport(data),
    };
}