import { FastifyRequest, FastifyReply } from 'fastify';
import { AddTradeRequest } from '../types/trade.types';
import { db } from '../plugins/db';
import { trades } from '../db/schema';

interface TradeQueryParams {
    first?: string;
    last?: string;
    // Add other query parameters as needed
}

let pnl = 0;
let returnPercent = 0;
let status = '';

export async function getTrades(request: FastifyRequest<{ Querystring: TradeQueryParams }>, reply: FastifyReply) {
    const { first, last } = request.query;
    console.log('request', request.body);

    return reply.send({ 
        message: 'Received test query parameter: ' + first + ' and last query parameter: ' + last, 
        status: 200,
        data: { first, last }
    });
}

function calculatePnl(entry_price: number, exit_price: number, quantity: number, side: string) {
    
    pnl = (exit_price - entry_price) * quantity;
    returnPercent = (pnl / (entry_price * quantity)) * 100;
    if(side.toUpperCase() === 'BUY' && pnl > 0) { 
        status = 'WIN';
    } else if(side.toUpperCase() === 'BUY' && pnl < 0) {
        status = 'LOSS';
    } else if(side.toUpperCase() === 'SELL' && pnl > 0) {
        status = 'LOSS';
    } else if(side.toUpperCase() === 'SELL' && pnl < 0) {
        status = 'WIN';
    }
}


export async function postTrades(request: FastifyRequest<{ Body: AddTradeRequest }>,reply: FastifyReply) {
    try {
        const trade = request.body;

        calculatePnl(trade.entry_price, trade.exit_price, trade.quantity, trade.side);

        const mappedTrade = {
            user_id: trade.user_id,
            symbol: trade.symbol,
            side: trade.side.toUpperCase(),
            quantity: Number(trade.quantity).toString(),
            entry_price: Number(trade.entry_price).toString(),
            exit_price: Number(trade.exit_price).toString(),
            entry_time: trade.entry_time ? new Date(trade.entry_time) : null,
            exit_time: trade.exit_time ? new Date(trade.exit_time) : null,
            pnl: pnl !== null ? (Math.round(pnl * 10) / 10).toString() : null,
            return_percent: returnPercent !== null ? (Math.round(returnPercent * 10) / 10).toString() : null,
            status,
            embedding: null,
            journal_id: Number(trade.journal_id).toString() || '1',
        }          
        const inserted = await db
          .insert(trades)
          .values(mappedTrade)
          .returning();

        return reply
          .code(201)
          .header('Location', `/api/trades/${inserted[0].id}`)
          .send(inserted[0]);
    } catch (err) {
    console.error('Trade creation failed:', err);
    return reply.code(500).send({ error: 'Failed to create trade' });
    }
}
