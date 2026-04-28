import type { VercelRequest, VercelResponse } from '@vercel/node';
import { YooKassa } from '@webzaytsev/yookassa-ts-sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, orderId } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  const sdk = YooKassa({
    shop_id: process.env.YOKASSA_SHOP_ID!,
    secret_key: process.env.YOKASSA_SECRET_KEY!,
  });

  try {
    const payment = await sdk.payments.create({
      amount: {
        value: amount.toFixed(2),
        currency: 'RUB',
      },
      confirmation: {
        type: 'redirect',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://vector-focus.vercel.app'}/demo?orderId=${orderId}`,
      },
      description: `Тестовый заказ #${orderId}`,
      capture: true,
    });

    res.status(200).json({
      redirectUrl: payment.confirmation.confirmation_url,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error('YooKassa error:', error);
    res.status(500).json({ error: error.message || 'Failed to create payment' });
  }
}