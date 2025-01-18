import Image from "next/image";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 25rem;
  @media screen and (min-width: 768px) {
    height: 20rem;
  }
  position: relative;
`;

const ActivityCard = ({ image, title, description }) => {
    return (
      <Container>
      <div className="flex flex-col h-full gap-2">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="relative h-[12rem] md:h-[15rem] w-full overflow-hidden">
          <Image
            src={image} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-[8px]"
            alt={title}
          />
        </div>
        </div>
        <div className="">
          <h3 className="font-bold text-xs">{title}</h3>
          <p className="text-gray-600 text-xs mt-1">{description}</p>
        </div>
      </div>
      </Container>
    );
  };
  
  export default ActivityCard;
  