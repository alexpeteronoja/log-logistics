const stats = [
    { value: "500K+", label: "Deliveries Made" },
    { value: "98%", label: "On-Time Rate" },
    { value: "24/7", label: "Customer Support" },
];
function Stats() {
    return (<section className="py-20 bg-[#20186D]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (<div key={index} className="text-center">
              <div className="text-4xl md:text-5xl text-white mb-2">
                {stat.value}
              </div>
              <div className="text-blue-100">{stat.label}</div>
            </div>))}
        </div>
      </div>
    </section>);
}
export default Stats;
