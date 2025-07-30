import { HeroSection } from "../../components/v2/home";
import Navigation from "../../components/v2/home/NavigationMenu";
import styles from "../../styles/pages/v2/home.module.scss";

const HomeV2 = () => {
  return (
    <div className={styles.ttwRevamp}>
      <Navigation />
      <HeroSection />
    </div>
  );
};

export default HomeV2;
