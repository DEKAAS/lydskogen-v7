import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    const cwd = process.cwd();
    return NextResponse.json({ ok: true, cwd, basename: path.basename(cwd) });
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}


