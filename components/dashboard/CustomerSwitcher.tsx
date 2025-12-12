'use client';

import { useRouter } from 'next/navigation';

export type CustomerOption = {
  id: string;
  name: string;
};

export function CustomerSwitcher({ options, currentId }: { options: CustomerOption[]; currentId: string }) {
  const router = useRouter();

  return (
    <select
      className="rounded-lg border border-white/20 bg-slate-900/60 px-3 py-2 text-xs text-slate-100"
      value={currentId}
      onChange={(event) => {
        const value = event.target.value;
        router.push(`/customers/${value}`);
      }}
    >
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
}
