'use client';

import WhiteBox from '@/components/server/white-box';
import Widget from '@/components/server/widget';
import { useState } from 'react';

interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export default function FAQClient(props: { data: FAQ[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const groupedFAQs: Record<string, FAQ[]> = props.data.reduce(
    (acc: { [x: string]: any[] }, faq: { category: string }) => {
      acc[faq.category] = acc[faq.category] || [];
      acc[faq.category].push(faq);
      return acc;
    },
    {} as Record<string, FAQ[]>,
  );

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <Widget title="Frequently Asked Questions">
      <WhiteBox className="p-4 h-[25rem] overflow-auto">
        <div className="space-y-3">
          {Object.entries(groupedFAQs).map(([category, faqs], index) => (
            <div key={index} className="border-b pb-3">
              <button
                className="w-full text-left text-sm font-semibold text-gray-800 flex justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                onClick={() => toggleCategory(category)}
              >
                {category}
                <span className="text-gray-600">
                  {openCategory === category ? '▲' : '▼'}
                </span>
              </button>
              {openCategory === category && (
                <ul className="mt-2 space-y-2">
                  {faqs.map((faq, qIndex) => (
                    <li key={qIndex} className="p-2 bg-white rounded-lg">
                      <p className="text-sm font-semibold text-gray-800">
                        {faq.question}
                      </p>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </WhiteBox>
    </Widget>
  );
}
