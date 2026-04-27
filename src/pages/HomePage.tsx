import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Shield, CreditCard, ArrowRight, CheckCircle, Zap, Sparkles } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    { icon: <Rocket className="w-8 h-8 text-teal-400" />, title: 'Молниеносная скорость', description: 'Максимальная производительность с React 18 и современным инструментарием' },
    { icon: <Shield className="w-8 h-8 text-emerald-400" />, title: 'Безопасные платежи', description: 'Интеграция со Сбербанком, Т-Банком и ЮKassa с защитой корпоративного уровня' },
    { icon: <Zap className="w-8 h-8 text-amber-400" />, title: 'Мгновенный деплой', description: 'Push в GitHub → авто-деплой на Vercel за секунды' },
    { icon: <CreditCard className="w-8 h-8 text-purple-400" />, title: 'Несколько шлюзов', description: 'Поддержка Сбербанка, Т-Банка, ЮKassa, CloudPayments и других' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Animated particle background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 text-sm font-medium mb-6 backdrop-blur-sm border border-teal-500/30"
            >
              <Sparkles className="w-4 h-4" />
              Принимаем платежи в России
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 mb-6"
            >
              Vector Focus
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
            >
              Современная оркестрация платежей для российского бизнеса. Единый API для интеграции со Сбербанком, Т-Банком, ЮKassa и другими платёжными системами.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/demo"
                className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-600 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Начать тест-драйв <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center px-8 py-3 text-lg font-semibold text-gray-200 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Документация
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid – unchanged but using updated gradient */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-center text-white mb-4"
            >
              Почему выбирают Vector Focus?
            </motion.h2>
            <p className="text-xl text-center text-gray-400 mb-16">Всё необходимое для приёма платежей онлайн</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-teal-500/50 transition-all duration-300"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Highlight */}
        <section className="py-20 px-4 bg-gradient-to-r from-teal-950/50 to-indigo-950/50">
          <div className="max-w-5xl mx-auto text-center">
            <CreditCard className="w-16 h-16 text-teal-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Готово к работе</h2>
            <p className="text-xl text-gray-300 mb-8">Полная интеграция с тестовой средой Сбербанка. Начните приём платежей уже сегодня.</p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block border border-white/20">
              <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-teal-400" /><span className="text-white">Тестовые учётные данные включены</span></div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 text-gray-400 py-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>© 2026 Vector Focus. Все права защищены.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;