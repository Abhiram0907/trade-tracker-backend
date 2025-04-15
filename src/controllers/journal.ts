import { FastifyReply, FastifyRequest } from "fastify";
import { AddJournalRequest, GetAllJournalsRequest } from "../types/journal.types";
import { db } from "../plugins/db";
import { journals } from "../db/schema";
import { eq, and } from 'drizzle-orm';

export async function getAllJournals(request: FastifyRequest<{ Querystring: GetAllJournalsRequest }>, reply: FastifyReply) {
    try {
        const { user_id } = request.query;

        if (!user_id) {
            return reply.code(400).send({ error: 'user_id are required' });
        }

        const getJournalsResult = await db.select()
            .from(journals)
            .where(and(
                eq(journals.user_id, user_id),
                // eq(trades.journal_id, journal_id)
            ));

        return reply.send({ 
            message: 'Received Journals for: ' + user_id, 
            status: 200,
            data: getJournalsResult
        });
    } catch (err) {
        console.error('Trade retrieval failed:', err);
        return reply.code(500).send({ error: 'Failed to retrieve journals for user: ' + request.query.user_id});
    }
    
}

export async function addJournal(request: FastifyRequest<{ Body: AddJournalRequest }>, reply: FastifyReply) {
    try {
        console.log('request', request.body);

        if (!request.body.user_id || !request.body.journal_name) {
            return reply.code(400).send({ error: 'user_id and journal_id are required' });
        }

        const mappedAddJournalValues = {
            user_id: request.body.user_id,
            name: request.body.journal_name,
            initial_balance: request.body.initial_balance || "0",
            current_balance: request.body.initial_balance || "0"
        }
        const addJournalResults = await db.insert(journals).values(mappedAddJournalValues).returning()

        return reply.send({ 
            message: 'Successfully Added Journal: ' + request.body.journal_name + ' by User: ' + request.body.user_id, 
            status: 200,
            data: addJournalResults
        });
    } catch (err) {
        console.error('Trade retrieval failed:', err);
        return reply.code(500).send({ error: 'Failed to retrieve trades for user: ' + request.body.user_id + ' and journal: ' + request.body.journal_name });
    }
    
}