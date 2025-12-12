'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataTable, Column } from '../../../../components/dashboard/DataTable';
import { EmptyState } from '../../../../components/dashboard/EmptyState';
import { KpiCard } from '../../../../components/dashboard/KpiCard';
import { ProductTile } from '../../../../components/dashboard/ProductTile';
import { SkeletonBlock } from '../../../../components/dashboard/SkeletonBlock';
import { StatusBadge } from '../../../../components/dashboard/StatusBadge';

interface OverviewResponse {
  customerId: string;
  customer: {
    id: string;
    name: string;
    ownerEmail?: string;
    country?: string;
    status?: string;
  };
  kpis: {
    tenants: number;
    microsoftSeats: number;
    backupProtected: number | null;
    baselines: number;
    jobsFailed: number;
    services: number;
    activeServices: number;
    riskRules: number;
  };
  products: Array<{ name: string; status: 'active' | 'inactive' | 'unknown' | string }>;
  tenants: Array<{ tenantId: string; tenantName: string; seats: number }>;
  services: Array<{
    id: string;
    name: string;
    status: string;
    purchasedSeats: number | null;
    assignedSeats: number | null;
    availableSeats: number | null;
    storageGb: number | null;
    retentionDays: number | null;
    expiresOn: string | null;
  }>;
  baselines: Array<{ baselineId: string; name: string; status: string }>;
  jobs: Array<{ jobId: string; status: string; startTime: string; endTime?: string }>;
  backup: { coverageRate: number | null; protectedUsers: number | null; microsoftSeats: number };
  scanProfiles: Array<{ id: string; name: string; status: string; lastUpdated: string | null; schedule: string }>;
  riskRules: Array<{ id: string; name: string; hits: number; severity: string }>;
  workspace: {
    complianceRate: number | null;
    ransomwareIncidents: number | null;
    protectedAssets: number | null;
    dspmInsights: { exposedObjects: number | null; hotspots: number | null };
  };
  errors: string[];
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function CustomerOverviewPage({ params }: { params: { customerId: string } }) {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  const activeServiceRatio = useMemo(() => {
    if (!data?.kpis?.services) return null;
    const total = data.kpis.services;
    const active = data.kpis.activeServices ?? 0;
    const ratio = total > 0 ? Math.min(100, Math.round((active / total) * 100)) : 0;
    return { active, total, ratio };
  }, [data]);

  const backupCoverage = useMemo(() => {
    if (data?.backup?.coverageRate === null || data?.backup?.coverageRate === undefined) return null;
    return Math.min(100, Math.max(0, Math.round(data.backup.coverageRate)));
  }, [data]);

  const loadOverview = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const response = await fetch(`/api/customers/${params.customerId}/overview`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      const payload = (await response.json()) as OverviewResponse;
      setData(payload);
      setRefreshedAt(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.customerId]);

  const tenantColumns = useMemo<Column<OverviewResponse['tenants'][number]>[]>(
    () => [
      { key: 'tenantName', header: 'Tenant' },
      { key: 'seats', header: 'Microsoft seats', render: (tenant) => tenant.seats.toLocaleString(), className: 'text-right' },
    ],
    [],
  );

  const serviceColumns = useMemo<Column<OverviewResponse['services'][number]>[]>(
    () => [
      { key: 'name', header: 'Service' },
      {
        key: 'status',
        header: 'Status',
        render: (service) => <StatusBadge status={service.status}>{service.status}</StatusBadge>,
      },
      {
        key: 'purchasedSeats',
        header: 'Seats',
        render: (service) =>
          service.purchasedSeats !== null
            ? `${service.purchasedSeats.toLocaleString()} purchased`
            : '—',
      },
      {
        key: 'assignedSeats',
        header: 'Assigned / Available',
        render: (service) =>
          service.assignedSeats !== null || service.availableSeats !== null
            ? `${service.assignedSeats?.toLocaleString() ?? 0} / ${service.availableSeats?.toLocaleString() ?? 0}`
            : '—',
      },
      {
        key: 'storageGb',
        header: 'Storage',
        render: (service) => (service.storageGb !== null ? `${service.storageGb.toLocaleString()} GB` : '—'),
      },
      {
        key: 'retentionDays',
        header: 'Retention',
        render: (service) => (service.retentionDays !== null ? `${service.retentionDays} days` : '—'),
      },
      {
        key: 'expiresOn',
        header: 'Expires',
        render: (service) => (service.expiresOn ? formatDate(service.expiresOn) : '—'),
      },
    ],
    [],
  );

  const jobColumns = useMemo<Column<OverviewResponse['jobs'][number]>[]>(
    () => [
      { key: 'jobId', header: 'Job ID' },
      {
        key: 'status',
        header: 'Status',
        render: (job) => <StatusBadge status={job.status}>{job.status}</StatusBadge>,
      },
      {
        key: 'startTime',
        header: 'Start',
        render: (job) => formatDate(job.startTime),
      },
      {
        key: 'endTime',
        header: 'End',
        render: (job) => formatDate(job.endTime),
      },
    ],
    [],
  );

  const scanColumns = useMemo<Column<OverviewResponse['scanProfiles'][number]>[]>(
    () => [
      { key: 'name', header: 'Scan profile' },
      { key: 'schedule', header: 'Schedule' },
      {
        key: 'status',
        header: 'Status',
        render: (scan) => <StatusBadge status={scan.status}>{scan.status}</StatusBadge>,
      },
      {
        key: 'lastUpdated',
        header: 'Last updated',
        render: (scan) => (scan.lastUpdated ? formatDate(scan.lastUpdated) : '—'),
      },
    ],
    [],
  );

  const riskColumns = useMemo<Column<OverviewResponse['riskRules'][number]>[]>(
    () => [
      { key: 'name', header: 'Rule' },
      { key: 'severity', header: 'Severity', render: (rule) => <StatusBadge status={rule.severity}>{rule.severity}</StatusBadge> },
      { key: 'hits', header: 'Hits', className: 'text-right', render: (rule) => rule.hits.toLocaleString() },
    ],
    [],
  );

  const renderKpis = () => {
    if (loading || !data) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard title="Tenants" value={data.kpis.tenants.toLocaleString()} helper="Connected across this customer" />
        <KpiCard title="Microsoft seats" value={data.kpis.microsoftSeats.toLocaleString()} helper="From tenant inventory" />
        <KpiCard
          title="Backup coverage"
          value={data.backup.coverageRate !== null ? `${data.backup.coverageRate}%` : 'Not reported'}
          helper="Protected users vs seats"
        />
        <KpiCard title="Services" value={data.kpis.services.toLocaleString()} helper="Assigned to this customer" />
        <KpiCard title="Baselines" value={data.kpis.baselines.toLocaleString()} helper="Baseline management" />
        <KpiCard title="Jobs failed" value={data.kpis.jobsFailed.toLocaleString()} helper="Recent job health" />
      </div>
    );
  };

