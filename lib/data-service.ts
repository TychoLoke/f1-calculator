import { elementsFetch } from './elementsClient';

const ENDPOINTS = {
  customersBatch: '/partner/external/v3/general/customers/batch',
  servicesBatch: '/partner/external/v3/general/customers/services/batch',
  tenantsBatch: '/partner/external/v3/general/third-party-products/tenants/batch',
  productsOverview: '/partner/external/v3/general/products/overview',
  backupOverview: '/partner/external/v3/backup/overview',
  baselinesBatch: '/partner/external/v3/bm/baselines/batch',
  jobsBatch: '/partner/external/v3/jobs/batch',
  scanProfiles: '/partner/external/v3/scan-profiles/batch',
  riskRules: '/partner/external/v3/rm/customers',
  dspmInsights: '/partner/external/v3/overview/dspm/insights',
  complianceRate: '/partner/external/v3/overview/data-protection/compliance-rate',
  ransomware: '/partner/external/v3/overview/data-protection/ransomware-detection',
};

export type CustomerSummary = {
  id: string;
  name: string;
  ownerEmail: string;
  region: string;
  status: string;
};

export type ServiceSummary = {
  id: string;
  name: string;
  status: string;
  purchasedSeats: number | null;
  assignedSeats: number | null;
  availableSeats: number | null;
  storageGb: number | null;
  retentionDays: number | null;
  expiresOn: string | null;
};

export type TenantSummary = {
  tenantId: string;
  tenantName: string;
  seats: number;
};

export type BaselineSummary = {
  baselineId: string;
  name: string;
  status: string;
};

export type JobSummary = {
  jobId: string;
  status: string;
  startTime: string;
  endTime?: string;
};

export type ScanProfileSummary = {
  id: string;
  name: string;
  status: string;
  lastUpdated: string | null;
  schedule: string;
};

export type ProductStatus = {
  name: string;
  status: 'active' | 'inactive' | 'unknown';
};

export type RiskRule = {
  id: string;
  name: string;
  hits: number;
  severity: string;
};

export type WorkspaceSignals = {
  complianceRate: number | null;
  ransomwareIncidents: number | null;
  protectedAssets: number | null;
  dspm: { exposedObjects: number | null; hotspots: number | null };
};

export type CustomerOverview = {
  customer: CustomerSummary;
  kpis: {
    tenants: number;
    seats: number;
    protectedUsers: number | null;
    baselines: number;
    jobsFailed: number;
    services: number;
    activeServices: number;
    riskRules: number;
  };
  products: ProductStatus[];
  tenants: TenantSummary[];
  services: ServiceSummary[];
  baselines: BaselineSummary[];
  jobs: JobSummary[];
  backup: { coverageRate: number | null; protectedUsers: number | null; microsoftSeats: number };
  scanProfiles: ScanProfileSummary[];
  riskRules: RiskRule[];
  workspace: WorkspaceSignals;
  lastUpdated: string;
  errors: string[];
};

function normalizeArray<T>(payload: unknown): T[] {
  if (payload == null) return [] as T[];
  const candidate = payload as { items?: T[]; data?: T[] } | T[];
  if (Array.isArray(candidate)) return candidate;
  if (Array.isArray((candidate as { items?: T[] }).items)) return (candidate as { items: T[] }).items;
  if (Array.isArray((candidate as { data?: T[] }).data)) return (candidate as { data: T[] }).data;
  return [] as T[];
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(' ');
}

