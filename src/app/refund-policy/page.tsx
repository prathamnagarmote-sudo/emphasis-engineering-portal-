import { FC } from 'react';
import PageHero from '@/components/ui/PageHero';

const RefundPolicy: FC = () => {
  return (
    <div className="pt-20">
      <PageHero 
        badge="Legal"
        heading="Refund Policy"
        subtitle="Our policies regarding refunds and money-back guarantees."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg">
          <h2>1. Money-Back Guarantee</h2>
          <p>We stand fully behind the quality of our services. Every candidate we have supported has successfully achieved their intended outcome, giving us a 100% success rate to date.</p>
          <h2>2. Refund Terms</h2>
          <p>If our courses, tests, or support do not meet the standard we promise, we offer a money-back guarantee under fair use terms. Please note that final registration decisions remain with external institutions.</p>
          <h2>3. Contact Us</h2>
          <p>If you have any questions about our Refund Policy, please contact us at emphasis.engineering@gmail.com.</p>
          <p>This is a placeholder policy. Please replace with actual legal text.</p>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
