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

  const combinedErrors = [
    ...customerErrors,
    ...serviceErrors,
    ...backupSummaries.flatMap((item) => item.errors),
    ...jobSummaries.flatMap((item) => item.errors),
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Total customers" subtitle="Tenants managed across Elements" accent>
          <p className="text-3xl font-semibold text-white">{customers.length}</p>
          <p className="text-sm text-slate-300">Backed by fixtures in data/elements-export</p>
        </Card>
        <Card title="Backup enabled" subtitle="Customers with active backup services" accent>
          <p className="text-3xl font-semibold text-white">{backupEnabledIds.size}</p>
          <p className="text-sm text-slate-300">Based on services batch data</p>
        </Card>
        <Card title="Protected objects" subtitle="Total protected items across modules" accent>
          <p className="text-3xl font-semibold text-white">{formatNumber(totalProtectedObjects)}</p>
          <p className="text-sm text-slate-300">Summed from backup.overview.json</p>
        </Card>
        <Card title="Job health" subtitle="Jobs grouped by status" accent>
          <div className="space-y-2">
            {Object.keys(jobStatusCounts).length === 0 ? (
              <p className="text-sm text-slate-300">No jobs recorded yet.</p>
            ) : (
              Object.entries(jobStatusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span className="text-sm text-slate-200">{status}</span>
                  <span className="text-lg font-semibold text-white">{count}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      <Card title="Customer overview" subtitle="Status, owners, and recent protection footprint">
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
          <p className="text-sm text-slate-300">No customers were found in data/elements-export.</p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wide text-slate-400">
              <span className="col-span-4">Customer</span>
              <span className="col-span-2">Region</span>
              <span className="col-span-2">Owner</span>
              <span className="col-span-2">Protected</span>
              <span className="col-span-2 text-right">Services</span>
            </div>
            <div className="divide-y divide-white/5 text-sm">
              {customers.map((customer) => {
                const backupTotal = backupSummaries
                  .find((entry) => entry.customerId === customer.id)
                  ?.items.reduce((sum, module) => sum + (module.totalProtectedObjects ?? 0), 0);
                const serviceCount = services.filter((svc) => svc.customerId === customer.id).length;

                return (
                  <Link
                    key={customer.id}
                    href={`/customers/${customer.id}`}
                    className="grid grid-cols-12 items-center gap-3 px-4 py-3 transition hover:bg-white/5"
                  >
                    <div className="col-span-4">
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
                          <p className="text-xs text-slate-300">{customer.tenants.length} tenants</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-slate-200">{customer.region}</div>
                    <div className="col-span-2 truncate text-slate-200" title={customer.ownerEmail}>
                      {customer.ownerEmail}
                    </div>
                    <div className="col-span-2 text-slate-200">{formatNumber(backupTotal)}</div>
                    <div className="col-span-2 flex items-center justify-end gap-2 text-slate-200">
                      <StatusBadge status={customer.status}>{customer.status}</StatusBadge>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">{serviceCount} services</span>
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
