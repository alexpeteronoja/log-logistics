import { Link } from "react-router-dom";
import { ServiceData } from "../../data/ServiceData";
function Services() {
    return (<>
      <section className="py-24 px-[5%] bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-3.5">
              <div className="bg-[#ef770e1f] text-accent font-bold font-nunito py-1 px-5 rounded-2xl">
                What We Offer
              </div>
            </div>

            <h2 className="font-syne text-5xl font-extrabold text-primary mt-5">
              Services Built for{" "}
              <span className="text-accent">Speed & Reliability</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ServiceData.map((service) => (<div key={service.title} className="bg-white p-8 rounded-xl shadow-[0_2px_16px_rgba(32,24,109,0.07)] transition-all duration-200">
                <div className="w-14 h-14 rounded-2xl
              flex items-center justify-center
              bg-linear-to-br
              from-primary/10
              to-accent/20
              mb-5 ">
                  <service.icon />
                </div>

                <h3 className="font-syne text-xl font-bold text-primary mb-3">
                  {service.title}
                </h3>

                <p className="text-[#6b7280] leading-7 text-sm">
                  {service.desc}
                </p>

                <p className="mt-5 text-sm text-accent font-semibold">
                  <Link to="/about">Learn More</Link>
                </p>
              </div>))}
          </div>
        </div>
      </section>
    </>);
}
export default Services;
