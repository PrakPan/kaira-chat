import { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine, RiDeleteBin6Line } from "react-icons/ri";
import Pax from "../../../tailoredform/slidetwo/pax/Pax";

const svgIcons = {
  'user': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12.5029 6.84741C13.5304 7.54491 14.2504 8.48991 14.2504 9.74991V11.9999H17.2504V9.74991C17.2504 8.11491 14.5729 7.14741 12.5029 6.84741Z" fill="#ACACAC" />
    <path d="M11.2504 6C12.9079 6 14.2504 4.6575 14.2504 3C14.2504 1.3425 12.9079 0 11.2504 0C10.8979 0 10.5679 0.0749998 10.2529 0.18C10.8754 0.9525 11.2504 1.935 11.2504 3C11.2504 4.065 10.8754 5.0475 10.2529 5.82C10.5679 5.925 10.8979 6 11.2504 6Z" fill="#ACACAC" />
    <path d="M6.75 6C8.4075 6 9.75 4.6575 9.75 3C9.75 1.3425 8.4075 0 6.75 0C5.0925 0 3.75 1.3425 3.75 3C3.75 4.6575 5.0925 6 6.75 6ZM6.75 1.5C7.575 1.5 8.25 2.175 8.25 3C8.25 3.825 7.575 4.5 6.75 4.5C5.925 4.5 5.25 3.825 5.25 3C5.25 2.175 5.925 1.5 6.75 1.5Z" fill="#ACACAC" />
    <path d="M6.75 6.75C4.7475 6.75 0.75 7.755 0.75 9.75V12H12.75V9.75C12.75 7.755 8.7525 6.75 6.75 6.75ZM11.25 10.5H2.25V9.7575C2.4 9.2175 4.725 8.25 6.75 8.25C8.775 8.25 11.1 9.2175 11.25 9.75V10.5Z" fill="#ACACAC" />
  </svg>,
  'edit': <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M7.33301 1.33325H5.99967C2.66634 1.33325 1.33301 2.66659 1.33301 5.99992V9.99992C1.33301 13.3333 2.66634 14.6666 5.99967 14.6666H9.99967C13.333 14.6666 14.6663 13.3333 14.6663 9.99992V8.66659" stroke="#ACACAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M5.43992 7.26659C5.23992 7.46659 5.03992 7.85992 4.99992 8.14659L4.71325 10.1533C4.60659 10.8799 5.11992 11.3866 5.84659 11.2866L7.85325 10.9999C8.13325 10.9599 8.52659 10.7599 8.73325 10.5599L13.9866 5.30659C14.8933 4.39992 15.3199 3.34659 13.9866 2.01326C12.6533 0.679924 11.5999 1.10659 10.6933 2.01326L5.43992 7.26659Z" stroke="#ACACAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M9.94043 2.7666C10.3871 4.35994 11.6338 5.6066 13.2338 6.05994" stroke="#ACACAC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
}

export default function Travelers(props) {
  const containerRef = useRef(null);
  const [travelers, setTravelers] = useState(
    props.filters.occupancies.reduce(
      (sum, room) =>
        sum + room.adults + (room.childAges ? room.childAges.length : 0),
      0
    )
  );
  const [rooms, setRooms] = useState(props.filters.occupancies || []);
  const [open, setOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  useEffect(() => {
    let total = 0;
    for (let room of rooms) {
      total += room?.adults ? room.adults : 0;
      total += room?.children ? room.children : 0;
    }

    setTravelers(total);
  }, [rooms]);

  const checkError = () => {
    for (let room of rooms) {
      if (room.childAges.includes(null)) {
        return true;
      }
    }

    return false;
  };

  const handleModifySearch = (selectedRooms) => {
    if (checkError()) {
      setShowError(true);
      return;
    }

    setShowError(false);
    props.setFilters((prev) => ({
      ...prev,
      occupancies: selectedRooms.map((room) => {
        return {
          adults: room.adults,
          childAges: room.childAges,
        };
      }),
      applyFilter: !props.filters.applyFilter,
    }));

    const count = selectedRooms.reduce(
      (sum, room) =>
        sum + room.adults + (room.childAges ? room.childAges.length : 0),
      0
    );

    setTravelers(count)
    setRooms(selectedRooms)

    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-fit w-full h-fit flex flex-row items-center gap-2 px-sm-md py-xs rounded-md-lg  bg-text-chinesWhite"
    >
      {svgIcons.user}
      <div className="flex flex-row text-sm-md text-text-charcolblack leading-lg-md font-400 align-items-center w-full items-center">
        <span>Room Configuration | </span> &nbsp;
        <span>
          {travelers} {travelers > 1 ? "travelers" : "traveler"}, {props.filters.occupancies.length}{" "}
          {props.filters.occupancies.length > 1 ? "rooms" : "room"}
        </span>
      </div>
      <span className="ml-auto cursor-pointer" onClick={() => setOpen((prev) => !prev)} >{svgIcons.edit}</span>


      {open && <Pax
        roomConfiguration={rooms}
        isOpenModal={open}
        hideOpenModel={() => setOpen(false)}
        setRoomConfiguration={(val) => handleModifySearch(val)}
      />
      }
    </div>
  );
}
