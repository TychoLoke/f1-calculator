import { NextResponse } from 'next/server';
import { elementsFetch } from '../../../../../lib/elementsClient';

export const dynamic = 'force-dynamic';

const CUSTOMER_BATCH_PATH = '/partner/external/v3/general/customers/batch';
const SERVICE_BATCH_PATH = '/partner/external/v3/general/customers/services/batch';
const TENANTS_WITH_PRODUCTS_PATH = '/partner/external/v3/general/third-party-products/tenants/batch';
const PRODUCT_OVERVIEW_PATH = '/partner/external/v3/general/products/overview';
const BACKUP_OVERVIEW_PATH = '/partner/external/v3/backup/overview';
const BASELINES_PATH = '/partner/external/v3/bm/baselines/batch';
const JOBS_PATH = '/partner/external/v3/jobs/batch';
const SCAN_PROFILES_PATH = '/partner/external/v3/scan-profiles/batch';
const RISK_RULES_PATH = '/partner/external/v3/rm/customers';
const DSPM_INSIGHTS_PATH = '/partner/external/v3/overview/dspm/insights';
const COMPLIANCE_RATE_PATH = '/partner/external/v3/overview/data-protection/compliance-rate';
const RANSOMWARE_PATH = '/partner/external/v3/overview/data-protection/ransomware-detection';

const PAGE_SIZE = 50;

