import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import { FaHome } from "react-icons/fa";

export default function AccommodationElement(props) {
  const { heading } = props;
  return (
    <Container className="pt-0">
      <div className=" flex flex-row items-center justify-start w-full">
        <div className="w-[20%] pr-3 flex items-center justify-end">
          <FaHome className="text-black lg:text-[2.05rem]   text-[1.25rem]" />
        </div>
        <div className="w-[80%] text-sm">{heading}</div>
      </div>
    </Container>
  );
}
