// Import all assets
import image1 from "./1.png";
import image2 from "./2.png";
import image3 from "./3.png";
import image4 from "./4.png";
import backgroundImage from "./bg.png";
import TTW from "./ttw.svg";

// Named exports for individual imports
export { backgroundImage, image1, image2, image3, image4, TTW };

// Alternative descriptive names
export {
  backgroundImage as heroBg,
  image1 as heroImage1,
  image2 as heroImage2,
  image3 as heroImage3,
  image4 as heroImage4,
};

// Array export for easy iteration
export const heroImages = [image1, image2, image3, image4];

// Default export containing all assets
export default {
  image1,
  image2,
  image3,
  image4,
  backgroundImage,
  heroImages,
};
