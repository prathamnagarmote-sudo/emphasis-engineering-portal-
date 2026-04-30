import { FC } from 'react';
import PageHero from '@/components/ui/PageHero';

const TermsOfService: FC = () => {
  return (
    <div className="pt-20">
      <PageHero 
        badge="Legal"
        heading="Terms of Service"
        subtitle="The rules and regulations for using our platform."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using our Services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
          <h2>2. Intellectual Property</h2>
          <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Emphasis Engineering and its licensors.</p>
          <h2>3. User Accounts</h2>
          <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
          <p>This is a placeholder policy. Please replace with actual legal text.</p>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
