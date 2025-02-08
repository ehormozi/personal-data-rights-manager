import ContactUs from './components/server/contact-us';
import FAQ from './components/server/faq';
import YourSupportHistory from './components/server/your-support-history';

export default function HelpSupportPage() {
  return (
    <div className="flex flex-col bg-neutral-100 min-h-screen p-6 space-y-6">
      <header className="text-2xl font-semibold text-gray-950 border-b border-gray-300 pb-4">
        Help & Support
      </header>
      <div className="flex flex-row bg-neutral-100 space-x-6">
        <div className="basis-1/2 space-y-4">
          <ContactUs />
        </div>
        <div className="basis-1/2 space-y-4">
          <FAQ />
        </div>
      </div>
      <YourSupportHistory />
    </div>
  );
}
