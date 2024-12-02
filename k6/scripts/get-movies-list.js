import http from 'k6/http';
import { check } from 'k6';

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
        'Tempo de resposta menor que 100ms': (r) => r.timings.duration < 200,
    });

}


