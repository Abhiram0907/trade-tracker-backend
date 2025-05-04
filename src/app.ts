import { fastify } from 'fastify';
import cors from '@fastify/cors';
import { Routes } from './routes/routes.js';
import {healthRoutes} from './routes/health.js';
import { SupabaseClient } from '@supabase/supabase-js';

// Extend FastifyInstance to include supabase
declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

const server = fastify();

// Register CORS plugin
server.register(cors, {
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
});

server.register(Routes);
server.register(healthRoutes);

async function start() {
  try {
      const port = parseInt(process.env.PORT || '3333', 10);
      await server.listen({ port, host: '0.0.0.0' });
      console.log(`Server is running on port ${port}`);
  } catch (err) {
      console.error(err);
      process.exit(1);
  }
}


start();
