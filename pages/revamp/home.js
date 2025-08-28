import HeroSection from "../../components/revamp/home/HeroSection";
import NavigationMenu from "../../components/revamp/home/NavigationMenu";
// import styles from "./../components/v2/home.module.scss";

const HomeV2 = () => {
  return (
    <div className={styles.ttwRevamp}>
      <NavigationMenu />
      <HeroSection />
    </div>
  );
};

export default HomeV2;
