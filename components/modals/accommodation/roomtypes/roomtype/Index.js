import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";
import { RxCross2 } from "react-icons/rx";
import { dateFormat } from "../../../../../helper/DateUtils";
import { use, useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ImageCarousel from "../../../Carousel/ImageCarousel";
import Image from "next/image";
import { useAnalytics } from "../../../../../hooks/useAnalytics";
import { useRouter } from "next/router";

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [openRooms, setOpenRooms] = useState({});
  const { trackHotelRoomDetails } = useAnalytics();
  const router = useRouter();
  

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


  const toggleRoomDetails = (roomIndex) => {
    if(openRooms[roomIndex]){    
      trackHotelRoomDetails(router.query.id, props.data.id,roomIndex, 'room_details_viewed')
    }else{
      trackHotelRoomDetails(router.query.id, props.data.id,roomIndex, 'room_details_hide')
    }
    setOpenRooms(prev => ({
      ...prev,
      [roomIndex]: !prev[roomIndex]
    }));

  };

  return (
    <>
      {props.rooms.map((room, index) => (
        <div key={index} className="flex flex-col gap-3 rounded-3xl border-sm border-solid border-text-disabled p-md hover:bg-text-smoothwhite cursor-pointer">
          <div className="relative flex lg:flex-row w-full flex-col gap-4">
            {room?.images?.length > 0 && (
              <div className="relative lg:h-[12rem] lg:w-[45%] w-full  h-[12rem]">
                <ImageCarousel images={room?.images} />
              </div>
            )}

            <div className="w-full">
              {room.name ? (
                <div className="text-md-lg leading-xl-sm font-600 mb-0">
                  {room.name}{" "} <span> X 1 Room </span>
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

                {props?.data?.board_basis && (
                  props?.data?.board_basis?.description === "Room Only" ? (
                    <li>
                      {props?.data?.board_basis?.description}
                    </li>
                  ) : (
                    <li >
                      <div>{props?.data?.board_basis?.description}</div>
                    </li>
                  ))}


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
            </div>

            <div>
              <div className="flex flex-col justify-between h-100 max-ph:flex-row">
                <div className="text-blue whitespace-nowrap">
                  {openRooms[index] ? (
                    <div
                      className="w-fit flex flex-row items-center gap-1  p-1 rounded-lg cursor-pointer"
                      onClick={() => toggleRoomDetails(index)}
                    >
                      <div>Hide details</div>
                      <IoIosArrowUp className="text-xl" />
                    </div>
                  ) : (
                    <div
                      className="w-fit flex flex-row items-center gap-1 p-1 rounded-lg cursor-pointer"
                      onClick={() => toggleRoomDetails(index)}
                    >
                      <div>See details</div>
                      <IoIosArrowDown className="text-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {openRooms[index] && (<>
            <hr />
            <div className="flex flex-col gap-3">
              <div
                className={`flex flex-col md:flex-row gap-1`}
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
                  <div className="text-md-lg font-600 leading-xl mb-lg">Room Amenities</div>
                  <div className="text-[14px]">
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
                </div>
              ) : null}


              <div className="flex flex-col gap-3">
                {props.data?.polices && props?.data?.polices?.length > 0
                  ? props.data.polices.map((item, policyIndex) => (
                    <div key={policyIndex} className="flex flex-col gap-xxs">
                      <div className="text-sm-xl font-500 leading-xl">{item.type}</div>
                      <div
                        className="gl-dynamic-render-elements"
                        dangerouslySetInnerHTML={{
                          __html: item.text,
                        }}
                      ></div>
                    </div>
                  ))
                  : null}
              </div>
            </div>
          </>
          )}

        </div>
      ))}
    </>
  );
};

export default RoomType;