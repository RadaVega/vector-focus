import { PaymentGateway, PaymentRequest, PaymentResult } from '../types/payment';

export class SberbankGateway implements PaymentGateway {
  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Mock implementation for build
    console.log('Processing payment with Sberbank:', request);
    return {
      success: true,
      message: 'Payment processed successfully (mock)',
      transactionId: 'mock_txn_' + Date.now()
    };
  }
}
