import { FastifyRequest, FastifyReply } from 'fastify';

export async function getTrades(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Get all trades', status: 200 });
}

export async function postTrade(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: 'Create new trade' });
}
