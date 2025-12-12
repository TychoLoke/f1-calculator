import { SkeletonBlock } from '../../../components/dashboard/SkeletonBlock';

export default function CustomersLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-32" />
        ))}
      </div>
      <SkeletonBlock className="h-96 w-full" />
    </div>
  );
}