  const renderProducts = () => {
    if (loading || !data) {
      return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {data.products.map((product) => (
          <ProductTile key={product.name} name={product.name} status={product.status} />
        ))}
      </div>
    );
  };

  const renderTenants = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.tenants.length) {
      return <EmptyState title="No tenants yet" description="Once tenants sync, they will appear here." />;
    }
    return <DataTable columns={tenantColumns} data={data.tenants} emptyMessage="No tenants returned." />;
  };

  const renderServices = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.services.length) {
      return <EmptyState title="No services yet" description="Provision services to see licensing details." />;
    }
    return <DataTable columns={serviceColumns} data={data.services} emptyMessage="No services returned." />;
  };

  const renderJobs = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.jobs.length) {
      return <EmptyState title="No jobs found" description="When AvePoint jobs run, they will show here." />;
    }
    return <DataTable columns={jobColumns} data={data.jobs} emptyMessage="No jobs returned." />;
  };

  const renderScans = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.scanProfiles.length) {
      return <EmptyState title="No scan profiles" description="Create scan profiles to start monitoring changes." />;
    }
    return <DataTable columns={scanColumns} data={data.scanProfiles} emptyMessage="No scan profiles returned." />;
  };

  const renderRisks = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.riskRules.length) {
      return <EmptyState title="No matched rules" description="When detections occur, they will show up here." />;
    }
    return <DataTable columns={riskColumns} data={data.riskRules} emptyMessage="No risk rules returned." />;
  };

  return (
    <div className="flex flex-col gap-8" id="overview">
      {loadError && (
        <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-r from-rose-900/60 via-rose-900/40 to-amber-800/40 p-4 text-sm text-rose-50 shadow-2xl shadow-black/30 ring-1 ring-rose-400/30">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-base font-semibold text-rose-100">!
            </span>
            <div className="space-y-1">
              <p className="font-semibold">We couldn&apos;t refresh this dashboard</p>
              <p className="text-xs text-rose-50/80">
                {loadError}. Try refreshing the snapshot or verifying the customer permissions.
              </p>
            </div>
          </div>
        </div>
      )}

      {data?.errors?.length ? (
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-900/60 via-amber-900/40 to-sky-900/40 p-4 text-sm text-amber-50 shadow-2xl shadow-black/30 ring-1 ring-amber-400/30">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-base font-semibold text-amber-100">
              !
            </span>
            <div className="space-y-1">
              <p className="font-semibold">Partial data (degraded)</p>
              <p className="text-xs text-amber-50/80">We kept the data that still looks reliable while the rest is being retried.</p>
              <ul className="mt-2 list-disc space-y-1 rounded-2xl bg-white/5 p-3 text-xs text-amber-50/90">
                {data.errors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      <section
        aria-labelledby="customer-heading"
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(56,189,248,0.26),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(168,85,247,0.22),transparent_30%),linear-gradient(120deg,rgba(15,23,42,0.7),rgba(8,47,73,0.85))] p-6 shadow-2xl shadow-black/30 ring-1 ring-white/10 sm:p-8"
      >
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
        <div className="relative flex flex-col gap-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.24em] text-sky-200">AvePoint dashboard</p>
              <div className="space-y-1">
                <h2 id="customer-heading" className="text-3xl font-semibold text-white">
                  {data?.customer?.name ?? params.customerId}
                </h2>
                <p className="max-w-2xl text-sm text-slate-200/80">
                  Unified customer overview. Monitor services, tenants, protection coverage, baselines, and risk posture in one hyper-modern experience.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">ID: {data?.customer?.id ?? '—'}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Owner: {data?.customer?.ownerEmail ?? '—'}</span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Region: {data?.customer?.country ?? 'Unknown region'}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <StatusBadge status={data?.customer?.status ?? 'Unknown'}>{data?.customer?.status ?? 'Unknown'}</StatusBadge>
              <button
                type="button"
                onClick={loadOverview}
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-sky-500/80 via-indigo-500/80 to-fuchsia-500/80 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-900/50 transition hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-sky-300"
              >
                <span className="absolute inset-0 bg-white/10 opacity-0 transition hover:opacity-20" aria-hidden />
                <span>Refresh snapshot</span>
              </button>
              {refreshedAt && <p className="text-[11px] text-slate-200/70">Live at {refreshedAt.toLocaleTimeString()}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-sky-400/5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
                <span>Active services</span>
                <span className="rounded-full bg-sky-500/20 px-2 py-0.5 text-[10px] text-sky-100">Live</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-white">{data?.kpis?.activeServices?.toLocaleString?.() ?? '—'}</p>
              <p className="text-xs text-slate-400">Of {data?.kpis?.services?.toLocaleString?.() ?? '—'} total</p>
              {activeServiceRatio && (
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 shadow-lg"
                    style={{ width: `${activeServiceRatio.ratio}%` }}
                    aria-label="Active service ratio"
                  />
                </div>
              )}
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-400/5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Risk rules</p>
              <p className="mt-2 text-2xl font-semibold text-white">{data?.kpis?.riskRules?.toLocaleString?.() ?? data?.riskRules?.length ?? '—'}</p>
              <p className="text-xs text-slate-400">Detections being monitored</p>
              <div className="mt-3 text-[11px] text-amber-100/90">Keep an eye on trending detections before they spike.</div>
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-emerald-400/40 hover:bg-emerald-400/5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Backup coverage</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data?.backup?.coverageRate !== null && data?.backup?.coverageRate !== undefined ? `${data.backup.coverageRate}%` : 'Not reported'}
              </p>
              <p className="text-xs text-slate-400">Protected users vs seats</p>
              {backupCoverage !== null && (
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg"
                    style={{ width: `${backupCoverage}%` }}
                    aria-label="Backup coverage"
                  />
                </div>
              )}
            </div>
            <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:border-rose-400/40 hover:bg-rose-400/5">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Jobs failed</p>
              <p className="mt-2 text-2xl font-semibold text-white">{data?.kpis?.jobsFailed?.toLocaleString?.() ?? '—'}</p>
              <p className="text-xs text-slate-400">Recent automation health</p>
              <div className="mt-3 text-[11px] text-rose-100/90">Track disruption quickly with failure totals.</div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="kpi-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Snapshot</p>
            <h2 id="kpi-heading" className="text-lg font-semibold text-white">
              Key performance indicators
            </h2>
          </div>
        </div>
        {renderKpis()}
        {refreshedAt && (
          <p className="text-xs text-slate-400">Last refreshed: {refreshedAt.toLocaleTimeString()}</p>
        )}
      </section>

      <section aria-labelledby="products-heading" className="space-y-3" id="services">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Products</p>
            <h2 id="products-heading" className="text-lg font-semibold text-white">
              AvePoint services
            </h2>
          </div>
        </div>
        {renderProducts()}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">Licensing & lifecycle</h3>
          {renderServices()}
        </div>
      </section>

      <section aria-labelledby="tenants-heading" className="space-y-3" id="tenants">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Tenants</p>
            <h2 id="tenants-heading" className="text-lg font-semibold text-white">
              Connected tenants and seats
            </h2>
          </div>
        </div>
        {renderTenants()}
      </section>

      <section aria-labelledby="backup-heading" className="space-y-3" id="backup">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Backup</p>
            <h2 id="backup-heading" className="text-lg font-semibold text-white">
              Cloud Backup for M365
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <KpiCard
            title="Coverage"
            value={
              data?.backup?.coverageRate !== null && data?.backup?.coverageRate !== undefined
                ? `${data.backup.coverageRate}%`
                : 'Not reported'
            }
            helper="Protected users vs seats"
          />
          <KpiCard
            title="Protected users"
            value={
              data?.backup?.protectedUsers !== null && data?.backup?.protectedUsers !== undefined
                ? data.backup.protectedUsers.toLocaleString()
                : '—'
            }
            helper="Reported by Cloud Backup"
          />
          <KpiCard
            title="Total seats"
            value={data?.backup?.microsoftSeats !== undefined ? data.backup.microsoftSeats.toLocaleString() : '—'}
            helper="Microsoft 365"
          />
        </div>
      </section>

      <section aria-labelledby="baselines-heading" className="space-y-3" id="baselines">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Baselines</p>
            <h2 id="baselines-heading" className="text-lg font-semibold text-white">
              Baseline management
            </h2>
          </div>
        </div>
        {loading || !data ? (
          <SkeletonBlock className="h-40" />
        ) : data.baselines.length ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.baselines.map((baseline) => (
              <li
                key={baseline.baselineId}
                className="relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 shadow-xl shadow-black/20"
              >
                <div className="pointer-events-none absolute -right-6 -top-10 h-20 w-20 rotate-12 rounded-full bg-sky-400/20 blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -left-12 -bottom-16 h-24 w-24 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white">{baseline.name}</p>
                    <p className="text-[11px] text-slate-300/80">{baseline.baselineId}</p>
                    <p className="text-[11px] text-sky-100/90">Baseline readiness</p>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400" style={{ width: '100%' }} aria-hidden />
                    </div>
                  </div>
                  <StatusBadge status={baseline.status}>{baseline.status}</StatusBadge>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No baselines" description="Create baselines to see them here." />
        )}
      </section>

      <section aria-labelledby="scans-heading" className="space-y-3" id="scans">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Scans</p>
            <h2 id="scans-heading" className="text-lg font-semibold text-white">
              Scan profiles
            </h2>
          </div>
        </div>
        {renderScans()}
      </section>

      <section aria-labelledby="risk-heading" className="space-y-3" id="risk">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Risk</p>
            <h2 id="risk-heading" className="text-lg font-semibold text-white">
              Risk rule detections
            </h2>
          </div>
        </div>
        {renderRisks()}
      </section>

      <section aria-labelledby="workspace-heading" className="space-y-3" id="workspace">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Workspace</p>
            <h2 id="workspace-heading" className="text-lg font-semibold text-white">
              Data protection & exposure
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          <KpiCard
            title="Compliance rate"
            value={
              data?.workspace?.complianceRate !== null && data?.workspace?.complianceRate !== undefined
                ? `${Math.round(data.workspace.complianceRate)}%`
                : 'Not reported'
            }
            helper="Data protection"
          />
          <KpiCard
            title="Ransomware incidents"
            value={
              data?.workspace?.ransomwareIncidents !== null && data?.workspace?.ransomwareIncidents !== undefined
                ? data.workspace.ransomwareIncidents.toLocaleString()
                : '—'
            }
            helper="Detection"
          />
          <KpiCard
            title="Protected assets"
            value={
              data?.workspace?.protectedAssets !== null && data?.workspace?.protectedAssets !== undefined
                ? data.workspace.protectedAssets.toLocaleString()
                : '—'
            }
            helper="Backup/Ransomware"
          />
          <KpiCard
            title="DSPM exposures"
            value={
              data?.workspace?.dspmInsights?.exposedObjects !== null &&
              data?.workspace?.dspmInsights?.exposedObjects !== undefined
                ? data.workspace.dspmInsights.exposedObjects.toLocaleString()
                : '—'
            }
            helper="Exposed objects"
          />
        </div>
        <p className="text-xs text-slate-400">
          Hotspots tracked: {
            data?.workspace?.dspmInsights?.hotspots !== null && data?.workspace?.dspmInsights?.hotspots !== undefined
              ? data.workspace.dspmInsights.hotspots
              : '—'
          }
        </p>
      </section>

      <section aria-labelledby="jobs-heading" className="space-y-3" id="jobs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Jobs</p>
            <h2 id="jobs-heading" className="text-lg font-semibold text-white">
              Recent job execution
            </h2>
          </div>
        </div>
        {renderJobs()}
      </section>
    </div>
  );
}
