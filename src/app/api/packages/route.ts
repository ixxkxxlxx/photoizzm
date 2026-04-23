import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const { data: packages, error } = await supabase
      .from('packages')
      .select('*')
      .eq('is_active', 1)
      .order('price', { ascending: true })

    if (error) throw error

    return NextResponse.json(packages || []);
  } catch (error) {
    console.error('Fetch packages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packages' },
      { status: 500 }
    );
  }
}