import { SkeletonBlock } from '../../../../components/dashboard/SkeletonBlock';

export default function CustomerLoading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-28" />
        ))}
      </div>
      <SkeletonBlock className="h-64" />
      <SkeletonBlock className="h-64" />
    </div>
  );
}
