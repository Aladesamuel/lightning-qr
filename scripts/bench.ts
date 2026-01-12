import fastify from 'fastify';
import { routes } from '../src/routes.js';

async function runBenchmark() {
    const server = fastify({ logger: false });
    server.register(routes);
    await server.ready();

    const iterations = 100;
    const start = performance.now();
    const latencies: number[] = [];

    console.log(`Starting benchmark: ${iterations} requests...`);

    for (let i = 0; i < iterations; i++) {
        const reqStart = performance.now();
        await server.inject({
            method: 'GET',
            url: '/generate',
            query: { text: `Benchmark ${i}`, size: '300' }
        });
        const reqEnd = performance.now();
        latencies.push(reqEnd - reqStart);
    }

    const end = performance.now();
    const totalTime = end - start;
    const avg = latencies.reduce((a, b) => a + b, 0) / iterations;
    const match = latencies.sort((a, b) => a - b);
    const p50 = match[Math.floor(iterations * 0.5)];
    const p95 = match[Math.floor(iterations * 0.95)];
    const p99 = match[Math.floor(iterations * 0.99)];

    console.log('\n--- Results ---');
    console.log(`Total Time: ${totalTime.toFixed(2)}ms`);
    console.log(`Avg Latency: ${avg.toFixed(2)}ms`);
    console.log(`P50: ${p50.toFixed(2)}ms`);
    console.log(`P95: ${p95.toFixed(2)}ms`);
    console.log(`P99: ${p99.toFixed(2)}ms`);

    if (avg < 50) {
        console.log('\n✅ SUCCESS: Sub-50ms goal achieved!');
    } else {
        console.log('\n⚠️ WARNING: Above 50ms goal.');
    }

    await server.close();
}

runBenchmark();
