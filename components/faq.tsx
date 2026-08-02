import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/animated-section";
import { faqs } from "@/lib/portfolio-data";

/**
 * Visible FAQ. Deliberately plain text inside the accordion — this is the
 * block answer engines quote, and the same `faqs` array feeds the FAQPage
 * JSON-LD node so the structured data can never disagree with the page.
 */
export function Faq() {
  return (
    <section id="faq" className="py-20" aria-labelledby="faq-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <h2 id="faq-heading" className="text-3xl font-bold mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-10">
            Quick answers about my experience, stack, and availability.
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={100}>
          <Accordion type="single" collapsible className="max-w-3xl">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimatedSection>
      </div>
    </section>
  );
}
