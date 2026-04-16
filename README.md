# Convo Photography Booking

A modern photography booking system built with Next.js 14, featuring a customer booking form and admin dashboard.

## Features

- **Customer Booking Form**: Easy-to-use form for clients to book photography sessions
- **Admin Dashboard**: Manage bookings, view statistics, and update booking status
- **Authentication**: Secure admin login with NextAuth.js
- **Package Management**: Multiple photography packages with pricing
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
```

3. Seed the database with admin user and sample data:
```bash
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

- **URL**: http://localhost:3000/admin/login
- **Email**: admin@convo.com
- **Password**: admin123

## Project Structure

```
convo-booking/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeder
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── admin/         # Admin pages
│   │   ├── booking/       # Booking form
│   │   └── page.tsx       # Landing page
│   ├── components/        # Reusable components
│   └── lib/               # Utilities
├── .env                   # Environment variables
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

## Booking Statuses

- **Pending**: New booking awaiting confirmation
- **Confirmed**: Booking confirmed by admin
- **Completed**: Session completed
- **Cancelled**: Booking cancelled

## License

MIT
