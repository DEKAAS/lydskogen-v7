import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.error('CRITICAL: Missing RESEND_API_KEY');
      return NextResponse.json({ ok: false, error: 'Configuration error' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const adminEmail = 'auroravildskog@gmail.com';

    const subject = data.subject || `Ny henvendelse (${data.source || 'Skjema'}) - ${data.type || data.genre || 'Ukjent'}`;
    const html = `
      <h1>Ny henvendelse fra Lydskog.no</h1>
      <p><strong>Navn:</strong> ${data.name || 'Ikke oppgitt'}</p>
      <p><strong>E-post:</strong> ${data.email}</p>
      <p><strong>Telefon:</strong> ${data.phone || '-'}</p>
      <p><strong>Type:</strong> ${data.type || data.genre || '-'}</p>
      <p><strong>Sjanger:</strong> ${data.genre || '-'}</p>
      <p><strong>Valg/Budsjett:</strong> ${data.priceOption || data.budget || '-'}</p>
      <hr />
      <h2>Melding:</h2>
      <p style="white-space: pre-wrap;">${data.message || '-'}</p>
    `;

    console.log(`Contact route: Sending to ${adminEmail}`);

    const result = await resend.emails.send({
      from: 'Lydskog Website <onboarding@resend.dev>',
      to: adminEmail,
      replyTo: data.email,
      subject,
      html
    });

    if (result.error) {
      console.error('Resend API Error:', result.error);
      return NextResponse.json({ ok: false, error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Server error in contact route:', err);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
