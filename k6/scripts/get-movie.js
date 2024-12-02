import http from 'k6/http';
import { check } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const baseUrl = 'http://127.0.0.1:3000/movies';

export const options = {
    scenarios: {
        get_movies: {
            executor: 'constant-arrival-rate',
            maxVUs: 100, 
            timeUnit: '1s',
            rate: 100, 
            preAllocatedVUs: 0,
            duration: '1s',
            exec: 'get_movies',
        }
    },
    thresholds: {
        // 95% das requisições devem ter tempo de resposta abaixo de 200ms e 99% abaixo de 500ms
        http_req_duration: ['p(95)<200', 'p(99)<500'],
        // Menos de 1% de falhas
        http_req_failed: ['rate<0.01'],
        // Pelo menos 99% das requisições devem passar nas verificações
        'checks{scenario:get_movies}': ['rate>0.99'],
    },
};

// Função de configuração que faz o GET inicial para pegar os IDs dos filmes
export function setup() {
    const res = http.get(baseUrl);
    if (res.status === 200) {
        const ids = res.json().slice(0, 200).map(item => item._id);  // Pega os primeiros 200 filmes
        return ids;
    } else {
        console.error('Erro ao obter filmes:', res.status);
        return [];  // Retorna um array vazio em caso de erro
    }
}

export default function (setupData) {
    get_movies(setupData);
}

export function get_movies(setupData) {
    if (setupData.length === 0) {
        console.error('Nenhum filme encontrado para testar.');
        return;
    }

    const movieIndex = __ITER % setupData.length;  // Seleciona um ID de filme baseado no índice
    const movieId = setupData[movieIndex];

    const res = http.get(`${baseUrl}/${movieId}`);
    
    // Verificações de status e tempo de resposta
    check(res, {
        'GET de filme concluído': (r) => r.status === 200,
        'Tempo de resposta menor que 50ms': (r) => r.timings.duration < 50,
    });
}

export function handleSummary(data) {
    return {
        // Gera o relatório HTML na pasta 'reports' com o nome baseado no script
        'reports/get-movie-report.html': htmlReport(data),
    };
}