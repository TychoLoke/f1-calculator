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
  kpis: {
    tenants: number;
    microsoftSeats: number;
    backupProtected: number | null;
    baselines: number;
    jobsFailed: number;
  };
  products: Array<{ name: string; status: 'active' | 'inactive' | 'unknown' | string }>;
  tenants: Array<{ tenantId: string; tenantName: string; seats: number }>;
  baselines: Array<{ baselineId: string; name: string; status: string }>;
  jobs: Array<{ jobId: string; status: string; startTime: string; endTime?: string }>;
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

  const renderKpis = () => {
    if (loading || !data) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonBlock key={index} className="h-24" />
          ))}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <KpiCard title="Tenants" value={data.kpis.tenants.toLocaleString()} helper="Connected across this customer" />
        <KpiCard title="Microsoft seats" value={data.kpis.microsoftSeats.toLocaleString()} helper="From tenant inventory" />
        <KpiCard
          title="Backup protected users"
          value={data.kpis.backupProtected !== null ? data.kpis.backupProtected.toLocaleString() : 'Not reported'}
          helper="Cloud Backup M365"
        />
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

  const renderJobs = () => {
    if (loading || !data) {
      return <SkeletonBlock className="h-48" />;
    }
    if (!data.jobs.length) {
      return <EmptyState title="No jobs found" description="When AvePoint jobs run, they will show here." />;
    }
    return <DataTable columns={jobColumns} data={data.jobs} emptyMessage="No jobs returned." />;
  };

  return (
    <div className="flex flex-col gap-6" id="overview">
      {loadError && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
          Failed to load dashboard: {loadError}
        </div>
      )}

      {data?.errors?.length ? (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
          <p className="font-semibold">Partial data</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-amber-100">
            {data.errors.map((err, index) => (
              <li key={index}>{err}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <section aria-labelledby="kpi-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Snapshot</p>
            <h2 id="kpi-heading" className="text-lg font-semibold text-white">
              Key performance indicators
            </h2>
          </div>
          <button
            type="button"
            onClick={loadOverview}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 transition hover:border-sky-400 hover:text-white"
          >
            Refresh
          </button>
        </div>
        {renderKpis()}
        {refreshedAt && (
          <p className="text-xs text-slate-400">Last refreshed: {refreshedAt.toLocaleTimeString()}</p>
        )}
      </section>

      <section aria-labelledby="products-heading" className="space-y-3" id="backup">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300">Products</p>
            <h2 id="products-heading" className="text-lg font-semibold text-white">
              AvePoint services
            </h2>
          </div>
        </div>
        {renderProducts()}
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
              <li key={baseline.baselineId} className="rounded-xl border border-white/5 bg-white/5 p-4 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{baseline.name}</p>
                    <p className="text-xs text-slate-400">{baseline.baselineId}</p>
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
