import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, CreditCard, ArrowLeft, CheckCircle, XCircle, Loader2, Zap, Code2 } from 'lucide-react';

// Design tokens (same as HomePage)
const T = {
  bg:     "#06070D",
  surf:   "#0D0F1A",
  surf2:  "#131527",
  border: "rgba(255,255,255,0.07)",
  teal:   "#00D4AA",
  tealD:  "rgba(0,212,170,0.12)",
  blue:   "#4F8FFF",
  purple: "#A78BFA",
  muted:  "#4A506A",
  mid:    "#8892B0",
  text:   "#CDD6F4",
  white:  "#FFFFFF",
  red:    "#FF4D6A",
  green:  "#34D399",
};

const DemoPage: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const orderId = `demo_${Date.now()}`;

    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(amount),
          orderId,
        }),
      });

      const data = await response.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setResult({
          success: false,
          message: data.error || 'Ошибка при создании платежа',
        });
      }
    } catch (error) {
      console.error(error);
      setResult({
        success: false,
        message: 'Ошибка при создании платежа',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, overflowX: "hidden" }}>
      {/* Grid texture */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`,
        backgroundSize: "40px 40px", opacity: 0.45,
      }} />

      {/* Glow orbs */}
      <div style={{ position:"fixed", top:"-20vh", left:"-8vw", width:"44vw", height:"44vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.teal}09,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"-14vh", right:"-8vw", width:"36vw", height:"36vw", borderRadius:"50%", background:`radial-gradient(circle, ${T.blue}09,transparent 70%)`, pointerEvents:"none", zIndex:0 }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Navbar (same as HomePage) */}
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
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: T.tealD,
                border: `1px solid ${T.teal}40`, display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Terminal size={14} color={T.teal} />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: T.white, letterSpacing: "-0.02em" }}>
                Vector<span style={{ color: T.teal }}>Focus</span>
              </span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link
                to="/docs"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 14px", borderRadius: 8, textDecoration: "none",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
                  color: T.mid, border: `1px solid ${T.border}`,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = T.teal}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = T.mid}
              >
                <Code2 size={12} />
                ДОКУМЕНТАЦИЯ
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Main content */}
        <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back button */}
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: T.mid, textDecoration: "none", marginBottom: 32, fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
              <ArrowLeft size={14} /> Назад на главную
            </Link>

            <div style={{
              borderRadius: 20, overflow: "hidden",
              background: T.surf, border: `1px solid ${T.border}`,
              padding: "40px 32px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: T.tealD, border: `1px solid ${T.teal}40`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <CreditCard size={24} color={T.teal} />
                </div>
                <div>
                  <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: T.white, marginBottom: 4 }}>
                    Тест-драйв платежей
                  </h1>
                  <p style={{ fontSize: 14, color: T.mid }}>Проведите тестовый платёж через ЮKassa</p>
                </div>
              </div>

              {/* Test card info */}
              <div style={{
                background: T.surf2, border: `1px solid ${T.teal}20`, borderRadius: 12,
                padding: "16px 20px", marginBottom: 32,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.teal, animation: "pulse 1.4s ease infinite" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.teal, fontWeight: 600 }}>ТЕСТОВЫЕ ДАННЫЕ ЮKASSA</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 12 }}>
                  <div><span style={{ color: T.muted }}>💳 Карта:</span> <code style={{ color: T.text, background: T.bg, padding: "2px 6px", borderRadius: 4 }}>4111 1111 1111 1111</code></div>
                  <div><span style={{ color: T.muted }}>📅 Срок:</span> любая будущая дата</div>
                  <div><span style={{ color: T.muted }}>🔐 CVV:</span> любые 3 цифры</div>
                </div>
              </div>

              {/* Payment form */}
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 13, color: T.mid, fontFamily: "'JetBrains Mono', monospace" }}>
                    Сумма (₽)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      background: T.bg,
                      border: `1px solid ${T.border}`,
                      borderRadius: 8,
                      color: T.text,
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = T.teal}
                    onBlur={e => e.currentTarget.style.borderColor = T.border}
                    placeholder="1000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    borderRadius: 10,
                    border: "none",
                    background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`,
                    color: T.white,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    cursor: loading ? "default" : "pointer",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      ОБРАБОТКА...
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      ОПЛАТИТЬ
                    </>
                  )}
                </button>
              </form>

              {result && (
                <div style={{
                  marginTop: 24,
                  padding: "14px 20px",
                  borderRadius: 10,
                  background: result.success ? `${T.green}10` : `${T.red}10`,
                  border: `1px solid ${result.success ? T.green : T.red}30`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  {result.success ? <CheckCircle size={16} color={T.green} /> : <XCircle size={16} color={T.red} />}
                  <span style={{ fontSize: 13, color: result.success ? T.green : T.red }}>{result.message}</span>
                </div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Footer (minimal) */}
        <footer style={{ borderTop: `1px solid ${T.border}`, padding: "20px 24px", textAlign: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.muted }}>© 2026 VectorFocus · ЮKassa тест-драйв</span>
        </footer>
      </div>
    </div>
  );
};

export default DemoPage;