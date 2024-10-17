import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [emptyImages, setEmptyImages] = useState(false);

    useEffect(() => {
        if (!images || !images.length) {
            setEmptyImages(true);
        }
    }, [images])

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="relative w-full h-full max-w-2xl mx-auto">
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
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ))}

                {emptyImages && (
                    <Image
                        src={"https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png"}
                        alt={`Slide`}
                        layout="fill"
                        objectFit="cover"
                    />
                )}
            </div>
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
            >
                &lt;
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
            >
                &gt;
            </button>
        </div>
    );
};

export default ImageCarousel;
