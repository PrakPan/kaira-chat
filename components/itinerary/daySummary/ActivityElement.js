import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import ImageLoader from "../../../components/ImageLoader";

export default function ActivityElement(props) {
  const { activities } = props;
  return (
    <Container className="pt-0">
      <div className=" flex flex-row items-center w-full md:pl-2 lg:pl-2">
        <div className="lg:w-[10%] md:w-[20%] font-normal text-sm">
          
        </div>
        <div className="text-sm font-normal flex flex-wrap gap-2">
          <span>Explore</span>
          {activities.map((activity, index) => (
            <span key={index}>
              {activity}
              {index < activities.length - 1 && ","}
            </span>
          ))}
        </div>
      </div>
    </Container>
  );
}
