import { ReactNode } from 'react';
import { fetchCustomerOverview, fetchCustomers } from '../../../../lib/data-service';
import { CustomerShell } from '../../../../components/dashboard/CustomerShell';

export const dynamic = 'force-dynamic';

export default async function CustomerLayout({ children, params }: { children: ReactNode; params: { customerId: string } }) {
  const [customersResponse, overview] = await Promise.all([
    fetchCustomers(),
    fetchCustomerOverview(params.customerId),
  ]);

  return (
    <CustomerShell
      customers={customersResponse.items}
      activeCustomerId={params.customerId}
      heading={overview.customer.name}
      description="Centralize protection, operations, and compliance for every tenant."
      lastUpdated={overview.lastUpdated}
    >
      {children}
    </CustomerShell>
  );
}
