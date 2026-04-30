import { FC } from 'react';
import PageHero from '@/components/ui/PageHero';

const PrivacyPolicy: FC = () => {
  return (
    <div className="pt-20">
      <PageHero 
        badge="Legal"
        heading="Privacy Policy"
        subtitle="How we handle your data and protect your privacy."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg">
          <h2>1. Introduction</h2>
          <p>Welcome to Emphasis Engineering. We are committed to protecting your personal information and your right to privacy.</p>
          <h2>2. Information We Collect</h2>
          <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services or otherwise when you contact us.</p>
          <h2>3. How We Use Your Information</h2>
          <p>We use personal information collected via our Services for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
          <p>This is a placeholder policy. Please replace with actual legal text.</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
