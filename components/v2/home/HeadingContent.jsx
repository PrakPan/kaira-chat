import styles from './HeadingContent.module.scss';

const HeadingContent = ({ title, subtitle }) => {
  return (
    <div className={styles.headingContent}>
      <h1 className={styles.title}>Your Trip. Your Vibe. </h1>
      <h1 className={styles.title}>Our AI's on It.</h1>
      <div className={styles.contentWrapper}>
      <p className={styles.subtitle}>Get trips that match your vibe, with AI-curated plans made just for you. With </p>
      <p className={styles.subtitle}>
        The Tarzan Way, travel feels easy, personal, and effortlessly cool.</p>
      </div>
    </div>
  );
};

export default HeadingContent;