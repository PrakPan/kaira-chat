import { useState, useRef, useEffect } from "react";
import ModalWithBackdrop from "../../../ui/ModalWithBackdrop";
import { AgeInput, ApplyButton, ClearButton, CounterBox, CounterButton, CounterValue, PassengerLabel, PassengerRow } from "../EnterPassenger";
import Image from "next/image";
import useMediaQuery from "../../../media";
import BottomModal from "../../../ui/LowerModal";

const Pax = (props) => {
  const containerRef = useRef(null);
  const [isRoomExpanded, setIsRoomExpanded] = useState(props?.isOpenModal);
  const isDesktop = useMediaQuery("(min-width:768px)");
  const [travelers, setTravelers] = useState(
    props?.numberOfAdults || 1 + props?.numberOfChildren || 0
  );
  const [totalChildren, setTotalChildren] = useState(props?.numberOfChildren)
  const [totalAdults, setTotalAdults] = useState(props?.numberOfAdults)
  const [rooms, setRooms] = useState(props.roomConfiguration);

  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsRoomExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (props?.isOpenModal && props?.hideOpenModel && !isRoomExpanded) {
      props?.hideOpenModel();
    }
  }, [isRoomExpanded])

  useEffect(() => {
    let totalAdults = 0;
    let totalChildren = 0;
    for (let room of rooms) {
      totalAdults += room.adults;
      totalChildren += room.children;
    }
    setTravelers(totalAdults + totalChildren);
    setTotalAdults(totalAdults)
    setTotalChildren(totalChildren)
  }, [props?.roomConfiguration]);

  useEffect(() => {
    let totalAdults = 0;
    let totalChildren = 0;
    for (let room of rooms) {
      totalAdults += room.adults;
      totalChildren += room.children;
    }
    setTotalAdults(totalAdults)
    setTotalChildren(totalChildren)
  }, [rooms])

  const handleAddRoom = () => {
    if (rooms.length < 8) {
      setRooms((prev) => [
        ...prev,
        {
          adults: 1,
          children: 0,
          childAges: [],
        },
      ]);
    }
  };

  const removeRoom = () => {
    setRooms((prev) => prev.slice(0, -1));
  };

  const handleDone = () => {
    props?.setRoomConfiguration(rooms);

    setShowError(false);
    setIsRoomExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${!props?.isOpenModal ? 'relative flex p-[12px] items-center gap-[10px] self-stretch rounded-[6px] border border-[#E5E5E5]' : 'relative'}`}    >

      {!props?.isOpenModal && <div
        className="flex flex-col rounded-lg cursor-pointer w-full"
        onClick={() => setIsRoomExpanded(!isRoomExpanded)}
      >
        <span className="mr-2 text-gray-700">
          {travelers} Travellers | {rooms.length} Room
          {rooms.length > 1 ? "s" : ""}
        </span>
      </div>
      }
      {isDesktop ? <ModalWithBackdrop
        centered
        show={isRoomExpanded}
        mobileWidth="100%"
        backdrop
        closeIcon={true}
        onHide={() => setIsRoomExpanded(false)}
        borderRadius={"12px"}
        animation={false}
        paddingX="20px"
        paddingY="20px"
        backdropStyle={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(1px)" }} // <- add this
      >
        <>

          <div className="bg-white z-50 left-0 md:left-0 md:right-0 top-[50px] flex flex-col rounded-lg max-h-[70vh] md:max-h-[60vh] w-full">
            {/* Fixed Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
              <div className="flex flex-col justify-center items-center gap-[12px]">
                <div className="Heading2SB">Room Configuration</div>
                <div className="Body2R_14">{totalAdults} Adults, {totalChildren} Children</div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto hide-scrollbar">
              <div className="min-w-[367px] p-6">
                {rooms.map((room, index) => (
                  <Room
                    key={index}
                    index={index}
                    data={room}
                    setRooms={setRooms}
                    showError={showError}
                    removeRoom={removeRoom}
                  />
                ))}

                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={handleAddRoom}
                    className="text-[#3A85FC] font-inter text-[14px] font-normal leading-[22px] underline"
                    disabled={rooms.length >= 8}
                  >
                    + Add Room
                  </button>
                </div>
              </div>
            </div>
            
            {/* Fixed Apply Button */}
            <div className="bg-white  flex-shrink-0">
              <div className="flex justify-end w-full gap-2 max-w-md mx-auto">
                <ApplyButton className="w-1/2" onClick={handleDone}>Apply</ApplyButton>
              </div>
            </div>
          </div>

        </>
      </ModalWithBackdrop>
        :
        <BottomModal
          show={isRoomExpanded == true}
          onHide={() => setIsRoomExpanded(false)}
          width="100%"
          height="max-content"
          paddingX="20px"
          paddingY="20px"
        >
          <div className="w-[100%] flex flex-col max-h-[80vh]">
            {/* Fixed Header */}
            <div className="bg-white border-b border-gray-200 p-6 flex-shrink-0">
              <div className="flex flex-col justify-center items-center gap-[12px]">
                <div className="Heading2SB">Room Configuration</div>
                <div className="Body2R_14">{totalAdults} Adults, {totalChildren} Children</div>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto hide-scrollbar">
              <div className="p-6">
                {rooms.map((room, index) => (
                  <Room
                    key={index}
                    index={index}
                    data={room}
                    setRooms={setRooms}
                    showError={showError}
                    removeRoom={removeRoom}
                  />
                ))}

                <div className="flex justify-end mt-4 gap-2">
                  <button
                    onClick={handleAddRoom}
                    className="text-[#3A85FC] font-inter text-[14px] font-normal leading-[22px] underline"
                    disabled={rooms.length >= 8}
                  >
                    + Add Room
                  </button>
                </div>
              </div>
            </div>
            
            {/* Fixed Apply Button */}
            <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
              <div className="flex justify-end w-full gap-2 max-w-md mx-auto">
                <ApplyButton className="w-1/2" onClick={handleDone}>Apply</ApplyButton>
              </div>
            </div>
          </div>
        </BottomModal>
      }
    </div>
  );
};

const Room = ({ index, data, setRooms, showError, removeRoom }) => {
  const [adults, setAdults] = useState(data.adults);
  const [children, setChildren] = useState(data.children);
  const [childAges, setChildAges] = useState(data?.childAges || []);

  useEffect(() => {
    setRooms((prev) =>
      prev.map((room, i) =>
        i === index
          ? {
            ...room,
            adults: adults,
            children: children,
            childAges: childAges,
          }
          : room
      )
    );
  }, [adults, children, childAges, index, setRooms]);

  const handleAdults = (increment) => {
    if (increment && adults < 14) {
      setAdults((prev) => prev + 1);
    } else if (!increment && adults > 1) {
      setAdults((prev) => prev - 1);
    }
  };

  const handleChildren = (type) => {
    if (type === "plus" && children < 13) {
      setChildren((prev) => prev + 1);
      setChildAges((prev) => [...prev, 10]);
    } else if (type === "minus" && children >= 1) {
      setChildren((prev) => prev - 1);
      setChildAges((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="mb-6 last:mb-0 ">
      <div className="flex justify-between items-center mb-[16px]">
        <div className="Body2M_14">Room {index + 1}</div>
        {index + 1 > 1 && (
          <button onClick={removeRoom} className="text-blue-600 font-medium">
            <Image src="/delete.svg" width={20} height={20} />
          </button>
        )}
      </div>

      <PassengerRow className="!w-[100%]">
        <PassengerLabel>
          <div className="Body2M_14">Adults</div>
          <div className="subtitle">Ages 13 or above</div>
        </PassengerLabel>
        <CounterBox>
          <CounterButton onClick={() => setAdults((p) => p - 1)} disabled={adults <= 1}>−</CounterButton>
          <CounterValue>{adults}</CounterValue>
          <CounterButton onClick={() => setAdults((p) => p + 1)} disabled={adults >= 14}>+</CounterButton>
        </CounterBox>
      </PassengerRow>

      <PassengerRow className="!w-[100%]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
          <PassengerLabel>
            <div className="Body2M_14">Children</div>
            <div className="subtitle">Ages 2 to 12</div>
          </PassengerLabel>
          <CounterBox>
            <CounterButton onClick={() => handleChildren("minus")} disabled={children <= 0}>−</CounterButton>
            <CounterValue>{children}</CounterValue>
            <CounterButton onClick={() => handleChildren("plus")} disabled={children > 12}>+</CounterButton>
          </CounterBox>
        </div>
      </PassengerRow>

      {children > 0 && (
        <div className="w-full" style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="text-[12px] text-[#6E757A]">Enter the age of each child below</div>
          {childAges.map((age, i) => (
            <ChildAge
              key={i}
              index={i}
              child={i + 1}
              age={age}
              setChildAges={setChildAges}
              showError={showError}
            />
          ))}

        </div>
      )}
    </div>
  );
};

const ChildAge = ({ child, age, index, setChildAges, showError }) => {
  const handleChange = (e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : "";
    setChildAges((prev) =>
      prev.map((a, i) => (i === index ? value : a))
    );
  };

  return (
    <PassengerRow className="!w-[100%] text-[12px]" style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <div className="flex justify-between items-center w-full">
        <div className="Body2M_14">Age of Child {index+1}</div>

        <div className="flex items-center gap-2">
          <CounterButton onClick={() => handleChange({ target: { value: age - 1 } })} disabled={age <= 2}>−</CounterButton>
          <AgeInput
            key={index}
            type="number"
            min="0"
            max="12"
            value={age ?? ""}
            onChange={handleChange}
            disabled
          />
                    <span className="text-sm text-gray-500">years</span>

          <CounterButton onClick={() => handleChange({ target: { value: age + 1 } })} disabled={age >= 12}>+</CounterButton>
        </div>

        {showError && (age === null || age === "") && (
          <div className="text-xs text-red-500 mt-1 absolute right-0 -bottom-4">
            Please provide the age
          </div>
        )}
      </div>
    </PassengerRow>
  );
};


export default Pax;