import type { VercelRequest, VercelResponse } from '@vercel/node';
import { YooKassa } from '@webzaytsev/yookassa-ts-sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paymentId } = req.query;
  if (!paymentId || typeof paymentId !== 'string') {
    return res.status(400).json({ error: 'Missing paymentId' });
  }

  const sdk = YooKassa({
    shop_id: process.env.YOKASSA_SHOP_ID!,
    secret_key: process.env.YOKASSA_SECRET_KEY!,
  });

  try {
    const payment = await sdk.payments.retrieve(paymentId);
    res.status(200).json({
      status: payment.status, // 'pending', 'waiting_for_capture', 'succeeded', 'canceled'
      paid: payment.status === 'succeeded',
    });
  } catch (error: any) {
    console.error('Error retrieving payment:', error);
    res.status(500).json({ error: 'Failed to retrieve payment status' });
  }
}