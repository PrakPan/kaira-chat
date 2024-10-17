import styled from "styled-components";
import ImageLoader from "../../../../UpdatedBackgroundImageLoader";
import { getIndianPrice } from "../../../../../services/getIndianPrice";
import media from "../../../../media";
import CheckboxFormComponent from "../../../../../components/FormComponents/CheckboxFormComponent";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ImageCarousel from "../../../Carousel/ImageCarousel";

const ImageContainer = styled.div`
  height: 85px;
  width: 85px;
`;

const RoomType = (props) => {
  let isPageWide = media("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const getRoomImage = (images) => {
    if (images && images.length) {
      for (let image of images) {
        if (image?.image) {
          return image.image;
        }
      }
    }

    return "media/icons/bookings/notfounds/noroom.png";
  }

  return (
    <div className="bg-[#F4F4F4] flex flex-col gap-3 p-3 rounded-lg relative">
      {props.data?.rooms.map((room, index) => (
        <div key={index} className="flex flex-row items-center justify-between">
          <div className="w-[70%] flex flex-row items-center gap-3">
            <ImageContainer>
              <ImageLoader
                noLazy
                height={isPageWide ? "85px" : "75px"}
                width={isPageWide ? "85px" : "75px"}
                borderRadius="10px"
                dimensions={{ height: 200, width: 200 }}
                url={getRoomImage(room?.images)}
              />
            </ImageContainer>

            <div className="w-full">
              <div
                className="w-full text-[14px] font-[400] md:text-[16px] md:font-[500]"
              >
                {room.name ? room.name : ""}
              </div>

              {room?.number_of_adults && room?.number_of_adults !== '0' ? (
                <div className="flex flex-row gap-1">
                  <div className="text-md font-semibold">Sleeps</div>
                  <div>
                    {room.number_of_adults > 1 ? `${room.number_of_adults} Adults` : `${room.number_of_adults} Adult`}
                    {room?.number_of_children && room?.number_of_children !== '0' ? `, ${room.number_of_children} Children` : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {index === 0 && (
            <div className="w-[30%] flex flex-row items-center justify-end">
              <div className="flex flex-col gap-1 items-end">
                <div style={{ fontWeight: "500" }}>
                  {"₹" + getIndianPrice(Math.round(props.data?.final_rate))}
                  <span className="text-xs md:text-sm font-[300] truncate"> per night</span>
                </div>

                <div className="flex flex-row items-center gap-1" onClick={props.setSelectedRoom(props.data.id)}>
                  <CheckboxFormComponent checked={props.selectedRoom} />
                  {props.selectedRoom ? 'Selected' : 'Select'}
                </div>
              </div>

              <div className="absolute top-1 right-1">
                {open ? (<IoIosArrowUp onClick={() => setOpen(false)} className="text-2xl cursor-pointer" />) :
                  (<IoIosArrowDown onClick={() => setOpen(true)} className="text-2xl cursor-pointer" />)}
              </div>
            </div>
          )}
        </div>
      ))}


      {open && (
        <div className="flex flex-col gap-3">
          {props.data?.rooms.map((room, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between">
              <div className="flex flex-col gap-3 md:w-[50%] h-[300px]">
                <ImageCarousel images={room?.images} />
                <div className="text-md md:text-lg font-semibold">{room?.name}</div>
              </div>
              {room?.description ? (
                <div dangerouslySetInnerHTML={{
                  __html: room.description
                }} className=""></div>
              ) : null}
            </div>
          ))}

          {props.data?.rooms[0]?.facilities ? (
            <div className="flex flex-col gap-2">
              <div className="text-lg font-semibold">Amenities</div>
              <div className="text-[14px]">
                {props.data?.rooms[0]?.facilities.map((item, index) => (
                  <span key={index}>{item}
                    {index < props.data.rooms[0].facilities.length - 1 && " . "}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {props.data?.polices ? (
            props.data.polices.map((item, index) => (
              <div className="flex flex-col gap-2">
                <div className="text-lg font-semibold">{item.type}</div>
                <div className="text-[14px]" dangerouslySetInnerHTML={{
                  __html: item.text
                }}></div>
              </div>
            ))
          ) : null}
        </div>
      )}
    </div>
  );
};

export default RoomType;
