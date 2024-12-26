import ImageLoader from "../../ImageLoader";
import { isJson } from "../../../services/isJSON";
import media from "../../media";

const SlabElement = (props) => {
  if (props.element.element_type === "activity") {
    return <Activity element={props.element} />;
  } else if (props.element.element_type === "recommendation") {
    return <Recommendation element={props.element} />;
  }
  return null;
};

export default SlabElement;

const Activity = (props) => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className="flex flex-row gap-3 bg-white p-3">
      <div className="md:w-[15%]">
        <ImageLoader
          borderRadius={"5px"}
          style={{ width: isPageWide ? "120px" : "60px", height: isPageWide ? "120px" : "60px" }}
          url={props.element?.icon}
        />
      </div>

      <div className="md:w-[85%]">
        <div className="font-semibold text-base">{props.element.heading}</div>
        <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
          {props.element?.poi ? "Self Exploration" : "Activity"}
        </div>
      </div>
    </div>
  );
};

const Recommendation = (props) => {
  if (props.element.type === "Meal Recommendation") {
    return <MealRecommendation element={props.element} />;
  }

  return (
    <div className="flex items-center gap-3 bg-white p-3">
      <div className="w-[15%] h-full">
        <ImageLoader
          style={{
            width: "50px",
            height: "50px",
            filter: "grayscale(100%) brightness(0%) contrast(100%)",
            margin: "auto",
          }}
          url={
            props.element?.icon
              ? props.element.icon
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="w-[85%] flex flex-col gap-2 text-sm">
        <div className="font-semibold text-base">{props.element.heading}</div>
        {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null}

        {props.element.text ? (
          isJson(props.element.text) ? (
            <div className="grid md:grid-cols-2 gap-4">
              {JSON.parse(props.element.text).map((res, index) => (
                <Restaurant key={index} element={res} />
              ))}
            </div>
          ) : (
            <p className="line-clamp-3">{props.element.text}</p>
          )
        ) : null}
      </div>
    </div>
  );
};

const MealRecommendation = (props) => {
  return (
    <div className="flex items-center gap-3 bg-white p-3">
      <div className="w-[15%] h-full">
        <ImageLoader
          style={{
            width: "50px",
            height: "50px",
            filter: "grayscale(100%) brightness(0%) contrast(100%)",
            margin: "auto",
          }}
          url={
            props.element?.icon
              ? props.element.icon
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="w-[85%] flex flex-col gap-1 text-sm">
        <div className="font-semibold text-base">{props.element.heading}</div>
        {props.element.type ? (
          <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
            {props.element.type}
          </div>
        ) : null}
        <p className="line-clamp-3">{props.element.text}</p>
      </div>
    </div>
  );
};

const Restaurant = (props) => {
  return (
    <div className="flex items-center gap-3">
      <div>
        <ImageLoader
          borderRadius={"5px"}
          style={{
            width: "80px",
            height: "80px",
          }}
          url={
            props.element?.image
              ? props.element.image
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="">
        <div className="font-semibold md:text-lg">{props.element.name}</div>
        <div className="line-clamp-3">{props.element.description}</div>
      </div>
    </div>
  );
};
