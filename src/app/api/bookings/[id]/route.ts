import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendBookingConfirmedNotification, type BookingEmailData } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      status,
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
      transportationFee,
      totalPrice 
    } = body;

    const updateData: Record<string, unknown> = {};
    
    if (status !== undefined) updateData.status = status;
    if (customerName !== undefined) updateData.customer_name = customerName;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (packageName !== undefined) updateData.package_name = packageName;
    if (university !== undefined) updateData.university = university;
    if (date !== undefined) updateData.date = new Date(date).toISOString();
    if (time !== undefined) updateData.time = time;
    if (location !== undefined) updateData.location = location;
    if (pax !== undefined) updateData.pax = pax;
    if (notes !== undefined) updateData.notes = notes;
    if (transportationFee !== undefined) updateData.transportation_fee = Number(transportationFee);
    if (totalPrice !== undefined) updateData.total_price = Number(totalPrice);

    const { data: booking, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update booking error:', error);
      throw error;
    }

    if (status === 'confirmed') {
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
        await sendBookingConfirmedNotification(emailData);
      } catch (emailError) {
        console.error('Confirmation email error:', emailError);
      }
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Booking deleted' });
  } catch (error) {
    console.error('Delete booking error:', error);
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    );
  }
}