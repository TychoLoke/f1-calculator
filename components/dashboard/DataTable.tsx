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
      <div className="rounded-2xl border border-white/5 bg-white/5 p-6 text-center text-sm text-slate-400">
        {emptyMessage ?? 'No records found.'}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/5 shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-300">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={`px-4 py-3 font-medium ${column.className ?? ''}`} scope="col">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-white/5">
                {columns.map((column) => (
                  <td key={String(column.key)} className={`px-4 py-3 align-middle ${column.className ?? ''}`}>
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
