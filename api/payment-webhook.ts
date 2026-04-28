import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory store (for demo only; in production use DB)
// This is a global variable – works per serverless instance, but ok for demo.
const paymentStatusStore = new Map<string, string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ⚠️ In production, verify webhook signature using YooKassa webhook secret
  // const signature = req.headers['x-yukassa-signature'];
  // if (!verifySignature(req.rawBody, signature)) return res.status(401).send('Unauthorized');

  const event = req.body;
  if (event.object && event.object.status) {
    const paymentId = event.object.id;
    const status = event.object.status;
    paymentStatusStore.set(paymentId, status);
    console.log(`Webhook: payment ${paymentId} status = ${status}`);
  }

  res.status(200).json({ received: true });
}