import { NextResponse } from 'next/server';
import { callElementsApi, normalizeItems } from '../_utils/avepoint';

type Baseline = {
  baselineId?: string;
  baselineName?: string;
  status?: string;
  [key: string]: unknown;
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await callElementsApi<Record<string, unknown>>(
      '/partner/external/v3/bm/baselines/batch',
      {
        pageIndex: 1,
        pageSize: 50,
      },
    );

    const items = normalizeItems<Baseline>(response);
    const totalCount =
      typeof (response as { totalCount?: number }).totalCount === 'number'
        ? (response as { totalCount?: number }).totalCount
        : items.length;

    return NextResponse.json({ items, totalCount });
  } catch (error) {
    console.error('Failed to fetch baselines', error);
    return NextResponse.json({ items: [], error: 'Unable to fetch baselines' }, { status: 500 });
  }
}
