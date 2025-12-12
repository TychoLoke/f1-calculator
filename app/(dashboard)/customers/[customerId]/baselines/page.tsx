import { Card } from '../../../../../components/dashboard/Card';
import { DataTable } from '../../../../../components/dashboard/DataTable';
import { StatusBadge } from '../../../../../components/dashboard/StatusBadge';
import { fetchCustomerOverview } from '../../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export default async function BaselinesPage({ params }: { params: { customerId: string } }) {
  const overview = await fetchCustomerOverview(params.customerId);

  return (
    <Card title="Baselines" subtitle="Protection and policy baselines" accent>
      <DataTable
        columns={[
          { key: 'name', header: 'Baseline' },
          { key: 'baselineId', header: 'ID' },
          { key: 'status', header: 'Status', render: (item) => <StatusBadge status={item.status}>{item.status}</StatusBadge> },
        ]}
        data={overview.baselines}
        emptyMessage="No baselines have been created. Establish baselines to track drift."
      />
    </Card>
  );
}
