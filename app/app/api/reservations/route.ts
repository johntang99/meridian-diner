import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, date, time, partySize } = body;

    // Validate required fields
    const missingFields: string[] = [];
    if (!firstName?.trim()) missingFields.push('firstName');
    if (!lastName?.trim()) missingFields.push('lastName');
    if (!email?.includes('@')) missingFields.push('email');
    if (!phone?.trim()) missingFields.push('phone');
    if (!date) missingFields.push('date');
    if (!time) missingFields.push('time');
    if (!partySize || partySize < 1) missingFields.push('partySize');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'validation_failed', fields: missingFields },
        { status: 400 },
      );
    }

    // In production: INSERT into reservations table + send confirmation emails via Resend
    console.log('Reservation:', {
      ...body,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
