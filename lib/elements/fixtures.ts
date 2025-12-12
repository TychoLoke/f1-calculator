import path from 'path';
import { customerFolder, exportRoot, listCustomerFolder, listFolderContents, readJsonFromExport } from './files';

type CustomerBatch = {
  data?: Array<{
    id?: string;
    organization?: string;
    ownerEmail?: string;
    jobStatus?: number | string;
    countryOrRegion?: string;
    tenants?: Array<{ id?: string; name?: string }>;
  }>;
};

type ServicesBatch = {
  data?: Array<{
    customerId?: string;
    organization?: string;
    customer?: string;
    products?: Array<Record<string, unknown>>;
  }>;
};

type BaselinesBatch = {
  data?: Array<{
    baselineId?: string;
    baselineName?: string;
    status?: number | string;
  }>;
};

type BackupOverview = {
  data?: Array<{
    customerId?: string;
    customer?: string;
    serviceType?: string;
    serviceModule?: string;
    totalScannedObjects?: number | string;
    totalProtectedObjects?: number | string;
    dataSizeStoredInAvePoint?: string | number;
    dataSizeStoredInBYOS?: string | number;
  }>;
};

type JobsPage = {
  data?: Array<{
    jobId?: string;
    status?: number | string;
    jobModule?: number | string;
    startTime?: string;
    endTime?: string;
    jobDuration?: string;
    backupSize?: string | number;
    name?: string;
  }>;
};

export type ElementsCustomer = {
  id: string;
  organization: string;
  ownerEmail: string;
  region: string;
  status: string;
  tenants: { id: string; name: string }[];
};

export type ElementsService = {
  customerId: string;
  organization: string;
  service: string;
  status: string;
  purchasedSeats: number | null;
  assignedSeats: number | null;
  availableSeats: number | null;
  storageGb: number | null;
  retentionDays: number | null;
  expiresOn: string | null;
};

export type ElementsBaseline = {
  baselineId: string;
  name: string;
  status: string;
};

export type BackupModule = {
  customerId: string;
  serviceType: string;
  module: string;
  totalScannedObjects: number | null;
  totalProtectedObjects: number | null;
  storedAvePointGb: number | null;
  storedByosGb: number | null;
};

export type JobRecord = {
  customerId: string;
  jobId: string;
  status: string;
  jobModule: string;
  startTime: string | null;
  endTime: string | null;
  backupSizeGb: number | null;
  duration: string | null;
};

type LoadResult<T> = {
  errors: string[];
  items: T[];
  exportPath?: string;
  exportExists?: boolean;
  contents?: string[];
};

const statusLookup: Record<string, string> = {
  '0': 'Pending',
  '1': 'Running',
  '2': 'Succeeded',
  '3': 'Failed',
  '4': 'Warning',
  '5': 'Ready',
};

function normalizeString(value: unknown): string | null {
  if (value == null) return null;
  const asString = String(value).trim();
  if (!asString || asString.toLowerCase() === 'n/a') return null;
  return asString;
}

