
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can I view my property valuation online?",
    answer: "To view your property valuation online, we conduct a Comparative Market Analysis (CMA). This is based on the recent sales history of similar properties, factoring in age, condition, and specific features of your unit to determine an accurate market value."
  },
  {
    question: "How can I sell my property quickly online?",
    answer: "To sell your property quickly, register with DEVELOP. We provide comprehensive support including professional maintenance and cleaning to ensure your property is presented in the best light, along with an expedited advertising and sales process."
  },
  {
    question: "What is the process for selling my property in Dubai?",
    answer: "The process is designed to be hassle-free. By listing with DEVELOP, you entrust us to handle all the legal and sales aspects. We manage everything from marketing your property to coordinating with legal teams for a smooth transaction."
  },
  {
    question: "Can I sell my property in Dubai in 2026?",
    answer: "Yes, you can sell your property in Dubai in 2026, provided that you have a clear title deed and the unit is ready for transfer to the new owner without any legal or financial encumbrances."
  },
  {
    question: "How do I get a free property valuation in 2026?",
    answer: "To get a free property valuation in 2026, simply contact our team to request a complimentary Comparative Market Analysis (CMA). We will provide you with a sensible and realistic price range for your property."
  },
  {
    question: "How long does it take to sell a property in 2026?",
    answer: "The timeline for selling a property in 2026 is variable. Units that are priced correctly according to the current market tend to sell fast. Delays can sometimes occur due to paperwork or other logistical factors."
  },
  {
    question: "What documents are required in 2026?",
    answer: "The essential documents required to sell your property in 2026 include the Title Deed, your Emirates ID or Passport copy, and the tenancy contract if the property is currently rented."
  },
  {
    question: "Why choose DEVELOP to sell in 2026?",
    answer: "Choosing DEVELOP means you get a dedicated 'one team' approach. We manage the full lifecycle of the sale, from listing and marketing to conducting viewings and handling all the necessary steps for a successful transfer."
  }
];

export function SellerFaq() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions:</h2>
        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border-b border-gray-200">
              <AccordionTrigger className="text-lg font-bold text-black text-left hover:no-underline py-6">
                {`${index + 1}. ${faq.question}`}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-700 leading-relaxed pt-0 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
