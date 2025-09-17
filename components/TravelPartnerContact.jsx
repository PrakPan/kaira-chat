import Image from "next/image";

export default function TravelPartnerContact() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Image src="/share.svg" height={22} width={22} className="text-gray-600" />
                </button>
                <button className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200">
                    <Image src={"/settings.svg"} height={22} width={22} className=" text-gray-600" />
                </button>
                <a
                    href="tel:+919354665989"
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
                >
                    <Image src="/phone.svg" height={20} width={20} alt="phone" />
                </a>
            </div>

            <div className="flex flex-col">
                <span className="text-sm text-gray-500">Talk to our travel partner</span>
                <span className="text-base font-medium text-gray-900">
                    +91 9354665989, +91 87872 00342
                </span>
            </div>
        </div>
    );
}
