import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiOutlineMail } from "react-icons/hi";
import { RiWhatsappFill } from "react-icons/ri";

import Socials from "./Socials";
import linksArr from "./Links";
import openTailoredModal from "../../services/openTailoredModal";
import urls from "../../services/urls";

/* =========================================
   Site footer — ink-rail background, yellow
   accents, four-column layout matching the
   homepage design system.
   ========================================= */

const Container = styled.footer`
  background: #0f1a2e;
  color: #fafaf5;
  padding: 56px 0 32px;
  position: relative;
  z-index: 1000;
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 28px;
`;

const NewsletterBanner = styled.div`
  background: #f7e700;
  border-radius: 24px;
  padding: 28px 32px;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;

  h3 {
    font-size: 24px;
    font-weight: 800;
    color: #0b1220;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.02em;

    span {
      font-family: "Instrument Serif", serif;
      font-style: normal;
      font-weight: 400;
    }
  }

  @media screen and (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 24px 20px;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  align-items: center;
  background: #ffffff;
  border-radius: 999px;
  padding: 4px;
  min-width: 320px;

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 16px;
    font-size: 14px;
    background: transparent;
    color: #0b1220;

    &::placeholder { color: #8a93a6; }
  }
  button {
    background: #0f1a2e;
    color: #fff;
    border: 0;
    padding: 12px 20px;
    border-radius: 999px;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover { transform: translateY(-1px); }
    @media screen and (max-width: 351px) {
    font-size: 12px;
     padding: 12px 8px;

  }
  }

  @media screen and (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;

  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media screen and (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Brand = styled.div`
  .logo-line {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo-mark {
    width: 36px;
    height: 36px;
    background: #f7e700;
    color: #0f1a2e;
    border-radius: 9px;
    display: grid;
    place-items: center;
    font-family: "Instrument Serif", serif;
    font-style: normal;
    font-size: 20px;
    transform: rotate(-6deg);
  }
  .brand-word .name {
    font-weight: 700;
    font-size: 16px;
    letter-spacing: -0.015em;
    color: #fff;
  }
  .brand-word .tag {
    display: block;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 2px;
  }
  .blurb {
    margin-top: 18px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.55;
    max-width: 320px;
  }
  .contact {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.86);

    a, .row {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.86);
      text-decoration: none;
      cursor: pointer;
    }
    a:hover { color: #f7e700; }
    svg { color: #f7e700; }
  }
`;

const Col = styled.div`
  h4 {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.45);
    margin: 0 0 16px 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  a, p {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
    margin: 0;
    cursor: pointer;
  }
  a:hover, p:hover { color: #f7e700; }
`;

const SocialRow = styled.div`
  margin-top: 20px;

  /* Existing Socials component renders FontAwesome icons; nudge into ink-rail */
  svg {
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.15s;
  }
  svg:hover { color: #f7e700; }
`;

const Bottom = styled.div`
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);

  @media screen and (max-width: 640px) {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
`;

const NewFooter = () => {
  const router = useRouter();

  return (
    <Container className="font-inter">
      <Inner>
        <NewsletterBanner>
          <div>
            <h3>
              Good vibes & <span>great deals,</span>
              <br />straight to your inbox.
            </h3>
          </div>
          <NewsletterForm onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@example.com" required />
            <button type="submit">Subscribe</button>
          </NewsletterForm>
        </NewsletterBanner>

        <Grid>
          <Brand>
            <div className="logo-line">
              {/* <div className="logo-mark">t</div> */}
              <img src="https://d31aoa0ehgvjdi.cloudfront.net/media/website/logoyellow.png" alt="The Tarzan Way" width={36} height={36} />
              <div className="brand-word">
                <span className="name">the tarzanway</span>
                <span className="tag">by Kaira · est. 2018</span>
              </div>
            </div>
            <p className="blurb">
              Trips planned in conversation, not forms. Powered by Kaira, our
              AI travel agent. Fine-tuned by humans who&apos;ve been there.
            </p>
            <div className="contact">
              <div
                className="row"
                onClick={() => (window.location.href = urls.WHATSAPP)}
              >
                <div className="flex gap-2 items-center">
                <RiWhatsappFill size={16} color="green" />
                +91 7827441548
                </div>
              </div>
              <a href="mailto:info@thetarzanway.com">
                <HiOutlineMail size={16} />
                info@thetarzanway.com
              </a>
            </div>
            <SocialRow>
              <Socials />
            </SocialRow>
          </Brand>

          {linksArr.map((section, idx) => (
            <Col key={idx}>
              <h4>{section.heading}</h4>
              <ul>
                {section.data.map((item, i) => {
                  if (item.title === "Personalise") {
                    return (
                      <li key={i}>
                        <p onClick={() => openTailoredModal(router)}>{item.title}</p>
                      </li>
                    );
                  }
                  if (item.title === "Subscribe") {
                    return null;
                  }
                  if (Array.isArray(item.link)) {
                    return (
                      <li key={i}>
                        <a href={item.link[0]} target="_blank" rel="noreferrer">
                          {item.title}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={i}>
                      <Link href={item.link}>{item.title}</Link>
                    </li>
                  );
                })}
              </ul>
            </Col>
          ))}
        </Grid>

        <Bottom>
          <span>
            © {new Date().getFullYear()} Tarzan Way Travels Private Limited · Made in India · Built for the world
          </span>
          <span>GST · Secure payments · ISO 27001</span>
        </Bottom>
      </Inner>
    </Container>
  );
};

export default NewFooter;
