export interface GetAllJournalsRequest {
    user_id?: string;
}

export interface AddJournalRequest {
    journal_name: string;
    initial_balance: string;
    user_id?: string;
}