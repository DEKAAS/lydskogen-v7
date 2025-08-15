import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const hasStripeSecret = Boolean(process.env.STRIPE_SECRET_KEY);
    const hasStripeWebhook = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
    const hasResend = Boolean(process.env.RESEND_API_KEY);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || null;

    return NextResponse.json({
      ok: true,
      env: {
        STRIPE_SECRET_KEY: hasStripeSecret,
        STRIPE_WEBHOOK_SECRET: hasStripeWebhook,
        RESEND_API_KEY: hasResend,
        NEXT_PUBLIC_SITE_URL: siteUrl
      }
    });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}



