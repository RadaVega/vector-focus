import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Shield, Zap, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    { icon: <Rocket className="w-8 h-8 text-blue-600" />, title: 'Lightning Fast', description: 'Optimized performance with React 18' },
    { icon: <Shield className="w-8 h-8 text-green-600" />, title: 'Secure Payments', description: 'Sberbank integration with enterprise-grade security' },
    { icon: <Zap className="w-8 h-8 text-yellow-600" />, title: 'Instant Deployment', description: 'Push to GitHub → Vercel auto-deploys' },
    { icon: <CreditCard className="w-8 h-8 text-purple-600" />, title: 'Multiple Gateways', description: 'Support for Sberbank, YooKassa, and more' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="px-4 py-20 md:py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            Now accepting payments in Russia
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
            Vector Focus
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
            Modern payment orchestration for Russian businesses. Integrate Sberbank, YooKassa, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg transform hover:scale-105">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button className="inline-flex items-center px-8 py-3 text-lg font-semibold text-gray-700 bg-white rounded-full border border-gray-300 hover:border-blue-600 transition shadow-md">
              View Documentation
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">Why Choose Vector Focus?</h2>
          <p className="text-xl text-center text-gray-600 mb-16">Everything you need to accept payments online</p>
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
        <h2 className="text-4xl font-bold mb-4">Ready for Production</h2>
        <p className="text-xl text-gray-700 mb-8">Fully integrated with Sberbank test environment.</p>
        <div className="bg-white rounded-2xl p-6 shadow-xl inline-block">
          <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-green-600" /><span>Test credentials included</span></div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12 text-center">
        <p>© 2026 Vector Focus. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
