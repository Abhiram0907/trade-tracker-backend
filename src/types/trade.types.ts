export interface AddTradeRequest {
  symbol: string;
  side: string;
  quantity: number;
  entry_price: number;
  exit_price: number;
  entry_time: string;
  exit_time: string;
  strategy_tag: string;
  notes?: string;
  userId?: string;
}