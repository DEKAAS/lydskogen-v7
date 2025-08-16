import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Save to orders system for admin tracking
    try {
      const orderResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: data.type || 'contact',
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: `${data.source || 'Skjema'} - ${data.genre || 'Ukjent sjanger'}`,
          message: data.message || data.description,
          formData: data,
          source: data.source || 'ContactForm'
        })
      })
      
      if (!orderResponse.ok) {
        console.error('Failed to save order to admin system')
      }
    } catch (orderError) {
      console.error('Error saving to orders system:', orderError)
      // Don't fail the entire request if order saving fails
    }
    
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY mangler i miljøvariabler. Sender ikke e-post.');
      return NextResponse.json({ ok: true, warn: 'EMAIL_DISABLED' });
    }

    const resend = new Resend(resendApiKey);
    const toEmail = 'lydskog@proton.me';
    const subject = `Ny henvendelse (${data.source || 'Skjema'}) - ${data.genre || 'Ukjent sjanger'}`;
    const text = `
Navn: ${data.name}
E-post: ${data.email}
Telefon: ${data.phone || '-'}
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


