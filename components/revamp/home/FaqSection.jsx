import React, { useState } from "react";
import styles from "./FaqSection.module.scss";

const defaultFaqData = [
  {
    question: "What exactly is The Tarzan Way?",
    answer:
      "The Tarzan Way combines the speed of AI with the expertise of real travellers. Kaira, our AI trip planner, creates personalised itineraries in seconds, while destination experts review every detail before it reaches you. You describe your trip in plain language, Kaira builds a plan across hundreds of platforms in seconds, and then a local expert, someone who has actually been to that destination, reviews and refines it before it reaches you.",
  },
  {
    question: "What is Kaira and how does she plan my trip?",
    answer:
      "Kaira is an AI travel planner built by The Tarzan Way. Tell her your destination, dates, budget, and travel style, and she'll search flights, hotels, experiences, and routes to build a personalised holiday itinerary that's ready to book.",
  },
  {
    question: "Is The Tarzan Way the best AI travel planner?",
    answer:
      "We'll let the trips speak for themselves. Kaira has helped plan thousands of journeys across 100+ countries, creating complete, bookable itineraries instead of just travel suggestions.",
  },
  {
    question: "How is Kaira different from ChatGPT for travel planning?",
    answer:
      "ChatGPT gives you ideas. Kaira helps turn those ideas into a real trip. She brings together flights, stays, experiences, and local recommendations in one personalised itinerary, all in a single conversation.",
  },
  {
    question: "Does Kaira work for international trips?",
    answer:
      "Yes. Kaira plans international trips across 100+ countries, whether you're travelling solo, planning a honeymoon, organising a family holiday, or looking for your next adventure.",
  },
  {
    question: "Is there a booking fee?",
    answer:
      "There is no upfront fee to plan. Kaira is free to plan with. You only pay for the flights, hotels, and experiences you choose, with no hidden fees or markups.",
  },
  {
    question: "Can I change my itinerary after Kaira builds it?",
    answer:
      "Absolutely. Change your dates, swap hotels, add experiences, adjust your budget, or reroute the trip entirely. Your itinerary is flexible, and you can keep refining it until it feels right.",
  },
  {
    question: "How is this different from a traditional travel agent?",
    answer:
      "A traditional travel agent works on commission from hotels and airlines. Kaira searches across the open web with no preferred suppliers, so you see actual prices. There are no hidden markups. You also get a local curator, not a call-centre agent, who has personal knowledge of your destination.",
  },
  {
    question: "Can I customise the itinerary?",
    answer:
      "Everything is customizable. Start with a ready-made route or describe your trip from scratch. You can swap hotels, change dates, add or remove activities, and adjust the budget, all from inside the chat. Kaira re-prices in real time so you always know what a change will cost before you confirm it.",
  },
  {
    question: "Can Kaira plan trips in Hindi or Hinglish?",
    answer:
      "Yes. You can write to Kaira in Hindi, Hinglish, or English and she will respond in the same language. A lot of our travellers switch between all three in the same conversation and Kaira keeps up.",
  },
  {
    question: "How does the local curator actually help?",
    answer:
      "The curator is a person based in, or with deep experience of, your destination. They look at Kaira's plan and catch the things AI cannot: a road that floods in August, a restaurant that used to be great but isn't anymore, a quiet ghat worth waking up early for. They also handle paperwork like restricted-area permits that even experienced travellers sometimes miss.",
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
                The honest answers,{" "}
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
