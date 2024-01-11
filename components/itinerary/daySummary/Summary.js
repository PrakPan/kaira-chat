import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";

export default function Summary(props) {
  const { icon, heading } = props;

  return (
    <Container className="pt-3">
      <div className=" flex flex-row items-center justify-start space-x-10">
        <div className="w-20 h-20">{icon}</div>
        <div className="">{heading}</div>
      </div>
    </Container>
  );
}
