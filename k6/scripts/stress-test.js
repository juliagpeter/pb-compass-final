import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

const BASE_URL = 'http://127.0.0.1:3000/movies';  // Ajuste se necessário

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

// Corpo fixo da requisição
const payload = JSON.stringify({
  title: "AAA",
  description: "teste",
  launchdate: "{{currentDate}}", // Pode precisar ser ajustado para uma data real
  showtimes: ["01", "02"]
});

const headers = { 'Content-Type': 'application/json' };

function logFailure(reqName, res) {
    if (!res.status || res.status >= 400) {
        console.error(`🚨 Falha na requisição ${reqName} - Status: ${res.status}`);
    }
}

export default function () {
    group('Testando endpoint POST /movies', () => {
        const res = http.post(BASE_URL, payload, { headers });

        const isSuccessful = check(res, {
            'status é 201': (r) => r.status === 201,
            'tempo de resposta < 500ms': (r) => r.timings.duration < 500,
        });

        if (!isSuccessful) {
            logFailure('POST /movies', res);
        }

        sleep(0.1); // Pausa de 100ms entre as execuções
    });
}

// Função para gerar o relatório HTML
export function handleSummary(data) {
    return {
        'reports/stress-test-movies.html': htmlReport(data),
    };
}
