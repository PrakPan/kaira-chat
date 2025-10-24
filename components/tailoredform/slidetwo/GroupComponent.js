import Image from "next/image";
import React from "react";
import styled from "styled-components";
import { Body2R_14 } from "../../new-ui/Body";

export const StyledBox = styled.div`
  width: 170px;
  height: 74px;
  min-width: 170px;
  max-width: 170px;
  transform: rotate(0deg);
  opacity: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  border-radius: 8px;
  padding: 10px;
  background-color: ${({ is_selected }) => (is_selected ? "#F7E700" : "transparent")};
    border: ${({ is_selected }) => (is_selected ? "none" : "1px solid #E5E5E5")};

`;


const groups = ["Solo", "Couple", "Friends", "Family"];

const GroupComponent = (props) => {
    return (
        <div className="flex flex-wrap gap-4">
            {groups.map((item) => (
                <StyledBox is_selected={props.groupType === item}
                    onClick={() => props._handleShowPax(item)}>
                        <div className="flex flex-col gap-[4px]">
                    <Image src={`/${item.toLowerCase()}.svg`} width={20} height={20} />
                    <Body2R_14>
                        {item}
                    </Body2R_14>
                    </div>
                </StyledBox>
            ))}
        </div>)
};

export default GroupComponent;
