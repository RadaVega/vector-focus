/**
 * Тип данных, используемый для управления состоянием формы.
 */
export type PaymentStatus = 'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR';

/**
 * Тип данных, отправляемых с Frontend на Backend.
 */
export interface PaymentFormData {
    orderId: string;
    buyerEmail: string;
    amount: number;
    paymentToken: string;
    paymentMethod: 'card' | 'sberbank' | 'other';
}