function normalizeArray<T>(payload: unknown): T[] {
  if (payload == null) return [] as T[];

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

  const [customer, services, tenants, products, backupOverview, baselines, jobs, scanProfiles, dspm, compliance, ransomware] =
    await Promise.all([
      safeFetch(
        'Customer profile',
        () =>
          elementsFetch<{ pageIndex: number; pageSize: number; customerIds: string[] }, { items?: Array<{ customerId?: string; customerName?: string; ownerEmail?: string; country?: string; status?: string }> }>(
            CUSTOMER_BATCH_PATH,
            { pageIndex: 1, pageSize: 1, customerIds: [customerId] },
          ),
        errors,
      ),
    safeFetch(
      'Customer services',
      () =>
        elementsFetch<
          { customerId: string },
          { items?: Array<{ serviceName?: string; status?: string; purchasedSeats?: number; assignedSeats?: number; availableSeats?: number; storageGb?: number; retentionDays?: number; expiration?: string }> }
          >(
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
    safeFetch(
      'Scan profiles',
      () =>
        elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: Array<{ id?: string; name?: string; status?: string; lastUpdated?: string; schedule?: string }> }>(
          SCAN_PROFILES_PATH,
          { customerId, pageIndex: 1, pageSize: PAGE_SIZE },
        ),
      errors,
    ),
    safeFetch('DSPM insights', () => elementsFetch<{ customerId: string }, { exposedObjects?: number; hotspots?: number }>(DSPM_INSIGHTS_PATH, { customerId }), errors),
    safeFetch('Compliance rate', () => elementsFetch<{ customerId: string }, { complianceRate?: number }>(COMPLIANCE_RATE_PATH, { customerId }), errors),
    safeFetch('Ransomware detection', () => elementsFetch<{ customerId: string }, { incidents?: number; protectedAssets?: number }>(RANSOMWARE_PATH, { customerId }), errors),
  ]);

  const customerItems = normalizeArray<{ customerId?: string; customerName?: string; ownerEmail?: string; country?: string; status?: string }>(customer ?? undefined);
  const normalizedCustomer = customerItems[0]
    ? {
        id: customerItems[0].customerId ?? customerId,
        name: customerItems[0].customerName ?? 'Customer',
        ownerEmail: customerItems[0].ownerEmail ?? '—',
        country: customerItems[0].country ?? 'Unknown region',
        status: customerItems[0].status ?? 'Unknown',
      }
    : { id: customerId, name: customerId, ownerEmail: '—', country: 'Unknown region', status: 'Unknown' };

  const serviceItems = normalizeArray<{
    serviceName?: string;
    status?: string;
    purchasedSeats?: number;
    assignedSeats?: number;
    availableSeats?: number;
    storageGb?: number;
    retentionDays?: number;
    expiration?: string;
  }>(services ?? undefined);
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

  const normalizedServices = serviceItems.map((service, index) => ({
    id: `${service.serviceName ?? 'service'}-${index + 1}`,
    name: service.serviceName ?? 'Service',
    status: service.status ?? 'Unknown',
    purchasedSeats: typeof service.purchasedSeats === 'number' ? service.purchasedSeats : null,
    assignedSeats: typeof service.assignedSeats === 'number' ? service.assignedSeats : null,
    availableSeats: typeof service.availableSeats === 'number' ? service.availableSeats : null,
    storageGb: typeof service.storageGb === 'number' ? service.storageGb : null,
    retentionDays: typeof service.retentionDays === 'number' ? service.retentionDays : null,
    expiresOn: service.expiration ?? null,
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

  const totalServices = normalizedServices.length;
  const activeServices = normalizedServices.filter((service) => service.status?.toLowerCase?.() === 'active').length;
  const backupCoverageRate = backupProtected && microsoftSeats ? Math.min(100, Math.round((backupProtected / microsoftSeats) * 100)) : null;

  const scanProfileItems = normalizeArray<{ id?: string; name?: string; status?: string; lastUpdated?: string; schedule?: string }>(scanProfiles ?? undefined).map((profile, index) => ({
    id: profile.id ?? `scan-${index + 1}`,
    name: profile.name ?? 'Scan profile',
    status: profile.status ?? 'Unknown',
    lastUpdated: profile.lastUpdated ?? null,
    schedule: profile.schedule ?? 'Not provided',
  }));

  const primaryTenant = normalizedTenants[0];
  const riskRules = await safeFetch(
    'Risk rules',
    () =>
      primaryTenant
        ? elementsFetch<{ } | undefined, { items?: Array<{ id?: string; name?: string; hits?: number; severity?: string }> }>(
            `${RISK_RULES_PATH}/${customerId}/tenants/${primaryTenant.tenantId}/detection/rules`,
            undefined,
            { method: 'GET' },
          )
        : Promise.resolve({ items: [] }),
    errors,
  );

  const riskRuleItems = normalizeArray<{ id?: string; name?: string; hits?: number; severity?: string }>(riskRules ?? undefined).map(
    (rule, index) => ({
      id: rule.id ?? `rule-${index + 1}`,
      name: rule.name ?? 'Rule',
      hits: typeof rule.hits === 'number' ? rule.hits : 0,
      severity: rule.severity ?? 'Unknown',
    }),
  );

  const dspmInsights = {
    exposedObjects: typeof dspm?.exposedObjects === 'number' ? dspm.exposedObjects : null,
    hotspots: typeof dspm?.hotspots === 'number' ? dspm.hotspots : null,
  };

  const workspace = {
    complianceRate: typeof compliance?.complianceRate === 'number' ? compliance.complianceRate : null,
    ransomwareIncidents: typeof ransomware?.incidents === 'number' ? ransomware.incidents : null,
    protectedAssets: typeof ransomware?.protectedAssets === 'number' ? ransomware.protectedAssets : null,
    dspmInsights,
  };

  const payload = {
    customer: normalizedCustomer,
    customerId,
    kpis: {
      tenants: normalizedTenants.length,
      microsoftSeats,
      backupProtected,
      baselines: normalizedBaselines.length,
      jobsFailed,
      services: totalServices,
      activeServices,
      riskRules: riskRuleItems.length,
    },
    products: normalizedProducts,
    tenants: normalizedTenants,
    services: normalizedServices,
    baselines: normalizedBaselines,
    jobs: normalizedJobs,
    backup: {
      coverageRate: backupCoverageRate,
      protectedUsers: backupProtected,
      microsoftSeats,
    },
    scanProfiles: scanProfileItems,
    riskRules: riskRuleItems,
    workspace,
    errors,
  };

  return NextResponse.json(payload);
}
