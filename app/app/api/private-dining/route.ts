import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, date, guestCount } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!name?.trim()) missingFields.push('name');
    if (!email?.includes('@')) missingFields.push('email');
    if (!phone?.trim()) missingFields.push('phone');
    if (!date) missingFields.push('date');
    if (!guestCount || parseInt(guestCount) < 10) missingFields.push('guestCount');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'validation_failed', fields: missingFields },
        { status: 400 },
      );
    }

    // In production: INSERT into private_dining_inquiries table + send emails via Resend
    console.log('Private dining inquiry:', {
      ...body,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Private dining error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
