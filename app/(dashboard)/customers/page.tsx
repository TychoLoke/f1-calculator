import Link from 'next/link';
import { Card } from '../../../components/dashboard/Card';
import { StatusBadge } from '../../../components/dashboard/StatusBadge';
import { getCustomerBackup, getCustomerJobs, getCustomers, getServices } from '../../../lib/elements/fixtures';

export const dynamic = 'force-dynamic';

function formatNumber(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toLocaleString();
}

export default async function CustomersPage() {
  const { items: customers, errors: customerErrors } = getCustomers();
  const { items: services, errors: serviceErrors } = getServices();

  const backupSummaries = customers.map((customer) => ({ customerId: customer.id, ...getCustomerBackup(customer.id) }));
  const jobSummaries = customers.map((customer) => ({ customerId: customer.id, ...getCustomerJobs(customer.id) }));

  const totalProtectedObjects = backupSummaries.reduce(
    (sum, summary) => sum + summary.items.reduce((subtotal, module) => subtotal + (module.totalProtectedObjects ?? 0), 0),
    0,
  );

  const backupEnabledIds = new Set(
    services.filter((service) => service.service.toLowerCase().includes('backup')).map((service) => service.customerId),
  );

  const jobStatusCounts = jobSummaries.reduce((acc, summary) => {
    summary.items.forEach((job) => {
      acc[job.status] = (acc[job.status] ?? 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const allJobs = jobSummaries.flatMap((summary) => summary.items);
  const failedJobs = allJobs.filter((job) => job.status.toLowerCase() === 'failed');

  const parseDate = (value: string | null | undefined) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const now = new Date();
  const failedLastDay = failedJobs.filter((job) => {
    const reference = parseDate(job.endTime ?? job.startTime);
    if (!reference) return false;
    return now.getTime() - reference.getTime() <= 24 * 60 * 60 * 1000;
  });

  const failedJobCount = failedLastDay.length > 0 ? failedLastDay.length : failedJobs.length;
  const failedJobLabel = failedLastDay.length > 0 ? 'Last 24 hours' : 'Latest runs';

  const statusPriority = ['Failed', 'Warning', 'Running', 'Pending', 'Succeeded', 'Ready'];
  const getPriority = (status: string | null | undefined) => {
    const index = statusPriority.indexOf(status ?? '');
    return index === -1 ? statusPriority.length : index;
  };

  const jobHealthByCustomer = jobSummaries.reduce<Record<string, string>>((acc, summary) => {
    if (summary.items.length === 0) {
      acc[summary.customerId] = 'No jobs';
      return acc;
    }

    const sorted = [...summary.items].sort((a, b) => {
      const dateA = parseDate(a.endTime ?? a.startTime)?.getTime() ?? 0;
      const dateB = parseDate(b.endTime ?? b.startTime)?.getTime() ?? 0;
      return dateB - dateA;
    });

    const ranked = sorted.reduce((best, current) => {
      const currentIndex = getPriority(current.status);
      const bestIndex = getPriority(best);
      if (best == null) return current.status;
      return currentIndex < bestIndex ? current.status : best;
    }, null as string | null);

    acc[summary.customerId] = ranked ?? sorted[0]?.status ?? 'Unknown';
    return acc;
  }, {});

  const combinedErrors = [
    ...customerErrors,
    ...serviceErrors,
    ...backupSummaries.flatMap((item) => item.errors),
    ...jobSummaries.flatMap((item) => item.errors),
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total customers" subtitle="Managed tenants" accent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">{customers.length}</p>
              <p className="text-xs text-slate-400">Across all connected tenants</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-lg shadow-black/30">
              <span className="text-lg font-bold">∞</span>
            </div>
          </div>
        </Card>
        <Card title="Backup enabled" subtitle="Customers protected" accent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">{backupEnabledIds.size}</p>
              <p className="text-xs text-slate-400">Active backup coverage</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-lg shadow-black/30">
              <span className="text-lg font-bold">B</span>
            </div>
          </div>
        </Card>
        <Card title="Protected objects" subtitle="Total items in scope" accent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">{formatNumber(totalProtectedObjects)}</p>
              <p className="text-xs text-slate-400">Aggregated across modules</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-lg shadow-black/30">
              <span className="text-lg font-bold">P</span>
            </div>
          </div>
        </Card>
        <Card title="Failed jobs" subtitle={failedJobLabel} accent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-semibold text-white">{failedJobCount}</p>
              <p className="text-xs text-slate-400">Monitored across tenants</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-lg shadow-black/30">
              <span className="text-lg font-bold">!</span>
            </div>
          </div>
        </Card>
      </section>

      <Card title="Job health" subtitle="Status distribution" action={<span className="text-xs text-slate-400">{allJobs.length} jobs tracked</span>}>
        {Object.keys(jobStatusCounts).length === 0 ? (
          <p className="text-sm text-slate-300">No jobs available.</p>
        ) : (
          <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-[#0c1220]">
            {Object.entries(jobStatusCounts)
              .sort(([, a], [, b]) => Number(b) - Number(a))
              .map(([status, count]) => {
                const total = Object.values(jobStatusCounts).reduce((sum, value) => sum + value, 0);
                const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
                return (
                  <div key={status} className="grid grid-cols-5 items-center gap-3 px-4 py-3 text-sm text-slate-100">
                    <span className="col-span-2 font-medium text-white">{status}</span>
                    <div className="col-span-2">
                      <div className="h-2 w-full rounded-full bg-white/5">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="col-span-1 text-right text-slate-300">{count}</span>
                  </div>
                );
              })}
          </div>
        )}
      </Card>

      <Card title="Customer overview" subtitle="Backup coverage and job signal">
        {combinedErrors.length > 0 && (
          <div className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            <p className="font-semibold">Fixture warnings</p>
            <ul className="list-disc space-y-1 pl-5">
              {combinedErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {customers.length === 0 ? (
          <p className="text-sm text-slate-300">No customers are available.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0c1220]">
            <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wide text-slate-400">
              <span className="col-span-5">Customer</span>
              <span className="col-span-2">Backup enabled</span>
              <span className="col-span-3">Protected objects</span>
              <span className="col-span-2 text-right">Job health</span>
            </div>
            <div className="divide-y divide-white/5 text-sm">
              {customers.map((customer) => {
                const backupTotal = backupSummaries
                  .find((entry) => entry.customerId === customer.id)
                  ?.items.reduce((sum, module) => sum + (module.totalProtectedObjects ?? 0), 0);
                const isBackupEnabled = backupEnabledIds.has(customer.id);
                const jobHealth = jobHealthByCustomer[customer.id] ?? 'Unknown';

                return (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    className="grid grid-cols-12 items-center gap-3 px-4 py-3 transition hover:bg-white/5"
                  >
                    <div className="col-span-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-semibold uppercase text-white">
                          {customer.organization
                            .split(/\s+/)
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join('') || 'CU'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{customer.organization}</p>
                          <p className="text-xs text-slate-400">{customer.tenants.length} tenants · {customer.region}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                          isBackupEnabled
                            ? 'bg-emerald-500/10 text-emerald-100 ring-1 ring-emerald-400/30'
                            : 'bg-slate-600/20 text-slate-200 ring-1 ring-slate-500/30'
                        }`}
                      >
                        {isBackupEnabled ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="col-span-3 text-slate-200">{formatNumber(backupTotal)}</div>
                    <div className="col-span-2 flex justify-end text-slate-200">
                      <StatusBadge status={jobHealth}>{jobHealth}</StatusBadge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
