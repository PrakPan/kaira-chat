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
        const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          text + " " + url
        )}`;
        window.open(whatsappShareUrl, "_blank", "noopener,noreferrer");
        break;
      case "fb":
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
        break;
      case "twitter":
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`;
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
        }
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
  share,
  setShare,
  itineraryName,
  itineraryImage,
  social_title,
  social_description,
}) => {
  const ref = useRef();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const closeShare = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShare(false);
      }
    };

    if (share) {
      document.addEventListener("mousedown", closeShare);
    }

    return () => {
      document.removeEventListener("mousedown", closeShare);
    };
  }, [share, setShare]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleWhatsappShare = () => {
    const text = `${social_title || itineraryName}\n${shareUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleInstagramShare = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied! You can now paste it in Instagram.");
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(
      social_title || itineraryName || "Check out this itinerary"
    );
    const body = encodeURIComponent(
      `${
        social_description ||
        "I wanted to share this amazing itinerary with you!"
      }\n\n${shareUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!share) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center pointer-events-auto">
      <div
        ref={ref}
        className="bg-white rounded-2xl w-[386px] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-4">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 leading-tight">
              Planning with friends?
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Share this trip in one click
            </p>
          </div>
          <button
            onClick={() => setShare(false)}
            className="text-black hover:text-gray-600 flex-shrink-0 ml-3"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M15 5L5 15M5 5l10 10" />
            </svg>
          </button>
        </div>

        {/* Social Share Buttons */}
        <div className="px-2 pb-1 space-y-1">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsappShare}
            className="w-full flex items-center gap-3 px-1.5 py-2.5 rounded-lg hover:bg-[#FFFAF5] transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <span className="text-sm text-gray-900">Whatsapp</span>
          </button>

          {/* Instagram */}
          <button
            onClick={handleInstagramShare}
            className="w-full flex items-center gap-3 px-1.5 py-2.5 rounded-lg hover:bg-[#FFFAF5] transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="url(#instagram-gradient)"
              >
                <defs>
                  <linearGradient
                    id="instagram-gradient"
                    x1="0%"
                    y1="100%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#FD5949" />
                    <stop offset="50%" stopColor="#D6249F" />
                    <stop offset="100%" stopColor="#285AEB" />
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-sm text-gray-900">Instagram</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center gap-3 px-1.5 py-2.5 rounded-lg hover:bg-[#FFFAF5] transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-sm text-gray-900">Facebook</span>
          </button>

          {/* Email and Copy Link Row */}
          <div className="pt-3 pb-1">
            {/* Horizontal divider */}
            <div className="border-t border-gray-200 mb-2"></div>

            <div className="flex gap-2">
              {/* Email */}
              <button
                onClick={handleEmailShare}
                className="flex-1 flex items-center justify-center gap-1.5 py-1 px-3 transition-colors"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-gray-600"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 7l-10 7L2 7" />
                </svg>
                <span className="text-xs font-medium text-gray-700">Email</span>
              </button>

              {/* Vertical divider */}
              <div className="w-px bg-gray-200"></div>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="15"
                  viewBox="0 0 13 15"
                  fill="none"
                >
                  <path
                    d="M4.5 12C4.0875 12 3.73438 11.8531 3.44063 11.5594C3.14688 11.2656 3 10.9125 3 10.5V1.5C3 1.0875 3.14688 0.734375 3.44063 0.440625C3.73438 0.146875 4.0875 0 4.5 0H11.25C11.6625 0 12.0156 0.146875 12.3094 0.440625C12.6031 0.734375 12.75 1.0875 12.75 1.5V10.5C12.75 10.9125 12.6031 11.2656 12.3094 11.5594C12.0156 11.8531 11.6625 12 11.25 12H4.5ZM4.5 10.5H11.25V1.5H4.5V10.5ZM1.5 15C1.0875 15 0.734375 14.8531 0.440625 14.5594C0.146875 14.2656 0 13.9125 0 13.5V3H1.5V13.5H9.75V15H1.5Z"
                    fill="#6E757A"
                  />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {copied ? "Copied!" : "Copy Link"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      className="fixed inset-0 z-[999] flex items-end justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="w-full max-w-sm animate-popOut flex flex-col justify-center gap-3 items-center">
        <div
          ref={ref}
          className="w-full bg-white rounded-lg flex flex-col gap-3 p-4 max-h-[70vh] overflow-y-auto"
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
          className="bg-white p-3 rounded-full cursor-pointer shadow-lg"
        >
          <IoMdClose className="text-xl" />
        </div>
      </div>
    </div>
  );
};
