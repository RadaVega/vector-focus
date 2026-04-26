import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад на главную
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Тест-драйв платежной системы</h1>
          <p className="text-gray-600 text-center mb-8">
            Здесь будет форма для тестового платежа с использованием Сбербанка.
          </p>
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Тестовые данные (Сбербанк)</h2>
            <ul className="space-y-2 text-gray-700">
              <li>🔢 Карта: <code className="bg-gray-200 px-2 py-1 rounded">4111 1111 1111 1111</code></li>
              <li>📅 Срок: любая будущая дата</li>
              <li>🔐 CVV: любые 3 цифры</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;