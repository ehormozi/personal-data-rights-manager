'use client';

import { useState } from 'react';

import WhiteBox from '@/app/dashboard/components/material/white-box';
import Widget from '@/app/dashboard/components/material/widget';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');
    try {
      const response = await fetch(
        'http://localhost:3001/api/handle-contact-form',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, PUT, POST',
            'Access-Control-Allow-Headers':
              'Origin, X-Requested-With, Content-Type, Accept',
          },
          body: JSON.stringify(formData),
        },
      );
      const result = await response.json();
      if (response.ok) {
        setResponseMessage(result.message);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResponseMessage(result.error);
      }
    } catch (error) {
      setResponseMessage('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <Widget title="Contact Us">
      <WhiteBox className="p-4 h-[25rem] overflow-auto">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {responseMessage && (
            <p className="text-sm text-gray-600 mt-2">{responseMessage}</p>
          )}
        </form>{' '}
      </WhiteBox>
    </Widget>
  );
}
