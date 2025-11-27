import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const ThemeHeadline = (props) => {
    const [text, setText] = useState(props?.text);
    const [position, setPosition] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const bannerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setContainerWidth(document.querySelector('.banner-container').offsetWidth);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const bannerRect = bannerRef.current.getBoundingClientRect();
            const containerWidth = bannerRect.width;
            const textWidth = text.length * 32;

            setPosition((position) => position - 3);

            if (position <= -textWidth / 2) {
                setPosition(containerWidth);
            }
        };

        const interval = setInterval(handleScroll, 50);
        return () => clearInterval(interval);
    }, [text, position, containerWidth]);

    return (
        // <Link href={"/event/new-year-2025"} className='text-black no-underline'>
            <div
                ref={bannerRef}
                className="bg-[#F7E700] py-2 md:mt-[80px] overflow-hidden banner-container text-black flex flex-row items-center justify-between">
                <div
                    className="inline-block whitespace-nowrap"
                    style={{
                        transform: `translateX(${position}px)`,
                        willChange: 'transform',
                    }}
                >
                    {text} 
                   <div className='inline-block ml-[50%]'>{text}</div>

                    {/* <span className='ml-5 text-blue'>Explore Now!</span> */}
                </div>
            </div>
        // </Link>
    );
};

export default ThemeHeadline;
