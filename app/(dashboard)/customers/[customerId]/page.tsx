import { Card } from '../../../../components/dashboard/Card';
import { CustomerSwitcher } from '../../../../components/dashboard/CustomerSwitcher';
import { StatusBadge } from '../../../../components/dashboard/StatusBadge';
import { getBaselines, getCustomerBackup, getCustomerJobs, getCustomers, getServices } from '../../../../lib/elements/fixtures';

export const dynamic = 'force-dynamic';

function formatNumber(value: number | null | undefined) {
  if (value == null) return '—';
  return value.toLocaleString();
}

function chartBar(value: number | null, max: number) {
  if (value == null || max === 0) return 0;
  return Math.round((value / max) * 100);
}

export default async function CustomerOverviewPage({ params }: { params: { customerId: string } }) {
  const { items: customers } = getCustomers();
  const { items: services } = getServices();
  const { items: baselines } = getBaselines();

  const customer = customers.find((item) => item.id === params.customerId);
  const backup = getCustomerBackup(params.customerId);
  const jobs = getCustomerJobs(params.customerId);

  const serviceList = services.filter((service) => service.customerId === params.customerId);
  const baselineCount = baselines.length;
  const protectedTotal = backup.items.reduce((sum, module) => sum + (module.totalProtectedObjects ?? 0), 0);
  const chartMax = Math.max(...backup.items.map((item) => item.totalProtectedObjects ?? 0), 0);

  const switcherOptions = customers.map((item) => ({ id: item.id, name: item.organization }));

  const errorMessages = [...backup.errors, ...jobs.errors];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
            <span className="rounded-md bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed] px-2 py-1 text-[10px] font-semibold text-white shadow-lg shadow-black/30">
              Customer
            </span>
            {customer?.id ?? params.customerId}
          </div>
          <h1 className="text-2xl font-semibold text-white">{customer?.organization ?? 'Unknown customer'}</h1>
          <p className="text-sm text-slate-300">{customer?.ownerEmail ?? 'Owner not provided'} • {customer?.region ?? 'Region missing'}</p>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="rounded-full border border-white/10 px-3 py-1">{customer?.tenants.length ?? 0} tenants</span>
            <span className="rounded-full border border-white/10 px-3 py-1">{serviceList.length} services</span>
            <span className="rounded-full border border-white/10 px-3 py-1">{baselineCount} baselines</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200">
            <span className="text-xs uppercase tracking-wide text-slate-400">Switch customer</span>
            <CustomerSwitcher options={switcherOptions} currentId={params.customerId} />
          </div>
          <StatusBadge status={customer?.status ?? 'Unknown'}>{customer?.status ?? 'Unknown'}</StatusBadge>
        </div>
      </div>

      {errorMessages.length > 0 && (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          <p className="font-semibold">Fixture warnings</p>
          <ul className="list-disc space-y-1 pl-5">
            {errorMessages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Protected objects" subtitle="Backup coverage across modules" accent>
          <p className="text-3xl font-semibold text-white">{formatNumber(protectedTotal)}</p>
          <p className="text-sm text-slate-300">From backup.overview.json</p>
        </Card>
        <Card title="Services" subtitle="Products provisioned for this tenant" accent>
          <p className="text-3xl font-semibold text-white">{serviceList.length}</p>
          <p className="text-sm text-slate-300">Primary modules and add-ons</p>
        </Card>
        <Card title="Baselines" subtitle="Security and compliance baselines" accent>
          <p className="text-3xl font-semibold text-white">{baselineCount}</p>
          <p className="text-sm text-slate-300">From baselines.batch.json</p>
        </Card>
        <Card title="Jobs observed" subtitle="Recent automation runs" accent>
          <p className="text-3xl font-semibold text-white">{jobs.items.length}</p>
          <p className="text-sm text-slate-300">Filtered to page 1 of jobs</p>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card title="Backup module overview" subtitle="Protected objects and storage by module">
          {backup.items.length === 0 ? (
            <p className="text-sm text-slate-300">No backup modules found for this customer.</p>
          ) : (
            <div className="space-y-3">
              {backup.items.map((module) => (
                <div key={`${module.customerId}-${module.module}`} className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between text-sm text-slate-200">
                    <div>
                      <p className="font-semibold text-white">{module.module}</p>
                      <p className="text-xs text-slate-400">{module.serviceType}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-100">
                      {formatNumber(module.totalProtectedObjects)} protected
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ff5f6d] via-[#5b8bff] to-[#7c3aed]"
                      style={{ width: `${chartBar(module.totalProtectedObjects, chartMax)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                    <span>AvePoint storage: {formatNumber(module.storedAvePointGb)} GB</span>
                    <span>BYOS: {formatNumber(module.storedByosGb)} GB</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Services" subtitle="Subscription and seat posture">
          {serviceList.length === 0 ? (
            <p className="text-sm text-slate-300">No services were provisioned for this customer.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
              <div className="grid grid-cols-12 px-3 py-2 text-[11px] uppercase tracking-wide text-slate-400">
                <span className="col-span-6">Service</span>
                <span className="col-span-2">Seats</span>
                <span className="col-span-2">Status</span>
                <span className="col-span-2 text-right">Expires</span>
              </div>
              <div className="divide-y divide-white/5 text-sm">
                {serviceList.map((service) => (
                  <div key={`${service.customerId}-${service.service}`} className="grid grid-cols-12 items-center px-3 py-3">
                    <div className="col-span-6 text-slate-100">
                      <p className="font-semibold">{service.service}</p>
                      <p className="text-xs text-slate-400">{service.organization}</p>
                    </div>
                    <div className="col-span-2 text-slate-200">{formatNumber(service.purchasedSeats)}</div>
                    <div className="col-span-2">
                      <StatusBadge status={service.status}>{service.status}</StatusBadge>
                    </div>
                    <div className="col-span-2 text-right text-slate-300">{service.expiresOn ?? '—'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card title="Recent jobs" subtitle="Latest activity from jobs.page1.json">
          {jobs.items.length === 0 ? (
            <p className="text-sm text-slate-300">No jobs found.</p>
          ) : (
            <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/5 text-sm">
              {jobs.items.slice(0, 6).map((job) => (
                <div key={job.jobId} className="grid grid-cols-5 items-center gap-3 px-3 py-3">
                  <div className="col-span-2">
                    <p className="font-semibold text-white">{job.jobId}</p>
                    <p className="text-xs text-slate-400">Module {job.jobModule}</p>
                  </div>
                  <div className="col-span-1 text-slate-200">{job.startTime ? new Date(job.startTime).toLocaleString() : '—'}</div>
                  <div className="col-span-1 text-slate-200">{job.endTime ? new Date(job.endTime).toLocaleString() : '—'}</div>
                  <div className="col-span-1 text-right">
                    <StatusBadge status={job.status}>{job.status}</StatusBadge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
