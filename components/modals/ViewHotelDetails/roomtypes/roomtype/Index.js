import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";
import { RxCross2 } from "react-icons/rx";
import { dateFormat } from "../../../../../helper/DateUtils";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ImageCarousel from "../../../Carousel/ImageCarousel";
import Image from "next/image";
import { currencySymbols } from "../../../../../data/currencySymbols";
import { useSelector } from "react-redux";

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const currency = useSelector(state=>state.currency);
  const [openRooms, setOpenRooms] = useState({});

  const getRoomImage = (images) => {
    if (images && images.length) {
      for (let image of images) {
        if (image?.image) {
          return image.image;
        }
      }
    }
    return null;
  };

  const pax = props?.rates?.reduce((total, rate) => {
    const roomTotal = rate?.rooms?.reduce((roomSum, room) => {
      const adults = Number(room?.number_of_adults) || 0;
      const children = Number(room?.number_of_children) || 0;
      return roomSum + adults + children;
    }, 0);
    return total + roomTotal;
  }, 0);



  const getRoomsByRate = () => {
    if (!props.rates || !Array.isArray(props.rates)) return [];

    return props.rates.map((rate, rateIndex) => ({
      rate,
      rateIndex,
      rooms: rate.rooms || []
    }));
  };


  const toggleRoomDetails = (rateIndex, roomIndex) => {
    const roomKey = `${rateIndex}-${roomIndex}`;
    setOpenRooms(prev => ({
      ...prev,
      [roomKey]: !prev[roomKey]
    }));
  };


  const isRoomOpen = (rateIndex, roomIndex) => {
    const roomKey = `${rateIndex}-${roomIndex}`;
    return openRooms[roomKey] || false;
  };

  const roomsByRate = getRoomsByRate();

  return (
    <div className={`flex flex-col gap-3 rounded-lg cursor-pointer ${props.isSelected ? 'border-2 border-blue-500' : ''}`}>

      {roomsByRate.map(({ rate, rateIndex, rooms }) => (
        <div key={rateIndex} className="flex flex-col gap-2">

          {roomsByRate.length > 1 && (
            <div className="text-sm font-semibold text-black px-2">
              {``}{getIndianPrice(Math.round(rate.final_rate))}
              {rate.refundable ? (
                <span className="text-[#3BAF75]">Refundable</span>
              ) : (
                <span className="text-[#EE724B]">Non-Refundable</span>
              )}
            </div>
          )}

          {rooms.map((room, roomIndex) => {
            const isCurrentRoomOpen = isRoomOpen(rateIndex, roomIndex);

            return (
              <div
                key={`${rateIndex}-${roomIndex}`}
                className="flex flex-col gap-3 rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite cursor-pointer "
              >
                <div className="relative flex lg:flex-row w-full flex-col gap-4">
                  {room?.images?.length > 0 && (
                    <div className="relative w-[70%] max-ph:w-full h-[12rem] ">
               
                      <ImageCarousel images={room?.images} />
        
                    </div>
                  )}


                  <div className="w-full">
                    {room.name ? (
                      <div className="text-md-lg leading-xl-sm font-600 mb-0">
                        {room.name}{" "} <span> X 1 room </span>
                      </div>
                    ) : null}


                    <ul className="list-informaation-ul">
                      <li>Sleeps {room.number_of_adults > 1
                        ? `${room.number_of_adults} Adults`
                        : `${room.number_of_adults} Adult`}
                        {room?.number_of_children &&
                          room?.number_of_children !== "0"
                          ? `, ${room.number_of_children} Children`
                          : null}</li>

                      {rate?.board_basis && (
                        rate.board_basis.description === "Room Only" ? (
                          <li className="">
                            {rate.board_basis.description}
                          </li>
                        ) : (
                          <li>
                            <div className="">
                              <div>{rate.board_basis.description}</div>
                            </div>
                          </li>
                        )
                      )}


                      {room?.beds?.length > 0 && <li>
                        {room?.beds.map((item, index) => (
                          <span> {item?.count > 0} {item?.type} Bed{room?.beds.length - 1 > index ? ',' : ''}</span>
                        ))}
                      </li>}

                      {room?.area && <li> {room?.area} </li>}

                      {room?.facilities?.length > 0 && <li>
                        {room?.facilities.slice(0, 2).map((item, index) => (
                          <span>{item}{2 - 1 > index ? ',' : ''}</span>
                        ))}
                      </li>}


                    </ul>

                    <div className="flex flex-row md:flex-row gap-1 items-center w-full font-bold">
                      <div className="text-text-charcolblack text-lg font-700 leading-2xl-md">
                        {`${currency?.currency ? currencySymbols?.[currency?.currency] : '₹'}` + getIndianPrice(Math.round(props.price)) + "/-"}
                      </div>
                      <div className="text-text-spacegrey text-sm-md font-400 leading-lg mt-xxs">for {pax} people</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-col justify-between h-100 max-ph:flex-row">
                      <div className="text-blue whitespace-nowrap">
                        {isCurrentRoomOpen ? (
                          <div
                            className="w-fit flex flex-row items-center gap-1  p-1 rounded-lg cursor-pointer"
                            onClick={() => toggleRoomDetails(rateIndex, roomIndex)}
                          >
                            <div>Hide details</div>
                            <IoIosArrowUp className="text-xl" />
                          </div>
                        ) : (
                          <div
                            className="w-fit flex flex-row items-center gap-1 p-1 rounded-lg cursor-pointer"
                            onClick={() => toggleRoomDetails(rateIndex, roomIndex)}
                          >
                            <div>See details</div>
                            <IoIosArrowDown className="text-xl" />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-1 items-end">
                        <button
                          className="ttw-btn-fill-yellow"
                          onClick={() => props.handleUpdateBooking(props.index)}
                        >
                          Add to Itinerary
                        </button>

                        <div className="text-text-spacegrey text-sm font-400 leading-lg mt-xxs">
                          on {props.checkInDate} ({props.city})
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                {isCurrentRoomOpen && (<>
                  <hr />
                  <div className="flex flex-col gap-3">
                    <div
                    >
                      <div className="gl-dynamic-render-elements">
                        {room?.description ? (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: room.description,
                            }}
                            className=""
                          ></div>
                        ) : null}
                      </div>
                    </div>

                    {room?.facilities?.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        <div className="text-md-lg font-600 leading-xl mb-lg">
                          Room Amenities
                        </div>

                        <ul className="grid grid-cols-3 gap-y-2 gap-x-4 !pl-md">
                          {room.facilities.map((item, index) => (
                            <>
                              <li className="text-sm-md font-400 leading-xl list-disc" key={index}>
                                {item}
                              </li>
                            </>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    {roomsByRate[rateIndex]?.rate?.polices && roomsByRate[rateIndex].rate.polices.length > 0 ? (
                      <>
                        <div className="text-md-lg font-600 leading-xl">Policies</div>
                        {roomsByRate[rateIndex].rate.polices.map((item, index) => (
                          <div key={index} className="flex flex-col gap-xxs">
                            <div className="text-sm-xl font-500 leading-xl ">{item.type}</div>
                            <div
                              className="gl-dynamic-render-elements"
                              dangerouslySetInnerHTML={{
                                __html: item.text,
                              }}
                            ></div>
                          </div>
                        ))}
                      </>
                    ) : null}


                    {rate?.cancellation_policies && (
                      <div className="flex flex-col gap-2">
                        <div
                          className="gl-dynamic-render-elements"
                          dangerouslySetInnerHTML={{
                            __html: rate.cancellation_policies,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default RoomType;