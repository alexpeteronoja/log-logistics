import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
export const OverviewSkeleton = () => {
    return (<>
      <Skeleton width={80} height={12} baseColor="#2d2a6e" highlightColor="#3b368a"/>
    </>);
};
