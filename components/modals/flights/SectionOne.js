import React from 'react';
import { IoMdClose } from 'react-icons/io';
import styled from 'styled-components';
import DropDown from '../../ui/DropDown'
import { useState } from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import media from '../../media'
import { FaFilter } from 'react-icons/fa';
import { TbArrowBack } from 'react-icons/tb';
import Drawer from '../../ui/Drawer';
import Button from '../../ui/button/Index'
const Heading = styled.div`
  margin: 0;
  display: flex;
  gap : 0.5rem;
  margin: 1rem;
  @media screen and (min-width: 768px) {
  }
`;
const Text = styled.div`
  font-size: 1.5rem;
  line-height: 2rem;
`;
const Container = styled.div`
margin-bottom : 10px;
`
const FiltersContainer = styled.div`
`
const FlexBox = styled.div`
  width: 95%;
  margin-inline: auto;

  @media screen and (min-width: 768px) {
    display: grid;
    gap: 2%;

    grid-template-columns: 1fr 1fr;
  }
`;
const DropDownContainer = styled.div`
  display: flex;
  gap: 2%;
  width: 95%;
  align-items : center;
  margin-inline: auto;
`;
const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  grid-auto-columns: auto;
  gap: 5px;
  grid-row-gap : 5px;
`;
const P = styled.div`
  margin-top: 1rem;
  margin-bottom: 0.3rem;
  font-weight: 600;
  @media screen and (min-width: 768px) {
    margin-bottom: 0.5rem;
    margin-top: 0rem;
    font-weight: 400;
  }
`;

const Item = styled.div`
  border: 2px solid #d0d5dd;
  font-size: 14px;
  cursor: pointer;
  padding: 3px 0;
  text-align : center;
  border-radius: 10px;
  &:hover {
    background: #01202b;
    border: 2px solid #01202b;

    color: white;
  }
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: fixed;
  width: 100%;
  bottom: 1.2rem;
`;
const ItemArr = ['Morning', 'Afternoon', 'Evening','Night']
const Section = (props) => {
  const [isSelected, setIsSelected] = useState(false)
  let isPageWide = media("(min-width: 768px)");
  
  const DropDownQueries = [
    {text : 'All' , value : 'All'}
  ]

  const _changeAirlineHandler = (e) => {
    console.log(e)
  }

  const FiltersSection = (
    <FiltersContainer>
      <FlexBox>
        <div>
          <P>Departure in</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item>{e}</Item>
            ))}
          </ItemContainer>
        </div>
        <div>
          <P>Reach by</P>
          <ItemContainer>
            {ItemArr.map((e) => (
              <Item>{e}</Item>
            ))}
          </ItemContainer>
        </div>
      </FlexBox>

      <P style={{ margin: "0.5rem auto 0.5rem auto", width: "95%" }}>Airline</P>

      <DropDownContainer>
        <div style={{ width: "15rem" }}>
          <DropDown
            onChange={(e) => _changeAirlineHandler(e, "query_type")}
            height="35px"
            label="All"
          >
            {DropDownQueries.map((e, i) => (
              <option
                style={{ borderBottom: "1px solid #e6e6e6" }}
                key={i}
                value={e.value}
              >
                {e.text}
              </option>
            ))}
          </DropDown>
        </div>

        {isSelected ? (
          <div
            onClick={() => {
              setIsSelected(false);
            }}
          >
            <ImCheckboxChecked style={{ display: "inline" }} /> Nonstop
          </div>
        ) : (
          <div
            onClick={() => {
              setIsSelected(true);
            }}
          >
            <ImCheckboxUnchecked style={{ display: "inline" }} /> Nonstop
          </div>
        )}
      </DropDownContainer>
    </FiltersContainer>
  );



  return (
    <Container>
      <Heading className="font-lexend">
        <IoMdClose
          className="hover-pointer"
          onClick={props.setHideFlightModal}
          style={{ fontSize: "2rem" }}
        ></IoMdClose>
        <Text>{props.text}</Text>
      </Heading>

      {isPageWide ? FiltersSection : <></>}

      {!isPageWide && (
        <Drawer
          anchor={"right"}
          backdrop
          style={{ zIndex: 1502 }}
          className="font-lexend"
          show={props.showFilter}
          onHide={() => props.setShowFilter(false)}
          mobileWidth={"100%"}
          width={"50%"}
        >
          <Container>
            <Heading className="font-lexend">
              <IoMdClose
                className="hover-pointer"
                onClick={() => props.setShowFilter(false)}
                style={{ fontSize: "2rem" }}
              ></IoMdClose>
              <Text>Filter</Text>
            </Heading>
            {FiltersSection}

            <ButtonContainer>
              <Button
                onclick={() => console.log("")}
                padding="0.7rem 3rem"
                borderRadius="0.5rem"
                fontWeight="600"
              >
                Cancel
              </Button>
              <Button
                onclick={() => console.log("")}
                bgColor={"#F7E700"}
                padding="0.7rem 3rem"
                borderRadius="0.5rem"
                fontWeight="600"
              >
                Apply
              </Button>
            </ButtonContainer>
          </Container>
        </Drawer>
      )}
    </Container>
  );
};

export default Section;
