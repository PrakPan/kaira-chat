import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";


export default function Travelers(props) {
    const [open, setOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [travelers, setTravelers] = useState(props.travelers)
    const [travelerAges, setTravelerAges] = useState(props.travelerAges);

    const handleAdults = (type) => {
        if (type === "plus" && travelers < 14) {
            setTravelers(prev => prev + 1);
            setTravelerAges(prev => [...prev, null])
        } else if (type === 'minus' && travelers > 1) {
            setTravelers(prev => prev - 1);
            setTravelerAges(prev => prev.slice(0, -1))
        }
    }

    const checkError = () => {
        if (travelerAges.includes(null)) {
            return true;
        }

        return false;
    }

    const handleModifySearch = () => {
        if (checkError()) {
            setShowError(true);
            return;
        }

        setShowError(false);

        props.setFilterState(prev => ({
            ...prev,
            'pax': {
                number_of_travelers: travelers,
                traveler_ages: travelerAges,
            }
        }))
        setOpen(false);
    }

    return (
        <div className="relative w-fit h-fit border-2 flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:border-black">
            <IoPerson onClick={() => setOpen(prev => !prev)} className="text-2xl" />

            <div onClick={() => setOpen(prev => !prev)} className="flex flex-col">
                <div className="text-sm">Travelers</div>
                <div>{travelers} {travelers > 1 ? "travelers" : "traveler"}</div>
            </div>

            {open && (
                <div className="absolute bg-white z-50 left-0 md:left-auto md:right-0 top-[65px] flex flex-col gap-3 drop-shadow-2xl rounded-lg p-4 overflow-auto max-h-[70vh] hide-scrollbar">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row items-center justify-between gap-[100px]">
                                    <div className="flex flex-col">
                                        <div className="text-sm">Travelers</div>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <CiCircleMinus onClick={() => handleAdults('minus')} className="text-2xl" />
                                        <div>{travelers}</div>
                                        <CiCirclePlus onClick={() => handleAdults('plus')} className="text-2xl" />
                                    </div>
                                </div>

                                {travelers ? (
                                    <div className="flex flex-col gap-2">
                                        {travelerAges && travelerAges.map((age, i) => (
                                            <AdultAge
                                                index={i}
                                                adult={i + 1}
                                                age={age}
                                                setAdultAges={setTravelerAges}
                                                showError={showError} />
                                        ))}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleModifySearch} className="px-3 py-1 bg-[#F7E700] rounded-lg border-2 border-black hover:text-white hover:bg-black transition-all">Modify search</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const AdultAge = ({ index, adult, age, setAdultAges, showError }) => {
    const [openAges, setOpenAges] = useState(false);
    const [selectedAge, setSelectedAge] = useState(age);

    useEffect(() => {
        setAdultAges(prev => prev.map((age, i) => i === index ? selectedAge : age))
    }, [selectedAge])

    const handleChildAge = (value) => {
        setSelectedAge(value);
        setOpenAges(false);
    }

    return (
        <div className="relative">
            <div onClick={() => setOpenAges(prev => !prev)} className={`flex flex-row justify-between text-sm border-1 rounded-lg p-2 ${showError && !selectedAge ? "border-red-500" : ""}`}>
                <div>Traveler {adult} age*</div>
                <div>{selectedAge}</div>
                <RiArrowDropDownLine className="text-xl" />
            </div>
            {showError && !selectedAge && (
                <div className="text-xs text-red-400">Provide the age of the adult.</div>
            )}

            {openAges && (
                <div className="z-50 flex flex-col gap-1 absolute top-10 bg-white w-full border-1 border-black drop-shadow-2xl">

                    {Array(100).fill(null).map((_, i) => (
                        <div
                            onClick={() => handleChildAge(i)}
                            className="hover:bg-gray-200 p-2">{i}</div>

                    ))}
                </div>
            )}
        </div>
    );
}
