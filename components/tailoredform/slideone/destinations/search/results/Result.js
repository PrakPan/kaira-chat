import { FaMapMarkerAlt } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment";
import ImageLoader from "../../../../../ImageLoader";
import Image from "next/image";

const Container = styled.div`
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 12px;
  align-items: center;
  margin-block: 1rem;
  &:hover {
    background: #FEFFC0;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 10px;
  padding-top: 10px;
`;

const Result = (props) => {
  const _handleClick = (e) => {
    e.stopPropagation();
    props.setSearchFinalized({ name: props.name, type: props.type });
    props.setDestination(props.name);

    if (props.result?.start_date && props.result?.end_date) {
      props.setValueStart(moment(props.result.start_date));
      props.setValueEnd(moment(props.result.end_date));
    }

    if (props.setShowResults) props.setShowResults(false);
    props.setFocusSearch(false);
  };

  const getParent = (path) => {
    if (!path) return "";

    const links = path.split("/");
    links.pop();
    const parent = links.map((part) => capitalizeFirstLetter(part)).join(" , ");

    return parent;
  };

  const capitalizeFirstLetter = (string) => {
    const words = string.split("_");
    const newString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return newString;
  };

  return (
    <Container
      className="font-lexend p-2"
      onClick={(e) => {
        _handleClick(e),
          props._updateDestinationHandler(
            props.result.resource_id || props.result.id,
            props.inbox_id,
            props.result
          );
      }}
    >
      {/* <MarkerContainer> */}
        <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/"+props.result?.image} width={32} height={28} className="rounded-[6px] h-[28px] w-[32px]"/>
      {/* </MarkerContainer> */}
      <div className="flex">
        <div className="font-[500]">{props.name} </div>
        <div className="font-normal">, {getParent(props.result.path)}</div>
      </div>
    </Container>
  );
};

export default Result;
