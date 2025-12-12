'use client';

import { useEffect, useState } from 'react';

type ApiList<T> = {
  items: T[];
  totalCount?: number;
  error?: string;
};

type Customer = {
  customerId?: string;
  customerName?: string;
  name?: string;
};

type Baseline = {
  baselineId?: string;
  baselineName?: string;
  status?: string;
};

async function fetchList<T>(path: string): Promise<ApiList<T>> {
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) {
      return { items: [], error: `Request failed: ${response.status} ${response.statusText}` };
    }
    return (await response.json()) as ApiList<T>;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { items: [], error: message };
  }
}

export default function HomePage() {
  const [customers, setCustomers] = useState<ApiList<Customer>>({ items: [] });
  const [baselines, setBaselines] = useState<ApiList<Baseline>>({ items: [] });
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [loadingBaselines, setLoadingBaselines] = useState(true);

  useEffect(() => {
    fetchList<Customer>('/api/customers').then((data) => {
      setCustomers(data);
      setLoadingCustomers(false);
    });
    fetchList<Baseline>('/api/baselines').then((data) => {
      setBaselines(data);
      setLoadingBaselines(false);
    });
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">AvePoint Elements Portal</p>
          <h1>Partner customer and baseline overview</h1>
          <p className="lead">
            All AvePoint Elements requests are executed server-side through secure API routes that use OAuth2
            client credentials with server-only secrets.
          </p>
          <div className="callouts">
            <div>
              <strong>{customers.totalCount ?? customers.items.length}</strong>
              <span>Customers</span>
            </div>
            <div>
              <strong>{baselines.totalCount ?? baselines.items.length}</strong>
              <span>Baselines</span>
            </div>
          </div>
        </div>
      </header>

      <section className="panels">
        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Customers</p>
              <h2>Connected tenants</h2>
            </div>
            {customers.error && <span className="badge badge--error">{customers.error}</span>}
          </div>
          {loadingCustomers ? (
            <p className="muted">Loading customers…</p>
          ) : customers.items.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Customer ID</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.items.map((customer, index) => (
                    <tr key={`${customer.customerId ?? customer.customerName ?? index}`}>
                      <td>{customer.customerName ?? customer.name ?? 'Unnamed customer'}</td>
                      <td className="muted">{customer.customerId ?? 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No customers returned.</p>
          )}
        </article>

        <article className="panel">
          <div className="panel__header">
            <div>
              <p className="eyebrow">Baselines</p>
              <h2>Backup maturity baselines</h2>
            </div>
            {baselines.error && <span className="badge badge--error">{baselines.error}</span>}
          </div>
          {loadingBaselines ? (
            <p className="muted">Loading baselines…</p>
          ) : baselines.items.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Baseline ID</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {baselines.items.map((baseline, index) => (
                    <tr key={`${baseline.baselineId ?? baseline.baselineName ?? index}`}>
                      <td>{baseline.baselineName ?? 'Unnamed baseline'}</td>
                      <td className="muted">{baseline.baselineId ?? 'Unknown'}</td>
                      <td>{baseline.status ?? 'Unknown'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="muted">No baselines returned.</p>
          )}
        </article>
      </section>
    </main>
  );
}
