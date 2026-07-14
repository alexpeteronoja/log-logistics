import { Star } from "lucide-react";
const testimonials = [
    {
        name: "Sarah Johnson",
        role: "CEO, TechStart Inc.",
        content: "FastLink has been a game-changer for our business. Their same-day delivery service is incredibly reliable, and our clients love the fast turnaround times.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MDQxODUxNnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
    },
    {
        name: "Michael Chen",
        role: "Operations Manager, E-Shop Pro",
        content: "We've tried many courier services, but FastLink stands out. The real-time tracking and professional handling of our packages have exceeded our expectations.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3ODA0MTg1MTZ8MA&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
    },
    {
        name: "Emily Rodriguez",
        role: "Small Business Owner",
        content: "As a small business owner, I need reliability and affordability. FastLink delivers on both fronts. Their customer service team is always helpful and responsive.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc4MDQxODUxNnww&ixlib=rb-4.1.0&q=80&w=400&utm_source=figma&utm_medium=referral",
    },
];
function Testimonials() {
    return (<section className="py-20 bg-[#F5F7FA]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about our services.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (<div key={index} className="bg-gray-50 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400"/>))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover"/>
                <div>
                  <h4 className="text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </section>);
}
export default Testimonials;
