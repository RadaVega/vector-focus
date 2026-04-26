import { PaymentRequest } from '../types/payment';

/**
 * Имитирует вызов внешнего API платежной системы.
 * @param request - Данные платежа.
 * @returns Promise<{ success: boolean, transactionId: string, message: string }>
 */
export async function charge(request: PaymentRequest): Promise<{ success: boolean, transactionId: string, message: string }> {
    console.log(`[GATEWAY] Попытка списания ${request.amount} с токена ${request.paymentToken}...`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация задержки сети

    // Логика имитации: если токен содержит "fail", то платеж не пройдет.
    if (request.paymentToken.includes('fail')) {
        return { 
            success: false, 
            transactionId: '', 
            message: 'Недостаточно средств или неверный токен.' 
        };
    }

    // Успешный платеж
    return { 
        success: true, 
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`, 
        message: 'Платеж успешно проведен.' 
    };
}