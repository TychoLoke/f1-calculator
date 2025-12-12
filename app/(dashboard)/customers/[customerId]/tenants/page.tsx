import { Card } from '../../../../../components/dashboard/Card';
import { DataTable } from '../../../../../components/dashboard/DataTable';
import { fetchCustomerOverview } from '../../../../../lib/data-service';

export const dynamic = 'force-dynamic';

export default async function TenantsPage({ params }: { params: { customerId: string } }) {
  const overview = await fetchCustomerOverview(params.customerId);

  return (
    <Card title="Tenants" subtitle="All connected tenants with license footprints" accent>
      <DataTable
        columns={[
          { key: 'tenantName', header: 'Tenant' },
          { key: 'tenantId', header: 'ID' },
          { key: 'seats', header: 'Seats', render: (item) => item.seats.toLocaleString() },
        ]}
        data={overview.tenants}
        emptyMessage="No tenants are connected yet. Connect a tenant to view protection coverage."
      />
    </Card>
  );
}
