// Import all assets
import image1 from "./sample/1.png";
import image2 from "./sample/2.png";
import image3 from "./sample/3.png";
import image4 from "./sample/4.png";
import image5 from "./sample/5.png";
import image6 from "./sample/6.png";
import image7 from "./sample/7.png";
import image8 from "./sample/8.png";
import image9 from "./sample/9.png";

import Japan from "./japan.png";
import Pinned from "./pinned.webp";
import backgroundImage from "./bg.png";
import cta from "./cta.png";
import TTW from "./ttw.svg";
import Paris from "./destination.png";

// Named exports for individual imports
export {
  backgroundImage,
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  TTW,
  Japan,
  cta,
  Paris,
  Pinned,
};

// Alternative descriptive names
export {
  backgroundImage as heroBg,
  image1 as heroImage1,
  image2 as heroImage2,
  image3 as heroImage3,
  image4 as heroImage4,
  image5 as heroImage5,
  image6 as heroImage6,
  image7 as heroImage7,
  image8 as heroImage8,
  image9 as heroImage9,
};

// Array export for easy iteration
export const heroImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
];

export default {
  // Default export containing all assets
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
  image9,
  backgroundImage,
  heroImages,
  cta,
};
