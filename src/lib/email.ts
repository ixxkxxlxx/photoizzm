import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface BookingEmailData {
  id: string;
  category: string;
  customerName: string;
  email: string;
  phone: string;
  packageName: string;
  university: string;
  date: string;
  time: string;
  location: string;
  pax: number | null;
  notes: string | null;
  totalPrice: number;
}

export async function sendBookingNotification(booking: BookingEmailData) {
  const categoryTitles: Record<string, string> = {
    convocation: 'Convocation',
    engagement: 'Engagement',
    wedding: 'Wedding',
  };

  const adminEmail = process.env.ADMIN_EMAIL || 'izz@photoizzm.my';
  const FROM_EMAIL = process.env.FROM_EMAIL || 'PHOTOIZZM <izz@photoizzm.my>';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a1a;">New Booking Received! 📸</h2>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Category:</strong> ${categoryTitles[booking.category] || booking.category}</p>
        <p><strong>Package:</strong> ${booking.packageName}</p>
      </div>

      <h3 style="color: #333;">Customer Details</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.email}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.phone}</td>
        </tr>
        ${booking.university ? `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>University:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.university}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Time:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.time}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Location:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.location}</td>
        </tr>
        ${booking.pax ? `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Pax:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.pax}</td>
        </tr>` : ''}
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Price:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">RM ${booking.totalPrice}</td>
        </tr>
        ${booking.notes ? `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Notes:</strong></td>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${booking.notes}</td>
        </tr>` : ''}
      </table>

      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        This is an automated notification from PHOTOIZZM Booking System.
      </p>
    </div>
  `;

  const customerHtmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #1a1a1a;">Thank you for your booking! 📸</h2>
      
      <p>Hi ${booking.customerName},</p>
      
      <p>We have received your booking request. Here are the details:</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Category:</strong> ${categoryTitles[booking.category] || booking.category}</p>
        <p><strong>Package:</strong> ${booking.packageName}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Total Price:</strong> RM ${booking.totalPrice}</p>
      </div>

      <p>We will contact you soon to confirm the booking.</p>
      
      <p>Best regards,<br/>PHOTOIZZM Photography</p>
    </div>
  `;

  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email notifications');
    return { success: false, skipped: true };
  }

  const results = await Promise.allSettled([
    resend.emails.send({
      from: FROM_EMAIL,
      to: [adminEmail],
      subject: `New Booking: ${booking.category} - ${booking.id}`,
      html: htmlContent,
    }),
    resend.emails.send({
      from: FROM_EMAIL,
      to: [booking.email],
      subject: 'Thank you for your booking! - PHOTOIZZM',
      html: customerHtmlContent,
    }),
  ]);

  const hasError = results.some(r => r.status === 'rejected');
  
  if (hasError) {
    console.error('Email sending errors:', results);
    throw new Error('Failed to send email notifications');
  }

  return { success: true };
}

export async function sendBookingConfirmedNotification(booking: BookingEmailData) {
  const categoryTitles: Record<string, string> = {
    convocation: 'Convocation',
    engagement: 'Engagement',
    wedding: 'Wedding',
  };

  const FROM_EMAIL = process.env.FROM_EMAIL || 'PHOTOIZZM <izz@photoizzm.my>';

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #22c55e;">✅ Your Booking is Confirmed! 📸</h2>
      
      <p>Hi ${booking.customerName},</p>
      
      <p>We are happy to inform you that your booking has been <strong>confirmed</strong>!</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Category:</strong> ${categoryTitles[booking.category] || booking.category}</p>
        <p><strong>Package:</strong> ${booking.packageName}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Total Price:</strong> RM ${booking.totalPrice}</p>
      </div>

      <p>We look forward to capturing your special moments!</p>
      
      <p>Best regards,<br/>PHOTOIZZM Photography</p>
      
      <p style="margin-top: 20px; color: #666; font-size: 12px;">
        This is an automated notification from PHOTOIZZM Booking System.
      </p>
    </div>
  `;

  if (!resend) {
    console.warn('RESEND_API_KEY not configured, skipping email notifications');
    return { success: false, skipped: true };
  }

  const result = await resend.emails.send({
    from: FROM_EMAIL,
    to: [booking.email],
    subject: `Booking Confirmed - ${booking.id} - PHOTOIZZM`,
    html: htmlContent,
  });

  if (result.error) {
    console.error('Email sending error:', result.error);
    throw new Error('Failed to send confirmation email');
  }

  return { success: true, data: result.data };
}