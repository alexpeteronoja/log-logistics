import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ShipmentDetailsSkeleton() {
  return (
    <div className="pt-24 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
      {/* Header Skeleton */}
      <div className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Back button placeholder */}
          <div className="mb-4">
            <Skeleton width={60} height={18} />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <Skeleton width={220} height={32} className="mb-2" />
              <Skeleton width={160} height={18} />
            </div>

            {/* Status & Sync Button placeholder */}
            <div className="flex items-center gap-3">
              <Skeleton width={80} height={26} borderRadius={9999} />
              <Skeleton width={130} height={32} borderRadius={6} />
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton circle width={20} height={20} />
              <Skeleton width={160} height={20} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton width={110} height={14} />
                  <Skeleton width="75%" height={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <Skeleton width={150} height={22} className="mb-6" />

            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <Skeleton circle width={40} height={40} />
                    {index < 2 && <Skeleton width={2} height={45} className="mt-2" />}
                  </div>
                  <div className="flex-1 space-y-2 pb-4">
                    <Skeleton width={120} height={14} />
                    <Skeleton width="80%" height={16} />
                    <Skeleton width={100} height={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Sender Card Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton circle width={20} height={20} />
              <Skeleton width={80} height={20} />
            </div>
            <div className="space-y-2">
              <Skeleton width={140} height={18} />
              <Skeleton width="90%" height={14} />
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={14} />
            </div>
          </div>

          {/* Receiver Card Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Skeleton circle width={20} height={20} />
              <Skeleton width={90} height={20} />
            </div>
            <div className="space-y-2">
              <Skeleton width={150} height={18} />
              <Skeleton width="85%" height={14} />
              <Skeleton width="60%" height={14} />
              <Skeleton width="40%" height={14} />
              <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                <Skeleton width="70%" height={14} />
                <Skeleton width="80%" height={14} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

