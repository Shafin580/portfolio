import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AnimatedSection } from "@/components/animated-section";
import { cn } from "@/lib/utils";
import { faqs as siteFaqs, type Faq as FaqItem } from "@/lib/portfolio-data";

/**
 * Visible FAQ. Deliberately plain text inside the accordion — this is the
 * block answer engines quote, and the same array feeds the `FAQPage` JSON-LD
 * node so the structured data can never disagree with the page.
 *
 * Defaults to the site-wide `faqs` for the homepage; case-study pages pass
 * their own `items`. There is deliberately only one accordion implementation —
 * forking a second one is how the markup and the schema drift apart.
 */
export function Faq({
  items = siteFaqs,
  id = "faq",
  title = "Frequently Asked Questions",
  description = "Quick answers about my experience, stack, and availability.",
  className,
  headingClassName = "text-3xl font-bold mb-2",
}: {
  items?: readonly FaqItem[];
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  headingClassName?: string;
}) {
  if (!items.length) return null;

  return (
    <section id={id} className={cn("py-20", className)} aria-labelledby={`${id}-heading`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fadeInUp">
          <h2 id={`${id}-heading`} className={headingClassName}>
            {title}
          </h2>
          {description && <p className="text-muted-foreground mb-10">{description}</p>}
        </AnimatedSection>

        <AnimatedSection animation="fadeInUp" delay={100}>
          <Accordion type="single" collapsible className="max-w-3xl">
            {items.map((faq, index) => (
              <AccordionItem key={faq.question} value={`${id}-${index}`}>
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
