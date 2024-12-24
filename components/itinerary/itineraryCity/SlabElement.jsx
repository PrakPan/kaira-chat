import ImageLoader from "../../ImageLoader";

const SlabElement = (props) => {
  if (props.element.element_type === "activity") {
    return <Activity element={props.element} />;
  } else if (props.element.element_type === "recommendation") {
    return <Recommendation element={props.element} />;
  }
  return null;
};

export default SlabElement;

const Recommendation = (props) => {
  return (
    <div className="flex gap-3 bg-white p-2 rounded-md">
      <div className="bg-gray-100 rounded-lg p-2 h-fit">
        <ImageLoader
          style={{ width: "80px", height: "60px" }}
          url={
            props.element?.icon
              ? props.element.icon
              : "media/icons/default/recommendation.svg"
          }
        />
      </div>

      <div className="flex flex-col gap-1 text-sm">
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

const Activity = (props) => {
  return (
    <div className="flex flex-row gap-3 bg-white p-2 rounded-md">
      <div>
        <ImageLoader
          borderRadius={"5px"}
          style={{ width: "100px", height: "60px" }}
          url={props.element?.icon}
        />
      </div>

      <div className="">
        <div className="font-semibold text-base">{props.element.heading}</div>
        <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">
          {props.element?.poi ? "Self Exploration" : "Activity"}
        </div>
      </div>
    </div>
  );
};
