import { useState, useEffect, useRef } from "react";

const TruncatedText = ({
  text,
  maxLength,
  wordsOnly = true,
  viewMoreText = "View more",
  viewLessText = "View less",
}) => {
  const [truncatedText, setTruncatedText] = useState(text.substr(0, maxLength));
  const [isTruncated, setIsTruncated] = useState(text.length > maxLength);
  const textRef = useRef(null);

  const handleViewMoreClick = () => {
    if (isTruncated) {
      setTruncatedText(text.substr(0, maxLength));
    } else {
      const words = text.split(" ");
      setTruncatedText(words.slice(0, maxLength).join(" "));
    }
    setIsTruncated(!isTruncated);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      let newMaxLength = maxLength;

      if (screenWidth <= 480) {
        newMaxLength = 50;
      } else if (screenWidth <= 768) {
        newMaxLength = 75;
      }

      if (newMaxLength !== maxLength) {
        const words = text.split(" ");
        setTruncatedText(words.slice(0, newMaxLength).join(" "));
        setIsTruncated(text.length > newMaxLength);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [maxLength, text]);

  return (
    <>
      <div ref={textRef} className="truncated-text">
        {truncatedText}
        {isTruncated && (
          <div
            className="view-more-btn font-bold"
            onClick={handleViewMoreClick}
          >
            {viewMoreText}
          </div>
        )}
      </div>
      {!isTruncated &&
        textRef.current &&
        textRef.current.scrollHeight > textRef.current.clientHeight && (
          <div
            className="view-more-btn font-bold"
            onClick={handleViewMoreClick}
          >
            {viewLessText}
          </div>
        )}
    </>
  );
};

export default TruncatedText;
