import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, subject, source, type } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Construct email content based on source
    let emailSubject = subject || `Ny henvendelse fra ${name}`;
    let emailHtml = `
      <h1>Ny henvendelse fra Lydskogen.no</h1>
      <p><strong>Navn:</strong> ${name}</p>
      <p><strong>E-post:</strong> ${email}</p>
      <p><strong>Kilde:</strong> ${source || 'Kontaktsskjema'}</p>
      ${type ? `<p><strong>Type:</strong> ${type}</p>` : ''}
      <hr />
      <h2>Melding:</h2>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    // Send email using Resend
    // Note: 'to' should be your verified email or the one you want to receive notifications at.
    // For now, we'll assume it sends TO the site owner (you) FROM the Resend default or configured domain.
    const data = await resend.emails.send({
      from: 'Lydskogen Contact <onboarding@resend.dev>', // Use your verified domain later
      to: 'lydskog@proton.me', // Target email from user request
      subject: emailSubject,
      html: emailHtml,
      replyTo: email,
    });

    if (data.error) {
      console.error('Resend error:', data.error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Server error sending email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

