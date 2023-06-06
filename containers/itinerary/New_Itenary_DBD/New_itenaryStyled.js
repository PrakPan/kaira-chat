import styled from 'styled-components';

export const newDayContainerTextpadding = {
  initialLeft: '2.6rem',
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
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
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
  font-weight: 500;
  font-size: 14px;

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
  font-weight: 500;
  font-size: 13px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;
export const SubTimecontainer = styled.div`
  font-weight: 500;
  font-size: 13px;
  display: flex;

  flex-direction: column;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    padding-left: ${newDayContainerTextpadding.initialLeft};
    padding-right: '10px';
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
  /* position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')}; */

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
  position: ${({ sticky }) => (sticky ? 'sticky' : 'inherit')};
  z-index: ${({ sticky }) => (sticky ? '1000' : '997')};
  top: 70px;
  display: flex;
  flex-direction: row;

  margin: 0px -20px 0px -20px;
  background-color: white;
`;
