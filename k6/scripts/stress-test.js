import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = 'http://127.0.0.1:3000/movies';

export const options = {
    scenarios: {
        constant_load: {
            executor: 'constant-arrival-rate',
            rate: 50, 
            timeUnit: '1s',
            duration: '1m', 
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], 
        http_req_failed: ['rate<0.01'],  
    },
};

function logFailure(reqName, res) {
    if (!res.status || res.status >= 400) {
        console.error(`🚨 Falha na requisição ${reqName} - Status: ${res.status}`);
    }
}

export default function () {
    group('Testando endpoint GET /movies', () => {
        const res = http.get(BASE_URL);

        const isSuccessful = check(res, {
            'status é 200': (r) => r.status === 200,
            'tempo de resposta > 500ms': (r) => r.timings.duration > 500,
            'conteúdo não é vazio': (r) => r.body.length > 0,
        });

        if (!isSuccessful) {
            logFailure('GET /movies', res);
        }

        sleep(0.1);
    });
}

export function handleSummary(data) {
    return {
      // Gera o relatório HTML na pasta 'reports' com o nome baseado no script
      'reports/stress-test.html': htmlReport(data),
    };
  }