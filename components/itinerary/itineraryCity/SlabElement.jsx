import ImageLoader from "../../ImageLoader";

const SlabElement = (props) => {
  if (props.element.element_type === "activity") {
    return <Activity element={props.element} />;
  }
  return <Recommendation element={props.element} />;
};

export default SlabElement;

const Recommendation = (props) => {
  return (
    <div className="flex gap-3 bg-gray-200 p-2 rounded-md">
      <div className="h-full w-12 bg-white p-2 rounded-lg">
        <ImageLoader url={props.element?.icon ? props.element.icon : ""} />
      </div>

      <div className="text-sm space-y-1">
        <div className="font-semibold text-base">{props.element.heading}</div>
        <div className="text-xs border-2 border-gray-400 w-fit p-1 rounded-md text-gray-500">{props.element.type}</div>
        <div className="line-clamp-3">{props.element.text}</div>
      </div>
    </div>
  );
};

const Activity = (props) => {
  return (
    <div>
      <div className="w-10 h-10">
        <ImageLoader url={props.element?.icon} />
      </div>

      <div>
        <div>{props.element.heading}</div>
        <div>{props.element?.poi ? "Self Exploration" : "Activity"}</div>
      </div>
    </div>
  );
};
