import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await prisma.booking.findMany({
      where: {
        date: { gte: today },
        status: { in: ['pending', 'confirmed'] },
      },
      orderBy: { date: 'asc' },
      take: 5,
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Upcoming bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming bookings' },
      { status: 500 }
    );
  }
}
