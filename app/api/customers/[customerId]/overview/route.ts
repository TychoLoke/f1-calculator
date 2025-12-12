import { NextResponse } from 'next/server';
import { elementsFetch } from '../../../../../lib/elementsClient';

export const dynamic = 'force-dynamic';

const SERVICE_BATCH_PATH = '/partner/external/v3/general/services/batch';
const TENANTS_WITH_PRODUCTS_PATH = '/partner/external/v3/general/third-party-products/tenants/batch';
const PRODUCT_OVERVIEW_PATH = '/partner/external/v3/general/products/overview';
const BACKUP_OVERVIEW_PATH = '/partner/external/v3/backup/overview';
const BASELINES_PATH = '/partner/external/v3/bm/baselines/batch';
const JOBS_PATH = '/partner/external/v3/jobs/batch';

const PAGE_SIZE = 50;

function normalizeArray<T>(payload: unknown): T[] {
  const candidate = payload as { items?: T[]; data?: T[] } | T[];
  if (Array.isArray(candidate)) return candidate;
  if (Array.isArray((candidate as { items?: T[] }).items)) return (candidate as { items: T[] }).items;
  if (Array.isArray((candidate as { data?: T[] }).data)) return (candidate as { data: T[] }).data;
  return [] as T[];
}

async function safeFetch<T>(label: string, request: () => Promise<T>, errors: string[]): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`${label}: ${message}`);
    return null;
  }
}

export async function GET(_: Request, { params }: { params: { customerId: string } }) {
  const { customerId } = params;
  const errors: string[] = [];

  const [services, tenants, products, backupOverview, baselines, jobs] = await Promise.all([
    safeFetch(
      'Customer services',
      () =>
        elementsFetch<{ customerId: string }, { items?: Array<{ serviceName?: string; status?: string }> }>(
          SERVICE_BATCH_PATH,
          { customerId },
        ),
      errors,
    ),
    safeFetch(
      'Tenant list',
      () =>
        elementsFetch<
          { customerId: string; pageIndex: number; pageSize: number },
          { items?: Array<{ tenantId?: string; tenantName?: string; seats?: number; licensedUserCount?: number }>; totalCount?: number }
        >(TENANTS_WITH_PRODUCTS_PATH, { customerId, pageIndex: 1, pageSize: PAGE_SIZE }),
      errors,
    ),
    safeFetch('Product overview', () => elementsFetch<{ customerId: string }, { items?: Array<{ name?: string; status?: string }> }>(PRODUCT_OVERVIEW_PATH, { customerId }), errors),
    safeFetch('Cloud Backup overview', () => elementsFetch<{ customerId: string }, { protectedUserCount?: number }>(BACKUP_OVERVIEW_PATH, { customerId }), errors),
    safeFetch(
      'Baselines',
      () =>
        elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: Array<{ baselineId?: string; baselineName?: string; name?: string; status?: string }> }>(
          BASELINES_PATH,
          { customerId, pageIndex: 1, pageSize: PAGE_SIZE },
        ),
      errors,
    ),
    safeFetch(
      'Jobs summary',
      () =>
        elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: Array<{ jobId?: string; id?: string; status?: string; startTime?: string; startDate?: string; endTime?: string; endDate?: string }> }>(
          JOBS_PATH,
          { customerId, pageIndex: 1, pageSize: PAGE_SIZE },
        ),
      errors,
    ),
  ]);

  const serviceItems = normalizeArray<{ serviceName?: string; status?: string }>(services ?? undefined);
  const tenantItems = normalizeArray<{ tenantId?: string; tenantName?: string; seats?: number; licensedUserCount?: number }>(tenants ?? undefined);
  const productItems = normalizeArray<{ name?: string; status?: string }>(products ?? undefined);
  const baselineItems = normalizeArray<{ baselineId?: string; baselineName?: string; name?: string; status?: string }>(baselines ?? undefined);
  const jobItems = normalizeArray<{
    jobId?: string;
    id?: string;
    status?: string;
    startTime?: string;
    startDate?: string;
    endTime?: string;
    endDate?: string;
  }>(jobs ?? undefined);

  const normalizedTenants = tenantItems.map((tenant, index) => ({
    tenantId: tenant.tenantId ?? `tenant-${index + 1}`,
    tenantName: tenant.tenantName ?? 'Unknown tenant',
    seats: typeof tenant.seats === 'number' ? tenant.seats : typeof tenant.licensedUserCount === 'number' ? tenant.licensedUserCount : 0,
  }));

  const normalizedBaselines = baselineItems.map((baseline, index) => ({
    baselineId: baseline.baselineId ?? `baseline-${index + 1}`,
    name: baseline.baselineName ?? baseline.name ?? 'Baseline',
    status: baseline.status ?? 'Unknown',
  }));

  const normalizedJobs = jobItems.map((job, index) => ({
    jobId: job.jobId ?? job.id ?? `job-${index + 1}`,
    status: job.status ?? 'Unknown',
    startTime: job.startTime ?? job.startDate ?? new Date().toISOString(),
    endTime: job.endTime ?? job.endDate ?? undefined,
  }));

  const knownProducts = ['Backup', 'Baseline Management', 'User Management', 'Workspace Management'];
  const normalizedProducts = knownProducts.map((name) => {
    const match = productItems.find((p) => p.name?.toLowerCase() === name.toLowerCase()) ||
      serviceItems.find((service) => service.serviceName?.toLowerCase() === name.toLowerCase());
    return {
      name,
      status: (match?.status?.toLowerCase() as 'active' | 'inactive' | 'unknown') ?? 'unknown',
    };
  });

  const backupProtected = typeof backupOverview?.protectedUserCount === 'number' ? backupOverview.protectedUserCount : null;
  const microsoftSeats = normalizedTenants.reduce((acc, tenant) => acc + (tenant.seats ?? 0), 0);
  const jobsFailed = normalizedJobs.filter((job) => job.status?.toLowerCase?.().includes('fail')).length;

  const payload = {
    customerId,
    kpis: {
      tenants: normalizedTenants.length,
      microsoftSeats,
      backupProtected,
      baselines: normalizedBaselines.length,
      jobsFailed,
    },
    products: normalizedProducts,
    tenants: normalizedTenants,
    baselines: normalizedBaselines,
    jobs: normalizedJobs,
    errors,
  };

  return NextResponse.json(payload);
}
