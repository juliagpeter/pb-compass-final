import http from 'k6/http';
import { check } from 'k6';

const baseUrl = 'http://127.0.0.1:3000/tickets';
const randomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = () => {
    const year = randomNum(2020, 2024);
    const month = randomNum(1, 12);
    const day = randomNum(1, 28);
    return `${day}/${month}/${year}`;
};

export const options = {
    scenarios: {
        create_tickets: {
            executor: 'constant-arrival-rate',
            maxVUs: 100,
            timeUnit: '1s',
            rate: 100, 
            preAllocatedVUs: 0,
            duration: '1s',
            
        },
    },
};

export function setup() {
    return Array.from({ length: 200 }, (_, i) => ({
        movieId: `MovieId ${i + 1}`,
        userId: `UserId ${i + 1}`,
        seatNumber: randomNum(0, 99),
        price: randomNum(0, 60),
        showtime: randomDate(),
    }));
}

export default function (setupData) {
    const ticket = setupData[__ITER % setupData.length];
    const payload = JSON.stringify(ticket);
    const params = { headers: { 'Content-Type': 'application/json' } };
    
    const res = http.post(baseUrl, payload, params);

    check(res, {
        'Criação de ticket com sucesso': (r) => r.status === 201,
        'Tempo de resposta < 300ms': (r) => r.timings.duration < 300,
    });
}
