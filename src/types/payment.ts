/**
 * Тип данных, отправляемых с Frontend на Backend.
 */
export interface PaymentRequest {
    orderId: string;          // ID заказа, который оплачивается
    buyerEmail: string;       // Email покупателя для уведомления
    amount: number;           // Сумма платежа (в копейках или центах)
    paymentToken: string;     // Токен, полученный от платежной системы
    paymentMethod: 'card' | 'sberbank' | 'other'; // Способ оплаты
}

/**
 * Тип данных, возвращаемых Backend на Frontend.
 */
export interface PaymentResponse {
    success: boolean;
    message: string;
    transactionId?: string; // Уникальный ID транзакции
    newOrderStatus: 'PENDING' | 'PAID' | 'FAILED'; // Новый статус заказа
}

/**
 * Статусы заказа в системе.
 */
export type OrderStatus = 'CREATED' | 'PENDING' | 'PAID' | 'CANCELLED' | 'FAILED';