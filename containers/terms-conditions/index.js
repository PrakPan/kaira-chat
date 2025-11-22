import content from "../../public/content/termsconditions";
import styled from "styled-components";
import media from "../../components/media";
import { useState } from "react";
import { useEffect } from "react";
import Navbar from "./Components/Navbar";
import Section from "./Components/Section";

const Container = styled.div`
  text-align: center;
  padding: 1rem;

  @media screen and (min-width: 768px) {
    padding: 0rem 4rem 4rem 4rem;
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 10px;
  }
`;

const Heading = styled.p`
  font-size: 3.25rem;
  font-weight: 700;
  margin: 1.5rem 0 0 0;
  padding: 2rem;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 5rem;
    padding: 1rem 0rem 4rem 4rem;
  }
`;

const Linkcardstyle = styled.div`
  position: sticky;
  height: max-content;
  font-size: 1.25rem;
  font-weight: 300;
  text-decoration: none;
  top: 15vh;
  box-shadow: yellow;
`;

const Cardstyle = styled.div`
  font-weight: 300;
  font-size: 1rem;
  padding: 0.5rem 1rem 1rem 1rem;
`;

const Terms = () => {
  let isPageWide = media("(min-width: 768px)");
  let textfield = [];
  const [textfieldText, settextfieldText] = useState(false);

  useEffect(() => {
    for (var i = 0; i < content.length; i++) {
      var text = (
        <ul>
          {content[i].content.map((e) => (
            <li>
              {e.text ? (
                e.text
              ) : (
                <div>
                  <b>{e.subheading}</b>
                  <ul>
                    {e.content.map((el) => (
                      <li style={{ listStyleType: "circle" }}>{el.text}</li>
                    ))}
                  </ul>{" "}
                </div>
              )}
            </li>
          ))}
        </ul>
      );

      textfield.push(
        <Section
          key={content[i].subheading}
          title={content[i].subheading}
          subtitle={text}
          dark={true}
          id={content[i].subheading}
        />
      );
    }

    settextfieldText(textfield);
  }, []);

  return (
    <>
      <Heading className="">Terms And Conditions</Heading>

      <Container className="">
        {isPageWide && (
          <Linkcardstyle>
            <Navbar />
          </Linkcardstyle>
        )}
        <Cardstyle>
          {" "}
          <div> {textfieldText} </div>{" "}
        </Cardstyle>
      </Container>
    </>
  );
};

export default Terms;
