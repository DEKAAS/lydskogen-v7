import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeSecret) {
    return NextResponse.json({ ok: false, error: 'STRIPE_NOT_CONFIGURED' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2024-06-20' });

  const signature = req.headers.get('stripe-signature') as string;
  const payload = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO: Mark product as sold in DB and send email with download link
        console.log('Checkout completed:', session.id, session.metadata);
        break;
      }
      default:
        console.log('Unhandled event type', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return NextResponse.json({ ok: false, error: 'INVALID_SIGNATURE' }, { status: 400 });
  }
}


