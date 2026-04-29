import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Design tokens (same as HomePage)
const T = {
  bg:     "#06070D",
  surf:   "#0D0F1A",
  surf2:  "#131527",
  border: "rgba(255,255,255,0.07)",
  teal:   "#00D4AA",
  tealD:  "rgba(0,212,170,0.12)",
  tealG:  "rgba(0,212,170,0.04)",
  amber:  "#F5A623",
  amberD: "rgba(245,166,35,0.12)",
  red:    "#FF4D6A",
  blue:   "#4F8FFF",
  purple: "#A78BFA",
  muted:  "#4A506A",
  mid:    "#8892B0",
  text:   "#CDD6F4",
  white:  "#FFFFFF",
  green:  "#34D399",
};

// Types for scenario and logs
interface LogEntry {
  d: number;
  l: 'INFO' | 'WARN' | 'ERR';
  m: string;
  c?: 'success' | 'warn' | 'err';
}

interface Scenario {
  id: string;
  label: string;
  cls: string;
  product: string;
  amount: string;
  gateway: string;
  card: string;
  badge: string;
  badgeText: string;
  desc: string;
  steps: string[];
  logs: LogEntry[];
  result: { ok: boolean; title: string; sub: string };
}

const SCENARIOS: Scenario[] = [
  {
    id: 'success',
    label: 'Успешная оплата',
    cls: 'teal',
    product: 'Nike Air Max 270 · р. 42',
    amount: '₽4 590',
    gateway: 'ЮKassa',
    card: '4111 1111 1111 1111',
    badge: 'pill-teal',
    badgeText: 'Стандартный',
    desc: 'ЮKassa выбрана как основной шлюз: наименьшая комиссия + максимальный uptime за 30 дней. Сумма ниже порога 3DS.',
    steps: ['Запрос', 'Маршрут', 'Платёж', 'Risk check', 'Webhook', 'PAID'],
    logs: [
      { d: 0, l: 'INFO', m: 'Входящий запрос: ₽4 590 · Nike Air Max 270' },
      { d: 320, l: 'INFO', m: 'Маршрутизатор: ЮKassa выбрана (uptime 30d: 99.98%, latency 210ms)' },
      { d: 700, l: 'INFO', m: 'Платёж создан: pay_' + Math.random().toString(36).slice(2,10) },
      { d: 1100, l: 'INFO', m: 'Risk score: 12/100 — 3DS не требуется' },
      { d: 1600, l: 'INFO', m: 'Webhook получен: payment.succeeded', c: 'success' },
      { d: 1900, l: 'INFO', m: 'БД обновлена: order_' + Math.random().toString(36).slice(2,10) + ' → PAID', c: 'success' },
      { d: 2100, l: 'INFO', m: 'Email уведомление отправлено покупателю', c: 'success' }
    ],
    result: { ok: true, title: 'Оплата прошла успешно', sub: '₽4 590 через ЮKassa · 2.1 сек' }
  },
  {
    id: 'fallback',
    label: 'Авто-маршрутизация',
    cls: 'amber',
    product: 'iPhone 15 Pro Case · Carbon',
    amount: '₽12 990',
    gateway: 'Сбербанк → Т-Банк',
    card: '5500 0000 0000 0004',
    badge: 'pill-amber',
    badgeText: 'Fallback',
    desc: 'Первый шлюз (Сбербанк) вернул ошибку 503. Vector Focus за 280 мс переключил транзакцию на Т-Банк. Пользователь ничего не заметил.',
    steps: ['Запрос', 'Сбербанк', 'Сбой!', 'Т-Банк', 'Webhook', 'PAID'],
    logs: [
      { d: 0, l: 'INFO', m: 'Входящий запрос: ₽12 990 · iPhone 15 Pro Case' },
      { d: 300, l: 'INFO', m: 'Маршрутизатор: Сбербанк (uptime 99.71%, первичный шлюз)' },
      { d: 680, l: 'WARN', m: 'Сбербанк → HTTP 503 Service Unavailable', c: 'warn' },
      { d: 960, l: 'WARN', m: 'Авто-переключение за 280ms → Т-Банк (uptime 99.89%)', c: 'warn' },
      { d: 1350, l: 'INFO', m: 'Платёж создан в Т-Банке: pay_' + Math.random().toString(36).slice(2,10) },
      { d: 2200, l: 'INFO', m: 'Webhook: payment.succeeded', c: 'success' },
      { d: 2500, l: 'INFO', m: 'БД → PAID · Email отправлен', c: 'success' },
      { d: 2700, l: 'INFO', m: 'Пользователь не заметил переключения шлюза', c: 'success' }
    ],
    result: { ok: true, title: 'Fallback сработал за 280 мс', sub: 'Пользователь ничего не заметил · ₽12 990 через Т-Банк' }
  },
  {
    id: '3ds',
    label: '3D Secure',
    cls: 'blue',
    product: 'MacBook Air M3 · Space Gray',
    amount: '₽89 000',
    gateway: 'Т-Банк',
    card: '4000 0027 6000 3184',
    badge: 'pill-blue',
    badgeText: '3D Secure',
    desc: 'Крупная сумма (>₽15 000) — Т-Банк запросил 3D Secure верификацию. Пользователь подтвердил через Tinkoff ID. Платёж прошёл.',
    steps: ['Запрос', 'Маршрут', 'Платёж', '3DS', 'Подтверждение', 'PAID'],
    logs: [
      { d: 0, l: 'INFO', m: 'Входящий запрос: ₽89 000 · MacBook Air M3' },
      { d: 350, l: 'INFO', m: 'Маршрутизатор: Т-Банк (специализация: крупные суммы)' },
      { d: 750, l: 'INFO', m: 'Платёж создан: pay_' + Math.random().toString(36).slice(2,10) },
      { d: 1100, l: 'INFO', m: '3DS инициирован: сумма > ₽15 000 (risk_score: 38/100)' },
      { d: 1500, l: 'INFO', m: 'Ожидание подтверждения пользователя...' },
      { d: 2800, l: 'INFO', m: 'Пользователь подтвердил через Tinkoff ID ✓', c: 'success' },
      { d: 3200, l: 'INFO', m: 'Webhook: payment.succeeded', c: 'success' },
      { d: 3500, l: 'INFO', m: 'БД → PAID · Email + чек отправлены', c: 'success' }
    ],
    result: { ok: true, title: '3D Secure пройден — покупка защищена', sub: '₽89 000 через Т-Банк · Tinkoff ID верификация' }
  },
  {
    id: 'decline',
    label: 'Отказ → СБП',
    cls: 'red',
    product: 'Sony WH-1000XM5 · Black',
    amount: '₽2 199',
    gateway: 'ЮKassa → СБП',
    card: '4000 0000 0000 0002',
    badge: 'pill-red',
    badgeText: 'Отказ + Retry',
    desc: 'Карта отклонена (недостаточно средств). Vector Focus отобразил понятное сообщение и предложил СБП как альтернативу. Заказ сохранён.',
    steps: ['Запрос', 'Попытка 1', 'Отказ', 'СБП QR', 'Подтверждение', 'PAID'],
    logs: [
      { d: 0, l: 'INFO', m: 'Входящий запрос: ₽2 199 · Sony WH-1000XM5' },
      { d: 300, l: 'INFO', m: 'Маршрутизатор: ЮKassa' },
      { d: 800, l: 'INFO', m: 'Платёж создан: pay_' + Math.random().toString(36).slice(2,10) },
      { d: 1400, l: 'ERR', m: 'ЮKassa: insufficient_funds (код 1052)', c: 'err' },
      { d: 1700, l: 'WARN', m: 'UI → «Недостаточно средств. Попробуйте другой способ»', c: 'warn' },
      { d: 2100, l: 'INFO', m: 'Пользователь выбрал СБП как альтернативу' },
      { d: 2500, l: 'INFO', m: 'СБП QR сгенерирован за 128ms: qr_' + Math.random().toString(36).slice(2,10) },
      { d: 3300, l: 'INFO', m: 'ЦБ РФ подтверждение получено — перевод успешен', c: 'success' },
      { d: 3600, l: 'INFO', m: 'БД → PAID · комиссия: 0%', c: 'success' }
    ],
    result: { ok: true, title: 'Альтернативный способ спас конверсию', sub: 'Карта отклонена → СБП · ₽2 199 · комиссия 0%' }
  },
  {
    id: 'sbp',
    label: 'Оплата СБП',
    cls: 'purple',
    product: 'Яндекс Станция 2 · Серая',
    amount: '₽1 299',
    gateway: 'СБП / ЦБ РФ',
    card: 'СБП · QR-код',
    badge: 'pill-purple',
    badgeText: 'СБП · 0% комиссия',
    desc: 'Оплата через Систему быстрых платежей. Нулевая комиссия для покупателя. Подтверждение за 2.1 секунды через банковское приложение.',
    steps: ['Запрос', 'СБП', 'QR-код', 'Банк', 'Подтверждение', 'PAID'],
    logs: [
      { d: 0, l: 'INFO', m: 'Входящий запрос: ₽1 299 · Яндекс Станция 2' },
      { d: 250, l: 'INFO', m: 'Метод: СБП (System of Fast Payments / ЦБ РФ)' },
      { d: 500, l: 'INFO', m: 'QR-код сгенерирован за 128ms' },
      { d: 850, l: 'INFO', m: 'Ожидание подтверждения из банка покупателя...' },
      { d: 1600, l: 'INFO', m: 'ЦБ РФ: перевод подтверждён (Сбербанк Online)', c: 'success' },
      { d: 1900, l: 'INFO', m: 'Webhook: payment.succeeded · комиссия: 0%', c: 'success' },
      { d: 2100, l: 'INFO', m: 'БД → PAID · Push-уведомление отправлено', c: 'success' }
    ],
    result: { ok: true, title: 'СБП: оплата за 2.1 сек · комиссия 0%', sub: '₽1 299 · ЦБ РФ · Сбербанк Online подтверждение' }
  }
];

