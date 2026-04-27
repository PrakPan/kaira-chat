import content from "../../public/content/termsconditions";
import styled from "styled-components";
import media from "../../components/media";
import Navbar from "./Components/Navbar";

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
  font-size: 2.25rem;
  font-weight: 700;
  margin: 1.5rem 0 0 0;
  padding: 2rem;
  text-align: center;
  @media screen and (min-width: 768px) {
    font-size: 4rem;
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
`;

const Cardstyle = styled.div`
  font-weight: 300;
  font-size: 1rem;
  padding: 0.5rem 1rem 1rem 1rem;
`;

const SectionWrapper = styled.div`
  text-align: left;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const BulletList = styled.ul`
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

const NestedList = styled.ul`
  list-style-type: circle;
  padding-left: 1.5rem;
  margin-top: 0.5rem;

  li {
    margin-bottom: 0.4rem;
    line-height: 1.6;
  }
`;

// Payment Terms section gets a side-by-side layout on desktop
const PaymentTermsLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 2rem;
  }
`;

const PaymentTermsContent = styled.div`
  flex: 1;
`;

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  @media screen and (min-width: 768px) {
    align-items: center;
  }
`;

const QRImage = styled.img`
  width: 260px;
  height: 260px;
  border: 1px solid #ddd;
  border-radius: 8px;
  object-fit: contain;
`;

const QRLabel = styled.p`
  font-size: 0.8rem;
  color: #888;
  margin: 0;
  text-align: center;
`;

const renderContent = (contentArray) => (
  <BulletList>
    {contentArray.map((item, index) => (
      <li key={index}>
        {item.text ? (
          item.text
        ) : (
          <>
            <b>{item.subheading}</b>
            <NestedList>
              {item.content.map((nested, i) => (
                <li key={i}>{nested.text}</li>
              ))}
            </NestedList>
          </>
        )}
      </li>
    ))}
  </BulletList>
);

const Terms = () => {
  let isPageWide = media("(min-width: 768px)");

  return (
    <>
      <Heading>Terms And Conditions</Heading>
      <Container>
        {isPageWide && (
          <Linkcardstyle>
            <Navbar />
          </Linkcardstyle>
        )}
        <Cardstyle>
          {content.map((section) => (
            <SectionWrapper key={section.subheading} id={section.subheading}>
              <SectionTitle>{section.subheading}</SectionTitle>

              {section.subheading === "Payment Terms" ? (
                <PaymentTermsLayout>
                  <PaymentTermsContent>
                    {renderContent(section.content)}
                  </PaymentTermsContent>
                  <QRWrapper>
                    <QRImage
                      src="/QRTTW.png"
                      alt="Payment QR Code"
                    />
                    <QRLabel>Scan to pay</QRLabel>
                  </QRWrapper>
                </PaymentTermsLayout>
              ) : (
                renderContent(section.content)
              )}
            </SectionWrapper>
          ))}
        </Cardstyle>
      </Container>
    </>
  );
};

export default Terms;