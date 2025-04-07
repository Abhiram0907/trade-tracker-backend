import { FastifyInstance } from 'fastify';
import { getTrades, postTrade } from '../controllers/trades.js';

export const tradeRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/trades', getTrades);
  fastify.post('/create-trade', postTrade);
};