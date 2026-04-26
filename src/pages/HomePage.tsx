import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, CreditCard, ArrowRight, CheckCircle, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    { icon: <Rocket className="w-8 h-8 text-blue-600" />, title: 'Молниеносная скорость', description: 'Максимальная производительность с React 18 и современным инструментарием' },
    { icon: <Shield className="w-8 h-8 text-green-600" />, title: 'Безопасные платежи', description: 'Интеграция со Сбербанком и ЮKassa с защитой корпоративного уровня' },
    { icon: <Zap className="w-8 h-8 text-yellow-600" />, title: 'Мгновенный деплой', description: 'Push в GitHub → авто-деплой на Vercel за секунды' },
    { icon: <CreditCard className="w-8 h-8 text-purple-600" />, title: 'Несколько шлюзов', description: 'Поддержка Сбербанка, ЮKassa, CloudPayments и других' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Принимаем платежи в России
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Vector Focus
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Современная оркестрация платежей для российского бизнеса. Единый API для интеграции со Сбербанком, ЮKassa и другими платёжными системами.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg transform hover:scale-105"
            >
              Начать тест-драйв <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/docs"
              className="inline-flex items-center px-8 py-3 text-lg font-semibold text-gray-700 bg-white rounded-full border border-gray-300 hover:border-blue-600 transition shadow-md hover:shadow-xl"
            >
              Документация
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Почему выбирают Vector Focus?</h2>
          <p className="text-xl text-center text-gray-600 mb-16">Всё необходимое для приёма платежей онлайн</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div key={idx} whileHover={{ y: -8 }} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition border border-gray-100">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Highlight */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 text-center">
        <CreditCard className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h2 className="text-4xl font-bold mb-4">Готово к работе</h2>
        <p className="text-xl text-gray-700 mb-8">Полная интеграция с тестовой средой Сбербанка. Начните приём платежей уже сегодня.</p>
        <div className="bg-white rounded-2xl p-6 shadow-xl inline-block">
          <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-600" /><span>Тестовые учётные данные включены</span></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>© 2026 Vector Focus. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;