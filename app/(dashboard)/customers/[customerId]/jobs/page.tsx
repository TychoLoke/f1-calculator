import { Card } from '../../../../../components/dashboard/Card';
import { DataTable } from '../../../../../components/dashboard/DataTable';
import { StatusBadge } from '../../../../../components/dashboard/StatusBadge';
import { fetchCustomerOverview } from '../../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ params }: { params: { customerId: string } }) {
  const overview = await fetchCustomerOverview(params.customerId);

  return (
    <div className="space-y-6">
      <Card title="Job health" subtitle="Execution quality across workloads" accent>
        <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-3">
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
            <span>Jobs observed</span>
            <span className="font-semibold text-white">{overview.jobs.length}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
            <span>Failures</span>
            <span className="font-semibold text-rose-200">{overview.kpis.jobsFailed}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3">
            <span>Success rate</span>
            <span className="font-semibold text-emerald-200">
              {overview.jobs.length
                ? `${Math.round(((overview.jobs.length - overview.kpis.jobsFailed) / overview.jobs.length) * 100)}%`
                : '—'}
            </span>
          </div>
        </div>
      </Card>

      <Card title="Recent jobs" subtitle="Chronological execution detail" accent>
        <DataTable
          columns={[
            { key: 'jobId', header: 'Job' },
            { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status}>{item.status}</StatusBadge> },
            { key: 'startTime', header: 'Started', render: (item) => new Date(item.startTime).toLocaleString() },
            { key: 'endTime', header: 'Finished', render: (item) => (item.endTime ? new Date(item.endTime).toLocaleString() : '—') },
          ]}
          data={overview.jobs}
          emptyMessage="No jobs have been executed yet."
        />
      </Card>
    </div>
  );
}
