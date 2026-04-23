import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendBookingNotification, type BookingEmailData } from '@/lib/email';

const CATEGORY_PREFIX: Record<string, string> = {
  convocation: 'CONV',
  engagement: 'ENG',
  wedding: 'WED',
}

export const dynamic = 'force-dynamic';

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

    const { data: existingBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('category', resolvedCategory)
    
    const count = existingBookings?.length ?? 0
    const prefix = CATEGORY_PREFIX[resolvedCategory] ?? 'BKG'
    const id = `${prefix}-${String(count + 1).padStart(3, '0')}`

    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        id,
        category: resolvedCategory,
        customer_name: customerName,
        email,
        phone,
        package_name: packageName,
        university: university || '',
        date: new Date(date).toISOString(),
        time,
        location,
        pax: pax ? Number(pax) : null,
        notes: notes || null,
        total_price: totalPrice,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    try {
      const emailData: BookingEmailData = {
        id: booking.id,
        category: booking.category,
        customerName: booking.customer_name,
        email: booking.email,
        phone: booking.phone,
        packageName: booking.package_name,
        university: booking.university,
        date: new Date(booking.date).toLocaleDateString('ms-MY'),
        time: booking.time,
        location: booking.location,
        pax: booking.pax,
        notes: booking.notes,
        totalPrice: booking.total_price,
      };
      await sendBookingNotification(emailData);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

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
    console.log('Fetching bookings from Supabase...')
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    console.log('Bookings result:', { count: bookings?.length, error })

    if (error) throw error

    return NextResponse.json(bookings || []);
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}