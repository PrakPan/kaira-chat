import { TransportIconFetcher } from "../../../helper/TransportIconFetcher";
import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";

export default function Summary(props) {
  const { icon, heading } = props;

  function getTransportationType(url) {
    const fileName = url.substring(
      url.lastIndexOf("/") + 1,
      url.lastIndexOf(".")
    );
    const firstLetter = fileName.charAt(0).toUpperCase();
    const restOfWord = fileName.slice(1);
    const transportationType = firstLetter + restOfWord;
    return transportationType;
  }

  console.log(props);

  return (
    <Container className="pt-3">
      <div className=" flex flex-row items-center justify-start space-x-5">
        {icon ? (
          <div className="w-[6.15rem] grid place-items-center">
            <TransportIconFetcher
              TransportMode={getTransportationType(icon)}
              classname="text-black lg:text-[3.05rem] text-[1.25rem]"
            />
          </div>
        ) : (
          <div className="w-[3.05rem]"></div>
        )}
        <div className="">{heading}</div>
      </div>
    </Container>
  );
}
