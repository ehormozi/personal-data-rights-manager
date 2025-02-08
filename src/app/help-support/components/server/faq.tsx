import WhiteBox from '@/components/material/white-box';
import Widget from '@/components/material/widget';

export default async function FAQ() {
  const faqs = [
    {
      question: 'How can I revoke permissions?',
      answer:
        'Visit the Permissions Overview page to revoke permissions for specific services.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Go to the Profile & Settings page and select "Change Password".',
    },
    {
      question: 'What should I do if I notice a data breach?',
      answer:
        'Review the Activity Log page for breach details and follow the suggested steps.',
    },
    {
      question: 'How can I revoke permissions?',
      answer:
        'Visit the Permissions Overview page to revoke permissions for specific services.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Go to the Profile & Settings page and select "Change Password".',
    },
    {
      question: 'What should I do if I notice a data breach?',
      answer:
        'Review the Activity Log page for breach details and follow the suggested steps.',
    },
    {
      question: 'How can I revoke permissions?',
      answer:
        'Visit the Permissions Overview page to revoke permissions for specific services.',
    },
    {
      question: 'How do I reset my password?',
      answer: 'Go to the Profile & Settings page and select "Change Password".',
    },
    {
      question: 'What should I do if I notice a data breach?',
      answer:
        'Review the Activity Log page for breach details and follow the suggested steps.',
    },
  ];

  return (
    <Widget title="Frequently Asked Questions">
      <WhiteBox className="p-4 h-[25rem] overflow-auto">
        <ul className="space-y-3">
          {faqs.map((faq, index) => (
            <li key={index} className="border-b pb-3">
              <p className="text-sm font-medium text-gray-800">
                {faq.question}
              </p>
              <p className="text-sm text-gray-600">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </WhiteBox>
    </Widget>
  );
}
