import { SkeletonBlock } from '../../../components/dashboard/SkeletonBlock';

export default function CustomersLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6">
      <SkeletonBlock className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32" />
        ))}
      </div>
    </div>
  );
}
