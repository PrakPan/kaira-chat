import styled from "styled-components";

const Color = {
  yellow: "#F7E700",
  dark: "black",
  gray: "gray",
};

export const ScrollBar = styled.div`
  height: 100vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.6rem;
  }

  &::-webkit-scrollbar-track {
    background: ${Color.yellow};
    border-radius: 100vw;
    margin-block: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${Color.dark};
    /* border: 0.25em solid white; */
    border-radius: 100vw;
    height: 6rem;
    &:hover {
      background: ${Color.gray};
    }
  }
`;
