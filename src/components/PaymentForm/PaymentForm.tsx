import React, { useState, useCallback } from 'react';
import { PaymentFormData, PaymentStatus } from './types';
import { processPayment } from '../../services/paymentService';

// --- Mock API Call ---
// В реальном проекте этот вызов будет использовать Axios или fetch к вашему Next.js API роуту.
const mockApiCall = async (data: PaymentFormData) => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    // Вызываем наш бэкенд-сервис, который имитирует всю логику
    return processPayment(data); 
};

const PaymentForm: React.FC = () => {
    const [formData, setFormData] = useState<PaymentFormData>({
        orderId: 'ORD-12345',
        buyerEmail: 'user@example.com',
        amount: 15000, // 150.00 руб.
        paymentToken: 'mock_token_xyz',
        paymentMethod: 'card',
    });
    const [status, setStatus] = useState<PaymentStatus>('IDLE');
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('LOADING');
        setMessage('');

        try {
            // 1. Вызов API
            const result = await mockApiCall(formData);

            // 2. Обработка успешного ответа
            if (result.success) {
                setStatus('SUCCESS');
                setMessage(`✅ Успешно! Заказ ${formData.orderId} оплачен. ID транзакции: ${result.transactionId}`);
            } else {
                // Обработка бизнес-ошибок
                setStatus('ERROR');
                setMessage(`❌ Ошибка: ${result.message}`);
            }
        } catch (error) {
            // Обработка критических ошибок
            setStatus('ERROR');
            setMessage('⚠️ Критическая ошибка. Проверьте соединение или свяжитесь с поддержкой.');
            console.error("Payment submission failed:", error);
        }
    }, [formData]);

    // --- UI Рендеринг ---
    return (
        <div className="payment-container">
            <form onSubmit={handleSubmit} className="payment-form">
                <h2 className="form-title">Оплата заказа {formData.orderId}</h2>
                
                {/* Поля формы */}
                <div className="form-group">
                    <label htmlFor="buyerEmail">Email:</label>
                    <input 
                        type="email" 
                        id="buyerEmail"
                        name="buyerEmail" 
                        value={formData.buyerEmail} 
                        onChange={handleChange} 
                        placeholder="user@example.com" 
                        disabled={status === 'LOADING'}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Сумма:</label>
                    <input 
                        type="number" 
                        id="amount"
                        name="amount" 
                        value={formData.amount} 
                        onChange={handleChange} 
                        placeholder="15000" 
                        disabled={status === 'LOADING'}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="paymentToken">Токен:</label>
                    <input 
                        type="text" 
                        id="paymentToken"
                        name="paymentToken" 
                        value={formData.paymentToken} 
                        onChange={handleChange} 
                        placeholder="mock_token_xyz" 
                        disabled={status === 'LOADING'}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="paymentMethod">Способ оплаты:</label>
                    <select 
                        id="paymentMethod"
                        name="paymentMethod" 
                        value={formData.paymentMethod} 
                        onChange={handleChange} 
                        disabled={status === 'LOADING'}
                    >
                        <option value="card">Карта</option>
                        <option value="sberbank">Сбербанк</option>
                        <option value="other">Другое</option>
                    </select>
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'LOADING'}
                    className={`submit-button ${status === 'LOADING' ? 'loading' : ''}`}
                >
                    {status === 'LOADING' ? 'Обработка...' : 'Оплатить'}
                </button>

                {/* Отображение статуса */}
                {message && (
                    <div className={`status-message ${status === 'SUCCESS' ? 'success' : status === 'ERROR' ? 'error' : ''}`}>
                        {message}
                    </div>
                )}
            </form>
        </div>
    );
};

export default PaymentForm;