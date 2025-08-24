import { HeroSection } from "../../components/revamp/home";
import Navigation from "../../components/revamp/home/NavigationMenu";
import styles from "../../styles/pages/revamp/home.module.scss";

const HomeV2 = () => {
  return (
    <div className={styles.ttwRevamp}>
      <Navigation />
      <HeroSection />
    </div>
  );
};

export default HomeV2;
