import { PaymentRequest, PaymentResponse, OrderStatus } from '../types/payment';
import { getOrderById, updateOrderStatus } from '../db/database';
import { charge } from '../integrations/paymentGateway';

/**
 * Имитирует отправку email.
 */
async function sendConfirmationEmail(email: string, orderId: string, amount: number): Promise<void> {
    console.log(`[EMAIL] Уведомление отправлено на ${email} об оплате ${amount}.`);
}

/**
 * Основная функция обработки платежа.
 * @param request - Запрос на оплату.
 * @returns Promise<PaymentResponse> - Результат транзакции.
 */
export async function processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    console.log(`\n--- [START] Обработка платежа для заказа ${request.orderId} ---`);

    // 1. Проверка данных (Валидация)
    const order = await getOrderById(request.orderId);
    if (!order || order.status !== 'CREATED') {
        return { success: false, message: `Заказ ${request.orderId} не найден или не готов к оплате. Текущий статус: ${order?.status || 'UNKNOWN'}.`, newOrderStatus: order ? order.status : 'FAILED' };
    }

    // 2. Вызов внешнего платежного шлюза
    let gatewayResult: { success: boolean, transactionId: string, message: string };
    try {
        gatewayResult = await charge(request);
    } catch (error) {
        console.error("Критическая ошибка интеграции:", error);
        return { success: false, message: "Внутренняя ошибка при связи с платежной системой.", newOrderStatus: 'FAILED' };
    }

    // 3. Обработка ответа и обновление БД
    if (gatewayResult.success) {
        await updateOrderStatus(request.orderId, 'PAID', gatewayResult.transactionId);
        
        // 4. Отправка уведомлений
        await sendConfirmationEmail(request.buyerEmail, request.orderId, request.amount);

        return { 
            success: true, 
            message: "Платеж успешно обработан.", 
            transactionId: gatewayResult.transactionId, 
            newOrderStatus: 'PAID' 
        };
    } else {
        // Если платеж не удался, обновляем статус на FAILED
        await updateOrderStatus(request.orderId, 'FAILED');
        return { 
            success: false, 
            message: `Ошибка оплаты: ${gatewayResult.message}. Пожалуйста, проверьте данные или попробуйте позже.`, 
            newOrderStatus: 'FAILED' 
        };
    }
}
}