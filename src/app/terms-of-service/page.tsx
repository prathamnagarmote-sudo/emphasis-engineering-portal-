import { FC } from 'react';
import PageHero from '@/components/ui/PageHero';

const TermsOfService: FC = () => {
  return (
    <div className="pt-20 bg-gray-50 min-h-screen">
      <PageHero 
        badge="Legal"
        heading="Terms of Service"
        subtitle="Last Updated: May 14, 2026"
      />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-gray-100 prose prose-teal max-w-none">
            <p className="lead text-gray-500 italic">Please read these Terms of Service carefully before using the Emphasis Engineering platform.</p>
            
            <h2 className="text-secondary">1. Acceptance of Terms</h2>
            <p>By accessing or using our platform, mentorship services, or educational materials, you agree to be bound by these Terms. These terms apply to all students, instructors, and visitors who access our Services.</p>
            
            <h2 className="text-secondary">2. Account Responsibility</h2>
            <p>When you create an account, you must provide accurate and complete information. You are solely responsible for the activity that occurs on your account and for keeping your account password secure. Sharing account credentials for premium courses is strictly prohibited.</p>
            
            <h2 className="text-secondary">3. Intellectual Property</h2>
            <p>The Service and its original content (excluding student-provided data), features, and functionality are the exclusive property of Emphasis Engineering. Our curriculum, proprietary roadmap frameworks, and mock test patterns are protected by copyright and trade secret laws.</p>
            
            <h2 className="text-secondary">4. Mentorship & Services</h2>
            <p>Mentorship sessions and professional reviews are provided as one-on-one professional support. We do not guarantee a specific licensure outcome; the final responsibility for professional certification lies with the relevant engineering institutions (ICE, PEO, NCEES, etc.).</p>
            
            <h2 className="text-secondary">5. Payments & Refunds</h2>
            <p>All fees are quoted in Canadian Dollars (C$). Course fees are non-refundable once the digital content has been accessed. For mentorship sessions, cancellation must be provided 24 hours in advance to be eligible for rescheduling.</p>
            
            <h2 className="text-secondary">6. Limitation of Liability</h2>
            <p>In no event shall Emphasis Engineering be liable for any indirect, incidental, special, or consequential damages resulting from the use or the inability to use our services.</p>
            
            <h2 className="text-secondary">7. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
