import React from 'react';
import PaymentForm from '../components/PaymentForm/PaymentForm';

// --- Компоненты для имитации разделов сайта ---

const HeroSection: React.FC = () => (
    <section className="section hero-section" style={{ padding: '100px 20px', textAlign: 'center', backgroundColor: '#f4f7fa' }}>
        <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">Превращаем идеи в работающие цифровые продукты.</h1>
        <p className="mt-6 text-2xl text-gray-600 max-w-3xl mx-auto">Комплексный подход к разработке, от архитектуры API до финального UX. Мы строим не просто сайты, а масштабируемые бизнес-системы, готовые к росту.</p>
        <div className="mt-10 flex justify-center gap-4">
            <button className="px-10 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full hover:bg-blue-700 transition shadow-lg transform hover:scale-105">Узнать о тарифах</button>
            <button className="px-10 py-3 bg-white text-blue-600 border border-blue-600 text-lg font-semibold rounded-full hover:bg-blue-50 transition shadow-md">Получить консультацию</button>
        </div>
    </section>
);

const ProblemSolutionSection: React.FC = () => (
    <section className="section problem-solution-section py-24">
        <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-900">Ваши идеи застряли на этапе "на бумаге"?</h2>
                <p className="text-xl text-gray-700">Многие стартапы сталкиваются с разрывом между красивым дизайном и надежной логикой. Разработка распадается на куски: фронтенд делает красиво, а бэкенд — медленно. В результате — долгий цикл, перерасход бюджета и неработающий продукт.</p>
                <p className="text-xl text-gray-700 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">Мы устраняем эти разрывы. Наша команда работает как единый механизм, обеспечивая бесшовную интеграцию всех компонентов — от архитектуры до пользовательского опыта.</p>
            </div>
            <div className="space-y-6">
                <h3 className="text-3xl font-bold text-blue-600">Наш подход: Масштабируемость и Надежность</h3>
                <p className="text-lg text-gray-700">Мы гарантируем, что ваш продукт будет не только красивым, но и <span className="font-extrabold text-blue-600">масштабируемым</span>, выдерживающим пиковые нагрузки и рост бизнеса.</p>
                <ul className="text-lg text-gray-700 space-y-3">
                    <li><span className="font-semibold">Архитектура:</span> Микросервисы для независимого масштабирования.</li>
                    <li><span className="font-semibold">UX:</span> Исследования, гарантирующие интуитивность и высокую конверсию.</li>
                    <li><span className="font-semibold">Управление:</span> Прозрачный процесс с постоянным контролем рисков.</li>
                </ul>
            </div>
        </div>
    </section>
);

