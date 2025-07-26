
import styles from '../../styles/pages/v2/home.module.scss';
import { HeroSection } from '../../components/v2/home';

const HomeV2 = () => {
  return (
    <div className={styles.ttwRevamp}>
      <HeroSection 
        title="Welcome to the Tarzan Way V2" 
        subtitle="Experience the next generation of travel planning with enhanced AI capabilities and personalized recommendations."
      />
    </div>
  );
};

export default HomeV2;