function toNumber(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed || trimmed.toLowerCase() === 'n/a') return null;
    const numeric = Number(trimmed.replace(/,/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

function parseGb(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const match = value.match(/(-?[0-9]+(?:\.[0-9]+)?)/);
    if (match) {
      const numeric = Number(match[1]);
      return Number.isFinite(numeric) ? numeric : null;
    }
  }
  return null;
}

function mapStatus(value: unknown, fallback = 'Unknown') {
  const normalized = normalizeString(value);
  if (!normalized) return fallback;
  const fromLookup = statusLookup[normalized];
  if (fromLookup) return fromLookup;
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && statusLookup[String(numeric)]) {
    return statusLookup[String(numeric)];
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function ensureExportPresence<T>(segments: string[], result: LoadResult<T>): LoadResult<T> {
  const exportContents = listFolderContents(exportRoot);
  const exportExists = exportContents.length > 0;

  if (!result.items.length && result.errors.length > 0) {
    result.exportPath = path.join(exportRoot, ...segments);
    result.exportExists = exportExists;
    result.contents = exportContents;
  }
  return result;
}

export function getCustomers(): LoadResult<ElementsCustomer> {
  const errors: string[] = [];
  const { data, error } = readJsonFromExport<CustomerBatch>('customers.batch.json');
  if (error) errors.push(error);

  const items = (data?.data ?? []).map((customer, index): ElementsCustomer => {
    const id = customer.id ?? `customer-${index + 1}`;
    return {
      id,
      organization: normalizeString(customer.organization) ?? 'Unknown organization',
      ownerEmail: normalizeString(customer.ownerEmail) ?? 'Unknown owner',
      region: normalizeString(customer.countryOrRegion) ?? 'Unknown region',
      status: mapStatus(customer.jobStatus),
      tenants: (customer.tenants ?? []).map((tenant, tenantIndex) => ({
        id: normalizeString(tenant.id) ?? `${id}-tenant-${tenantIndex + 1}`,
        name: normalizeString(tenant.name) ?? 'Tenant',
      })),
    };
  });

  return ensureExportPresence(['customers.batch.json'], { errors, items } as LoadResult<ElementsCustomer>);
}

export function getServices(): LoadResult<ElementsService> {
  const errors: string[] = [];
  const { data, error } = readJsonFromExport<ServicesBatch>('services.batch.json');
  if (error) errors.push(error);

  const items: ElementsService[] = [];

  (data?.data ?? []).forEach((customerServices) => {
    const customerId = normalizeString(customerServices.customerId) ?? 'unknown-customer';
    (customerServices.products ?? []).forEach((product) => {
      const purchasedSeats = toNumber(product.purchasedUserSeats);
      const assignedSeats = toNumber((product as { microsoftLicenseAssigned?: unknown }).microsoftLicenseAssigned);
      const availableSeats = toNumber((product as { microsoftLicenseAvailable?: unknown }).microsoftLicenseAvailable);
      const storageGb = parseGb((product as { storage?: unknown }).storage);
      const retentionDays = toNumber((product as { retention?: unknown }).retention);
      const serviceName = normalizeString(product.service) ?? 'Service';

      items.push({
        customerId,
        organization: normalizeString(customerServices.organization) ?? 'Unknown organization',
        service: serviceName,
        status: purchasedSeats && purchasedSeats > 0 ? 'Active' : 'Provisioned',
        purchasedSeats,
        assignedSeats,
        availableSeats,
        storageGb,
        retentionDays,
        expiresOn: normalizeString((product as { expirationDate?: unknown }).expirationDate),
      });
    });
  });

  return ensureExportPresence(['services.batch.json'], { errors, items } as LoadResult<ElementsService>);
}

export function getBaselines(): LoadResult<ElementsBaseline> {
  const errors: string[] = [];
  const { data, error } = readJsonFromExport<BaselinesBatch>('baselines.batch.json');
  if (error) errors.push(error);

  const items = (data?.data ?? []).map((baseline, index): ElementsBaseline => ({
    baselineId: normalizeString(baseline.baselineId) ?? `baseline-${index + 1}`,
    name: normalizeString(baseline.baselineName) ?? 'Baseline',
    status: mapStatus(baseline.status),
  }));

  return ensureExportPresence(['baselines.batch.json'], { errors, items } as LoadResult<ElementsBaseline>);
}

export function getCustomerBackup(customerId: string): LoadResult<BackupModule> {
  const errors: string[] = [];
  const { data, error } = readJsonFromExport<BackupOverview>(`customer_${customerId}`, 'backup.overview.json');
  if (error) errors.push(error);

  const items = (data?.data ?? []).map((entry): BackupModule => ({
    customerId: customerId,
    serviceType: normalizeString(entry.serviceType) ?? 'Backup',
    module: normalizeString(entry.serviceModule) ?? 'Module',
    totalScannedObjects: toNumber(entry.totalScannedObjects),
    totalProtectedObjects: toNumber(entry.totalProtectedObjects),
    storedAvePointGb: parseGb(entry.dataSizeStoredInAvePoint),
    storedByosGb: parseGb(entry.dataSizeStoredInBYOS),
  }));

  const folderPath = customerFolder(customerId);
  return ensureExportPresence(
    [path.relative(exportRoot, path.join(folderPath, 'backup.overview.json'))],
    { errors, items, contents: listCustomerFolder(customerId) } as LoadResult<BackupModule>,
  );
}

export function getCustomerJobs(customerId: string): LoadResult<JobRecord> {
  const errors: string[] = [];
  const { data, error } = readJsonFromExport<JobsPage>(`customer_${customerId}`, 'jobs.page1.json');
  if (error) errors.push(error);

  const items = (data?.data ?? [])
    .map((entry) => ({
      customerId,
      jobId: normalizeString(entry.jobId),
      status: mapStatus(entry.status),
      jobModule: normalizeString(entry.jobModule) ?? 'Module',
      startTime: normalizeString(entry.startTime),
      endTime: normalizeString(entry.endTime),
      backupSizeGb: parseGb(entry.backupSize),
      duration: normalizeString(entry.jobDuration),
    }))
    .filter((entry) => Boolean(entry.jobId))
    .map((entry) => ({ ...entry, jobId: entry.jobId ?? 'job' }));

  const folderPath = customerFolder(customerId);
  return ensureExportPresence(
    [path.relative(exportRoot, path.join(folderPath, 'jobs.page1.json'))],
    { errors, items, contents: listCustomerFolder(customerId) } as LoadResult<JobRecord>,
  );
}
