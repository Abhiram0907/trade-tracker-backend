import { FastifyInstance } from 'fastify';
import { getTrades, postTrades } from '../controllers/trades.js';

export const tradeRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/get-trades', getTrades);
  fastify.post('/add-trade', postTrades);
};