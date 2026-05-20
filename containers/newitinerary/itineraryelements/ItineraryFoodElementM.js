import { MdRestaurant } from "react-icons/md";

const ItineraryFoodElementM = (props) => {
  return (
    <>
      <div className="">
        <div className="flex flex-col">
          <div className="flex flex-row ">
            <div className="text-center">
              <div className="grid place-items-center">
                <MdRestaurant className="text-black ttw-type-h2 mr-4" />
              </div>
            </div>
            <div className="font-normal text-[1.2rem]">{props.heading}</div>
          </div>

          <div className="flex ">
            <div className=" pt-2 ttw-type-body">{props.text}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItineraryFoodElementM;
