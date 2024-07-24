import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaWhatsapp, FaFacebook } from "react-icons/fa";
import { MdLink } from "react-icons/md";
import { RiTwitterXLine } from "react-icons/ri";
import { IoIosDoneAll, IoMdClose } from "react-icons/io";
import { CgMoreO } from "react-icons/cg";
import ImageLoader from "../../../components/ImageLoader";

export const SocialShare = ({
  social_title,
  social_description,
  itineraryName,
  itineraryImage,
  more,
}) => {
  const [copied, setCopied] = useState(false);

  const getURL = () => {
    let currentUrl = window.location.href;
    const newUrl = new URL(currentUrl);
    newUrl.search = "";

    return newUrl.toString();
  };

  const handleClick = (id) => {
    const url = getURL();
    const text = social_description
      ? social_description
      : "Check out this amazing itinerary";

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
          title: social_title ? social_title : document.title,
          text: social_description
            ? social_description
            : "Check out this amazing itinerary",
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
    <div className="w-full flex flex-col gap-3 p-0">
      <div className="text-lg font-bold">Share</div>
      <div className="flex flex-row items-center gap-2">
        <ImageLoader
          url={itineraryImage}
          borderRadius="5%"
          width="5rem"
          height="5rem"
          dimesions={{ width: 100, height: 100 }}
          dimensionsMobile={{ width: 100, height: 100 }}
          noPlaceholder={true}
        ></ImageLoader>
        <div className="w-[75%] flex flex-col gap-1">
          <div className="flex text-lg font-bold">{itineraryName}</div>
          <div className="flex text-sm text-gray-600 truncate">{getURL()}</div>
        </div>
      </div>
      <div className="w-[99%] md:w-full flex flex-row justify-center items-center gap-3 px-2 overflow-x-auto hide-scrollbar">
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

      <div className="w-full flex justify-center items-center">
        <div
          onClick={copyToClipboard}
          className="w-[70%] p-1 flex flex-row gap-2 items-center justify-center border-2 border-gray-300 cursor-pointer rounded-lg"
        >
          <MdLink className="text-[40px] p-1 cursor-pointer" />
          <div className="text-sm font-medium text-nowrap">Copy Link</div>

          {copied && (
            <div className="flex flex-row items-center gap-1 text-sm text-gray-600">
              Copied <IoIosDoneAll className="text-2xl text-green-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SocialShareDesktop = ({
  setShare,
  itineraryName,
  itineraryImage,
  social_title,
  social_description,
}) => {
  const ref = useRef();

  const closeShare = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShare(false);
    }
  };

  return (
    // <div
    //   onClick={(e) => closeShare(e)}
    //   className="z-[2000] fixed inset-0 flex items-center justify-end px-3"
    // >
    <div className="fixed bottom-[140px] right-4 z-[999] w-fit animate-slideRight drop-shadow-2xl shadow-2xl border-2 border-black rounded-md">
      <div
        ref={ref}
        className={`animate-slideRight w-full bg-white rounded-md flex flex-col gap-3 p-3 transition-all duration-300`}
      >
        <SocialShare
          social_title={social_title}
          social_description={social_description}
          itineraryName={itineraryName}
          itineraryImage={itineraryImage}
        />
      </div>
    </div>
    // </div>
  );
};

export const SocialShareMobile = ({
  setShare,
  itineraryName,
  itineraryImage,
  social_title,
  social_description,
}) => {
  const ref = useRef();

  const closeShare = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShare(false);
    }
  };

  return (
    <div
      onClick={(e) => closeShare(e)}
      className="z-[2000] fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-3"
    >
      <div className="w-full animate-slideRight flex flex-col justify-center gap-3 items-center">
        <div
          ref={ref}
          className={`animate-slideRight w-full bg-white rounded-md flex flex-col gap-3 p-3 transition-all duration-300`}
        >
          <SocialShare
            itineraryName={itineraryName}
            itineraryImage={itineraryImage}
            social_title={social_title}
            social_description={social_description}
            more
          />
        </div>

        <div
          onClick={() => setShare(false)}
          className="animate-slideRight bg-white p-2 rounded-full cursor-pointer"
        >
          <IoMdClose className="text-2xl" />
        </div>
      </div>
    </div>
  );
};
