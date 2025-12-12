import { Card } from '../../../../../components/dashboard/Card';
import { DataTable } from '../../../../../components/dashboard/DataTable';
import { GradientMeter } from '../../../../../components/dashboard/GradientMeter';
import { StatusBadge } from '../../../../../components/dashboard/StatusBadge';
import { fetchCustomerOverview } from '../../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export default async function BackupPage({ params }: { params: { customerId: string } }) {
  const overview = await fetchCustomerOverview(params.customerId);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title="Coverage" subtitle="Backup saturation across Microsoft 365" accent>
        <GradientMeter
          label="Protected users"
          value={overview.backup.coverageRate}
          helper={`${overview.backup.protectedUsers?.toLocaleString() ?? '—'} of ${overview.backup.microsoftSeats.toLocaleString()} seats`}
        />
        <GradientMeter label="Active services" value={overview.kpis.activeServices ? Math.round((overview.kpis.activeServices / (overview.kpis.services || 1)) * 100) : null} helper={`${overview.kpis.activeServices} of ${overview.kpis.services} services`} />
      </Card>

      <Card title="Jobs" subtitle="Recent backup job performance" accent>
        <div className="space-y-3 text-sm text-slate-200">
          <div className="flex items-center justify-between">
            <span>Jobs executed</span>
            <span className="font-semibold">{overview.jobs.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Failures</span>
            <span className="font-semibold text-rose-200">{overview.kpis.jobsFailed}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Success rate</span>
            <span className="font-semibold">
              {overview.jobs.length
                ? `${Math.round(((overview.jobs.length - overview.kpis.jobsFailed) / overview.jobs.length) * 100)}%`
                : '—'}
            </span>
          </div>
        </div>
      </Card>

      <Card title="Services" subtitle="Seat and storage allocation" accent>
        <DataTable
          columns={[
            { key: 'name', header: 'Service' },
            { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status}>{item.status}</StatusBadge> },
            { key: 'purchasedSeats', header: 'Purchased', render: (item) => (item.purchasedSeats ?? '—').toLocaleString() },
            { key: 'assignedSeats', header: 'Assigned', render: (item) => (item.assignedSeats ?? '—').toLocaleString() },
          ]}
          data={overview.services}
          emptyMessage="No backup services are active yet."
        />
      </Card>
    </div>
  );
}
