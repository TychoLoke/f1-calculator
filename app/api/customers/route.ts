import { NextResponse } from 'next/server';
import { fetchCustomers } from '../../../lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchCustomers();
    return NextResponse.json({ items: data.items, totalCount: data.total, lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.error('Failed to fetch customers batch', error);
    return NextResponse.json({ items: [], totalCount: 0, error: 'Unable to fetch customers' }, { status: 500 });
  }
}
