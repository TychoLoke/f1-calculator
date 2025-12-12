import { AlertTriangle, Database, ShieldCheck, Users } from 'lucide-react';
import { AppShell } from '../../../components/layout/AppShell';
import { BackupCoverageChart } from '../../../components/dashboard/BackupCoverageChart';
import { CustomerTable } from '../../../components/dashboard/CustomerTable';
import { JobHealthChart } from '../../../components/dashboard/JobHealthChart';
import { KpiCard } from '../../../components/dashboard/KpiCard';
import { Panel } from '../../../components/dashboard/Panel';
import { getCustomerBackup, getCustomerJobs, getCustomers, getServices } from '../../../lib/elements/fixtures';

export const dynamic = 'force-dynamic';

function formatNumber(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toLocaleString();
}

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
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

  const coverageByModule = backupSummaries
    .flatMap((summary) => summary.items)
    .reduce((acc, module) => {
      const key = module.module ?? module.serviceType;
      if (!acc[key]) {
        acc[key] = { module: module.module ?? 'Module', scanned: 0, protected: 0 };
      }
      acc[key].scanned += module.totalScannedObjects ?? 0;
      acc[key].protected += module.totalProtectedObjects ?? 0;
      return acc;
    }, {} as Record<string, { module: string; scanned: number; protected: number }>);

  const coverageData = Object.values(coverageByModule);

  const statuses = ['Succeeded', 'Warning', 'Failed', 'Running', 'Pending', 'Ready'];
  const jobHealthData = statuses.map((status) => ({ status, count: jobStatusCounts[status] ?? 0 }));

  const customerRows = customers.map((customer) => {
    const backupTotal = backupSummaries
      .find((entry) => entry.customerId === customer.id)
      ?.items.reduce((sum, module) => sum + (module.totalProtectedObjects ?? 0), 0);
    const isBackupEnabled = backupEnabledIds.has(customer.id);
    const jobHealth = jobHealthByCustomer[customer.id] ?? 'Unknown';

    return {
      id: customer.id,
      organization: customer.organization,
      tenants: customer.tenants.length,
      region: customer.region,
      backupEnabled: isBackupEnabled,
      protectedObjects: backupTotal,
      jobHealth,
    };
  });

  const combinedErrors = [
    ...customerErrors,
    ...serviceErrors,
    ...backupSummaries.flatMap((item) => item.errors),
    ...jobSummaries.flatMap((item) => item.errors),
  ].filter(Boolean);

  return (
    <AppShell
      title="Customers overview"
      breadcrumbs={[{ label: 'Dashboard', href: '/customers' }, { label: 'Customers' }]}
      actions={
        <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#101a32] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_40px_-28px_rgba(0,0,0,0.9)] transition hover:border-white/20 hover:bg-[#14223e]">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#ff5f6d] via-[#7c3aed] to-[#5b8bff] text-white shadow-[0_20px_40px_-26px_rgba(91,139,255,0.9)]">
            <Users className="h-4 w-4" />
          </span>
          New tenant
        </button>
      }
    >
      <div className="grid gap-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Total customers" value={customers.length} helper="Managed tenants" icon={Users} />
          <KpiCard title="Backup enabled" value={backupEnabledIds.size} helper="Active coverage" icon={ShieldCheck} />
          <KpiCard
            title="Protected objects"
            value={formatNumber(totalProtectedObjects)}
            helper="Across all modules"
            icon={Database}
          />
          <KpiCard
            title="Failed jobs"
            value={failedJobCount}
            helper={failedJobLabel}
            icon={AlertTriangle}
            footer={`${allJobs.length} jobs monitored`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <JobHealthChart data={jobHealthData} />
          <BackupCoverageChart data={coverageData} />
        </section>

        <section>
          <Panel title="Customer overview" subtitle="Backup coverage and job signal">
            <CustomerTable rows={customerRows} errors={combinedErrors} />
          </Panel>
        </section>
      </div>
    </AppShell>
  );
}
