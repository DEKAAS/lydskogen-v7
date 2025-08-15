import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { productName = 'Ferdiglåt', productId, genre, amount } = await req.json();

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ ok: false, error: 'STRIPE_NOT_CONFIGURED' }, { status: 500 });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });

    // Derive origin for success/cancel URLs
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nok',
            unit_amount: typeof amount === 'number' ? amount : 45000, // 450 NOK default
            product_data: {
              name: productName,
              metadata: {
                productId: productId || '',
                genre: genre || '',
                type: 'music'
              }
            }
          },
          quantity: 1
        }
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        productId: productId || '',
        genre: genre || '',
        type: 'music'
      }
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return NextResponse.json({ ok: false, error: 'CHECKOUT_ERROR' }, { status: 500 });
  }
}


