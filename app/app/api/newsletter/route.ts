import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'validation_failed', fields: ['email'] },
        { status: 400 },
      );
    }

    // In production: INSERT into newsletter_subscribers table
    // For now: log and return success
    console.log('Newsletter subscription:', { email, source: source || 'footer', timestamp: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
