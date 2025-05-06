import { FastifyRequest, FastifyReply } from 'fastify';
import { AddTradeRequest } from '../types/trade.types';
import { db } from '../plugins/db';
import { trades } from '../db/schema';
import { eq, and } from 'drizzle-orm';

interface GetTradeQueryParams {
    user_id?: string;
    journal_id?: string;
}

let pnl = 0;
let returnPercent = 0;
let status = '';

export async function getTrades(request: FastifyRequest<{ Querystring: GetTradeQueryParams }>, reply: FastifyReply) {
    try {
        const { user_id, journal_id } = request.query;
        console.log('request', request.body);

        if (!user_id || !journal_id) {
            return reply.code(400).send({ error: 'user_id and journal_id are required' });
        }

        const tradesResult = await db.select()
            .from(trades)
            .where(and(
                eq(trades.user_id, user_id),
                eq(trades.journal_id, journal_id)
            ));

        return reply.send({ 
            message: 'Received test query parameter: ' + user_id + ' and last query parameter: ' + journal_id, 
            status: 200,
            data: tradesResult
        });
    } catch (err) {
        console.error('Get trades failed:', err);
        return reply.code(500).send({ error: 'Failed to retrieve trades for user: ' + request.query.user_id + ' and journal: ' + request.query.journal_id });
    }
    
}

function calculatePnl(entry_price: number, exit_price: number, quantity: number, side: string, fees_plus_commissions: number) {

    const isBuy = side.toUpperCase() === 'BUY';
    const priceDiff = isBuy ? exit_price - entry_price : entry_price - exit_price;
    
    pnl = priceDiff * quantity;
    pnl -= fees_plus_commissions * quantity;
    returnPercent = (pnl / (entry_price * quantity)) * 100;
    if (pnl > 0) {
        status = 'WIN';
    } else if (pnl < 0) {
    status = 'LOSS';
    } else {
    status = 'BREAKEVEN';
    }
}


export async function postTrades(request: FastifyRequest<{ Body: AddTradeRequest }>,reply: FastifyReply) {
    try {
        const trade = request.body;

        calculatePnl(trade.entry_price, trade.exit_price, trade.quantity, trade.side, trade.fees_plus_commissions ?? 0);

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
