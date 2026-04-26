import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code, CreditCard, Shield } from 'lucide-react';

const DocsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад на главную
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Документация API</h1>
          <p className="text-gray-600 text-center mb-8">
            Как интегрировать Vector Focus с вашим приложением.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-6">
              <Code className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Быстрый старт</h3>
              <p className="text-gray-600 text-sm">Добавьте наш SDK и начните приём платежей за 5 минут.</p>
            </div>
            <div className="border rounded-xl p-6">
              <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Платёжные шлюзы</h3>
              <p className="text-gray-600 text-sm">Инструкции для Сбербанка, ЮKassa и других.</p>
            </div>
            <div className="border rounded-xl p-6">
              <Shield className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Безопасность</h3>
              <p className="text-gray-600 text-sm">Как мы защищаем данные ваших клиентов.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;