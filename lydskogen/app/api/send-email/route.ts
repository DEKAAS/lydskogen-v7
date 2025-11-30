import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('CRITICAL: Missing RESEND_API_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    const body = await request.json();
    const { name, email, message, subject, source, type } = body;

    if (!email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // HARDCODED ADMIN EMAIL FOR SAFETY
    const adminEmail = 'auroravildskog@gmail.com';
    
    const emailSubject = subject || `Ny henvendelse fra ${name || email}`;
    const emailHtml = `
      <h1>Ny henvendelse fra Lydskog.no</h1>
      <p><strong>Navn:</strong> ${name || 'Ikke oppgitt'}</p>
      <p><strong>E-post:</strong> ${email}</p>
      <p><strong>Kilde:</strong> ${source || 'Kontaktsskjema'}</p>
      ${type ? `<p><strong>Type:</strong> ${type}</p>` : ''}
      <hr />
      <h2>Melding:</h2>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    console.log(`Attempting to send email to ${adminEmail} from onboarding@resend.dev`);

    const data = await resend.emails.send({
      from: 'Lydskog Website <onboarding@resend.dev>',
      to: adminEmail,
      replyTo: email,
      subject: emailSubject,
      html: emailHtml,
    });

    if (data.error) {
      console.error('Resend API Error:', data.error);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error sending email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
