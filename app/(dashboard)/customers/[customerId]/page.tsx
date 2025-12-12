import { Card } from '../../../../components/dashboard/Card';
import { DataTable } from '../../../../components/dashboard/DataTable';
import { GradientMeter } from '../../../../components/dashboard/GradientMeter';
import { KpiCard } from '../../../../components/dashboard/KpiCard';
import { ProductTile } from '../../../../components/dashboard/ProductTile';
import { StatusBadge } from '../../../../components/dashboard/StatusBadge';
import { fetchCustomerOverview } from '../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export default async function CustomerOverviewPage({ params }: { params: { customerId: string } }) {
  const overview = await fetchCustomerOverview(params.customerId);
  const kpiItems = [
    { label: 'Tenants', value: overview.kpis.tenants },
    { label: 'Seats', value: overview.kpis.seats.toLocaleString() },
    { label: 'Protected users', value: overview.backup.protectedUsers ?? '—', helper: 'Backup coverage across tenants' },
    { label: 'Active services', value: `${overview.kpis.activeServices}/${overview.kpis.services}` },
  ];

  const jobHealth = overview.jobs.length
    ? Math.round(((overview.jobs.length - overview.kpis.jobsFailed) / overview.jobs.length) * 100)
    : null;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiItems.map((item) => (
          <KpiCard key={item.label} title={item.label} value={item.value} helper={item.helper} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Backup coverage" subtitle="Microsoft 365 protection with redundancy" accent>
          <GradientMeter
            label="Protected user coverage"
            value={overview.backup.coverageRate}
            helper={`${overview.backup.protectedUsers?.toLocaleString() ?? '—'} of ${overview.backup.microsoftSeats.toLocaleString()} seats`}
          />
          <GradientMeter label="Job success" value={jobHealth} helper={`${overview.jobs.length} jobs observed`} />
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {overview.scanProfiles.map((profile) => (
              <span key={profile.id} className="rounded-full bg-white/5 px-3 py-1 text-slate-100">
                {profile.name} · {profile.schedule}
              </span>
            ))}
          </div>
        </Card>

        <Card title="Workspace health" subtitle="Compliance, DSPM, and ransomware protection" accent>
          <div className="grid gap-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Compliance rate</span>
              <span className="font-semibold">{overview.workspace.complianceRate ?? '—'}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ransomware incidents</span>
              <span className="font-semibold">{overview.workspace.ransomwareIncidents ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Protected assets</span>
              <span className="font-semibold">{overview.workspace.protectedAssets ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>DSPM hotspots</span>
              <span className="font-semibold">{overview.workspace.dspm.hotspots ?? '—'}</span>
            </div>
          </div>
        </Card>

        <Card title="Products" subtitle="AvePoint modules enabled for this customer" accent>
          <div className="grid grid-cols-2 gap-3 text-sm text-slate-200">
            {overview.products.map((product) => (
              <ProductTile key={product.name} name={product.name} status={product.status} />
            ))}
          </div>
        </Card>
      </div>

      <Card title="Service utilization" subtitle="Seats, storage, and retention signals">
        <DataTable
          columns={[
            { key: 'name', header: 'Service' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <StatusBadge status={item.status}>{item.status}</StatusBadge>,
            },
            {
              key: 'purchasedSeats',
              header: 'Purchased',
              render: (item) => (item.purchasedSeats ?? '—').toLocaleString(),
            },
            {
              key: 'assignedSeats',
              header: 'Assigned',
              render: (item) => (item.assignedSeats ?? '—').toLocaleString(),
            },
            {
              key: 'availableSeats',
              header: 'Available',
              render: (item) => (item.availableSeats ?? '—').toLocaleString(),
            },
            {
              key: 'storageGb',
              header: 'Storage (GB)',
              render: (item) => (item.storageGb ?? '—').toLocaleString(),
            },
            {
              key: 'retentionDays',
              header: 'Retention (days)',
              render: (item) => (item.retentionDays ?? '—').toLocaleString(),
            },
          ]}
          data={overview.services}
          emptyMessage="No services are provisioned yet."
        />
      </Card>

      <Card title="Latest jobs" subtitle="Recent automation activity across tenants">
        <DataTable
          columns={[
            { key: 'jobId', header: 'Job' },
            {
              key: 'status',
              header: 'Status',
              render: (item) => <StatusBadge status={item.status}>{item.status}</StatusBadge>,
            },
            { key: 'startTime', header: 'Started', render: (item) => new Date(item.startTime).toLocaleString() },
            { key: 'endTime', header: 'Finished', render: (item) => (item.endTime ? new Date(item.endTime).toLocaleString() : '—') },
          ]}
          data={overview.jobs.slice(0, 8)}
          emptyMessage="No jobs have been executed yet."
        />
      </Card>
    </div>
  );
}
