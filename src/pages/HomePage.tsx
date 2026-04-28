import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Terminal, Zap, Shield, CreditCard,
  Globe, ChevronRight, Check, Code2, Cpu, BarChart3,
} from "lucide-react";

// ─── DESIGN TOKENS (shared with PaymentGuide) ─────────────────────
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
  blueD:  "rgba(79,143,255,0.12)",
  purple: "#A78BFA",
  muted:  "#4A506A",
  mid:    "#8892B0",
  text:   "#CDD6F4",
  white:  "#FFFFFF",
};

// ─── FONT INJECTION ───────────────────────────────────────────────
const useGlobalStyles = () => {
  useEffect(() => {
    const id = "vf-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${T.bg};color:${T.text};font-family:'DM Sans',sans-serif}
      @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
      @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
      @keyframes scanline{0%{top:0}100%{top:100%}}
      @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      @keyframes orbit{from{transform:rotate(0deg) translateX(180px) rotate(0deg)}to{transform:rotate(360deg) translateX(180px) rotate(-360deg)}}
      @keyframes orbit2{from{transform:rotate(120deg) translateX(220px) rotate(-120deg)}to{transform:rotate(480deg) translateX(220px) rotate(-480deg)}}
      @keyframes orbit3{from{transform:rotate(240deg) translateX(160px) rotate(-240deg)}to{transform:rotate(600deg) translateX(160px) rotate(-600deg)}}
      @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
      @keyframes borderPulse{0%,100%{border-color:rgba(0,212,170,0.2)}50%{border-color:rgba(0,212,170,0.6)}}
      @keyframes glow{0%,100%{box-shadow:0 0 14px rgba(0,212,170,0.3)}50%{box-shadow:0 0 32px rgba(0,212,170,0.7)}}
      @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      ::-webkit-scrollbar{width:4px;height:4px}
      ::-webkit-scrollbar-track{background:transparent}
      ::-webkit-scrollbar-thumb{background:#1e2235;border-radius:4px}
    `;
    document.head.appendChild(style);
  }, []);
};

// ─── TYPEWRITER ───────────────────────────────────────────────────
const Typewriter = ({ words, speed = 80, pause = 2200 }: { words: string[]; speed?: number; pause?: number }) => {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words, speed, pause]);

  return (
    <span>
      {displayed}
      <span style={{ color: T.teal, animation: "pulse 1s step-start infinite" }}>▊</span>
    </span>
  );
};

// ─── ANIMATED COUNTER ─────────────────────────────────────────────
const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const dur = 1400;
      const tick = () => {
        const p = Math.min(1, (Date.now() - start) / dur);
        setVal(Math.round(p * to));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val.toLocaleString("ru")}{suffix}</span>;
};

// ─── GATEWAY BADGE ────────────────────────────────────────────────
const GatewayBadge = ({ name, color, delay }: { name: string; color: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.85 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ scale: 1.06 }}
    style={{
      padding: "7px 14px", borderRadius: 8,
      background: `${color}12`, border: `1px solid ${color}40`,
      color, fontFamily: "'JetBrains Mono', monospace",
      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
      userSelect: "none", cursor: "default",
    }}
  >{name}</motion.div>
);

// ─── FEATURE CARD ─────────────────────────────────────────────────
const FeatureCard = ({
  icon, title, desc, color, tag, idx,
}: {
  icon: React.ReactNode; title: string; desc: string; color: string; tag: string; idx: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: idx * 0.09, duration: 0.5 }}
    whileHover={{ y: -6 }}
    style={{
      padding: "24px", borderRadius: 14,
      background: T.surf, border: `1px solid ${T.border}`,
      transition: "border-color 0.3s",
      cursor: "default", position: "relative", overflow: "hidden",
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}40`)}
    onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
  >
    {/* corner accent */}
    <div style={{
      position: "absolute", top: 0, right: 0,
      width: 48, height: 48,
      background: `${color}08`,
      clipPath: "polygon(100% 0, 0 0, 100% 100%)",
    }} />
    <div style={{
      width: 44, height: 44, borderRadius: 11, marginBottom: 16,
      background: `${color}14`, border: `1px solid ${color}30`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>{icon}</div>
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
      color, letterSpacing: "0.12em", marginBottom: 6, fontWeight: 600,
    }}>{tag}</div>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: T.white, marginBottom: 8 }}>{title}</h3>
    <p style={{ fontSize: 13, color: T.mid, lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
  </motion.div>
);

// ─── STAT CARD ────────────────────────────────────────────────────
const StatCard = ({ label, to, suffix, sub, color, delay }: {
  label: string; to: number; suffix: string; sub: string; color: string; delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    style={{
      textAlign: "center", padding: "28px 20px",
      borderRadius: 14, background: T.surf,
      border: `1px solid ${T.border}`,
    }}
  >
    <div style={{
      fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 38,
      color, lineHeight: 1, marginBottom: 6,
    }}>
      <Counter to={to} suffix={suffix} />
    </div>
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.white, fontWeight: 600, marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 12, color: T.muted, fontWeight: 300 }}>{sub}</div>
  </motion.div>
);

