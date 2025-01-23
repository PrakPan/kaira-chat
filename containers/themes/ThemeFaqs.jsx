import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import SecondaryHeading from "../../components/heading/Secondary";
import PrimaryHeading from "../../components/heading/PrimaryHeading";

export default function ThemeFaqs(props) {
  return (
    <div className="flex flex-col items-center gap-5 px-3 md:mb-10  md:px-8  md:flex md:flex-col md:justify-center md:items-center md:m-auto">
      <PrimaryHeading className="text-center">
        Frequently Asked Questions
      </PrimaryHeading>

      <div className="w-full flex flex-col gap-4">
        {props.faqs.map((q, index) => (
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

      {open && (
        <SecondaryHeading className="text-[#7C7C7C]">{answer}</SecondaryHeading>
      )}
    </div>
  );
};
