import styled from "styled-components";

export const newDayContainerTextpadding = {
  initialLeft: "2.6rem",
};

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  @media screen and (min-width: 768px) {
    flex-direction: column;
  }
`;

export const ArriveContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* Caption · 12/1.4/600 — arrival meta */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-style: normal;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.4;
  @media screen and (min-width: 768px) {
    flex-direction: row;
  }
  padding: 10px 0px 10px 0px;
  color: #01202b;
`;

export const TransparentButton = styled.button`
  border: 1.8px solid #000000;
  filter: drop-shadow(0px 1px 0px #f0f0f0);
  border-radius: 6px;
  display: flex;
  /* Button label · 13.5/700 per design-system component rule */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.01em;

  width: fit-content;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 6px 15px;
  margin: 10px 0px 10px 0px;
`;

export const TransportContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TInfoContainer = styled.div`
  @media screen and (min-width: 768px) {
    display: flex;

    flex-direction: row;
    & > div {
      padding-left: ${newDayContainerTextpadding.initialLeft};
      width: 100%;
    }
  }
`;

export const TransferInfo = styled.div`
  padding: 4px 0px 10px 0px;
`;

export const Timecontainer = styled.div`
  /* Small body · 13/1.5/600 — day/time label */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

export const SubTimecontainer = styled.div`
  /* Small body · 13/1.5/400 — sub-time meta */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
  font-variant-numeric: tabular-nums;
  display: flex;

  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    padding-left: ${newDayContainerTextpadding.initialLeft};
    padding-right: "10px";
  }
`;

export const Line = styled.div`
  border-style: none none solid none;
  border-color: #e4e4e4;
  border-width: 1px;
  width: 100%;
`;

export const HLine = styled.span`
  @media screen and (min-width: 768px) {
    border-style: none none none dotted;
    border-color: #111;
    margin: -10px 0px;
    border-width: 2px;

    margin-left: 2rem;
    & > div {
      margin-top: 60%;
    }
  }
`;

export const Navbar = styled.div`
  /* position: ${({ sticky }) => (sticky ? "sticky" : "inherit")}; */

  display: flex;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: scroll;
  align-items: center;

  margin: 0px -20px 0px -20px;
  background-color: white;
`;

export const NavbarContainer = styled.div`
  position: ${({ sticky }) => (sticky ? "sticky" : "inherit")};
  z-index: ${({ sticky }) => (sticky ? "1000" : "997")};
  top: 70px;
  display: flex;
  flex-direction: row;

  margin: 0px -20px 0px -20px;
  background-color: white;
`;
