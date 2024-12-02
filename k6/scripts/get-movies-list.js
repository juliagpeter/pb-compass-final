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
            duration: '1s',  
            preAllocatedVUs: 0,
            rate: 100, 
            exec: 'get_movies', 
        }
    }
};

export default function () {
    get_movies();
}

export function get_movies() {
    const res = http.get(baseUrl);
    check(res, {
        'GET concluido': (r) => r.status === 200,
        'Tempo de resposta menor que 200ms': (r) => r.timings.duration < 200,
    });

}

export function handleSummary(data) {
    return {
      // Gera o relatório HTML na pasta 'reports' com o nome baseado no script
      'reports/get-movies.html': htmlReport(data),
    };
  }

