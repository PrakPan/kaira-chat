import React, { useEffect, useRef, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { RiArrowDropDownLine } from "react-icons/ri";

export default function Pax(props) {
    const containerRef = useRef(null);
    const [travelers, setTravelers] = useState(2);
    const [rooms, setRooms] = useState([{
        adults: 2,
        children: 0,
        infants: 0,
        childAges: [],
    }]);
    const [open, setOpen] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setOpen]);

    useEffect(() => {
        let total = 0
        for (let room of rooms) {
            total += room.adults;
            total += room.children;
            total += room.infants;
        }

        setTravelers(total);
    }, [rooms])

    const handleAddRoom = () => {
        if (rooms.length < 8) {
            setRooms(prev => (
                [...prev, {
                    adults: 1,
                    children: 0,
                    infants: 0,
                    childAges: [],
                }]
            ))
        }
    }

    const removeRoom = () => {
        setRooms(prev => prev.slice(0, -1));
    }

    const checkError = () => {
        for (let room of rooms) {
            if (room.childAges.includes(null)) {
                return true;
            }
        }

        return false;
    }

    const handleDone = () => {
        if (checkError()) {
            setShowError(true);
            return;
        }

        setShowError(false);

        let adults = 0;
        let children = 0;
        let infants = 0;

        for (let room of rooms) {
            adults += room.adults;
            children += room.children;
            infants += room.infants;
        }

        props.setNumberOfAdults(adults);
        props.setNumberOfChildren(children);
        props.setNumberOfInfants(infants);
        props.setRoomConfiguration(rooms);

        setOpen(false);
    }

    return (
        <div ref={containerRef} className="relative w-fit md:w-full h-fit border-2 flex flex-row items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:border-black">
            <IoPerson onClick={() => setOpen(prev => !prev)} className="text-2xl" />

            <div onClick={() => setOpen(prev => !prev)} className="w-full flex flex-col">
                <div className="text-sm">Room Configuration</div>
                <div>{travelers} {travelers > 1 ? "travelers" : "traveler"}, {rooms.length} {rooms.length > 1 ? "rooms" : "room"}</div>
            </div>

            {open && (
                <div className="absolute bg-white z-50 left-0 md:left-0 md:right-0 top-[65px] flex flex-col gap-3 drop-shadow-2xl rounded-lg p-4 overflow-auto max-h-[70vh] hide-scrollbar shadow-2xl">
                    <div className="flex flex-col gap-3">
                        {rooms.map((room, index) => (
                            <Room key={index} index={index} data={room} setRooms={setRooms} showError={showError} />
                        ))}
                    </div>

                    {rooms.length > 1 && (
                        <div className="flex justify-end">
                            <button onClick={removeRoom} className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none">Remove room</button>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button onClick={handleAddRoom} className="w-fit text-blue rounded-full px-2 py-1 hover:bg-[#ECF4FD] focus:outline-none">Add another room</button>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={handleDone} className="px-3 py-1 bg-[#F7E700] rounded-lg border-2 border-black hover:text-white hover:bg-black transition-all">Done</button>
                    </div>
                </div>
            )}
        </div>
    );
}

const Room = ({ index, data, setRooms, showError }) => {
    const [adults, setAdults] = useState(data.adults)
    const [children, setChildren] = useState(data.children);
    const [childAges, setChildAges] = useState(data.childAges);
    const [infants, setInfants] = useState(data.infants)


    useEffect(() => {
        setRooms(prev => prev.map((room, i) => i === index ? {
            ...room,
            adults: adults,
            children: children,
            childAges: childAges,
            infants: infants,
        } : room));
    }, [adults, children, childAges, infants])

    const handleAdults = (type) => {
        if (type === "plus" && adults < 14) {
            setAdults(prev => prev + 1);
        } else if (type === 'minus' && adults > 1) {
            setAdults(prev => prev - 1);
        }
    }

    const handleChildren = (type) => {
        if (type === 'plus' && children < 6) {
            setChildren(prev => prev + 1);
            setChildAges(prev => [...prev, null]);
        } else if (type === 'minus' && children >= 1) {
            setChildren(prev => prev - 1);
            setChildAges(prev => prev.slice(0, -1));
        }
    }

    const handleInfants = (type) => {
        if (type === "plus" && infants < 6) {
            setInfants(prev => prev + 1);
        } else if (type === 'minus' && infants >= 1) {
            setInfants(prev => prev - 1);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="font-semibold">Room {index + 1}</div>
            <div className="flex flex-row items-center justify-between gap-[100px]">
                <div className="flex flex-col">
                    <div className="text-sm">Adults</div>
                    <div className="text-xs">12+ years</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <CiCircleMinus onClick={() => handleAdults('minus')} className="text-2xl" />
                    <div>{adults}</div>
                    <CiCirclePlus onClick={() => handleAdults('plus')} className="text-2xl" />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col">
                        <div className="text-sm">Children</div>
                        <div className="text-xs">2 - 12 years</div>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <CiCircleMinus onClick={() => handleChildren('minus')} className="text-2xl" />
                        <div>{children}</div>
                        <CiCirclePlus onClick={() => handleChildren('plus')} className="text-2xl" />
                    </div>
                </div>

                {children ? (
                    <div className="flex flex-col gap-2">
                        {childAges && childAges.map((age, i) => (
                            <ChildAge
                                index={i}
                                child={i + 1}
                                age={age}
                                setChildAges={setChildAges}
                                showError={showError} />
                        ))}
                    </div>
                ) : null}
            </div>

            <div className="flex flex-row items-center justify-between gap-[100px]">
                <div className="flex flex-col">
                    <div className="text-sm">Infants</div>
                    <div className="text-xs"> &lt; 2 years</div>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <CiCircleMinus onClick={() => handleInfants('minus')} className="text-2xl" />
                    <div>{infants}</div>
                    <CiCirclePlus onClick={() => handleInfants('plus')} className="text-2xl" />
                </div>
            </div>
        </div>
    );
}

const ChildAge = ({ index, child, age, setChildAges, showError }) => {
    const [openAges, setOpenAges] = useState(false);
    const [selectedAge, setSelectedAge] = useState(age);

    useEffect(() => {
        setChildAges(prev => prev.map((age, i) => i === index ? selectedAge : age))
    }, [selectedAge])

    const handleChildAge = (value) => {
        setSelectedAge(value);
        setOpenAges(false);
    }

    return (
        <div className="relative">
            <div onClick={() => setOpenAges(prev => !prev)} className={`flex flex-row justify-between text-sm border-1 rounded-lg p-2 ${showError && !selectedAge ? "border-red-500" : ""}`}>
                <div>Child {child} age*</div>
                <div>{selectedAge}</div>
                <RiArrowDropDownLine className="text-xl" />
            </div>
            {showError && !selectedAge && (
                <div className="text-xs text-red-400">Provide the age of the child.</div>
            )}

            {openAges && (
                <div className="z-50 flex flex-col gap-1 absolute top-10 bg-white w-full border-1 border-black drop-shadow-2xl">

                    {Array(11).fill(null).map((_, i) => (
                        <div
                            onClick={() => handleChildAge(i + 2)}
                            className="hover:bg-gray-200 p-2">{i + 2}</div>

                    ))}
                </div>
            )}
        </div>
    );
}
