import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentForm from './PaymentForm';
import * as paymentService from '../../services/paymentService';
import * as paymentGateway from '../../integrations/paymentGateway';

describe('PaymentForm Component', () => {
    // Мокируем внешние зависимости для изоляции теста
    const mockProcessPayment = jest.spyOn(paymentService, 'processPayment');
    const mockCharge = jest.spyOn(paymentGateway, 'charge');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the form correctly in the initial state (IDLE)', () => {
        render(<PaymentForm />);
        // Проверка наличия основных элементов формы
        expect(screen.getByLabelText(/Email:/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Оплатить/i })).toBeInTheDocument();
    });

    it('should handle a successful payment flow (SUCCESS)', async () => {
        // 1. Настройка моков для успеха
        mockCharge.mockResolvedValueOnce({
            success: true,
            transactionId: 'mock_success_txn',
            message: 'Платеж успешно проведен.'
        });
        mockProcessPayment.mockResolvedValueOnce({
            success: true,
            message: 'Платеж успешно обработан.',
            transactionId: 'mock_success_txn',
            newOrderStatus: 'PAID'
        });

        render(<PaymentForm />);
        
        // 2. Имитация ввода данных и клика
        const form = screen.getByRole('form');
        const submitButton = screen.getByRole('button', { name: /Оплатить/i });
        
        fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'test@success.com' } });
        fireEvent.change(screen.getByLabelText(/Токен:/i), { target: { value: 'mock_token_xyz' } });
        
        fireEvent.click(submitButton);

        // 3. Ожидание и проверка результата
        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalledTimes(1);
            expect(screen.getByText(/Успешно! Заказ ORD-12345 оплачен. ID транзакции: mock_success_txn/i)).toBeInTheDocument();
        });
    });

    it('should handle payment failure due to insufficient funds (ERROR)', async () => {
        // 1. Настройка моков для ошибки платежа
        mockCharge.mockResolvedValueOnce({
            success: false,
            transactionId: '',
            message: 'Недостаточно средств или неверный токен.'
        });
        mockProcessPayment.mockResolvedValueOnce({
            success: false,
            message: 'Ошибка оплаты: Недостаточно средств или неверный токен. Пожалуйста, проверьте данные или попробуйте позже.',
            newOrderStatus: 'FAILED'
        });

        render(<PaymentForm />);
        
        // 2. Имитация ввода данных с токеном, вызывающим ошибку
        const form = screen.getByRole('form');
        const submitButton = screen.getByRole('button', { name: /Оплатить/i });
        
        fireEvent.change(screen.getByLabelText(/Токен:/i), { target: { value: 'fail_token_xyz' } });
        fireEvent.click(submitButton);

        // 3. Ожидание и проверка результата
        await waitFor(() => {
            expect(mockProcessPayment).toHaveBeenCalledTimes(1);
            expect(screen.getByText(/❌ Ошибка: Ошибка оплаты: Недостаточно средств или неверный токен. Пожалуйста, проверьте данные или попробуйте позже./i)).toBeInTheDocument();
        });
    });

    it('should handle critical network/system error', async () => {
        // 1. Настройка моков для критической ошибки (бросаем исключение)
        mockCharge.mockRejectedValueOnce(new Error('Network timeout'));
        mockProcessPayment.mockRejectedValueOnce(new Error('Network timeout'));

        render(<PaymentForm />);
        
        // 2. Имитация клика
        const form = screen.getByRole('form');
        const submitButton = screen.getByRole('button', { name: /Оплатить/i });
        fireEvent.click(submitButton);

        // 3. Ожидание и проверка результата
        await waitFor(() => {
            expect(screen.getByText(/⚠️ Критическая ошибка. Проверьте соединение или свяжитесь с поддержкой./i)).toBeInTheDocument();
        });
    });
});