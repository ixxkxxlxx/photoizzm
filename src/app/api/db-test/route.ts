import { NextResponse } from 'next/server';
import { turso } from '@/lib/turso';

export const POST = async () => {
  try {
    // Check if environment variables are set
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      return NextResponse.json(
        { error: 'Missing Turso environment variables (TURSO_DATABASE_URL or TURSO_AUTH_TOKEN)' },
        { status: 400 }
      );
    }

    // Fetch data from SQLite / Execute a query
    // This will create a 'todos' table if the connection is successful
    const result = await turso.execute("CREATE TABLE IF NOT EXISTS todos (description TEXT);");
    
    return NextResponse.json({ 
      success: true, 
      message: 'Table created or already exists', 
      result 
    });
  } catch (error: any) {
    console.error('Turso DB error:', error);
    return NextResponse.json(
      { error: 'Database operation failed', message: error.message },
      { status: 500 }
    );
  }
};
