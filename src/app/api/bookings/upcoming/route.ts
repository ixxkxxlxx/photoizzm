import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('date', today.toISOString())
      .in('status', ['pending', 'confirmed'])
      .order('date', { ascending: true })
      .limit(5)

    if (error) throw error

    return NextResponse.json(bookings || []);
  } catch (error) {
    console.error('Upcoming bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming bookings' },
      { status: 500 }
    );
  }
}