import { FastifyReply, FastifyRequest } from "fastify";
import { AddJournalRequest, DeleteJournalRequest, GetAllJournalsRequest } from "../types/journal.types";
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
            .where(eq(journals.user_id, user_id))
            .orderBy(journals.created_at);
          
        const journalsWithIndex = getJournalsResult.map((journal, index) => ({
            ...journal,
            index,
          }));

        return reply.send({ 
            message: 'Received Journals for: ' + user_id, 
            status: 200,
            data: journalsWithIndex
        });
    } catch (err) {
        console.error('Get all journals failed:', err);
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
        console.error('Add Journal failed:', err);
        return reply.code(500).send({ error: 'Failed to retrieve trades for user: ' + request.body.user_id + ' and journal: ' + request.body.journal_name });
    }
    
}

export async function deleteJournal(
    request: FastifyRequest<{ Body: DeleteJournalRequest }>,
    reply: FastifyReply
  ) {
    try {
      const { journal_id, user_id } = request.body;
  
      if (!journal_id || !user_id) {
        return reply.code(400).send({ error: 'journal_id and user_id are required' });
      }
  
      const deleteResult = await db
        .delete(journals)
        .where(and(eq(journals.id, journal_id), eq(journals.user_id, user_id)))
        .returning();
  
      if (deleteResult.length === 0) {
        return reply.code(404).send({ error: 'No journal found for given user_id and journal_id' });
      }
  
      return reply.send({
        message: `Successfully deleted journal ${journal_id} for user ${user_id}`,
        status: 200,
        data: deleteResult,
      });
    } catch (err) {
      console.error('Delete Journal failed:', err);
      return reply.code(500).send({ error: 'Failed to delete journal for user: ' + request.body.user_id });
    }
  }
  