// ─── TERMINAL BLOCK ───────────────────────────────────────────────
const TerminalBlock = () => {
  const lines = [
    { prefix: "$", text: "npm install @vectorfocus/sdk", color: T.text },
    { prefix: "✓", text: "Пакет установлен за 1.2s", color: T.teal },
    { prefix: "", text: "", color: "" },
    { prefix: "~", text: "const vf = new VectorFocus({", color: T.text },
    { prefix: " ", text: "  shopId: process.env.SHOP_ID,", color: T.mid },
    { prefix: " ", text: "  secretKey: process.env.SECRET_KEY,", color: T.mid },
    { prefix: " ", text: "  gateway: 'yukassa' // или 'sberbank' | 'tinkoff'", color: "#4A506A" },
    { prefix: "~", text: "});", color: T.text },
    { prefix: "", text: "", color: "" },
    { prefix: "✓", text: "Готово к приёму платежей 🚀", color: "#34D399" },
  ];

  return (
    <div style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${T.border}`,
      background: "#080B14",
      animation: "float 4s ease-in-out infinite",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "10px 14px", background: T.surf2,
        borderBottom: `1px solid ${T.border}`,
      }}>
        {["#FF5F57","#FEBC2E","#28C840"].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, marginLeft: 6, letterSpacing: "0.08em" }}>
          vector-focus — bash
        </span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.12 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11, lineHeight: 1.7, display: "flex", gap: 8,
            }}
          >
            <span style={{ color: T.teal, width: 10, flexShrink: 0 }}>{l.prefix}</span>
            <span style={{ color: l.color }}>{l.text}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ─── TICKER ───────────────────────────────────────────────────────
const Ticker = () => {
  const items = [
    "ЮKassa", "•", "Сбербанк", "•", "Т-Банк", "•",
    "CloudPayments", "•", "WebMoney", "•", "СБП", "•",
    "Apple Pay", "•", "Google Pay", "•", "QIWI", "•",
    "ЮKassa", "•", "Сбербанк", "•", "Т-Банк", "•",
    "CloudPayments", "•", "WebMoney", "•", "СБП", "•",
    "Apple Pay", "•", "Google Pay", "•", "QIWI", "•",
  ];
  return (
    <div style={{ overflow: "hidden", padding: "14px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, position: "relative" }}>
      <div style={{
        display: "inline-flex", gap: 28, whiteSpace: "nowrap",
        animation: "ticker 22s linear infinite",
      }}>
        {items.map((t, i) => (
          <span key={i} style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11, fontWeight: t === "•" ? 400 : 600,
            color: t === "•" ? T.muted : T.mid,
            letterSpacing: t === "•" ? 0 : "0.08em",
          }}>{t}</span>
        ))}
      </div>
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  useGlobalStyles();

  const features = [
    { icon: <Zap size={20} color={T.teal} />, title: "Единый API", desc: "Один интерфейс для всех платёжных систем России. Меняйте провайдера без переписывания кода.", color: T.teal, tag: "INTEGRATION", },
    { icon: <Shield size={20} color={T.blue} />, title: "Безопасность", desc: "Верификация webhook-подписей, хранение ключей в .env, PCI DSS compliance через официальные виджеты.", color: T.blue, tag: "SECURITY", },
    { icon: <Code2 size={20} color={T.purple} />, title: "Готовые SDK", desc: "Node.js, Python, PHP и Go. Полный комплект примеров кода и документации на русском языке.", color: T.purple, tag: "SDK", },
    { icon: <Globe size={20} color={T.amber} />, title: "Webhook-оркестрация", desc: "Надёжная обработка событий: повторные попытки, очереди, мониторинг статусов в реальном времени.", color: T.amber, tag: "EVENTS", },
    { icon: <BarChart3 size={20} color="#34D399" />, title: "Аналитика", desc: "Дашборд с конверсией, средним чеком, причинами отказов и сравнением по шлюзам.", color: "#34D399", tag: "ANALYTICS", },
    { icon: <Cpu size={20} color={T.red} />, title: "Авто-маршрутизация", desc: "Система выбирает лучший шлюз в реальном времени по доступности и комиссии.", color: T.red, tag: "ROUTING", },
  ];

  return (
    <div style={{ minHeight: "100vh", background: T.bg, overflowX: "hidden" }}>

      {/* ── GRID TEXTURE ── */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: "40px 40px",
        opacity: 0.45,
      }} />

      {/* ── GLOW ORBS ── */}
      <div style={{ position:"fixed", top:"-20vh", left:"-8vw", width:"44vw", height:"44vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.teal}09,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"-14vh", right:"-8vw", width:"36vw", height:"36vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.blue}09,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", top:"40vh", right:"10vw", width:"22vw", height:"22vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.purple}06,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ══════════ NAVBAR ══════════ */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "sticky", top: 0, zIndex: 100,
            backdropFilter: "blur(16px)",
            background: "rgba(6,7,13,0.8)",
            borderBottom: `1px solid ${T.border}`,
            padding: "0 24px",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: T.tealD,
                border: `1px solid ${T.teal}40`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Terminal size={14} color={T.teal} />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: T.white, letterSpacing: "-0.02em" }}>
                Vector<span style={{ color: T.teal }}>Focus</span>
              </span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[
                { label: "Документация", to: "/docs", accent: true },
                { label: "Тест-драйв", to: "/demo", accent: false },
              ].map(({ label, to, accent }) => (
                <Link
                  key={to}
                  to={to}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: accent ? "8px 18px" : "8px 14px",
                    borderRadius: 8, textDecoration: "none",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
                    background: accent ? `linear-gradient(135deg, ${T.teal}, ${T.blue})` : "transparent",
                    color: accent ? T.white : T.mid,
                    border: `1px solid ${accent ? "transparent" : T.border}`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { if (!accent) (e.currentTarget as HTMLElement).style.color = T.teal; }}
                  onMouseLeave={e => { if (!accent) (e.currentTarget as HTMLElement).style.color = T.mid; }}
                >
                  {accent && <Code2 size={12} />}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </motion.nav>

        {/* ══════════ HERO ══════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* Left copy */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24,
                padding: "6px 14px", borderRadius: 20,
                border: `1px solid ${T.teal}40`, background: T.tealD,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.teal,
                fontWeight: 600, letterSpacing: "0.1em",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, animation: "pulse 1.4s ease infinite" }} />
              РОССИЙСКАЯ ПЛАТЁЖНАЯ ОРКЕСТРАЦИЯ
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(36px, 4vw, 54px)", lineHeight: 1.08,
                color: T.white, marginBottom: 16, letterSpacing: "-0.03em",
              }}
            >
              Единый API для{" "}
              <span style={{
                background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                <Typewriter words={["ЮKassa", "Сбербанка", "Т-Банка", "CloudPayments", "любого шлюза"]} />
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{ fontSize: 16, color: T.mid, lineHeight: 1.7, marginBottom: 32, fontWeight: 300, maxWidth: 460 }}
            >
              Современная платёжная оркестрация для российского бизнеса.
              Интегрируйте все платёжные системы один раз — переключайтесь между
              провайдерами без переписывания кода.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
            >
              {/* Primary — Тест-драйв */}
              <Link
                to="/demo"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 24px", borderRadius: 10, textDecoration: "none",
                  background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                  color: T.white,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                  boxShadow: `0 0 24px ${T.teal}30`,
                  transition: "all 0.25s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${T.teal}55`}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 0 24px ${T.teal}30`}
              >
                <Zap size={14} />
                НАЧАТЬ ТЕСТ-ДРАЙВ
                <ArrowRight size={13} />
              </Link>

              {/* Secondary — Документация → PaymentGuide */}
              <Link
                to="/docs"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "12px 22px", borderRadius: 10, textDecoration: "none",
                  background: T.surf, color: T.text,
                  border: `1px solid ${T.border}`,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                  transition: "all 0.25s",
                  animation: "borderPulse 3s ease infinite",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = `${T.teal}60`;
                  el.style.color = T.teal;
                  el.style.animation = "none";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = T.border;
                  el.style.color = T.text;
                  el.style.animation = "borderPulse 3s ease infinite";
                }}
              >
                <Code2 size={14} />
                ДОКУМЕНТАЦИЯ
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              style={{ display: "flex", gap: 20, marginTop: 28, flexWrap: "wrap" }}
            >
              {[
                { icon: "✓", text: "Тестовая среда включена" },
                { icon: "✓", text: "Без регистрации для теста" },
                { icon: "✓", text: "SDK за 2 минуты" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 12, color: T.teal, fontWeight: 700 }}>{icon}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.06em" }}>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <TerminalBlock />
          </motion.div>
        </section>

        {/* ══════════ TICKER ══════════ */}
        <Ticker />

        {/* ══════════ GATEWAYS ══════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 36 }}
          >
            <div style={{
              display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: T.muted, letterSpacing: "0.15em",
              marginBottom: 12, textTransform: "uppercase",
            }}>Поддерживаемые платёжные шлюзы</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: "clamp(26px, 3.5vw, 38px)", color: T.white,
              letterSpacing: "-0.02em",
            }}>
              Один SDK —
              <span style={{ background: `linear-gradient(135deg, ${T.amber}, ${T.red})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> все шлюзы</span>
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {[
              { name: "ЮKassa", color: T.teal },
              { name: "Сбербанк", color: T.blue },
              { name: "Т-Банк (Тинькофф)", color: T.amber },
              { name: "CloudPayments", color: T.purple },
              { name: "Robokassa", color: T.red },
              { name: "СБП", color: "#34D399" },
              { name: "WebMoney", color: T.mid },
              { name: "QIWI", color: "#F97316" },
            ].map(({ name, color }, i) => (
              <GatewayBadge key={name} name={name} color={color} delay={i * 0.06} />
            ))}
          </div>
        </section>

        {/* ══════════ FEATURES GRID ══════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 60px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 48 }}
          >
            <div style={{
              display: "inline-block", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: T.muted, letterSpacing: "0.15em", marginBottom: 12,
            }}>ВОЗМОЖНОСТИ</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 700,
              fontSize: "clamp(26px, 3.5vw, 38px)", color: T.white, letterSpacing: "-0.02em",
            }}>
              Почему выбирают{" "}
              <span style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Vector Focus?
              </span>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {features.map((f, i) => <FeatureCard key={i} {...f} idx={i} />)}
          </div>
        </section>

        {/* ══════════ STATS ══════════ */}
        <section style={{ background: T.surf, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <StatCard label="Транзакций/день" to={2400000} suffix="+" sub="в продакшн-инстансах" color={T.teal} delay={0} />
            <StatCard label="Платёжных шлюзов" to={8} suffix="" sub="Россия + СНГ" color={T.blue} delay={0.1} />
            <StatCard label="Uptime" to={99} suffix=".97%" sub="SLA гарантия" color={T.purple} delay={0.2} />
            <StatCard label="Мс среднее время" to={240} suffix="ms" sub="P99 latency API" color={T.amber} delay={0.3} />
          </div>
        </section>

        {/* ══════════ CTA BANNER ══════════ */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              borderRadius: 20, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, ${T.teal}14, ${T.blue}14)`,
              border: `1px solid ${T.teal}30`,
              padding: "56px 48px",
              textAlign: "center",
            }}
          >
            {/* grid overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
              backgroundSize: "32px 32px", opacity: 0.5,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
                padding: "6px 14px", borderRadius: 20, border: `1px solid ${T.teal}40`,
                background: T.tealD, fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: T.teal, fontWeight: 600, letterSpacing: "0.1em",
              }}>
                <CreditCard size={12} />
                ГОТОВО К РАБОТЕ ПРЯМО СЕЙЧАС
              </div>

              <h2 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 44px)", color: T.white,
                letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 16,
              }}>
                Начните принимать платежи<br />
                <span style={{ background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  за 15 минут
                </span>
              </h2>

              <p style={{ fontSize: 15, color: T.mid, lineHeight: 1.7, marginBottom: 36, fontWeight: 300 }}>
                Тестовая среда ЮKassa, Сбербанка и Т-Банка уже настроена.<br />
                Полная документация по подключению в 5 шагов — с кодом.
              </p>

              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <Link
                  to="/demo"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 28px", borderRadius: 10, textDecoration: "none",
                    background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                    color: T.white,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                    boxShadow: `0 0 32px ${T.teal}40`,
                  }}
                >
                  <Zap size={14} />
                  ТЕСТ-ДРАЙВ БЕСПЛАТНО
                  <ArrowRight size={13} />
                </Link>

                <Link
                  to="/docs"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "13px 26px", borderRadius: 10, textDecoration: "none",
                    background: T.surf2, color: T.text,
                    border: `1px solid ${T.border}`,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.06em",
                    transition: "all 0.25s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${T.teal}50`;
                    (e.currentTarget as HTMLElement).style.color = T.teal;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = T.border;
                    (e.currentTarget as HTMLElement).style.color = T.text;
                  }}
                >
                  <Code2 size={14} />
                  ДОКУМЕНТАЦИЯ → 5 ШАГОВ
                </Link>
              </div>

              {/* Checklist row */}
              <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, flexWrap: "wrap" }}>
                {["Тестовые ключи включены", "Без привязки карты", "SDK за 2 минуты", "Поддержка 54-ФЗ"].map(t => (
                  <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Check size={12} color={T.teal} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.06em" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* ══════════ FOOTER ══════════ */}
        <footer style={{
          borderTop: `1px solid ${T.border}`, background: T.surf,
          padding: "28px 24px",
        }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: T.tealD, border: `1px solid ${T.teal}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Terminal size={11} color={T.teal} />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 800, color: T.white }}>Vector<span style={{ color: T.teal }}>Focus</span></span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: "0.08em" }}>
              © 2026 VectorFocus · PjM20 · Frontend &amp; Backend
            </span>
            <Link
              to="/docs"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                color: T.teal, textDecoration: "none", letterSpacing: "0.08em", fontWeight: 600,
              }}
            >
              <Code2 size={11} />
              ДОКУМЕНТАЦИЯ <ChevronRight size={10} />
            </Link>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default HomePage;