import { NextResponse } from 'next/server';
import { fetchCustomerOverview } from '../../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { customerId: string } }) {
  const { customerId } = params;

  try {
    const overview = await fetchCustomerOverview(customerId);
    return NextResponse.json(overview);
  } catch (error) {
    console.error(`Failed to build overview for ${customerId}`, error);
    return NextResponse.json({ error: 'Unable to load customer overview', customerId }, { status: 500 });
  }
}
