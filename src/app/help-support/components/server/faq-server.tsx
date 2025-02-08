import FAQClient from '../client/faq-client';

export default async function FAQServer() {
  const response = await fetch('http://localhost:3001/api/faqs');
  const data = await response.json();

  return <FAQClient data={data} />;
}
