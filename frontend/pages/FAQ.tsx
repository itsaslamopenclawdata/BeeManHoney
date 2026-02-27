import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { MobileNav } from '../components/MobileNav';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What types of honey do you offer?",
    answer: "We offer a variety of premium honey including Raw Honey, Processed Honey, Organic Honey, and Infused Honey. Each type comes in different flavors and sizes to suit your preferences."
  },
  {
    question: "How is your honey sourced?",
    answer: "Our honey is ethically sourced from trusted beekeepers across India. We work directly with local farmers to ensure sustainable beekeeping practices and the highest quality honey."
  },
  {
    question: "What is the shelf life of your honey?",
    answer: "Our honey has a shelf life of 2-3 years when stored in a cool, dry place. Natural honey never spoils if properly stored!"
  },
  {
    question: "Do you offer bulk orders or wholesale?",
    answer: "Yes! We offer competitive pricing for bulk orders. Please contact us through the Contact page or email us at wholesale@beemanhoney.com for custom quotes."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the Order History section."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unopened products. If you receive a damaged or incorrect item, please contact us immediately with photos for a full refund or replacement."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we ship within India. International shipping coming soon! Sign up for our newsletter to be notified when we expand."
  },
  {
    question: "How should I store honey?",
    answer: "Store honey in a cool, dry place away from direct sunlight. Natural honey may crystallize over time - this is normal! Simply warm the jar in warm water to return it to liquid form."
  },
  {
    question: "Is your honey organic?",
    answer: "We offer both organic and non-organic options. Look for the 'Organic' badge on product pages for our certified organic honey varieties."
  },
  {
    question: "How can I become a reseller?",
    answer: "We're always looking for partners! Please email partnership@beemanhoney.com with your business details and we'll get back to you within 48 hours."
  },
  {
    question: "Do you offer gift packaging?",
    answer: "Yes! We have beautiful gift boxes perfect for festivals and special occasions. You can select gift packaging during checkout."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via the Contact page, email us at support@beemanhoney.com, or call us at +91-XXXXXXXXXX (Mon-Sat, 9AM-6PM IST)."
  }
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Find answers to common questions about our honey products, orders, and shipping.
          Can't find what you're looking for? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>.
        </p>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center bg-primary/10 rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Still have questions?</h2>
          <p className="text-gray-600 mb-4">Our team is here to help you with any questions about our products.</p>
          <Link
            to="/contact"
            className="inline-block bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
};

export default FAQ;
