import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { tradeRoutes } from './routes/trades.js';
const server = fastify();

// Register CORS plugin
server.register(cors, {
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

server.register(tradeRoutes);

async function start() {
    try {
        await server.listen({ port: 3333 });
        console.log("Server is running on port 3333");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();
