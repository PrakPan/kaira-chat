import { useRouter } from "next/router";
import StoryCard from "./StoryCard";
import styles from "./TravelerStoriesSection.module.scss";

/*
 * "Real trips. Real moments." — editorial story grid.
 *
 * Cards are rendered by the reusable <StoryCard> in StoryCard.jsx
 * (also used by MyTripsSection). To swap content, pass `stories` shape:
 *
 *   { id, image, badge, moment, detail, author, rating, seed }
 */

const DEFAULT_STORIES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80",
    badge: "Vietnam · 5 nights",
    moment: (
      <>
        Minal found her <span className="ttwSerif">favourite coffee</span> in Hoi An.
      </>
    ),
    detail:
      "A ₹40 egg coffee from a woman who's been pouring them for 34 years. Kaira found the street; Nimmi picked the shop.",
    author: { initial: "M", name: "Minal", location: "Delhi", avatarVariant: "pink" },
    rating: 4.8,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80",
    badge: "Maldives · 4 nights",
    moment: (
      <>
        Amish <span className="ttwSerif">proposed</span> in a floating villa he almost didn&apos;t book.
      </>
    ),
    detail:
      "Kaira caught a 23% drop on the water-villa upgrade the night before they flew. He made the switch. She said yes.",
    author: { initial: "A", name: "Amish", location: "Mumbai", avatarVariant: "blue" },
    rating: 4.9,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80",
    badge: "Japan · 9 nights",
    moment: (
      <>
        Twinkle stayed up for <span className="ttwSerif">2am ramen</span> in Golden Gai.
      </>
    ),
    detail:
      "She was solo, nervous. Kaira dropped a pin to a 6-seat bar where the chef speaks Hinglish. Best meal of her life, she wrote.",
    author: { initial: "T", name: "Twinkle", location: "Bangalore · solo", avatarVariant: "pink" },
    rating: 4.7,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600&q=80",
    badge: "Bali · 7 nights",
    moment: (
      <>
        The Mehtas <span className="ttwSerif">ditched</span> the resort pool for a ricefield dawn.
      </>
    ),
    detail:
      "Day 4, their 8-year-old asked if they could skip the water-park. Kaira swapped it for a ricefield bike tour in 4 minutes flat.",
    author: { initial: "M", name: "The Mehtas", location: "Pune · family", avatarVariant: "green" },
    rating: 4.8,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=600&q=80",
    badge: "Thailand · 6 nights",
    moment: (
      <>
        Rohan replied in <span className="ttwSerif">Hinglish.</span> So did Kaira.
      </>
    ),
    detail:
      '"That\'s when I knew this wasn\'t a templated bot." His Krabi plan changed mid-chat to Koh Lanta. No wait time, no re-quote.',
    author: { initial: "R", name: "Rohan", location: "Bangalore", avatarVariant: "blue" },
    rating: 4.9,
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80",
    badge: "Rajasthan · 5 nights",
    moment: (
      <>
        Priya caught a <span className="ttwSerif">permit</span> three agents missed.
      </>
    ),
    detail:
      "Trip three with Kaira. She flagged the restricted-area permit paperwork 48 hours before it would've gone wrong in Leh.",
    author: { initial: "P", name: "Priya", location: "Delhi · trip 3", avatarVariant: "pink" },
    rating: 5.0,
  },
];

const TravelerStoriesSection = ({ stories = DEFAULT_STORIES, total = 2140 }) => {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className="ttwContainer">
        <div className="ttwSectionHead">
          <div className={styles.headLeft}>
            <h2>
              Real trips. Real <span className="ttwSerif">moments.</span>
            </h2>
            <p className="ttwLede">
              Every trip has one thing that made it. The{" "}
              <span className="ttwSerif">unforgettable bit</span>. Here&apos;s
              what Kaira&apos;s travellers took home.
            </p>
          </div>
          {/* <a href="/stories" className="ttwSectionLink">
            See all {total.toLocaleString()} stories
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" height={12} width={12}>
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a> */}
        </div>

        <div className={styles.grid}>
          {stories.map((s) => (
            <StoryCard
              key={s.id}
              image={s.image}
              badge={s.badge}
              moment={s.moment}
              detail={s.detail}
              author={s.author}
              rating={s.rating}
              onClick={() =>
                router.push(`/chat?seed=${encodeURIComponent(s.seed || s.badge || "")}`)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelerStoriesSection;
