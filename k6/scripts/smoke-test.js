
// a ideia do smoke test é garantir que os principais fluxos da API estão funcionando sem entrar em detalhes mais profundos, como validações específicas.

import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE_URL = 'http://127.0.0.1:3000/movies'; 

export const options = {
    scenarios: {
        constant_load: {
            executor: 'constant-arrival-rate',
            rate: 50, // 50 requisições por segundo
            timeUnit: '1s',
            duration: '5s', // Testa por 5 segundos
            preAllocatedVUs: 50,
            maxVUs: 200,
        },
    },
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% das requisições devem ser abaixo de 500ms
        http_req_failed: ['rate<0.01'],  // Taxa de falha deve ser menor que 1%
    },
};

const payload = JSON.stringify({
  title: "AAA",
  description: "teste",
  launchdate: new Date().toISOString(),
  showtimes: ["01", "02"]
});

const headers = { 'Content-Type': 'application/json' };

function logFailure(reqName, res) {
    if (!res.status || res.status >= 400) {
        console.error(`🚨 Falha na requisição ${reqName} - Status: ${res.status}`);
    }
}

export default function () {
    group('Smoke Test - Endpoint POST /movies', () => {
        const res = http.post(BASE_URL, payload, { headers });

        const isSuccessful = check(res, {
            'status é 201': (r) => r.status === 201,
            'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
        });

        if (!isSuccessful) {
            logFailure('POST /movies', res);
        }

        sleep(0.1);
    });
}
