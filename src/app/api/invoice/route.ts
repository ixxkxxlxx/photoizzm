import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const bookingNumber = searchParams.get('bookingNumber');

  if (!bookingNumber) {
    return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
  }

  try {
    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingNumber)
      .single();

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('INVOICE', {
      x: 50,
      y: height - 80,
      size: 28,
      font: fontBold,
      color: rgb(0.13, 0.13, 0.13),
    });

    page.drawText(`Booking No: ${booking.id}`, {
      x: width - 200,
      y: height - 80,
      size: 10,
      font: font,
    });

    page.drawText('PHOTOIZZM Photography', {
      x: 50,
      y: height - 110,
      size: 12,
      font: fontBold,
      color: rgb(0.13, 0.13, 0.13),
    });

    page.drawText('Email: izz@photoizzm.my', {
      x: 50,
      y: height - 125,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText('Phone: +60 11-1422 7957', {
      x: 50,
      y: height - 140,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    const dateStr = new Date().toLocaleDateString('en-MY', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    page.drawText(`Date: ${dateStr}`, {
      x: width - 200,
      y: height - 95,
      size: 10,
      font: font,
    });

    page.drawLine({
      start: { x: 50, y: height - 160 },
      end: { x: width - 50, y: height - 160 },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText('Bill To:', {
      x: 50,
      y: height - 190,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText(booking.customer_name, {
      x: 50,
      y: height - 205,
      size: 12,
      font: fontBold,
      color: rgb(0.13, 0.13, 0.13),
    });

    page.drawText(booking.email, {
      x: 50,
      y: height - 220,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText(booking.phone, {
      x: 50,
      y: height - 235,
      size: 10,
      font: font,
      color: rgb(0.4, 0.4, 0.4),
    });

    page.drawText('Booking Details:', {
      x: 50,
      y: height - 280,
      size: 10,
      font: fontBold,
      color: rgb(0.5, 0.5, 0.5),
    });

    const details = [
      ['Category:', booking.category.charAt(0).toUpperCase() + booking.category.slice(1)],
      ['Package:', booking.package_name],
      ['Date:', new Date(booking.date).toLocaleDateString('en-MY')],
      ['Time:', booking.time || 'Not specified'],
      ['Location:', booking.location],
      ...(booking.university ? [['University:', booking.university]] : []),
      ...(booking.pax ? [['Pax:', booking.pax.toString()]] : []),
    ];

    let yPos = height - 300;
    details.forEach(([label, value]) => {
      page.drawText(label, {
        x: 50,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText(value, {
        x: 150,
        y: yPos,
        size: 10,
        font: font,
        color: rgb(0.13, 0.13, 0.13),
      });
      yPos -= 18;
    });

    if (booking.notes) {
      page.drawText('Notes:', {
        x: 50,
        y: yPos + 10,
        size: 10,
        font: fontBold,
        color: rgb(0.5, 0.5, 0.5),
      });
      page.drawText(booking.notes, {
        x: 50,
        y: yPos - 5,
        size: 10,
        font: font,
        color: rgb(0.4, 0.4, 0.4),
        maxWidth: 300,
      });
    }

    yPos = height - 480;
    page.drawLine({
      start: { x: 50, y: yPos },
      end: { x: width - 50, y: yPos },
      thickness: 1,
      color: rgb(0.85, 0.85, 0.85),
    });

    page.drawText('Total:', {
      x: 50,
      y: yPos - 25,
      size: 14,
      font: fontBold,
      color: rgb(0.13, 0.13, 0.13),
    });

    page.drawText(`RM ${Number(booking.total_price).toFixed(2)}`, {
      x: width - 150,
      y: yPos - 25,
      size: 14,
      font: fontBold,
      color: rgb(0.13, 0.13, 0.13),
    });

    const statusColor = booking.status === 'confirmed' ? rgb(0, 0.6, 0) : 
                       booking.status === 'completed' ? rgb(0, 0.5, 0.8) :
                       booking.status === 'cancelled' ? rgb(0.8, 0, 0) : rgb(0.8, 0.6, 0);

    page.drawText(`Status: ${booking.status.toUpperCase()}`, {
      x: 50,
      y: yPos - 50,
      size: 10,
      font: fontBold,
      color: statusColor,
    });

    page.drawText('Thank you for your business!', {
      x: 50,
      y: 50,
      size: 10,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });

    page.drawText('PHOTOIZZM Photography - Based in Puncak Alam, Setia Alam, Shah Alam', {
      x: 50,
      y: 35,
      size: 8,
      font: font,
      color: rgb(0.6, 0.6, 0.6),
    });

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Invoice-${booking.customer_name.replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}