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

export function setup() {
    const setupData = http.get(baseUrl);
    if (setupData.status === 200) {
        const ids = setupData.json().slice(0, 200).map(item => item._id);
        return ids;
    } else {
        return null;
    }
}


export default function (setupData) {
    get_movies(setupData);
}

export function get_movies(setupData) {
    const movieIndex = __ITER % setupData.length; 
    const movie = setupData[movieIndex]; 

    const res = http.get(`${baseUrl}/${movie}`);
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
