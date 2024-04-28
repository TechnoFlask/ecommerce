import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="mt-28 flex justify-between">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 items-center">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
