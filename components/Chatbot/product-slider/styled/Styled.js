import styled from "styled-components";

export const Image = styled.img`
  width: 200px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
`;

export const ImageWrapper = styled.div`
  height: 140px;

  &.flight-wrapper {
    height: 50px;
    display: block;
    border-radius: 10px;
    width: 50px;
    border: 1px solid #ededed;
    }
`;

export const HeadingOne = styled.p`
  font-family: Montserrat;
  font-weight: 500 !important;
  font-size: 16px !important;
`;

export const SubHeading = styled.p`
  font-family: Montserrat;
  font-weight: 400;
  font-size: 12px;
`;

export const ChipsContainer = styled.div`
  display: flex; 
  row-gap: 8px;
  gap: 8px;
  flex-wrap : wrap;

  &.spacebottom{
  margin-bottom: 8px
  }
`
export const SingleChips = styled.span`
    border-radius: 40px;
    padding: 2px 8px;
    color: #fff;
    font-family: Montserrat;
    font-weight: 400;
    font-size: 12px;
    background: #01202b;

    &.purple{
      background: #8981E4
    }

     &.green{
      background: #36BACB
    }
`