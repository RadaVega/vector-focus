import { useState, useEffect, useRef, ReactNode } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
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
  muted:  "#4A506A",
  mid:    "#8892B0",
  text:   "#CDD6F4",
  white:  "#FFFFFF",
} as const;


// ─── FONTS (injected once) ────────────────────────────────────────
const GlobalStyles = () => {
  useEffect(() => {
    const id = "pay-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
      @keyframes scanline{0%{top:-2px}100%{top:100%}}
      @keyframes glow{0%,100%{box-shadow:0 0 12px rgba(0,212,170,0.4)}50%{box-shadow:0 0 28px rgba(0,212,170,0.8)}}
      @keyframes flow{0%{stroke-dashoffset:200}100%{stroke-dashoffset:0}}
      @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      .pay-code::-webkit-scrollbar{height:4px;width:4px}
      .pay-code::-webkit-scrollbar-track{background:transparent}
      .pay-code::-webkit-scrollbar-thumb{background:#1e2235;border-radius:4px}
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ─── CODE HIGHLIGHTER ─────────────────────────────────────────────
const highlight = (code: string): string => {
  return code
    .replace(/\/\/.*/g, (m) => `<span style="color:#4A506A;font-style:italic">${m}</span>`)
    .replace(/('.*?'|`.*?`)/g, (m) => `<span style="color:#98C379">${m}</span>`)
    .replace(/\b(const|let|async|await|return|import|from|if|switch|case|break|new|exports)\b/g, (m) => `<span style="color:#C678DD">${m}</span>`)
    .replace(/\b(true|false|null)\b/g, (m) => `<span style="color:#D19A66">${m}</span>`)
    .replace(/\b(\d+)\b/g, (m) => `<span style="color:#D19A66">${m}</span>`)
    .replace(/\b(require|process|crypto)\b/g, (m) => `<span style="color:#56B6C2">${m}</span>`);
};

interface CodeBlockProps {
  code: string;
  lang?: string;
  label?: string;
}

const CodeBlock = ({ code, lang = "js", label }: CodeBlockProps) => (
  <div style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`, background: "#080B14" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", background: T.surf2, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", gap: 6 }}>
        {["#FF5F57","#FEBC2E","#28C840"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>
        {label || lang.toUpperCase()}
      </span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.muted }}>{lang}</span>
    </div>
    <div className="pay-code" style={{ overflowX: "auto", padding: "14px 16px" }}>
      <pre
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, lineHeight: 1.75, color: T.text, margin: 0, whiteSpace: "pre" }}
        dangerouslySetInnerHTML={{ __html: highlight(code) }}
      />
    </div>
  </div>
);

interface FlowNodeProps {
  icon: ReactNode;
  label: string;
  color: string;
  active: boolean;
  delay?: number;
}

const FlowNode = ({ icon, label, color, active, delay = 0 }: FlowNodeProps) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    animation: `fadeUp 0.5s ease ${delay}s both`,
  }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
      background: active ? `${color}20` : T.surf2,
      border: `1.5px solid ${active ? color : T.border}`,
      fontSize: 22,
      boxShadow: active ? `0 0 20px ${color}30` : "none",
      transition: "all 0.4s ease",
      animation: active ? "glow 2s ease infinite" : "none",
    }}>{icon}</div>
    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: active ? color : T.muted, fontWeight: 500, textAlign: "center", maxWidth: 64, lineHeight: 1.3 }}>{label}</span>
  </div>
);

interface FlowArrowProps {
  active: boolean;
  color: string;
}

const FlowArrow = ({ active, color }: FlowArrowProps) => (
  <div style={{ display: "flex", alignItems: "center", paddingBottom: 16, flex: 1, maxWidth: 40 }}>
    <div style={{
      height: 1.5, width: "100%",
      background: active ? `linear-gradient(90deg, ${color}, ${color}88)` : T.border,
      position: "relative", transition: "all 0.4s ease",
    }}>
      <div style={{
        position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)",
        width: 0, height: 0,
        borderLeft: `5px solid ${active ? color : T.border}`,
        borderTop: "4px solid transparent",
        borderBottom: "4px solid transparent",
        transition: "all 0.4s ease",
      }} />
    </div>
  </div>
);

// ─── STEP DATA TYPES ──────────────────────────────────────────────
interface Provider {
  name: string;
  fee: string;
  fz: string;
  best: string;
}

interface Step {
  num: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  who: string;
  time: string;
  summary: string;
  providers?: Provider[];
  code: string;
  codeLabel: string;
}

const STEPS: Step[] = [
  {
    num: "01",
    icon: "🔑",
    title: "Платёжная система и API-ключи",
    subtitle: "Выбор провайдера · Регистрация · Безопасность",
    color: T.teal,
    who: "DevOps · Backend",
    time: "~1 день",
    summary: "Выбираем ЮKassa — поддерживает 54-ФЗ, работает в России, есть SDK для Node.js/Python/PHP. Ключи хранятся ТОЛЬКО в .env на сервере. Никогда не в коде!",
    providers: [
      { name: "ЮKassa", fee: "2.8–3.5%", fz: "✓", best: "Рос. магазины" },
      { name: "Tinkoff Pay", fee: "2.5–3%", fz: "✓", best: "Клиенты Tinkoff" },
      { name: "Stripe", fee: "1.4–2.9%", fz: "✗", best: "Международные" },
    ],
    code: `// .env — ТОЛЬКО на сервере, никогда в Git!
YUKASSA_SHOP_ID=123456
YUKASSA_SECRET_KEY=live_xxxxxxxxxxxxxxxxxxxxxxxx
YUKASSA_TEST_KEY=test_xxxxxxxxxxxxxxxxxxxxxxxx
WEBHOOK_SECRET=your_webhook_secret_here`,
    codeLabel: ".env · Environment Variables",
  },
  {
    num: "02",
    icon: "🖥️",
    title: "Frontend: форма оплаты",
    subtitle: "React · ЮKassa Checkout Widget · Безопасность",
    color: "#A78BFA",
    who: "Frontend Dev",
    time: "~2 дня",
    summary: "Используем официальный виджет ЮKassa — карточные данные вводятся на их серверах. Нам не нужна PCI DSS сертификация. Frontend только инициирует платёж и ждёт результат.",
    code: `import { useState, useEffect } from 'react';

const CheckoutForm = ({ orderId, amount }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Запрашиваем confirmation token с нашего backend
    fetch('/api/payments/create', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount })
    })
    .then(r => r.json())
    .then(data => setToken(data.confirmationToken));
  }, [orderId]);

  const openWidget = () => {
    const checkout = new YooMoneyCheckoutWidget({
      confirmation_token: token,
      return_url: \`https://shop.ru/orders/\${orderId}/success\`,
      customization: { colors: { control_primary: '#C43030' } },
      error_callback: (err) => console.error(err)
    });
    checkout.render('payment-widget-container');
  };

  return (
    <div>
      <div id="payment-widget-container" />
      <button onClick={openWidget} disabled={!token}>
        Оплатить {amount} ₽
      </button>
    </div>
  );
};`,
    codeLabel: "CheckoutForm.jsx · React",
  },
  {
    num: "03",
    icon: "⚙️",
    title: "Backend: создание платежа",
    subtitle: "Node.js · ЮKassa SDK · Валидация",
    color: T.blue,
    who: "Backend Dev",
    time: "~2–3 дня",
    summary: "Backend получает запрос, проверяет заказ в базе, создаёт платёж через ЮKassa API и возвращает confirmation_token для виджета. Сумма всегда берётся из БД — не с frontend!",
    code: `const { YooCheckout } = require('@a2seven/yoo-checkout');
const checkout = new YooCheckout({
  shopId: process.env.YUKASSA_SHOP_ID,
  secretKey: process.env.YUKASSA_SECRET_KEY
});

exports.createPayment = async (req, res) => {
  const { orderId, amount } = req.body;

  // Валидация: проверяем заказ в БД (сумму берём из БД!)
  const order = await Order.findById(orderId);
  if (!order || order.total !== amount) {
    return res.status(400).json({ error: 'Invalid order' });
  }

  // Создаём платёж в ЮKassa
  const payment = await checkout.createPayment({
    amount: { value: amount.toFixed(2), currency: 'RUB' },
    confirmation: { type: 'embedded' },
    capture: true,
    description: \`Заказ #\${orderId}\`,
    metadata: { orderId }
  }, crypto.randomUUID());

  // Сохраняем payment_id в заказ
  await Order.update(orderId, { paymentId: payment.id, status: 'pending' });
  res.json({ confirmationToken: payment.confirmation.confirmation_token });
};`,
    codeLabel: "payments.controller.js · Node.js",
  },
  {
    num: "04",
    icon: "🔔",
    title: "Webhook: обновление БД",
    subtitle: "Асинхронный · Верификация подписи · PostgreSQL",
    color: T.amber,
    who: "Backend Dev",
    time: "~2 дня",
    summary: "Webhook — HTTP-запрос от ЮKassa когда статус платежа изменился. Важно: всегда верифицировать подпись (защита от фейков) и отвечать 200 — иначе ЮKassa будет повторять запрос.",
    code: `exports.handleWebhook = async (req, res) => {
  const event = req.body;

  // 1. Верифицируем подпись (защита от фейковых запросов)
  const signature = req.headers['x-yukassa-signature'];
  if (!verifySignature(req.rawBody, signature)) {
    return res.status(401).send('Unauthorized');
  }

  const payment = event.object;
  const orderId = payment.metadata.orderId;

  switch (payment.status) {
    case 'succeeded':
      await Order.update(orderId, {
        status: 'paid',
        paidAt: new Date(),
        paymentMethod: payment.payment_method.type
      });
      await sendSuccessEmail(orderId);  // → Шаг 5
      break;

    case 'canceled':
      await Order.update(orderId, { status: 'payment_failed' });
      await sendFailureEmail(orderId);
      break;
  }

  // Обязательно отвечаем 200 — иначе ЮKassa будет повторять
  res.status(200).json({ received: true });
};`,
    codeLabel: "payments.webhook.js · Node.js",
  },
  {
    num: "05",
    icon: "✅",
    title: "Frontend: статус + уведомления",
    subtitle: "Polling · React State · Sendgrid Email",
    color: "#34D399",
    who: "Frontend + Backend",
    time: "~1 день",
    summary: "После редиректа с return_url — frontend polling статуса каждые 2 сек. Backend отправляет email через Sendgrid. Не полагаемся только на return_url — он ненадёжен.",
    code: `// React: polling статуса заказа
const OrderStatus = ({ orderId }) => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const poll = setInterval(async () => {
      const res = await fetch(\`/api/orders/\${orderId}/status\`);
      const data = await res.json();
      setStatus(data.status);
      if (data.status !== 'pending') clearInterval(poll);
    }, 2000);
    return () => clearInterval(poll);
  }, []);

  if (status === 'paid')          return <SuccessScreen />;
  if (status === 'payment_failed') return <FailureScreen />;
  return <LoadingSpinner />;
};

// Node.js: отправка email через Sendgrid
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendSuccessEmail = async (orderId) => {
  const order = await Order.findById(orderId);
  await sgMail.send({
    to: order.email, from: 'shop@myshop.ru',
    subject: \`Заказ #\${orderId} оплачен ✓\`,
    html: renderTemplate('order-success', { order })
  });
};`,
    codeLabel: "OrderStatus.jsx + email.service.js",
  },
];

const FLOW_STEPS = [
  { icon: "👤", label: "Покупатель", color: T.teal },
  { icon: "🖥️", label: "Frontend", color: "#A78BFA" },
  { icon: "⚙️", label: "Backend", color: T.blue },
  { icon: "💳", label: "ЮKassa", color: T.amber },
  { icon: "🔔", label: "Webhook", color: T.red },
  { icon: "✅", label: "Готово", color: "#34D399" },
] as const;

// ─── MAIN COMPONENT ───────────────────────────────────────────────
const PaymentGuide: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simStep, setSimStep]       = useState<number>(-1);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const simRef = useRef<NodeJS.Timeout | null>(null);

  const runSimulation = () => {
    if (simRunning) return;
    setSimRunning(true);
    setSimStep(0);
    let i = 0;
    simRef.current = setInterval(() => {
      i++;
      setSimStep(i);
      if (i >= FLOW_STEPS.length - 1) {
        if (simRef.current) clearInterval(simRef.current);
        setTimeout(() => { setSimRunning(false); setSimStep(-1); }, 2000);
      }
    }, 900);
  };

  useEffect(() => () => {
    if (simRef.current) clearInterval(simRef.current);
  }, []);

  const step = STEPS[activeStep];

  return (
    <>
      <GlobalStyles />
      <div style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: "'DM Sans', sans-serif",
        color: T.text,
        position: "relative",
        overflow: "hidden",
      }}>

        {/* GRID NOISE BACKGROUND */}
        <div style={{
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: `
            linear-gradient(${T.border} 1px, transparent 1px),
            linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }} />

        {/* GLOW ORBS */}
        <div style={{ position:"fixed", top:"-20vh", left:"-10vw", width:"50vw", height:"50vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.teal}08, transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
        <div style={{ position:"fixed", bottom:"-10vh", right:"-10vw", width:"40vw", height:"40vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.blue}08, transparent 70%)`, pointerEvents:"none", zIndex:0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "0 24px 60px" }}>

          {/* HERO HEADER */}
          <div style={{ textAlign: "center", padding: "60px 0 48px", animation: "fadeUp 0.6s ease both" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
              padding: "6px 16px", borderRadius: 20, border: `1px solid ${T.teal}40`,
              background: T.tealD, color: T.teal,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, animation: "pulse 1.5s ease infinite" }} />
              PjM20 · FRONTEND & BACKEND · ЗАДАНИЕ 1
            </div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.1,
              color: T.white, margin: "0 0 16px", letterSpacing: "-0.03em",
            }}>
              Подключение{" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>онлайн-оплаты</span>
            </h1>
            <p style={{ fontSize: 17, color: T.mid, maxWidth: 520, margin: "0 auto", lineHeight: 1.6, fontWeight: 300 }}>
              Техническая инструкция для разработчиков ·{" "}
              <span style={{ color: T.teal }}>ЮKassa API</span> ·{" "}
              <span style={{ color: "#A78BFA" }}>React</span> ·{" "}
              <span style={{ color: T.blue }}>Node.js</span>
            </p>
          </div>

          {/* FLOW SIMULATOR */}
          <div style={{
            border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden",
            marginBottom: 32, animation: "fadeUp 0.6s ease 0.15s both",
            background: T.surf,
          }}>
            <div style={{ padding: "12px 20px", background: T.surf2, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["#FF5F57","#FEBC2E","#28C840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.muted, letterSpacing: "0.08em" }}>PAYMENT FLOW SIMULATOR</span>
              </div>
              <button
                onClick={runSimulation}
                disabled={simRunning}
                style={{
                  padding: "7px 18px", borderRadius: 8, border: "none", cursor: simRunning ? "default" : "pointer",
                  background: simRunning ? T.surf : `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                  color: simRunning ? T.muted : T.white,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                  transition: "all 0.3s",
                }}
              >
                {simRunning ? "● RUNNING..." : "▶ RUN SIMULATION"}
              </button>
            </div>

            <div style={{ padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 0 }}>
              {FLOW_STEPS.map((node, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <FlowNode icon={node.icon} label={node.label} color={node.color} active={simStep >= i} delay={i * 0.05} />
                  {i < FLOW_STEPS.length - 1 && (
                    <FlowArrow active={simStep > i} color={node.color} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: "10px 20px", background: T.surf2, borderTop: `1px solid ${T.border}`, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.muted }}>
              {simStep < 0 && "● Нажмите RUN SIMULATION для демонстрации платёжного флоу"}
              {simStep === 0 && <span style={{ color: T.teal }}>● Покупатель нажал «Оплатить» → Frontend инициирует запрос...</span>}
              {simStep === 1 && <span style={{ color: "#A78BFA" }}>● Frontend открывает виджет ЮKassa → Ввод данных карты...</span>}
              {simStep === 2 && <span style={{ color: T.blue }}>● Backend создаёт платёж через ЮKassa API → payment_id сохранён</span>}
              {simStep === 3 && <span style={{ color: T.amber }}>● ЮKassa обрабатывает транзакцию → Проверка 3D Secure...</span>}
              {simStep === 4 && <span style={{ color: T.red }}>● Webhook получен → Верификация подписи → Обновление статуса в БД</span>}
              {simStep >= 5 && <span style={{ color: "#34D399" }}>✓ Платёж успешен! Email отправлен покупателю. Статус: PAID</span>}
            </div>
          </div>

          {/* STEP NAVIGATOR */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, overflowX: "auto", paddingBottom: 4, animation: "fadeUp 0.6s ease 0.2s both" }}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => { setActiveStep(i) }}
                style={{
                  display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
                  padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: activeStep === i ? `${s.color}18` : T.surf,
                  borderWidth: 1, borderStyle: "solid",
                  borderColor: activeStep === i ? `${s.color}60` : T.border,
                  color: activeStep === i ? s.color : T.mid,
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                  transition: "all 0.25s",
                }}
              >
                <span style={{ fontSize: 16 }}>{s.icon}</span>
                <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1 }}>
                  <span>{s.num}</span>
                  <span style={{ fontSize: 9, opacity: 0.7, fontWeight: 400, letterSpacing: "0.04em", maxWidth: 80, lineHeight: 1.2, textAlign: "left" }}>{s.title.split(":")[0]}</span>
                </span>
              </button>
            ))}
          </div>

          {/* ACTIVE STEP DETAIL */}
          <div key={activeStep} style={{ animation: "fadeUp 0.4s ease both" }}>
            <div style={{
              border: `1px solid ${step.color}30`,
              borderRadius: 16, overflow: "hidden",
              background: T.surf,
            }}>
              <div style={{
                padding: "24px 28px 20px",
                background: `linear-gradient(135deg, ${step.color}10, ${T.surf})`,
                borderBottom: `1px solid ${T.border}`,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
              }}>
                <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, flexShrink: 0,
                    background: `${step.color}15`, border: `1.5px solid ${step.color}50`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
                  }}>{step.icon}</div>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: step.color, fontWeight: 600, letterSpacing: "0.1em" }}>ШАГ {step.num}</span>
                      <span style={{ width: 1, height: 12, background: T.border }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.muted }}>{step.who}</span>
                      <span style={{ width: 1, height: 12, background: T.border }} />
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.muted }}>{step.time}</span>
                    </div>
                    <h2 style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 700, color: T.white, margin: 0, letterSpacing: "-0.02em" }}>{step.title}</h2>
                    <p style={{ fontSize: 13, color: T.muted, margin: "4px 0 0", fontWeight: 300 }}>{step.subtitle}</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, paddingTop: 4 }}>
                  {STEPS.map((_, i) => (
                    <div key={i} onClick={() => setActiveStep(i)} style={{
                      width: i === activeStep ? 20 : 8, height: 8, borderRadius: 4, cursor: "pointer",
                      background: i === activeStep ? step.color : i < activeStep ? `${STEPS[i].color}60` : T.border,
                      transition: "all 0.3s",
                    }} />
                  ))}
                </div>
              </div>

              <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{
                  background: `${step.color}08`, border: `1px solid ${step.color}20`,
                  borderRadius: 10, padding: "14px 16px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 16, marginTop: 1 }}>💡</span>
                  <p style={{ margin: 0, fontSize: 14, color: T.mid, lineHeight: 1.7, fontWeight: 300 }}>
                    {step.summary}
                  </p>
                </div>
              </div>

              {step.providers && (
                <div style={{ padding: "20px 28px", borderBottom: `1px solid ${T.border}` }}>
                  <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.muted, letterSpacing: "0.1em", margin: "0 0 12px", textTransform: "uppercase" }}>Сравнение платёжных систем</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono',monospace" }}>
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {["Система","Комиссия","54-ФЗ","Лучше для"].map(h => (
                            <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 10, color: T.muted, fontWeight: 600, letterSpacing: "0.08em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {step.providers.map((p, i) => (
                          <tr key={i} style={{ borderBottom: `1px solid ${T.border}`, background: i === 0 ? `${T.teal}05` : "transparent" }}>
                            <td style={{ padding: "10px 12px", color: i === 0 ? T.teal : T.text, fontWeight: i === 0 ? 600 : 400, fontSize: 12 }}>
                              {i === 0 && <span style={{ marginRight: 6, fontSize: 10, padding: "2px 6px", borderRadius: 4, background: `${T.teal}20`, color: T.teal, fontWeight: 700 }}>★ РЕКОМ</span>}
                              {p.name}
                            </td>
                            <td style={{ padding: "10px 12px", color: T.mid, fontSize: 12 }}>{p.fee}</td>
                            <td style={{ padding: "10px 12px", fontSize: 14 }}>{p.fz === "✓" ? <span style={{ color: "#34D399" }}>✓</span> : <span style={{ color: T.red }}>✗</span>}</td>
                            <td style={{ padding: "10px 12px", color: T.muted, fontSize: 12 }}>{p.best}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div style={{ padding: "20px 28px" }}>
                <CodeBlock code={step.code} label={step.codeLabel} />
              </div>
            </div>
          </div>

          {/* QUICK-NAV */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20, gap: 10, animation: "fadeUp 0.6s ease 0.3s both" }}>
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: 10, border: `1px solid ${T.border}`,
                background: activeStep === 0 ? T.surf : T.surf2, color: activeStep === 0 ? T.muted : T.text,
                cursor: activeStep === 0 ? "default" : "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                transition: "all 0.25s",
              }}
            >← ПРЕДЫДУЩИЙ ШАГ</button>
            <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 16px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.muted }}>
              {activeStep + 1} / {STEPS.length}
            </div>
            <button
              onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))}
              disabled={activeStep === STEPS.length - 1}
              style={{
                flex: 1, padding: "12px 20px", borderRadius: 10, border: `1px solid ${activeStep === STEPS.length-1 ? T.border : step.color+"60"}`,
                background: activeStep === STEPS.length - 1 ? T.surf : `${step.color}15`, color: activeStep === STEPS.length - 1 ? T.muted : step.color,
                cursor: activeStep === STEPS.length - 1 ? "default" : "pointer", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 600,
                transition: "all 0.25s",
              }}
            >СЛЕДУЮЩИЙ ШАГ →</button>
          </div>

          {/* QA CHECKLIST */}
          <div style={{ marginTop: 32, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden", background: T.surf, animation: "fadeUp 0.6s ease 0.35s both" }}>
            <div style={{ padding: "16px 24px", background: T.surf2, borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 16 }}>🧪</span>
              <span style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, color: T.white }}>QA Чеклист · Что проверить перед релизом</span>
              <div style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: T.teal, padding: "3px 10px", borderRadius: 6, background: T.tealD }}>7 ТЕСТОВ</div>
            </div>
            <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
              {[
                { icon: "💳", text: "Успешная оплата тестовой картой 4111 1111 1111 1111" },
                { icon: "🚫", text: "Отклонение карты 4000 0000 0000 0002 — ошибка" },
                { icon: "🔔", text: "Webhook приходит корректно, подпись верна" },
                { icon: "📧", text: "Email попадает во Входящие, не в Спам" },
                { icon: "🗄️", text: "Статус заказа обновился в базе данных" },
                { icon: "📱", text: "Виджет корректно работает на мобильном" },
                { icon: "⚡", text: "Тест с 3D Secure: дополнительная верификация" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "10px 12px", borderRadius: 8, background: T.surf2, border: `1px solid ${T.border}`,
                }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12, color: T.mid, lineHeight: 1.5, fontWeight: 300 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div style={{ marginTop: 40, textAlign: "center", fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: T.muted, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <span>PjM20 · Frontend & Backend · Задание 1 · </span>
            <span style={{ color: T.teal }}>ЮKassa Integration Guide</span>
            <span> · April 2026</span>
          </div>

        </div>
      </div>
    </>
  );
};

export default PaymentGuide;