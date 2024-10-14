import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const QUESTIONS = [
    {
        question: "How do I customize my travel itinerary?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
    {
        question: "What is your cancellation and refund policy?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
    {
        question: "Do you offer group discounts for bookings?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
    {
        question: "How do you ensure safety during the trips?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
    {
        question: "Can you accommodate special requests or dietary needs?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
    {
        question: "What support is available during my trip?",
        answer: "You can customize your itinerary by choosing from various options during booking. Our travel experts will tailor the trip to your preferences, whether it’s adding activities, selecting accommodations, or adjusting the pace. Reach out, and we'll create a personalized experience for you!"
    },
]


export default function Faqs(params) {
    return (
        <div className="flex flex-col items-center gap-5 px-3">
            <div className="text-[27px] md:text-[40px] font-[700] md:leading-[56px]">Frequently Asked Questions.</div>

            <div className="w-full flex flex-col gap-4">
                {QUESTIONS.map((q, index) => (
                    <Question key={index} question={q.question} answer={q.answer} />
                ))}
            </div>
        </div>
    )
}

const Question = ({question, answer}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full flex flex-col gap-3 bg-[#F4F4F4] p-4 rounded-lg">
            <div className="flex flex-row items-center justify-between">
                <div className="text-[18px] md:text-[22px] font-[600] md:leading-[32px]">{question}</div>
                {open ? (<IoIosArrowUp onClick={() => setOpen(false)} className="text-2xl cursor-pointer" />) :
                    (<IoIosArrowDown onClick={() => setOpen(true)} className="text-2xl cursor-pointer" />)}
            </div>

            {open && (
                <div className="text-[#7C7C7C] text-[16px] font-[400] leading-[24px]">
                    {answer}
                </div>
            )}
        </div>
    )
}
