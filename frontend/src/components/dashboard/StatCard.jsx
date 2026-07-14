function StatCard({ header, content }) {
    return (<div className="bg-primary text-white flex justify-between items-center p-5 md:p-6 w-full rounded-lg shadow-sm">
      <div>
        <p className="text-xs md:text-sm">{header}</p>
        <p className="text-lg md:text-2xl mt-2">{content}</p>
      </div>
      {/* <div className="bg-primary/10 text-primary p-3 rounded-lg">
          <Icon className="w-6 h-6" />
        </div> */}
    </div>);
}
export default StatCard;
