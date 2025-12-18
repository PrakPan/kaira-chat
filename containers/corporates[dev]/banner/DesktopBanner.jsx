import { useState, useEffect } from "react";

export default function DesktopBanner({ onclick }) {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        let scrollhandler = () => {
            let currentScroll = window.pageYOffset;
            if (currentScroll > window.innerHeight / 2) {
                setShowBanner(true);
            } else {
                setShowBanner(false);
            }
        };
        window.addEventListener("scroll", scrollhandler);
        return () => {
            window.removeEventListener("scroll", scrollhandler);
        };
    });

    if (!showBanner) return null;

    return (
        <div
            className="fixed z-[998] bottom-4 left-[50%] translate-x-[-50%] w-fit mx-auto py-2 px-5 flex flex-row items-center gap-3 text-white rounded-full bg-[rgba(0,0,0,0.7)]">
            <div className="text-lg font-semibold">Schedule a Callback Now!</div>
            <button onClick={onclick} className="bg-[#F7E700] text-black text-lg py-2 px-4 rounded-full">Contact Us</button>
        </div>
    );
}