function normalizeStatus(value?: unknown) {
  if (value == null) return 'Unknown';

  const asString =
    typeof value === 'string'
      ? value
      : Array.isArray(value)
        ? value.join(', ')
        : typeof value === 'object'
          ? JSON.stringify(value)
          : String(value);

  const trimmed = asString.trim();
  if (!trimmed) return 'Unknown';

  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1).toLowerCase()}`;
}

function friendlyCustomerName(customerId: string, index: number) {
  if (!customerId) return `Customer ${index + 1}`;
  const cleaned = customerId.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return `Customer ${index + 1}`;
  return toTitleCase(cleaned);
}

export async function fetchCustomers(pageSize = 200): Promise<{ items: CustomerSummary[]; total: number }> {
  const body = { pageIndex: 1, pageSize };
  const response = await elementsFetch<typeof body, { items?: unknown[]; data?: unknown[]; totalCount?: number }>(
    ENDPOINTS.customersBatch,
    body,
  );

  const items = normalizeArray<{ customerId?: string; customerName?: string; ownerEmail?: string; country?: string; status?: string }>(
    response,
  ).map((customer, index) => ({
    id: customer.customerId ?? `customer-${index + 1}`,
    name: customer.customerName?.trim() || friendlyCustomerName(customer.customerId ?? '', index),
    ownerEmail: customer.ownerEmail ?? '—',
    region: customer.country ?? 'Unknown region',
    status: normalizeStatus(customer.status),
  }));

  return { items, total: typeof response.totalCount === 'number' ? response.totalCount : items.length };
}

async function safeFetch<T>(label: string, request: () => Promise<T>, errors: string[]) {
  try {
    return await request();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    errors.push(`${label}: ${message}`);
    return null;
  }
}

export async function fetchCustomerOverview(customerId: string): Promise<CustomerOverview> {
  const errors: string[] = [];

  const [customer, services, tenants, products, backupOverview, baselines, jobs, scanProfiles, dspm, compliance, ransomware] =
    await Promise.all([
      safeFetch(
        'Customer profile',
        () =>
          elementsFetch<{ pageIndex: number; pageSize: number; customerIds: string[] }, { items?: unknown[] }>(
            ENDPOINTS.customersBatch,
            { pageIndex: 1, pageSize: 1, customerIds: [customerId] },
          ),
        errors,
      ),
      safeFetch(
        'Customer services',
        () =>
          elementsFetch<{ customerId: string }, { items?: unknown[] }>(ENDPOINTS.servicesBatch, { customerId }),
        errors,
      ),
      safeFetch(
        'Tenant list',
        () =>
          elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: unknown[]; totalCount?: number }>(
            ENDPOINTS.tenantsBatch,
            { customerId, pageIndex: 1, pageSize: 100 },
          ),
        errors,
      ),
      safeFetch('Product overview', () => elementsFetch<{ customerId: string }, { items?: unknown[] }>(ENDPOINTS.productsOverview, { customerId }), errors),
      safeFetch('Cloud Backup overview', () => elementsFetch<{ customerId: string }, { protectedUserCount?: number }>(ENDPOINTS.backupOverview, { customerId }), errors),
      safeFetch(
        'Baselines',
        () => elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: unknown[] }>(ENDPOINTS.baselinesBatch, { customerId, pageIndex: 1, pageSize: 100 }),
        errors,
      ),
      safeFetch(
        'Jobs summary',
        () => elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: unknown[] }>(ENDPOINTS.jobsBatch, { customerId, pageIndex: 1, pageSize: 100 }),
        errors,
      ),
      safeFetch(
        'Scan profiles',
        () => elementsFetch<{ customerId: string; pageIndex: number; pageSize: number }, { items?: unknown[] }>(ENDPOINTS.scanProfiles, { customerId, pageIndex: 1, pageSize: 100 }),
        errors,
      ),
      safeFetch('DSPM insights', () => elementsFetch<{ customerId: string }, { exposedObjects?: number; hotspots?: number }>(ENDPOINTS.dspmInsights, { customerId }), errors),
      safeFetch('Compliance rate', () => elementsFetch<{ customerId: string }, { complianceRate?: number }>(ENDPOINTS.complianceRate, { customerId }), errors),
      safeFetch('Ransomware detection', () => elementsFetch<{ customerId: string }, { incidents?: number; protectedAssets?: number }>(ENDPOINTS.ransomware, { customerId }), errors),
    ]);

  const customerItems = normalizeArray<{ customerId?: string; customerName?: string; ownerEmail?: string; country?: string; status?: string }>(customer ?? undefined);
  const normalizedCustomer: CustomerSummary = customerItems[0]
    ? {
        id: customerItems[0].customerId ?? customerId,
        name: customerItems[0].customerName?.trim() || friendlyCustomerName(customerItems[0].customerId ?? customerId, 0),
        ownerEmail: customerItems[0].ownerEmail ?? '—',
        region: customerItems[0].country ?? 'Unknown region',
        status: normalizeStatus(customerItems[0].status),
      }
    : {
        id: customerId,
        name: customerId,
        ownerEmail: '—',
        region: 'Unknown region',
        status: 'Unknown',
      };

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
  const jobItems = normalizeArray<{ jobId?: string; id?: string; status?: string; startTime?: string; startDate?: string; endTime?: string; endDate?: string }>(jobs ?? undefined);
  const scanProfileItems = normalizeArray<{ id?: string; name?: string; status?: string; lastUpdated?: string; schedule?: string }>(scanProfiles ?? undefined);

  const normalizedTenants: TenantSummary[] = tenantItems.map((tenant, index) => ({
    tenantId: tenant.tenantId ?? `tenant-${index + 1}`,
    tenantName: tenant.tenantName ?? 'Unknown tenant',
    seats:
      typeof tenant.seats === 'number'
        ? tenant.seats
        : typeof tenant.licensedUserCount === 'number'
          ? tenant.licensedUserCount
          : 0,
  }));

  const normalizedServices: ServiceSummary[] = serviceItems.map((service, index) => ({
    id: `${service.serviceName ?? 'service'}-${index + 1}`,
    name: service.serviceName ?? 'Service',
    status: normalizeStatus(service.status),
    purchasedSeats: typeof service.purchasedSeats === 'number' ? service.purchasedSeats : null,
    assignedSeats: typeof service.assignedSeats === 'number' ? service.assignedSeats : null,
    availableSeats: typeof service.availableSeats === 'number' ? service.availableSeats : null,
    storageGb: typeof service.storageGb === 'number' ? service.storageGb : null,
    retentionDays: typeof service.retentionDays === 'number' ? service.retentionDays : null,
    expiresOn: service.expiration ?? null,
  }));

  const normalizedBaselines: BaselineSummary[] = baselineItems.map((baseline, index) => ({
    baselineId: baseline.baselineId ?? `baseline-${index + 1}`,
    name: baseline.baselineName ?? baseline.name ?? 'Baseline',
    status: normalizeStatus(baseline.status),
  }));

  const normalizedJobs: JobSummary[] = jobItems.map((job, index) => ({
    jobId: job.jobId ?? job.id ?? `job-${index + 1}`,
    status: normalizeStatus(job.status),
    startTime: job.startTime ?? job.startDate ?? new Date().toISOString(),
    endTime: job.endTime ?? job.endDate ?? undefined,
  }));

  const normalizedScanProfiles: ScanProfileSummary[] = scanProfileItems.map((profile, index) => ({
    id: profile.id ?? `scan-${index + 1}`,
    name: profile.name ?? 'Scan profile',
    status: normalizeStatus(profile.status),
    lastUpdated: profile.lastUpdated ?? null,
    schedule: profile.schedule ?? 'Not provided',
  }));

  const knownProducts = ['Backup', 'Baseline Management', 'User Management', 'Workspace Management'];
  const normalizedProducts: ProductStatus[] = knownProducts.map((name) => {
    const match =
      productItems.find((p) => p.name?.toLowerCase() === name.toLowerCase()) ||
      serviceItems.find((service) => service.serviceName?.toLowerCase() === name.toLowerCase());
    const status = match?.status?.toLowerCase();
    return {
      name,
      status: status === 'active' ? 'active' : status === 'inactive' ? 'inactive' : 'unknown',
    };
  });

  const backupProtected = typeof backupOverview?.protectedUserCount === 'number' ? backupOverview.protectedUserCount : null;
  const microsoftSeats = normalizedTenants.reduce((acc, tenant) => acc + (tenant.seats ?? 0), 0);
  const jobsFailed = normalizedJobs.filter((job) => job.status.toLowerCase().includes('fail')).length;

  const totalServices = normalizedServices.length;
  const activeServices = normalizedServices.filter((service) => service.status.toLowerCase() === 'active').length;
  const backupCoverageRate = backupProtected && microsoftSeats ? Math.min(100, Math.round((backupProtected / microsoftSeats) * 100)) : null;

  const primaryTenant = normalizedTenants[0];
  const riskRulesResponse = await safeFetch(
    'Risk rules',
    () =>
      primaryTenant
        ? elementsFetch<undefined, { items?: unknown[] }>(
            `${ENDPOINTS.riskRules}/${customerId}/tenants/${primaryTenant.tenantId}/detection/rules`,
            undefined,
            { method: 'GET' },
          )
        : Promise.resolve({ items: [] }),
    errors,
  );

  const riskRuleItems = normalizeArray<{ id?: string; name?: string; hits?: number; severity?: string }>(riskRulesResponse ?? undefined).map(
    (rule, index) => ({
      id: rule.id ?? `rule-${index + 1}`,
      name: rule.name ?? 'Rule',
      hits: typeof rule.hits === 'number' ? rule.hits : 0,
      severity: rule.severity ?? 'Unknown',
    }),
  );

  const workspace: WorkspaceSignals = {
    complianceRate: typeof compliance?.complianceRate === 'number' ? compliance.complianceRate : null,
    ransomwareIncidents: typeof ransomware?.incidents === 'number' ? ransomware.incidents : null,
    protectedAssets: typeof ransomware?.protectedAssets === 'number' ? ransomware.protectedAssets : null,
    dspm: {
      exposedObjects: typeof dspm?.exposedObjects === 'number' ? dspm.exposedObjects : null,
      hotspots: typeof dspm?.hotspots === 'number' ? dspm.hotspots : null,
    },
  };

  return {
    customer: normalizedCustomer,
    kpis: {
      tenants: normalizedTenants.length,
      seats: microsoftSeats,
      protectedUsers: backupProtected,
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
    backup: { coverageRate: backupCoverageRate, protectedUsers: backupProtected, microsoftSeats },
    scanProfiles: normalizedScanProfiles,
    riskRules: riskRuleItems,
    workspace,
    lastUpdated: new Date().toISOString(),
    errors,
  };
}
