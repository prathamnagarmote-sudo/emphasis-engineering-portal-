import { FC } from 'react';
import PageHero from '@/components/ui/PageHero';

const CookiePolicy: FC = () => {
  return (
    <div className="pt-20">
      <PageHero 
        badge="Legal"
        heading="Cookie Policy"
        subtitle="Information about how we use cookies on our website."
      />
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 prose prose-lg">
          <h2>1. What Are Cookies</h2>
          <p>Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored in your web browser and allows the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.</p>
          <h2>2. How We Use Cookies</h2>
          <p>When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes: to enable certain functions of the Service, to provide analytics, to store your preferences, to enable advertisements delivery, including behavioral advertising.</p>
          <h2>3. Your Choices Regarding Cookies</h2>
          <p>If you'd like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.</p>
          <p>This is a placeholder policy. Please replace with actual legal text.</p>
        </div>
      </section>
    </div>
  );
};

export default CookiePolicy;
