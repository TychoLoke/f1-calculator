import React from 'react';

export type Column<T> = {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T>({ columns, data, emptyMessage }: DataTableProps<T>) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400 shadow-lg shadow-black/20">
        {emptyMessage ?? 'No records found.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 via-white/0 to-white/5 shadow-2xl shadow-black/20 ring-1 ring-white/10">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-sm">
          <thead className="bg-gradient-to-r from-sky-900/40 via-slate-900/40 to-purple-900/30 text-left text-[11px] uppercase tracking-[0.18em] text-slate-200/90">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={`px-4 py-3 font-medium ${column.className ?? ''}`} scope="col">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400/70" aria-hidden />
                    {column.header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr key={index} className="bg-white/[0.02] transition hover:bg-white/10">
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-4 py-3 align-middle text-slate-100/90 ${column.className ?? ''}`}>
                    {column.render ? column.render(item) : ((item as Record<string, unknown>)[column.key as string] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
