import React from 'react'

const TrustFactor = () => {
    const mainList = [
        { icon: "/assets/trustfactor/trust-factor-1.svg", title: "Trusted by 10,000+ Travelers" },
        { icon: "/assets/trustfactor/trust-factor-2.svg", title: "24/7 Support" },
        { icon: "/assets/trustfactor/trust-factor-3.svg", title: "GST Invoice Provided" },
        { icon: "/assets/trustfactor/trust-factor-4.svg", title: "Secure Payments" },
    ];

    return (
        <div className="border-t border-t-sm border-text-disabled">
            <div className="w-full overflow-x-auto">
                <div className={`flex flex-row gap-2xl py-md px-md min-w-max justify-center max-ph:justify-start`}>
                    {mainList.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-row items-center gap-xs py-xs">
                                <img src={item.icon} alt={item.title} className="w-[20px] h-[20px]" />
                                <div className="text-sm-md font-400 leading-lg-md font-inter whitespace-nowrap">
                                    {item.title}
                                </div>
                            </div>
                            {index < mainList.length - 1 && (
                                <div className="w-[2px] bg-text-disabled"></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustFactor;
