import { NextResponse } from 'next/server';
import { elementsFetch } from '../../../lib/elementsClient';

type Customer = {
  customerId?: string;
  customerName?: string;
  name?: string;
  [key: string]: unknown;
};

type CustomerBatchResponse = {
  items?: Customer[];
  data?: Customer[];
  totalCount?: number;
};

const CUSTOMERS_PATH = '/partner/external/v3/general/customers/batch';
const PAGE_SIZE = 100;

export const dynamic = 'force-dynamic';

function extractItems(payload: CustomerBatchResponse) {
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [] as Customer[];
}

export async function GET() {
  try {
    const requestBody = { pageIndex: 1, pageSize: PAGE_SIZE };
    const response = await elementsFetch<typeof requestBody, CustomerBatchResponse>(CUSTOMERS_PATH, requestBody);

    const items = extractItems(response);
    const totalCount = typeof response.totalCount === 'number' ? response.totalCount : items.length;

    return NextResponse.json({ items, totalCount });
  } catch (error) {
    console.error('Failed to fetch customers batch', error);
    return NextResponse.json({ items: [], error: 'Unable to fetch customers' }, { status: 500 });
  }
}
