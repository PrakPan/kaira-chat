import { TTW } from "../assets";
// import TTW from "../common/TTW";
import Image from "next/image";
import Link from "next/link";
import styles from "./NavigationMenu.module.scss";
const NavigationMenu = () => {
  return (
    <nav className={styles.navigationMenu}>
      <Image src={TTW} alt="TTW Logo" />
      <ul className={styles.menuList}>
        <li>
          <Link href={"/v2/home"}>Home</Link>
        </li>
        <li>
          <Link href={"/v2/about"}>About</Link>
        </li>
        <li>
          <Link href={"/v2/services"}>Services</Link>
        </li>
        <li>
          <Link href={"/v2/contact"}>Contact</Link>
        </li>
      </ul>

      <button className="cta-button">Get Started</button>
    </nav>
  );
};

export default NavigationMenu;
