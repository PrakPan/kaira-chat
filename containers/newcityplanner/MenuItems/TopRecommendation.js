import Experiences from "./Experiences";

const TopRecommendations = (props) => {
  return (
    <Experiences
      cols={"3"}
      link="https://www.blog.thetarzanway.com/post/hidden-gems-of-ladakh"
      heading="Hidden Gems of Ladakh"
      text="Well, Ladakh is often referred to as the Land of explorers, which is because this amazing place has several hidden treasures waiting to be explored."
      img="media/website/b80cd8_8fb69995b7024cf3981e779ee18602d6_mv2.webp"
      margin="2.5rem 0"
      experiences={props.itineraries}
    ></Experiences>
  );
};

export default TopRecommendations;
