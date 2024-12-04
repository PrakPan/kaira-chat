import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const HomePageBanner = () => {
    const [text, setText] = useState('Exciting Discounts on New Year\'s Tour Packages! Book Your Adventure Today!');
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
            const textWidth = text.length * 16;

            setPosition((position) => position - 3);

            if (position <= -textWidth / 2) {
                setPosition(containerWidth);
            }
        };

        const interval = setInterval(handleScroll, 50);
        return () => clearInterval(interval);
    }, [text, position, containerWidth]);

    return (
        <Link href={"/new-year"} className='text-black no-underline'>
            <div
                ref={bannerRef}
                className="bg-[#F7E700] py-2 md:mt-[80px] overflow-hidden banner-container flex flex-row items-center justify-between">
                <div
                    className="inline-block whitespace-nowrap"
                    style={{
                        transform: `translateX(${position}px)`,
                        willChange: 'transform',
                    }}
                >
                    {text}

                    <span className='ml-5 text-blue'>Explore Now!</span>
                </div>
            </div>
        </Link>
    );
};

export default HomePageBanner;