const ServicesSection: React.FC = () => (
    <section className="section services-section py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Наши ключевые компетенции</h2>
            <p className="text-xl text-gray-600 mb-16">Мы покрываем весь цикл разработки, чтобы вы могли сосредоточиться на бизнесе.</p>
            <div className="grid grid-cols-3 gap-10">
                {/* Блок 1: Backend */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    <h3 className="text-3xl font-bold text-blue-600 mb-3">Backend & Архитектура</h3>
                    <p className="text-gray-600 mb-4">Проектирование микросервисной архитектуры, выбор оптимального стека, разработка надежных и масштабируемых API.</p>
                    <div className="text-sm text-gray-500">Технологии: TypeScript, Microservices, REST/GraphQL, CI/CD.</div>
                </div>
                {/* Блок 2: Frontend */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    <h3 className="text-3xl font-bold text-blue-600 mb-3">Frontend & UX/UI</h3>
                    <p className="text-gray-600 mb-4">Создание интуитивно понятного и адаптивного пользовательского опыта. Превращаем макеты в быстрый, современный код.</p>
                    <div className="text-sm text-gray-500">Технологии: React/Next.js, Figma, Адаптивность, UX-исследования.</div>
                </div>
                {/* Блок 3: PM & Тестирование */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                    <h3 className="text-3xl font-bold text-blue-600 mb-3">PM & Тестирование</h3>
                    <p className="text-gray-600 mb-4">Мы управляем процессом, составляем тест-кейсы, управляем рисками и гарантируем, что продукт соответствует бизнес-целям.</p>
                    <div className="text-sm text-gray-500">Методологии: Agile, Scrum, Тест-кейсы, Управление рисками.</div>
                </div>
            </div>
        </div>
    </section>
);

const PricingSection: React.FC = () => (
    <section className="section pricing-section py-24 bg-white">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Выберите путь к цифровому успеху.</h2>
            <p className="text-xl text-gray-600 mb-16">Наш тариф "Стандарт" — идеальный баланс между функциональностью и стоимостью для стартапов.</p>
            
            {/* Интеграция модуля оплаты здесь! */}
            <div className="max-w-xl mx-auto p-8 border-4 border-dashed border-blue-200 rounded-2xl shadow-inner">
                <h3 className="text-4xl font-bold text-blue-700 mb-2">Тариф: Стандарт (Growth)</h3>
                <p className="text-xl text-gray-600 mb-8">Идеально для стартапов, которые готовы расти и нуждаются в надежной базе.</p>
                <PaymentForm />
            </div>
        </div>
    </section>
);

const PortfolioSection: React.FC = () => (
    <section className="section portfolio-section py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Наши кейсы: от идеи до запуска</h2>
            <p className="text-xl text-gray-600 mb-16">Мы превращаем сложные бизнес-задачи в работающие, измеримые решения.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Кейс 1: E-commerce */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                    <h4 className="text-2xl font-bold text-blue-600 mb-2">E-commerce (Масштабирование)</h4>
                    <p className="text-gray-700 mb-3"><strong>Задача:</strong> Обеспечить стабильность при пиковых нагрузках.</p>
                    <p className="text-gray-600"><strong>Решение:</strong> Архитектура на микросервисах, кэширование Redis. <strong>Результат:</strong> Увеличение конверсии на 15% и стабильность в Black Friday.</p>
                </div>
                {/* Кейс 2: B2B SaaS */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                    <h4 className="text-2xl font-bold text-blue-600 mb-2">B2B SaaS (Автоматизация)</h4>
                    <p className="text-gray-700 mb-3"><strong>Задача:</strong> Автоматизировать рутинные внутренние процессы клиента.</p>
                    <p className="text-gray-600"><strong>Решение:</strong> Интеграция с внешними API (CRM, ERP). <strong>Результат:</strong> Сокращение ручного труда на 40% и экономия времени сотрудников.</p>
                </div>
                {/* Кейс 3: Образовательная платформа */}
                <div className="p-8 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
                    <h4 className="text-2xl font-bold text-blue-600 mb-2">Образовательная платформа</h4>
                    <p className="text-gray-700 mb-3"><strong>Задача:</strong> Создать вовлекающий и интерактивный образовательный контент.</p>
                    <p className="text-gray-600"><strong>Решение:</strong> Использование геймификации и React для динамического контента. <strong>Результат:</strong> Увеличение времени вовлеченности пользователя на 25%.</p>
                </div>
            </div>
        </div>
    </section>
);

const ContactSection: React.FC = () => (
    <section className="section contact-section py-24 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Готовы начать?</h2>
            <p className="text-2xl text-gray-600 mb-12">Оставьте заявку, и наш менеджер свяжется с вами для бесплатной консультации и составления технического задания.</p>
            
            <div className="bg-white p-10 shadow-2xl rounded-xl border-t-4 border-blue-600">
                <h3 className="text-3xl font-bold text-gray-800 mb-6">Свяжитесь с нами</h3>
                <form className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Ваше имя</label>
                        <input type="text" id="name" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Иван Иванов" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="email@company.com" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Краткое описание задачи</label>
                        <textarea id="message" rows={4} className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Например: Нужна интеграция с CRM и оплата через карту."></textarea>
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition shadow-md">Отправить заявку</button>
                </form>
            </div>
        </div>
    </section>
);

// --- Главный компонент страницы --- 
const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen font-sans bg-white">
            <HeroSection />
            <ProblemSolutionSection />
            <ServicesSection />
            <PricingSection />
            <PortfolioSection />
            <ContactSection />
            
            {/* Стилизация для имитации Tailwind/CSS */}
            <style jsx global>{`
                /* Общие стили для всех секций */
                .section { 
                    padding: 80px 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                /* Стили для кнопок */
                button { 
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                /* Улучшение читаемости заголовков */
                h1, h2, h3 { 
                    font-weight: 700;
                }
            `}</style>
        </div>
    );
};

export default HomePage;
