import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [emptyImages, setEmptyImages] = useState(false);
    const [mouseHovered, setMouseHovered] = useState(false);

    useEffect(() => {
        let interval;
        if (mouseHovered) {
            nextSlide();
            interval = setInterval(() => {
                if (currentIndex < images.length - 1) {
                    nextSlide();
                }
            }, 3000)
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        }
    }, [mouseHovered])

    useEffect(() => {
        if (!images || !images.length) {
            setEmptyImages(true);
        }
    }, [images])

    const nextSlide = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = (e) => {
        if (e) {
            e.stopPropagation();
        }
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    if (emptyImages) return null;

    return (
        <div onMouseEnter={() => setMouseHovered(true)} onMouseLeave={() => setMouseHovered(false)} className="relative w-full h-full max-w-2xl mx-auto">
            <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="relative h-full overflow-hidden rounded-lg">
                {images.map((src, index) => (
                    <div
                        key={index}
                        className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <Image
                            src={src.image}
                            alt={`Slide ${index + 1}`}
                            fill
                        />
                    </div>
                ))}

            </div>

            <div className='absolute bottom-0 right-[50%] translate-x-[50%] z-50 flex flex-row gap-1 items-center'>
                <div onClick={(e) => prevSlide(e)} className='w-3 h-3 rounded-full bg-gray-200'></div>
                <div className='w-3 h-3 rounded-full bg-[#F7E700] border-1 border-black'></div>
                <div onClick={(e) => nextSlide(e)} className='w-3 h-3 rounded-full bg-gray-200'></div>
            </div>

            {mouseHovered && (
                <>
                    <button
                        onClick={(e) => prevSlide(e)}
                        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full w-10 h-10"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={(e) => nextSlide(e)}
                        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full w-10 h-10"
                    >
                        &gt;
                    </button>
                </>
            )}
        </div>
    );
};

export default ImageCarousel;