interface Gateway {
  name: string;
  uptime: number;
  latency: number;
  load: number;
  col: string;
}

const GATEWAYS: Gateway[] = [
  { name: 'ЮKassa', uptime: 99.98, latency: 210, load: 42, col: T.teal },
  { name: 'Сбербанк', uptime: 99.71, latency: 340, load: 31, col: T.blue },
  { name: 'Т-Банк', uptime: 99.89, latency: 185, load: 18, col: T.amber },
  { name: 'CloudPayments', uptime: 99.94, latency: 290, load: 9, col: T.purple },
];

const DemoPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<number>(0);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [result, setResult] = useState<Scenario['result'] | null>(null);
  const [txnCount, setTxnCount] = useState<number>(3247891);
  const [gateways, setGateways] = useState<Gateway[]>(GATEWAYS);
  const [showArchitectureModal, setShowArchitectureModal] = useState<boolean>(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulate metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTxnCount(prev => prev + Math.floor(Math.random() * 12 + 3));
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Simulate gateway health bars (random load changes)
  useEffect(() => {
    const interval = setInterval(() => {
      setGateways(prev => prev.map(g => ({
        ...g,
        load: Math.min(98, Math.max(5, g.load + (Math.random() - 0.5) * 8)),
        latency: Math.round(g.latency + (Math.random() - 0.5) * 30)
      })));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const resetSim = () => {
    clearTimers();
    setSimRunning(false);
    setCurrentStep(-1);
    setLogs([]);
    setResult(null);
  };

  const runSimulation = () => {
    if (simRunning) return;
    resetSim();
    setSimRunning(true);
    const scenario = SCENARIOS[activeScenario];
    const logsToAdd = scenario.logs.map(log => ({ ...log }));

    logsToAdd.forEach((log, idx) => {
      const timer = setTimeout(() => {
        setLogs(prev => [...prev, log]);
        if (idx < scenario.steps.length) {
          setCurrentStep(idx);
        } else {
          setCurrentStep(scenario.steps.length - 1);
        }
        if (logContainerRef.current) {
          logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
      }, log.d);
      timersRef.current.push(timer);
    });

    const lastDelay = logsToAdd[logsToAdd.length - 1].d + 400;
    const endTimer = setTimeout(() => {
      setCurrentStep(scenario.steps.length);
      setResult(scenario.result);
      setSimRunning(false);
    }, lastDelay);
    timersRef.current.push(endTimer);
  };

  const selectScenario = (idx: number) => {
    setActiveScenario(idx);
    resetSim();
  };

  const scenario = SCENARIOS[activeScenario];

  const getPillClass = (cls: string) => {
    const map: Record<string, string> = {
      teal: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return map[cls] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="min-h-screen bg-[#06070D] overflow-x-hidden">
      {/* Grid texture background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-45"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />
      {/* Glow orbs */}
      <div className="fixed top-[-20vh] left-[-8vw] w-[44vw] h-[44vw] rounded-full pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${T.teal}09, transparent 70%)` }} />
      <div className="fixed bottom-[-14vh] right-[-8vw] w-[36vw] h-[36vw] rounded-full pointer-events-none z-0"
        style={{ background: `radial-gradient(circle, ${T.blue}09, transparent 70%)` }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* ══════════════ NEW NAVBAR WITH HOME BUTTON ══════════════ */}
        <div className="flex items-center justify-between mb-8 pb-2 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-teal-500/20 border border-teal-500/40 flex items-center justify-center group-hover:bg-teal-500/30 transition">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400">
                <path d="M3 3h18v18H3z M8 8h4v4H8z M12 8h4v4h-4z M8 12h4v4H8z"/>
              </svg>
            </div>
            <span className="text-lg font-bold text-white group-hover:text-teal-400 transition">Vector<span className="text-teal-400">Focus</span></span>
          </Link>
          <div className="flex gap-2">
            <Link to="/docs" className="text-sm text-gray-400 hover:text-teal-400 transition px-3 py-1 rounded-md border border-gray-800 hover:border-teal-500/50">Документация</Link>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Live demo
              </span>
              <span className="text-xs text-gray-500 font-mono">Кейс: Маркетплейс · 14 млн покупателей</span>
            </div>
            <h1 className="text-xl md:text-2xl font-medium text-white mb-1">Как МаркетСфера перестала терять<br />₽128 млн из-за сбоев шлюзов</h1>
            <p className="text-sm text-[#8892B0] max-w-xl">Один API — четыре шлюза. Авто-маршрутизация за &lt;340 мс. Попробуйте каждый сценарий вживую.</p>
          </div>
          <div className="flex items-center gap-1 px-3 py-2 rounded-md border border-gray-700 bg-[#0D0F1A]">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-mono text-green-500">System online</span>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-[#0D0F1A] rounded-lg p-3 text-center border border-gray-800">
            <div className="text-xs text-gray-500">Транзакций сегодня</div>
            <div className="text-xl font-mono text-green-500">{txnCount.toLocaleString('ru')}</div>
          </div>
          <div className="bg-[#0D0F1A] rounded-lg p-3 text-center border border-gray-800">
            <div className="text-xs text-gray-500">Успешных</div>
            <div className="text-xl font-mono text-green-500">98.7%</div>
          </div>
          <div className="bg-[#0D0F1A] rounded-lg p-3 text-center border border-gray-800">
            <div className="text-xs text-gray-500">Ср. время API</div>
            <div className="text-xl font-mono text-blue-400">238 мс</div>
          </div>
          <div className="bg-[#0D0F1A] rounded-lg p-3 text-center border border-gray-800">
            <div className="text-xs text-gray-500">Переключений шлюза</div>
            <div className="text-xl font-mono text-amber-400">127</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4 mb-6">
          {/* Left Panel: Scenarios + Gateways */}
          <div className="space-y-3">
            <div className="text-xs font-mono text-gray-500 mb-1">Сценарии оплаты</div>
            {SCENARIOS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => selectScenario(idx)}
                className={`w-full text-left p-2 rounded-md border flex items-center gap-3 transition-colors ${
                  activeScenario === idx
                    ? `border-${s.cls}-500 bg-${s.cls}-500/10`
                    : 'border-gray-800 hover:border-gray-700 bg-[#0D0F1A]'
                }`}
                style={{
                  borderColor: activeScenario === idx ? (s.cls === 'teal' ? T.teal : s.cls === 'amber' ? T.amber : s.cls === 'blue' ? T.blue : s.cls === 'red' ? T.red : T.purple) : undefined,
                }}
              >
                <div className="w-8 h-8 rounded-md bg-opacity-20 flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${s.cls === 'teal' ? T.teal : s.cls === 'amber' ? T.amber : s.cls === 'blue' ? T.blue : s.cls === 'red' ? T.red : T.purple}20` }}>
                  {s.id === 'success' && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke={T.teal} strokeWidth="1.5" /></svg>}
                  {s.id === 'fallback' && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3v5M8 11v1" stroke={T.amber} strokeWidth="1.5" /></svg>}
                  {s.id === '3ds' && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="5" width="12" height="9" rx="1.5" stroke={T.blue} strokeWidth="1.5"/><path d="M5 5V3.5a3 3 0 016 0V5" stroke={T.blue} strokeWidth="1.5"/></svg>}
                  {s.id === 'decline' && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke={T.red} strokeWidth="1.5"/></svg>}
                  {s.id === 'sbp' && <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="1.5" stroke={T.purple} strokeWidth="1.5"/><path d="M5 8h6M8 5v6" stroke={T.purple} strokeWidth="1.5"/></svg>}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-200">{s.label}</div>
                  <div className="text-xs text-gray-500">{s.amount} · {s.gateway.split('→')[0]}</div>
                </div>
              </button>
            ))}

            <div className="text-xs font-mono text-gray-500 mt-2 mb-1">Статус шлюзов</div>
            <div className="space-y-2">
              {gateways.map(g => (
                <div key={g.name} className="p-2 rounded-md border border-gray-800 bg-[#0D0F1A]">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.col }}></span>
                      <span className="text-xs font-medium text-gray-300">{g.name}</span>
                    </div>
                    <span className="text-xs font-mono" style={{ color: g.col }}>{g.uptime}%</span>
                  </div>
                  <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(98, Math.max(5, g.load))}%`, backgroundColor: g.col, opacity: 0.7 }}></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-gray-600">Нагрузка {Math.round(g.load)}%</span>
                    <span className="text-[10px] text-gray-600">{g.latency} мс</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel: Simulation */}
          <div className="space-y-3">
            {/* Info Bar */}
            <div className="p-3 rounded-md border border-gray-800 bg-[#0D0F1A]">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex flex-wrap gap-4">
                  <div><div className="text-xs text-gray-500">Товар</div><div className="text-sm font-medium text-gray-200 mt-1">{scenario.product}</div></div>
                  <div><div className="text-xs text-gray-500">Сумма</div><div className="text-sm font-medium text-gray-200 mt-1">{scenario.amount}</div></div>
                  <div><div className="text-xs text-gray-500">Шлюз</div><div className="text-sm font-medium text-gray-200 mt-1">{scenario.gateway}</div></div>
                  <div><div className="text-xs text-gray-500">Карта</div><div className="text-xs font-mono text-gray-300 mt-1">{scenario.card}</div></div>
                </div>
                <div><span className={`px-2 py-1 rounded-full text-xs font-mono ${getPillClass(scenario.cls)}`}>{scenario.badgeText}</span></div>
              </div>
              <div className="mt-2 p-2 rounded bg-[#131527] text-xs text-gray-400 border border-gray-800">{scenario.desc}</div>
            </div>

            {/* Step Progress */}
            <div className="flex items-center gap-0 overflow-x-auto py-2">
              {scenario.steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono transition-all ${
                    idx < currentStep ? 'bg-green-600 text-white border-0' :
                    idx === currentStep ? 'border-2 border-green-500 text-green-500' :
                    'border border-gray-700 text-gray-600 bg-[#131527]'
                  }`}>
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <span className={`text-[10px] text-center max-w-[60px] leading-tight ${
                    idx <= currentStep ? 'text-green-500' : 'text-gray-600'
                  }`}>{step}</span>
                </div>
              ))}
            </div>

            {/* Terminal Log */}
            <div className="rounded-md border border-gray-800 overflow-hidden bg-[#131527]">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-xs font-mono text-gray-500">vectorfocus — payment-log</span>
                </div>
                <span className="text-xs font-mono text-gray-500">{simRunning ? 'processing' : 'idle'}</span>
              </div>
              <div ref={logContainerRef} className="h-48 overflow-y-auto p-3 space-y-1 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="flex gap-2">
                    <span className="text-gray-600">—</span>
                    <span className="text-gray-500">Выберите сценарий и нажмите «Запустить» для начала демонстрации</span>
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex gap-2 animate-fadeIn">
                      <span className="text-gray-500 flex-shrink-0">{new Date().toLocaleTimeString('ru').slice(0,8)}</span>
                      <span className={`font-bold flex-shrink-0 ${
                        log.l === 'INFO' ? 'text-blue-400' : log.l === 'WARN' ? 'text-yellow-400' : 'text-red-400'
                      }`}>[{log.l}]</span>
                      <span className={log.c === 'success' ? 'text-green-400' : log.c === 'warn' ? 'text-yellow-400' : log.c === 'err' ? 'text-red-400' : 'text-gray-300'}>
                        {log.m}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Result Banner */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`p-3 rounded-md border flex items-center gap-3 ${
                    result.ok ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center text-lg">
                    {result.ok ? '✓' : '✕'}
                  </div>
                  <div>
                    <div className={`font-medium ${result.ok ? 'text-green-400' : 'text-red-400'}`}>{result.title}</div>
                    <div className="text-xs text-gray-400">{result.sub}</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={runSimulation}
                disabled={simRunning}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm transition ${
                  simRunning
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00D4AA] to-[#4F8FFF] text-white hover:opacity-90'
                }`}
              >
                {simRunning ? (
                  <>
                    <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    Обработка...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 3l10 5-10 5V3z" fill="currentColor"/></svg>
                    Запустить демо
                  </>
                )}
              </button>
              <button
                onClick={resetSim}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-gray-300 hover:border-gray-500 transition font-mono text-sm"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 106-6H6.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 5l3.5.5L6 9" stroke="currentColor" strokeWidth="1.5"/></svg>
                Сбросить
              </button>
            </div>
          </div>
        </div>

        {/* Use Case Story - Before/After */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-md border border-red-800/30 bg-[#0D0F1A]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center text-sm font-medium text-purple-400">МС</div>
              <div><div className="font-medium text-gray-200">МаркетСфера</div><div className="text-xs text-gray-500">14 млн покупателей · до Vector Focus</div></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px]">✕</div><span className="text-xs text-gray-400">4 команды поддерживают 4 разных интеграции</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px]">✕</div><span className="text-xs text-gray-400">Ручное переключение при сбое: 20+ минут</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px]">✕</div><span className="text-xs text-gray-400">«Чёрная пятница» 2024: Сбербанк упал на 47 мин</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-[10px]">✕</div><span className="text-xs text-gray-400">Потери: <strong className="text-red-400">₽128 000 000</strong> за одну ночь</span></div>
            </div>
          </div>
          <div className="p-4 rounded-md border border-green-800/30 bg-[#0D0F1A]">
            <div className="mb-3"><span className="px-2 py-1 rounded-full text-xs font-mono bg-green-500/20 text-green-400 border border-green-500/30">После Vector Focus</span></div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="text-center p-2 rounded bg-[#131527]"><div className="text-xs text-gray-500">Переключение</div><div className="text-lg font-medium text-green-400">340 мс</div></div>
              <div className="text-center p-2 rounded bg-[#131527]"><div className="text-xs text-gray-500">Потери</div><div className="text-lg font-medium text-green-400">₽0</div></div>
              <div className="text-center p-2 rounded bg-[#131527]"><div className="text-xs text-gray-500">Поддержка</div><div className="text-lg font-medium text-blue-400">−73%</div></div>
              <div className="text-center p-2 rounded bg-[#131527]"><div className="text-xs text-gray-500">Интеграций</div><div className="text-lg font-medium text-gray-300">1 API</div></div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px]">✓</div><span className="text-xs text-gray-400">Авто-маршрутизация в реальном времени</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px]">✓</div><span className="text-xs text-gray-400">Единый webhook-формат для всех шлюзов</span></div>
              <div className="flex items-center gap-2"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-[10px]">✓</div><span className="text-xs text-gray-400">Единая аналитика: конверсия, причины отказов</span></div>
            </div>
          </div>
        </div>

        {/* Routing Flow Diagram */}
        <div id="routing-flow" className="p-4 rounded-md border border-gray-800 bg-[#0D0F1A] mb-6">
          <div className="text-xs font-mono text-gray-500 mb-3">Как работает маршрутизатор</div>
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
            {['Запрос', 'Маршрутизатор VF', 'Выбор шлюза', 'Обработка шлюзом', 'Заказ PAID'].map((label, i) => (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-1 min-w-[70px]">
                  <div className="w-10 h-10 rounded-md bg-[#131527] border border-gray-800 flex items-center justify-center">
                    {i === 0 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#8892B0" strokeWidth="1.2"/><path d="M4 8h8M8 4c-1.5 1.5-2 3-2 4s.5 2.5 2 4M8 4c1.5 1.5 2 3 2 4s-.5 2.5-2 4" stroke="#8892B0" strokeWidth="1.2"/></svg>}
                    {i === 1 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8h12M9 5l3 3-3 3" stroke="#00D4AA" strokeWidth="1.4"/></svg>}
                    {i === 2 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="8" rx="1.5" stroke="#A78BFA" strokeWidth="1.2"/><path d="M2 7h12" stroke="#A78BFA" strokeWidth="1.2"/></svg>}
                    {i === 3 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M4 6l4-4 4 4" stroke="#F5A623" strokeWidth="1.4"/></svg>}
                    {i === 4 && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#34D399" strokeWidth="1.5"/></svg>}
                  </div>
                  <span className="text-[10px] text-center text-gray-500">{label}</span>
                </div>
                {i < 4 && <div className="flex-1 h-px bg-gray-800 min-w-[12px]"></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 p-2 rounded bg-[#131527] text-xs text-gray-400">При сбое любого шлюза — авто-переключение за &lt;500 мс без участия человека. Webhook-формат остаётся неизменным.</div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/30 text-center">
          <div className="text-lg font-medium text-white mb-2">Готовы защитить выручку?</div>
          <p className="text-sm text-gray-400 mb-4">Подключите Vector Focus за 15 минут. Тестовая среда всех шлюзов уже настроена.</p>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <Link
              to="/docs"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-blue-500 text-white text-sm font-mono hover:opacity-90 transition inline-flex items-center gap-2"
            >
              Документация → 5 шагов
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M7 1l6 6-6 6M1 7h12" stroke="currentColor" strokeWidth="1.5"/></svg>
            </Link>
            <button
              onClick={() => setShowArchitectureModal(true)}
              className="px-4 py-2 rounded-md bg-[#0D0F1A] border border-gray-700 text-gray-300 text-sm font-mono hover:border-gray-500 transition inline-flex items-center gap-2"
            >
              Как работает маршрутизация?
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M1 8h14M9 14l6-6-6-6" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-4 justify-center text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</span> 14 дней бесплатно</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</span> Без карты</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</span> Поддержка 54-ФЗ</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white">✓</span> SLA 99.9%</span>
          </div>
        </div>
      </div>

      {/* Modal: Technical architecture explanation */}
      {showArchitectureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="max-w-2xl w-full bg-[#0D0F1A] border border-teal-500/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-lg font-mono font-semibold text-teal-400">Архитектура авто-маршрутизации</h3>
              <button onClick={() => setShowArchitectureModal(false)} className="text-gray-400 hover:text-white">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4 text-gray-300 text-sm leading-relaxed">
              <p><span className="text-teal-400 font-semibold">Vector Focus</span> использует распределённую архитектуру для мгновенного переключения между платёжными шлюзами. Вот как это работает:</p>
              <div className="space-y-3">
                <div className="border-l-2 border-teal-500 pl-3">
                  <span className="font-mono text-teal-400">1. Health Check (активный мониторинг)</span>
                  <p className="mt-1">Каждый шлюз проверяется каждые 5 секунд по трём метрикам: <strong>латентность</strong> (порог 500 мс), <strong>процент ошибок</strong> (порог 2%) и <strong>доступность API</strong>. При падении метрики ниже порога шлюз помечается как &laquo;unhealthy&raquo;.</p>
                </div>
                <div className="border-l-2 border-amber-500 pl-3">
                  <span className="font-mono text-amber-400">2. Circuit Breaker (предохранитель)</span>
                  <p className="mt-1">Если шлюз вернул 3 ошибки подряд, он переводится в &laquo;открытое&raquo; состояние. Все последующие запросы автоматически направляются на следующий здоровый шлюз. Через 30 секунд делается одна попытка восстановления &mdash; если успешно, шлюз снова включается в ротацию.</p>
                </div>
                <div className="border-l-2 border-blue-500 pl-3">
                  <span className="font-mono text-blue-400">3. Маршрутизация в реальном времени</span>
                  <p className="mt-1">При поступлении запроса маршрутизатор мгновенно (за &lt;10 мс) рассчитывает приоритет шлюзов на основе:</p>
                  <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
                    <li>комиссии (минимальная – приоритет выше)</li>
                    <li>текущей нагрузки (используется алгоритм weighted round‑robin)</li>
                    <li>истории успешных платежей за последние 5 минут</li>
                  </ul>
                </div>
                <div className="border-l-2 border-purple-500 pl-3">
                  <span className="font-mono text-purple-400">4. Асинхронный fallback</span>
                  <p className="mt-1">Если платеж не удаётся после первого шлюза, запрос автоматически направляется на второй шлюз без перезапроса от пользователя (идиемпотентность по orderId). В демо вы видели переключение Сбербанк → Т-Банк за 280 мс.</p>
                </div>
              </div>
              <div className="bg-[#131527] p-3 rounded-md border border-gray-800 mt-4">
                <span className="text-xs font-mono text-gray-400">⏱️ Итоговая задержка переключения:</span>
                <span className="text-teal-400 font-mono ml-2">~280–450 мс</span>
                <p className="text-xs text-gray-500 mt-1">Пользователь не замечает сбоя — оплата проходит на втором шлюзе без перезагрузки страницы.</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-800 text-right flex gap-3 justify-end">
              <Link to="/" className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition">На главную</Link>
              <button onClick={() => setShowArchitectureModal(false)} className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-md hover:bg-teal-500/30 transition">Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemoPage;