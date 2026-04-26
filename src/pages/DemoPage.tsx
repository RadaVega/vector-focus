import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { processPayment } from '../services/paymentService';

const DemoPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [paymentToken, setPaymentToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Prepare payment data (matches what paymentService.processPayment expects)
    const paymentData = {
      amount: parseFloat(amount),
      paymentToken: paymentToken,
      currency: 'RUB',
      orderId: `demo-${Date.now()}`,
      buyerEmail: 'demo@example.com',
      paymentMethod: 'card'
    };

    try {
      const response = await processPayment(paymentData);
      setResult({
        success: response.success,
        message: response.message || (response.success ? 'Платёж успешно проведён!' : 'Ошибка платежа')
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Произошла ошибка при обработке платежа. Попробуйте позже.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад на главную
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <CreditCard className="w-12 h-12 text-white mb-2" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Тест-драйв платежной системы</h1>
            <p className="text-blue-100 mt-1">Проведите тестовый платёж через Сбербанк</p>
          </div>

          <div className="p-8">
            {/* Test credentials info */}
            <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-3">🧪 Тестовые данные (Сбербанк)</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>💳 <strong>Номер карты:</strong> <code className="bg-gray-200 px-2 py-0.5 rounded">4111 1111 1111 1111</code></li>
                <li>📅 <strong>Срок действия:</strong> любая будущая дата (например, 12/28)</li>
                <li>🔐 <strong>CVV:</strong> любые 3 цифры (например, 123)</li>
                <li>🏦 <strong>Платёжный токен:</strong> можно ввести любое значение (например, <code>test_token_123</code>)</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                  Сумма платежа (₽)
                </label>
                <input
                  type="number"
                  id="amount"
                  required
                  min="1"
                  max="100000"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="1000"
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
                  Платёжный токен (или тестовый идентификатор)
                </label>
                <input
                  type="text"
                  id="token"
                  required
                  value={paymentToken}
                  onChange={(e) => setPaymentToken(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="test_token_123"
                />
                <p className="text-xs text-gray-500 mt-1">Имитирует токен, полученный от платёжного шлюза</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Обработка платежа...
                  </>
                ) : (
                  'Оплатить сейчас'
                )}
              </button>
            </form>

            {result && (
              <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
                result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                {result.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? 'Успешно!' : 'Ошибка'}
                  </p>
                  <p className={`text-sm ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                    {result.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;