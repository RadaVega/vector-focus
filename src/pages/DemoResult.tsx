import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Design tokens (same as HomePage)

const T = {
  bg:     "#06070D",
  surf:   "#0D0F1A",
  border: "rgba(255,255,255,0.07)",
  teal:   "#00D4AA",
  blue:   "#4F8FFF",
  muted:  "#4A506A",
  mid:    "#8892B0",
  text:   "#CDD6F4",
  white:  "#FFFFFF",
  green:  "#34D399",
  red:    "#FF4D6A",
};

const DemoResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const paymentId = searchParams.get('paymentId');

  const [status, setStatus] = useState<'pending' | 'succeeded' | 'canceled' | 'error'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) {
      setStatus('error');
      setLoading(false);
      return;
    }

    let interval: NodeJS.Timeout;
    let isMounted = true;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/payment-status?paymentId=${paymentId}`);
        const data = await res.json();
        if (!isMounted) return;

        if (data.status === 'succeeded') {
          setStatus('succeeded');
          setLoading(false);
          clearInterval(interval);
        } else if (data.status === 'canceled') {
          setStatus('canceled');
          setLoading(false);
          clearInterval(interval);
        } else {
          // still pending
          setStatus('pending');
        }
      } catch (err) {
        if (isMounted) {
          setStatus('error');
          setLoading(false);
          clearInterval(interval);
        }
      }
    };

    checkStatus(); // immediate check
    interval = setInterval(checkStatus, 2000); // poll every 2s

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [paymentId]);

  const getContent = () => {
    if (loading || status === 'pending') {
      return (
        <div className="text-center">
          <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: T.teal, margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Проверка платежа...</h2>
          <p style={{ color: T.mid }}>Пожалуйста, подождите, мы проверяем статус вашей транзакции.</p>
        </div>
      );
    }

    if (status === 'succeeded') {
      return (
        <div className="text-center">
          <CheckCircle size={64} color={T.green} style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Платёж успешен!</h2>
          <p style={{ color: T.mid, marginBottom: 24 }}>Заказ {orderId} успешно оплачен. Спасибо за тест-драйв.</p>
          <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: `linear-gradient(135deg, ${T.teal}, ${T.blue})`, borderRadius: 8, color: T.white, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>Вернуться на главную</Link>
        </div>
      );
    }

    if (status === 'canceled') {
      return (
        <div className="text-center">
          <XCircle size={64} color={T.red} style={{ margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Платёж отменён</h2>
          <p style={{ color: T.mid, marginBottom: 24 }}>Транзакция не завершена. Вы можете попробовать ещё раз.</p>
          <Link to="/demo" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: T.surf, border: `1px solid ${T.border}`, borderRadius: 8, color: T.teal, textDecoration: "none", fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>Попробовать снова</Link>
        </div>
      );
    }

    return (
      <div className="text-center">
        <XCircle size={64} color={T.red} style={{ margin: '0 auto 24px' }} />
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ошибка</h2>
        <p style={{ color: T.mid, marginBottom: 24 }}>Не удалось проверить статус платежа. Пожалуйста, свяжитесь с поддержкой.</p>
        <Link to="/" style={{ color: T.teal, textDecoration: "none" }}>На главную</Link>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, position: "relative", overflow: "hidden" }}>
      {/* Grid texture */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize: "40px 40px", opacity: 0.45 }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 600, margin: "0 auto", padding: "80px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ background: T.surf, borderRadius: 20, padding: "48px 32px", border: `1px solid ${T.border}`, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `${T.teal}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Terminal size={24} color={T.teal} />
            </div>
          </div>
          {getContent()}
        </motion.div>
      </div>
    </div>
  );
};

export default DemoResult;