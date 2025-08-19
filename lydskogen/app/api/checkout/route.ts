import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Handle both single item and cart checkout
    let lineItems;
    let metadata = {};
    
    if (body.cartItems && Array.isArray(body.cartItems)) {
      // Multiple items from shopping cart
      lineItems = body.cartItems.map((item: any) => ({
        price_data: {
          currency: 'nok',
          unit_amount: typeof item.amount === 'number' ? item.amount : 45000,
          product_data: {
            name: item.productName,
            metadata: {
              productId: item.productId || '',
              productType: item.productType || 'music',
              genre: item.genre || ''
            }
          }
        },
        quantity: item.quantity || 1
      }));
      
      metadata = {
        type: 'cart_purchase',
        itemCount: body.cartItems.length,
        totalAmount: body.totalAmount || 0
      };
    } else {
      // Single item checkout (legacy)
      const { productName = 'Ferdiglåt', productId, genre, amount } = body;
      
      lineItems = [
        {
          price_data: {
            currency: 'nok',
            unit_amount: typeof amount === 'number' ? amount : 45000,
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
      ];
      
      metadata = {
        productId: productId || '',
        genre: genre || '',
        type: 'single_purchase'
      };
    }

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
      line_items: lineItems,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    return NextResponse.json({ ok: false, error: 'CHECKOUT_ERROR' }, { status: 500 });
  }
}


