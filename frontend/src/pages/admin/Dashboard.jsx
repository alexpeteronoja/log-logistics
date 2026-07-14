import StatCard from "../../components/dashboard/StatCard";
import { useGetOverview } from "../../datahooks/dashboard/dashboardHook";
import Skeleton from "react-loading-skeleton";
function Dashboard() {
    const { getOverview, getOverviewLoading } = useGetOverview();
    const overviewArray = Object.entries(getOverview ?? {})
        .filter(([key]) => key !== "_id")
        .map(([key, value]) => ({
        key,
        value,
    }));
    return (<>
      <div className="mt-18 pb-10 ml-0 lg:ml-71 px-4 md:px-8.5 bg-background text-textcol min-h-dvh">
        <div className="pt-5 pb-3">
          <h1 className="text-3xl sm:text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of all shipments and logistics operations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {getOverviewLoading ? (<Skeleton width={80} height={12} baseColor="#2d2a6e" highlightColor="#3b368a"/>) : (overviewArray?.map((item) => (<div key={item.key}>
                <StatCard header={item.key} content={String(item.value)}/>
              </div>)))}
        </div>
      </div>
    </>);
}
export default Dashboard;
