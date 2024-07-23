import { useState } from "react";
import { useRef } from "react";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { MdLink } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { IoIosDoneAll, IoMdClose } from "react-icons/io";
import { CgMoreO } from "react-icons/cg";
import { useEffect } from "react";

export const SocialShare = ({ more }) => {
  const [copied, setCopied] = useState(false);

  const getURL = () => {
    let currentUrl = window.location.href;
    const newUrl = new URL(currentUrl);
    newUrl.search = "";

    return newUrl.toString();
  };

  const handleClick = (id) => {
    const url = getURL();
    const text = "Check out this amazing itinerary";

    switch (id) {
      case "whatsapp":
        const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + url)}`;
        window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
        break;
      case "fb":
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
        break;
      case "twitter":
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        window.open(twitterShareUrl, "_blank", "noopener,noreferrer");
        break;
      default:
        return;
    }
  };

  const copyToClipboard = () => {
    const url = getURL();

    if (navigator.clipboard && window.isSecureContext) {
      // Use the navigator clipboard API when available and secure context
      navigator.clipboard.writeText(url).then(
        () => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        },
        (err) => {
          console.error("Could not copy text: ", err);
        },
      );
    } else {
      // Fallback method for older browsers or insecure context
      const textArea = document.createElement("textarea");
      textArea.value = url;
      textArea.style.position = "fixed"; // Avoid scrolling to bottom of page in mobile browsers
      textArea.style.opacity = 0; // Make it invisible
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 1000);
        } else {
          console.error("Fallback: Could not copy text");
        }
      } catch (err) {
        console.error("Fallback: Could not copy text: ", err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleMore = () => {
    const url = getURL();

    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          text: "Check out this amazing itinerary",
          url: url,
        })
        .then(() => {
          console.log("Thanks for sharing!");
        })
        .catch(console.error);
    } else {
      // fallback
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-3 p-0">
      <div className="text-lg flex flex-col gap-1">
        <div>Liked this itinerary?</div>
        <div>Share on social media</div>
      </div>
      <div className="w-[99%] md:w-full flex flex-row justify-center items-center gap-3 pt-4 overflow-x-auto hide-scrollbar">
        <div className="relative flex flex-col gap-1 items-center">
          {copied && (
            <div className="absolute z-50 -top-6 left-0 flex flex-row items-center gap-1 text-sm text-gray-600">
              Copied <IoIosDoneAll className="text-2xl text-green-500" />
            </div>
          )}
          <div className="p-1 flex items-center justify-center bg-[#1D9BF0] rounded-full">
            <MdLink
              onClick={copyToClipboard}
              className="text-[40px] text-white p-1 cursor-pointer"
            />
          </div>
          <div className="text-xs font-medium text-nowrap">Copy Link</div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="p-1 flex items-center justify-center bg-green-500 rounded-full">
            <FaWhatsapp
              onClick={() => handleClick("whatsapp")}
              className="text-[40px] text-white p-1 cursor-pointer"
            />
          </div>
          <div className="text-xs font-medium text-nowrap">WhatsApp</div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="p-1 flex items-center justify-center bg-[#3b5998] rounded-full">
            <FaFacebook
              onClick={() => handleClick("fb")}
              className="text-[40px] text-white p-1 cursor-pointer"
            />
          </div>
          <div className="text-xs font-medium text-nowrap">Facebook</div>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <div className="p-1 flex items-center justify-center bg-black rounded-full">
            <RiTwitterXLine
              onClick={() => handleClick("twitter")}
              className="text-[40px] text-white p-1 cursor-pointer"
            />
          </div>
          <div className="text-xs font-medium text-nowrap">Twitter</div>
        </div>

        {more && (
          <div className="flex flex-col gap-1 items-center">
            <div className="p-1 flex items-center justify-center bg-gray-500 rounded-full">
              <CgMoreO
                onClick={handleMore}
                className="text-[40px] text-white p-1 cursor-pointer"
              />
            </div>
            <div className="text-xs font-medium text-nowrap">More Apps</div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SocialShareMobile = ({ setShare }) => {
  const ref = useRef();

  const closeShare = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShare(false);
    }
  };

  return (
    <div
      onClick={(e) => closeShare(e)}
      className="z-[2000] fixed inset-0 bg-black bg-opacity-50 flex items-end"
    >
      <div
        ref={ref}
        className={`animate-slideUp w-full bg-white flex flex-col gap-3 py-2 transition-all duration-300`}
      >
        <div className="flex flex-row items-center gap-2 px-2">
          <IoMdClose
            onClick={() => setShare(false)}
            className="text-xl font-bold cursor-pointer"
          />
          <div className="text-lg">Share</div>
        </div>

        <SocialShare more />
      </div>
    </div>
  );
};
