import { FastifyInstance } from 'fastify';
import { db } from '../plugins/db.js';
import { journals, trades } from '../db/schema.js';

export const healthRoutes = async (fastify: FastifyInstance) => {
  fastify.get('/db-trades-health', async (_, reply) => {
    try {
      // Minimal query
      await db.select({ id: trades.id }).from(trades).limit(1);
      return reply.send({ status: 'connected to Postgres ✅' });
    } catch (err) {
      console.error('❌ DB ERROR:', err);
      return reply.status(500).send({ status: 'Postgres not reachable ❌' });
    }
  });

  fastify.get('/db-journal-health', async (_, reply) => {
    try {
      // Minimal query
      await db.select({ id: journals.id }).from(journals).limit(1);
      return reply.send({ status: 'connected to Postgres ✅' });
    } catch (err) {
      console.error('❌ DB ERROR:', err);
      return reply.status(500).send({ status: 'Postgres not reachable ❌' });
    }
  });
};