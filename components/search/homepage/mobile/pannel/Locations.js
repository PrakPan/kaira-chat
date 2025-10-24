import styled from "styled-components";
import { FaMapMarkerAlt } from "react-icons/fa";
import SkeletonCard from "../../../../ui/SkeletonCard";
import Link from "next/link";

const Container = styled.div`
  margin: 1rem;
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 14px 14px;
`;

const Text = styled.div`
  font-weight: 500;
  p {
    font-weight: 400;
    margin-bottom: 0rem;
    margin-top: -2px;
    font-size: 12px;
    color: #7e7e7e;
  }
`;

const LocationContainer = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 0.5rem;
  margin-block: auto;
  max-width: 100%;
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr 7fr;
  grid-gap: 0.5rem;
  &:hover {
    cursor: pointer;
    background: #FEFFC0;
  }
`;

const SkeletonContainer = styled.div`
  padding: 0.5rem;
  max-width: 100%;
  display: grid;
  grid-template-columns: 1fr 7fr;
`;

const Heading = styled.p`
  font-weight: 500;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  text-transform: uppercase;
  margin: 1rem;
  color: #7a7a7a;
`;

const Locations = (props) => {
  let locations = [];

  const getParent = (path) => {
    if (!path) return "";

    const links = path.split("/");
    links.pop();
    const parent = links.map((part) => capitalizeFirstLetter(part)).join(" > ");

    return parent;
  };

  const capitalizeFirstLetter = (string) => {
    const words = string.split("_");
    const newString = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    return newString;
  };

  if (props.hotlocations) {
    for (var i = 0; i < 5; i++) {
      const data = props.hotlocations[i];
      if(props.hotlocations[i]?.name){
      locations.push(
        <LocationContainer href={"/" + data?.path} onClick={props?.setPannelClose}>
          <MarkerContainer>
            <FaMapMarkerAlt />
          </MarkerContainer>
          <Text>
            <div>{props.hotlocations[i]?.name}</div>
            {props.hotlocations[i]?.parent ? (
              <p className="text-[#7e7e7e] text-[12px] font-[400] mb-0">{props.hotlocations[i]?.parent}</p>
            ) : props.hotlocations[i]?.state?.name ? (
              <p className="text-[#7e7e7e] text-[12px] font-[400] mb-0"> {props.hotlocations[i]?.state?.name}</p>
            ) : props.hotlocations[i]?.path ? <p className="text-[#7e7e7e] text-[12px] font-[400] mb-0"> {getParent(props.hotlocations[i]?.path)}</p>: null}
          </Text>
        </LocationContainer>
      );
    }
    }
  } else {
    for (var i = 0; i < 5; i++) {
      locations.push(
        <SkeletonContainer>
          <SkeletonCard borderRadius="100%" width="46px"></SkeletonCard>
          <div style={{ marginBlock: "auto" }}>
            <SkeletonCard
              height="14px"
              ml="8px"
              width={"70%"}
              borderRadius={"2px"}
            ></SkeletonCard>
            <SkeletonCard
              height="12px"
              ml="8px"
              mt="4px"
              width={"55%"}
              borderRadius={"2px"}
            ></SkeletonCard>
          </div>
        </SkeletonContainer>
      );
    }
  }

  return (
    <div>
      <Heading className="">POPULAR DESTINATIONS</Heading>
      <Container>{locations}</Container>
    </div>
  );
};

export default Locations;
