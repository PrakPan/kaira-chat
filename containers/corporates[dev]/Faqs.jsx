import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import SecondaryHeading from "../../components/heading/Secondary";

const QUESTIONS = [
  {
    question:
      "Can you customize the itinerary according to our company’s preference?",
    answer:
      "Yes, we specialize in creating personalized itineraries based on your company’s needs and preferences. We’ll tailor everything for you, whether a relaxing retreat or a full-of-action adventure trip.",
  },
  {
    question: "How can I make changes or cancel my trip?",
    answer:
      "To make changes or cancel your trip, you may contact your dedicated travel expert; besides this, we have a 24/7 live customer support team to help you.",
  },
  {
    question:
      "Can we modify our hotel booking if we need to change accommodations for our group?",
    answer:
      "You can modify your hotel booking according to the booking & cancellation policy you selected during the booking process. Changes to room availability or timing will depend on the hotel's capacity. For larger groups, such as 20 people, adjustments to accommodations are also subject to the hotel's availability to meet your group's needs. To ensure a smooth transition, we recommend contacting us as early as possible.",
  },
  {
    question:
      "Can I get a refund if my flight is canceled or delayed by the airline?",
    answer:
      "Every airline has its own policies regarding compensation for delays and canceled flights. However, you will be informed of all available alternatives. If you choose not to accept them, the airline may offer credits or a refund, subject to their terms and conditions.",
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      'We accept both private and corporate credit and debit cards, along with virtual payment methods like PayPal, Razorpay, and more. Additionally, we offer a convenient "Pay Later" option to make your booking experience even easier.',
  },
  {
    question: "How does the booking process work?",
    answer:
      "Our booking process is simple and hassle-free. You can book everything in one click, thanks to our real-time negotiated bookings. We handle everything from flight bookings and accommodations to activities so you can focus on enjoying the experience.",
  },
  {
    question: "Do you offer assistance during the trip?",
    answer:
      "Yes, we offer 24/7 live assistance during your trip. Our team is always available to address any concerns, provide updates, and ensure your trip goes smoothly from start to finish.",
  },
  {
    question: "Are there any hidden fees in the pricing?",
    answer:
      "No, we believe in transparent pricing. The price you see includes all the services you’ll receive, with no hidden fees or unexpected charges. You only have to pay a small service fee, and you’re all sorted!",
  },
  {
    question: "Is there a minimum group size for corporate bookings?",
    answer:
      "We cater to groups of all sizes. You can plan a solo workation, a small team retreat, or a large corporate event, as per your wish and we’ll offer flexible options to ensure it fits the needs of your group.",
  },
  {
    question: "Can we add activities during the booking?",
    answer:
      "Yes, you can! When booking your trip, simply select any additional activities you'd like to include. We'll make sure everything is arranged for a smooth, exciting experience.",
  },
];

export default function Faqs(props) {
  return (
    <div className="flex flex-col items-center gap-5 px-3">
      <div className="text-[27px] md:text-[40px] font-[700] md:leading-[56px]">
        Frequently Asked Questions
      </div>

      <div className="w-full flex flex-col gap-4">
        {QUESTIONS.map((q, index) => (
          <Question key={index} question={q.question} answer={q.answer} />
        ))}
      </div>
    </div>
  );
}

const Question = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen((prev) => !prev)}
      className="w-full flex flex-col gap-3 bg-[#F4F4F4] p-4 rounded-lg cursor-pointer"
    >
      <div className="flex flex-row justify-between">
        <div className="text-[18px] md:text-[22px] font-[600] md:leading-[32px]">
          {question}
        </div>
        <div className="w-[5%]">
          {open ? (
            <IoIosArrowUp className="ml-auto text-2xl cursor-pointer" />
          ) : (
            <IoIosArrowDown className="ml-auto text-2xl cursor-pointer" />
          )}
        </div>
      </div>

      {open && <SecondaryHeading className="text-[#7C7C7C]">{answer}</SecondaryHeading>}
    </div>
  );
};

