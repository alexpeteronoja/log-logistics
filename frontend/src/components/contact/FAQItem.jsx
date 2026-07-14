import { ChevronDown } from "lucide-react";
export const FAQItem = ({ faq, index }) => (<details key={index} className="group rounded-2xl border border-gray-100 bg-white shadow-sm open:shadow-md transition-all duration-300">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-6">
      <span className="font-semibold text-primary">{faq.q}</span>
      <ChevronDown size={18} className="shrink-0 text-orange-500 transition-transform duration-300 group-open:rotate-180"/>
    </summary>
    <p className="px-7 pb-6 text-sm leading-7 text-gray-500">{faq.a}</p>
  </details>);
