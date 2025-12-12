import { NextResponse } from 'next/server';
import { callElementsApi, normalizeItems } from '../_utils/avepoint';

type Customer = {
  customerId?: string;
  customerName?: string;
  [key: string]: unknown;
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await callElementsApi<Record<string, unknown>>(
      '/partner/external/v3/general/customers/batch',
      {
        pageIndex: 1,
        pageSize: 50,
      },
    );

    const items = normalizeItems<Customer>(response);
    const totalCount =
      typeof (response as { totalCount?: number }).totalCount === 'number'
        ? (response as { totalCount?: number }).totalCount
        : items.length;

    return NextResponse.json({ items, totalCount });
  } catch (error) {
    console.error('Failed to fetch customers', error);
    return NextResponse.json({ items: [], error: 'Unable to fetch customers' }, { status: 500 });
  }
}
