import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

const FaqSection = ({Faqs}) => {
  const [openFaq, setOpenFaq] = useState(0); // First FAQ open by default

  const faqData = [
    {
      question: "How do I get my dream trip planned with The Tarzan Way?",
      answer:
        "Easy – just tell us where you'd like to go and what you're confused, when you're going, and what kind of traveler you are. Whether you're into adventure, food, culture, or just chilling, we mix your vibe with our tech + travel experts to craft a trip that's 100% you.",
    },
    {
      question: "What makes TTW itineraries so different (read: better)?",
      answer:
        "Our itineraries are crafted by combining AI technology with local expertise. We don't just plan trips; we create experiences tailored to your interests, budget, and travel style. Each itinerary includes insider tips, hidden gems, and authentic local experiences you won't find in typical tourist guides.",
    },
    {
      question: "Will someone be there if things go wrong mid-trip?",
      answer:
        "Absolutely! We provide 24/7 support during your trip. Our travel experts are just a call or message away to help with any issues, changes, or emergencies. You'll have dedicated support contact information and can reach us anytime during your journey.",
    },
    {
      question: "Can you help with visa, insurance, and all that jazz?",
      answer:
        "Yes, we've got you covered! We provide comprehensive travel assistance including visa guidance, travel insurance options, vaccination requirements, and all necessary documentation. Our team will walk you through every requirement for your destination.",
    },
    {
      question: "Can I change or cancel stuff later?",
      answer:
        "We understand plans change! Most bookings can be modified or cancelled, though terms depend on the specific service provider and timing. We'll always try our best to accommodate changes and will clearly explain any fees or restrictions upfront.",
    },
    {
      question: "Don't know where to go? Will you help me pick?",
      answer:
        "That's exactly what we're here for! Our travel experts love helping indecisive travelers find their perfect destination. We'll ask about your interests, budget, preferred climate, and travel style to suggest amazing places you might never have considered.",
    },
    {
      question: "Any hidden charges I should worry about?",
      answer:
        "Nope, we believe in complete transparency! All costs are clearly outlined upfront, including our service fees, accommodation costs, activities, and any additional charges. No surprises, no hidden fees – just honest pricing so you can plan your budget confidently.",
    },
    {
      question: "Do you do budget-friendly trips (like under ₹1 Lakh)?",
      answer:
        "Absolutely! We specialize in creating amazing experiences for every budget. Whether you have ₹30,000 or ₹3,00,000, we'll craft an incredible trip that maximizes your money. Budget-friendly doesn't mean compromising on experiences – it means being smart about them.",
    },
    {
      question: "Are your plans just touristy spots or something cooler?",
      answer:
        "We're all about the 'something cooler' part! While we include must-see attractions, our specialty is uncovering hidden gems, local experiences, and authentic cultural encounters. Think street food tours with locals, sunset spots only residents know about, and activities that create real memories.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-0 sm:px-4 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl max-sm:text-xl font-bold text-gray-900 mb-4 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-[16px] max-w-2xl mx-auto leading-relaxed">
            Planning made simple with answers to your most common questions.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-0"
        style={{ padding: "1rem" }}>
          {(Faqs || faqData).map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-200 last:border-b-0"
            >
              {/* Question Header */}
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-0 py-6 text-left flex items-center justify-between hover:bg-transparent transition-colors duration-200 focus:outline-none"
              >
                <h3 className="text-[16px] font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  <FontAwesomeIcon
                    icon={openFaq === index ? faMinus : faPlus}
                    className="w-5 h-5 text-gray-500 transition-transform duration-200"
                  />
                </div>
              </button>

              {/* Answer Content */}
              <div
                className={`px-0 transition-all duration-300 ease-in-out ${
                  openFaq === index
                    ? "max-h-96 opacity-100 pb-6"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-[14px] text-gray-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
