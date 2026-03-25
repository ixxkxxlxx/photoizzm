import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      packageName,
      university,
      date,
      time,
      location,
      pax,
      notes,
      totalPrice,
    } = body;

    const booking = await prisma.booking.create({
      data: {
        customerName,
        email,
        phone,
        packageName,
        university: university || "",
        date: new Date(date),
        time,
        location,
        pax: pax ? Number(pax) : null,
        notes: notes || null,
        totalPrice,
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
