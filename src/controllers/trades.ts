import { FastifyRequest, FastifyReply } from 'fastify';
import { AddTradeRequest } from '../types/trade.types';
import { db } from '../plugins/db';
import { trades } from '../db/schema';

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

function calculatePnl(entry_price: number, exit_price: number, quantity: number, side: string) {
    const pnl = (exit_price - entry_price) * quantity;
    return pnl;
}


export async function postTrades(request: FastifyRequest<{ Body: AddTradeRequest }>,reply: FastifyReply) {
    try {
        const trade = request.body;

        // calculatePnl(trade.entry_price, trade.exit_price, trade.quantity, trade.side);

        const mapTrade =
        {
            "userId": trade.userId,
            "symbol": trade.symbol,
            "side": trade.side,
            "quantity": trade.quantity.toString(),
            "entryPrice": trade.entry_price.toString(),
            "exitPrice": trade.exit_price.toString(),
            "entryTime": new Date(trade.entry_time),
            "exitTime": new Date(trade.exit_price),
            "pnl": "34.5",
            "returnPercent": "3.5",
            "status": "WIN",
            "strategyTag": trade.strategy_tag,
            "notes": "Entered on VWAP bounce after consolidation. Executed well with no hesitation.",
            "embedding": null,
        }
    
        const inserted = await db
          .insert(trades)
          .values(mapTrade)
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
