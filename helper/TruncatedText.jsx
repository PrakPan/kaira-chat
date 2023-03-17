import { useState, useEffect, useRef } from 'react';

const TruncatedText = ({
  text,
  maxLength,
  wordsOnly = true,
  viewMoreText = 'View more',
  viewLessText = 'View less',
}) => {
  const [truncatedText, setTruncatedText] = useState(
    text.substr(0, Math.min(text.length, text.lastIndexOf(' ')))
  );
  const [isTruncated, setIsTruncated] = useState(text.length > maxLength);
  const textRef = useRef(null);

  // useEffect(() => {
  //   if (isTruncated && wordsOnly) {
  //     setTruncatedText(
  //       truncatedText.substr(
  //         0,
  //         Math.min(truncatedText.length, truncatedText.lastIndexOf(' '))
  //       )
  //     );
  //   }
  // }, [isTruncated, wordsOnly, truncatedText]);

  const handleViewMoreClick = () => {
    if (isTruncated) {
      setTruncatedText(text);
    } else {
      setTruncatedText(text.substr(0, maxLength));
      if (wordsOnly) {
        setTruncatedText(
          truncatedText.substr(
            0,
            Math.min(truncatedText.length, truncatedText.lastIndexOf(' '))
          )
        );
      }
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
        setTruncatedText(text.substr(0, newMaxLength));
        setIsTruncated(text.length > newMaxLength);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [maxLength, text]);

  return (
    <>
      <div ref={textRef} className="truncated-text">
        {truncatedText}
        {isTruncated && (
          <div className="view-more-btn" onClick={handleViewMoreClick}>
            {viewMoreText}
          </div>
        )}
      </div>
      {!isTruncated &&
        textRef.current &&
        textRef.current.scrollHeight > textRef.current.clientHeight && (
          <div className="view-more-btn" onClick={handleViewMoreClick}>
            {viewLessText}
          </div>
        )}
    </>
  );
};

export default TruncatedText;

// Example usage:
//   const textEl = document.getElementById('text');
//   const screenWidth = window.innerWidth;
//   let maxLength = 100;

//   if (screenWidth <= 480) {
//     maxLength = 50;
//   } else if (screenWidth <= 768) {
//     maxLength = 75;
//   }

//   textEl.innerHTML = truncateString('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut imperdiet ex. Donec at elit vel mi blandit efficitur quis ac lectus. Proin eget hendrerit augue. Nulla eget velit vel massa aliquam lacinia. Nunc ut purus id tellus aliquet bibendum sed a nulla. Curabitur eu diam sed justo pharetra pulvinar. Praesent vel consectetur dolor. Nulla sed lacus sit amet sapien pharetra ullamcorper.', maxLength);
