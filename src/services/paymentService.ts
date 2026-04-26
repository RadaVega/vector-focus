import { PaymentGateway, PaymentRequest, PaymentResult } from '../types/payment';
import { SberbankGateway } from '../integrations/sberbankGateway';
import { z } from 'zod'; // Импорт Zod

// Схема валидации для входящих данных платежа
const PaymentRequestSchema = z.object({
  amount: z.number().min(1).max(10000).positive(),
  currency: z.enum(['RUB', 'USD', 'EUR']).default('RUB'),
  paymentToken: z.string().min(10).max(100),
});

/**
 * Сервис, отвечающий за оркестровку бизнес-логики платежа.
 * Теперь принимает любой объект, реализующий PaymentGateway.
 */
export class PaymentService {
  private readonly gateway: PaymentGateway;
  /**
   * Конструктор принимает конкретный шлюз (Strategy).
   * @param gateway Экземпляр платежного шлюза.
   */
  constructor(gateway: PaymentGateway) {
    this.gateway = gateway;
  }

  /**
   * Основная бизнес-логика: Заказ -> Оплата -> Обновление статуса.
   * @param orderId ID заказа.
   * @param request Данные платежа.
   */
  async processOrderPayment(orderId: string, request: any): Promise<{ success: boolean; message: string }> {
    try {
      // 1. ВАЛИДАЦИЯ ВХОДНЫХ ДАННЫХ (КРИТИЧЕСКИ ВАЖНО)
      const validatedRequest = PaymentRequestSchema.safeParse(request);
      if (!validatedRequest.success) {
        return { success: false, message: `Ошибка валидации данных: ${validatedRequest.error.issues.map(i => i.message).join(', ')}` };
      }
      const validatedData: PaymentRequest = validatedRequest.data;

      // 2. Получение заказа (OrderService)
      const order = await this.getOrderById(orderId);
      if (!order) {
        return { success: false, message: 'Заказ не найден.' };
      }

      // 3. Выполнение платежа через внедренный шлюз (Strategy)
      const paymentResult: PaymentResult = await this.gateway.processPayment(validatedData);
      if (!paymentResult.success) {
        return { success: false, message: `Ошибка платежа: ${paymentResult.message}` };
      }
      // 4. Обновление статуса и отправка уведомления
      await this.updateOrderStatus(orderId, 'PAID');
      await this.sendConfirmationEmail(order);

      return { success: true, message: `Успешно! Заказ ${orderId} оплачен. ${paymentResult.message}` };

    } catch (error) {
      console.error("Критическая ошибка при обработке платежа:", error);
      return { success: false, message: 'Произошла внутренняя ошибка системы. Попробуйте позже.' };
    }
  }

  // --- Имитация зависимых методов ---
  private async getOrderById(orderId: string): Promise<{ id: string; total: number; status: string }> {
    // Здесь должна быть реальная логика запроса к БД
    return { id: orderId, total: 1000, status: 'PENDING' };
  }

  private async updateOrderStatus(orderId: string, status: 'PAID' | 'FAILED'): Promise<void> {
    // Здесь должна быть реальная логика обновления статуса в БД
    console.log(`[DB] Обновление статуса заказа ${orderId} на ${status}`);
  }

  private async sendConfirmationEmail(order: any): Promise<void> {
    // Здесь должна быть логика отправки email
    console.log(`[Email] Отправка подтверждения заказа ${order.id}`);
  }
}

