// ─────────────────────────────────────────────────────────────
// 🚧 FULL PAYMENT SERVICE (commented out – will be enabled later)
// ─────────────────────────────────────────────────────────────
/*
import { PaymentGateway, PaymentRequest, PaymentResult } from '../types/payment';
import { SberbankGateway } from '../integrations/sberbankGateway';
import { z } from 'zod';

const PaymentRequestSchema = z.object({
  amount: z.number().min(1).max(10000).positive(),
  currency: z.string().default('RUB'),
  paymentToken: z.string().min(10).max(100),
});

export class PaymentService {
  private readonly gateway: PaymentGateway;
  constructor(gateway: PaymentGateway) {
    this.gateway = gateway;
  }
  async processOrderPayment(orderId: string, request: any) {
    try {
      const validatedRequest = PaymentRequestSchema.safeParse(request);
      if (!validatedRequest.success) {
        return { success: false, message: `Validation error: ${validatedRequest.error.message}` };
      }
      const fullRequest: PaymentRequest = {
        orderId: orderId,
        buyerEmail: request.buyerEmail || 'customer@example.com',
        amount: validatedRequest.data.amount,
        paymentToken: validatedRequest.data.paymentToken,
        paymentMethod: request.paymentMethod || 'card',
      };
      const result = await this.gateway.processPayment(fullRequest);
      return result;
    } catch (error) {
      return { success: false, message: 'Payment failed' };
    }
  }
  private async getOrderById(orderId: string) {
    return { id: orderId, total: 1000, status: 'PENDING' };
  }
  private async updateOrderStatus(orderId: string, status: 'PAID' | 'FAILED') {
    console.log(`Order ${orderId} updated to ${status}`);
  }
  private async sendConfirmationEmail(order: any) {
    console.log(`Email sent for order ${order.id}`);
  }
}
*/

// ─────────────────────────────────────────────────────────────
// ✅ CURRENT ACTIVE MOCK – used by /demo page
// ─────────────────────────────────────────────────────────────
export const processPayment = async (paymentData: any) => {
  console.log("processPayment called:", paymentData);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const token = paymentData.paymentToken?.toLowerCase() || "";

  if (token.includes("success") || token.includes("test")) {
    return {
      success: true,
      message: `Платёж на сумму ${paymentData.amount} ₽ успешно проведён. ID транзакции: ${Date.now()}`,
    };
  } else if (token.includes("fail") || token.includes("error")) {
    return {
      success: false,
      message: "Ошибка платежа: недостаточно средств или неверный токен.",
    };
  } else {
    return {
      success: false,
      message: "Неизвестная ошибка. Попробуйте другой тестовый токен (например, 'success_token').",
    };
  }
};