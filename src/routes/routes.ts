import { FastifyInstance } from 'fastify';
import { getTrades, postTrades } from '../controllers/trades.js';
import { addJournal, getAllJournals } from '../controllers/journal.js';

export const Routes = async (fastify: FastifyInstance) => {
  fastify.get('/get-trades', getTrades);
  fastify.post('/add-trade', postTrades);
  fastify.get('/get-all-journals', getAllJournals);
  fastify.post('/add-journal', addJournal);
};