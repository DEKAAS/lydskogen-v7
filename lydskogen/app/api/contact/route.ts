import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Save to orders system removed as OrdersTab is deprecated
    // Proceed directly to email sending
    
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY mangler i miljøvariabler. Sender ikke e-post.');
      return NextResponse.json({ ok: true, warn: 'EMAIL_DISABLED' });
    }

    const resend = new Resend(resendApiKey);
    const toEmail = 'lydskog@proton.me';
    const subject = data.subject || `Ny henvendelse (${data.source || 'Skjema'}) - ${data.type || data.genre || 'Ukjent'}`;
    const text = `
Navn: ${data.name}
E-post: ${data.email}
Telefon: ${data.phone || '-'}
Type: ${data.type || data.genre || '-'}
Sjanger: ${data.genre || '-'}
Valg: ${data.priceOption || data.budget || '-'}

Melding:
${data.message || '-'}
`;

    await resend.emails.send({
      from: 'Lydskogen <no-reply@resend.dev>',
      to: toEmail,
      subject,
      text
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Feil ved mottak av kontakt-skjema', err);
    return NextResponse.json({ ok: false, error: 'SERVER_ERROR' }, { status: 500 });
  }
}


