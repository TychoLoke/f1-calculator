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
  name?: string;
};

const formatDate = (value?: string | number | Date) => {
  if (!value) return 'Unknown';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleString();
};

async function fetchList<T>(path: string): Promise<ApiList<T>> {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    return { items: [], error: `Request failed: ${response.statusText}` };
  }
  return (await response.json()) as ApiList<T>;
}

export default function HomePage() {
  const [customers, setCustomers] = useState<ApiList<Customer>>({ items: [] });
  const [baselines, setBaselines] = useState<ApiList<Baseline>>({ items: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [customerData, baselineData] = await Promise.all([
        fetchList<Customer>('/api/customers'),
        fetchList<Baseline>('/api/baselines'),
      ]);

      setCustomers(customerData);
      setBaselines(baselineData);
      setLoading(false);
    };

    load();
  }, []);

  return (
    <main className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">AvePoint Elements Portal</p>
          <h1>Partner customer and baseline overview</h1>
          <p className="lead">
            Data is served through secure server-side integrations. Tokens are cached on the server and refreshed automatically
            using the OAuth2 client credentials flow.
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
          {loading ? (
            <p className="muted">Loading customers…</p>
          ) : customers.items.length ? (
            <ul className="list">
              {customers.items.map((customer, index) => (
                <li key={`${customer.customerId ?? customer.customerName ?? index}`} className="list__item">
                  <div>
                    <h3>{customer.customerName ?? customer.name ?? 'Unnamed customer'}</h3>
                    <p className="muted">ID: {customer.customerId ?? 'Unknown'}</p>
                  </div>
                </li>
              ))}
            </ul>
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
          {loading ? (
            <p className="muted">Loading baselines…</p>
          ) : baselines.items.length ? (
            <ul className="list">
              {baselines.items.map((baseline, index) => (
                <li key={`${baseline.baselineId ?? baseline.baselineName ?? index}`} className="list__item">
                  <div>
                    <h3>{baseline.baselineName ?? baseline.name ?? 'Unnamed baseline'}</h3>
                    <p className="muted">
                      ID: {baseline.baselineId ?? 'Unknown'} • Status: {baseline.status ?? 'Unknown'}
                    </p>
                  </div>
                  {baseline && 'lastModified' in baseline && (
                    <span className="muted">{formatDate((baseline as { lastModified?: string }).lastModified)}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No baselines returned.</p>
          )}
        </article>
      </section>
    </main>
  );
}
