
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes DEVELOP different from other real estate agencies?",
    answer: "DEVELOP combines deep market expertise with a data-driven approach and a suite of in-house services, including property management and interior design, to provide a seamless, end-to-end luxury real estate experience."
  },
  {
    question: "Do you only deal with luxury properties?",
    answer: "While we specialize in the luxury segment, our portfolio is diverse and includes a wide range of premium properties. We focus on quality and investment potential across all our listings."
  },
  {
    question: "Can you help with financing a property purchase?",
    answer: "Yes, through our mortgage consultancy service, we connect clients with the best financing options available from our network of banking partners."
  },
  {
    question: "What is an 'off-plan' property?",
    answer: "An off-plan property is a property that is purchased before it has been constructed. These often offer attractive pricing and payment plans, representing a great investment opportunity."
  },
   {
    question: "What areas in Dubai do you specialize in?",
    answer: "Our team has extensive experience across all of Dubai's prime residential areas, including Downtown Dubai, Palm Jumeirah, Dubai Marina, and Dubai Hills Estate, among others."
  }
]

export function FAQ() {
  return (
    <section className="py-16 bg-card">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
