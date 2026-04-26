import { OrderStatus } from '../types/payment';

// Имитация базы данных в памяти
const mockOrders: Record<string, { status: OrderStatus }> = {
    'ORD-12345': { status: 'CREATED' },
    'ORD-99999': { status: 'CANCELLED' },
};

/**
 * Получает информацию о заказе по ID.
 * @param orderId - ID заказа.
 * @returns Promise< { status: OrderStatus } | null >
 */
export async function getOrderById(orderId: string): Promise<{ status: OrderStatus } | null> {
    console.log(`[DB] Запрос заказа ${orderId}...`);
    await new Promise(resolve => setTimeout(resolve, 50)); // Имитация задержки БД
    return mockOrders[orderId] ? { status: mockOrders[orderId].status } : null;
}

/**
 * Обновляет статус заказа.
 * @param orderId - ID заказа.
 * @param newStatus - Новый статус.
 * @param transactionId - ID транзакции (опционально).
 */
export async function updateOrderStatus(orderId: string, newStatus: 'PAID' | 'FAILED', transactionId?: string): Promise<void> {
    console.log(`[DB] Обновление статуса заказа ${orderId} на ${newStatus}.`);
    await new Promise(resolve => setTimeout(resolve, 100)); // Имитация записи в БД
    
    // Обновляем наш mock
    if (mockOrders[orderId]) {
        mockOrders[orderId] = { status: newStatus };
    }
}