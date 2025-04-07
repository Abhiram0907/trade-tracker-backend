import { FastifyRequest, FastifyReply } from 'fastify';

interface TradeQueryParams {
    first?: string;
    last?: string;
    // Add other query parameters as needed
}

export async function getTrades(request: FastifyRequest<{ Querystring: TradeQueryParams }>, reply: FastifyReply) {
    const { first, last } = request.query;
    console.log('request', request.body);

    return reply.send({ 
        message: 'Received test query parameter: ' + first + ' and last query parameter: ' + last, 
        status: 200,
        data: { first, last }
    });
}


export async function postTrades(request: FastifyRequest<{ Body: TradeRequest }>,reply: FastifyReply) {
    const requestBody = request.body;
    return reply.send({ 
        message: 'Received test query parameter: ' +  requestBody, 
        status: 200,
        data: { requestBody }
    });
}
