import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { FaHome } from "react-icons/fa";

export default function AccommodationElement(props) {
  const { heading } = props;
  return (
    <Container className="pt-3">
      <div className=" flex flex-row items-center justify-start space-x-10">
        <div className="w-20 h-20 flex items-center">
          <FaHome className="text-black lg:text-[3.05rem]   text-[1.25rem]" />
        </div>
        <div className="">{heading}</div>
      </div>
    </Container>
  );
}
