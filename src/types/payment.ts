// Payment types for the application
export interface PaymentRequest {
  orderId: string;
  buyerEmail: string;
  amount: number;
  paymentToken: string;
  paymentMethod: 'card' | 'sberbank' | 'other';
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  newOrderStatus: 'PENDING' | 'PAID' | 'FAILED';
}

export type OrderStatus = 'CREATED' | 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED';

export interface PaymentGateway {
  processPayment(request: PaymentRequest): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
}

// Additional types if needed
export interface TransactionData {
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING';
