import React, { useState } from "react";
import styles from "./FaqSection.module.scss";

const defaultFaqData = [
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

const PlusIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const renderAnswer = (answer) => {
  if (typeof answer === "string") return answer;
  if (React.isValidElement(answer)) return answer;
  return String(answer ?? "");
};

const FaqSection = ({ Faqs, heading, lede }) => {
  const items = Faqs && Faqs.length ? Faqs : defaultFaqData;
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className={styles.faqBlock}>
      <div className={styles.faqContainer}>
        <div className={styles.faqHead}>
          <h2>
            {heading || (
              <>
                Questions, <span className={styles.serif}>answered.</span>
              </>
            )}
          </h2>
          <p className={styles.faqLede}>
            {lede || (
              <>
                The honest answers —{" "}
                <span className={styles.serif}>no marketing fluff.</span>
              </>
            )}
          </p>
        </div>

        <div className={styles.faqList}>
          {items.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`${styles.faqItem} ${
                  isOpen ? styles.faqItemOpen : ""
                }`}
              >
                <button
                  type="button"
                  className={styles.faqQ}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span className={styles.faqIcon}>
                    <PlusIcon />
                  </span>
                </button>
                <div className={styles.faqA}>
                  <div className={styles.faqAInner}>
                    {renderAnswer(faq.answer)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
