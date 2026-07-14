import Skeleton from "react-loading-skeleton";
export const StaffGridSkeleton = () => {
    return (<div className="grid grid-cols-3 gap-3.5">
      {Array.from({ length: 6 }).map((_, index) => (<div key={index} className="p-4 rounded-xl border border-gray-200 space-y-4">
          {/* Header (avatar + name) */}
          <div className="flex items-center gap-3">
            <Skeleton circle width={40} height={40}/>
            <div className="flex-1">
              <Skeleton height={10} width="70%"/>
              <Skeleton height={8} width="50%" style={{ marginTop: 6 }}/>
            </div>
          </div>

          {/* Email */}
          <Skeleton height={10} width="90%"/>

          {/* Phone */}
          <Skeleton height={10} width="60%"/>

          {/* Role + Status */}
          <div className="flex justify-between pt-2">
            <Skeleton height={20} width={70} borderRadius={20}/>
            <Skeleton height={20} width={70} borderRadius={20}/>
          </div>
        </div>))}
    </div>);
};
