export interface XenditInvoicePayload {
  id: string;
  external_id: string;
  user_id: string;
  is_high: boolean;
  payment_method: "QRIS";
  status: "PAID" | "PENDING" | "EXPIRED";
  merchant_name: string;
  amount: number;
  paid_amount: number;
  bank_code: string;
  paid_at: string; // ISO date
  payer_email: string;
  description: string;
  created: string; // ISO date
  updated: string; // ISO date
  currency: "IDR";
  payment_channel: string;
  payment_destination: string;
}
