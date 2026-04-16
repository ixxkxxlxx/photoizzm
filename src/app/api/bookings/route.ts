import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CATEGORY_PREFIX: Record<string, string> = {
  convocation: 'CONV',
  engagement: 'ENG',
  wedding: 'WED',
}

async function generateBookingId(category: string): Promise<string> {
  const prefix = CATEGORY_PREFIX[category] ?? 'BKG'

  // Count all bookings for this category to get the next sequence number
  const count = await prisma.booking.count({
    where: { category },
  })

  const seq = String(count + 1).padStart(3, '0')
  return `${prefix}-${seq}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category,
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

    const resolvedCategory = category || 'convocation'

    // Generate ID and create booking in a transaction to prevent race conditions
    const booking = await prisma.$transaction(async (tx) => {
      const count = await tx.booking.count({ where: { category: resolvedCategory } })
      const prefix = CATEGORY_PREFIX[resolvedCategory] ?? 'BKG'
      const id = `${prefix}-${String(count + 1).padStart(3, '0')}`

      return tx.booking.create({
        data: {
          id,
          category: resolvedCategory,
          customerName,
          email,
          phone,
          packageName,
          university: university || '',
          date: new Date(date),
          time,
          location,
          pax: pax ? Number(pax) : null,
          notes: notes || null,
          totalPrice,
        },
      })
    })

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
