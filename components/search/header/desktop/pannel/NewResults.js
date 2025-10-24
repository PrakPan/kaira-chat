import React from "react";
import styled from "styled-components";
import { ImSearch } from "react-icons/im";
import SkeletonCard from "../../../../ui/SkeletonCard";
import Link from "next/link";
import Image from "next/image";

const Container = styled.div`
  margin: 1rem;

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
  }
`;

const LocationContainer = styled(Link)`
  color: black;
  text-decoration: none;
  padding: 0.3rem;
  max-width: 100%;
  display: flex;
  gap: 12px;
  align-items: center;
  border-radius: 10px;
  &:hover {
    background: #FEFFC0;
    cursor: pointer;
  }
`;

const MarkerContainer = styled.div`
  background: #dfdfdf;
  border-radius: 100%;
  padding: 14px;
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

const SkeletonContainer = styled.div`
  margin: 1rem;
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
  }
`;

const NewResults = (props) => {

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

  const skeleton = (
    <div
      style={{
        display: "grid",
        padding: "0.3rem",
        gap: "2px",
        gridTemplateColumns: "1fr 5fr",
      }}
    >
      <SkeletonCard borderRadius="100%" width="45px"></SkeletonCard>
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
    </div>
  );

  if (!props.results)
    return (
      <SkeletonContainer>
        {[
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
          skeleton,
        ]}
      </SkeletonContainer>
    );

  return (
    <>
      <Container>
        {props.results.map((e) => (
          <LocationContainer key={e.resource_id} href={"/" + e.path}>
            {!e?.image ? <MarkerContainer>
              <ImSearch />
            </MarkerContainer> :
              <Image src={"https://d31aoa0ehgvjdi.cloudfront.net/" + e?.image} width={32} height={28} className="rounded-[6px] h-[28px] w-[32px]" />
            }
            <Text>
              <div>{e.name}</div>
              {e.parent ? <p className="text-[#7e7e7e] text-[12px] font-[400] mb-0">{e.parent}</p> : e?.path ? <p className="text-[#7e7e7e] text-[12px] font-[400] mb-0">{getParent(e.path)}</p> : null}
            </Text>
          </LocationContainer>
        ))}
      </Container>
    </>
  );
};

export default NewResults;
