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
            rate: 100,  // 100 requisições por segundo
            preAllocatedVUs: 0,
            duration: '1s',  // duração do teste
            exec: 'get_movies',
        }
    },
    thresholds: {
        http_req_duration: ['p(95)<200', 'p(99)<500'],
        
        http_req_failed: ['rate<0.01'],
        
        'checks{scenario:get_movies}': ['rate>0.99'],
    },
};

export default function () {
    get_movies();
}

export function get_movies() {
    const res = http.get(baseUrl);
    
    check(res, {
        'GET concluído com sucesso': (r) => r.status === 200,
        'Tempo de resposta menor que 200ms': (r) => r.timings.duration < 200,
    });
}

export function handleSummary(data) {
    return {
        'reports/get-movies.html': htmlReport(data),
    };
}