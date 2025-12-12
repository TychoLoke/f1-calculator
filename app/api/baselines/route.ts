import { NextResponse } from 'next/server';
import { MissingEnvError, elementsFetch } from '../../../lib/elementsClient';

type Baseline = {
  baselineId?: string;
  baselineName?: string;
  status?: string;
  [key: string]: unknown;
};

type BaselineBatchResponse = {
  items?: Baseline[];
  data?: Baseline[];
  totalCount?: number;
};

const BASELINES_PATH = '/partner/external/v3/bm/baselines/batch';
const PAGE_SIZE = 100;

export const dynamic = 'force-dynamic';

function extractItems(payload: BaselineBatchResponse) {
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  return [] as Baseline[];
}

export async function GET() {
  try {
    const requestBody = { pageIndex: 1, pageSize: PAGE_SIZE };
    const response = await elementsFetch<typeof requestBody, BaselineBatchResponse>(BASELINES_PATH, requestBody);

    const items = extractItems(response);
    const totalCount = typeof response.totalCount === 'number' ? response.totalCount : items.length;

    return NextResponse.json({ items, totalCount });
  } catch (error) {
    console.error('Failed to fetch baselines batch', error);

    if (error instanceof MissingEnvError) {
      return NextResponse.json({ items: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: [], error: 'Unable to fetch baselines' }, { status: 500 });
  }
}
