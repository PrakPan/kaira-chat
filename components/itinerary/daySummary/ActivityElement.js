import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import ImageLoader from "../../../components/ImageLoader";

export default function ActivityElement(props) {
  const { icon, heading } = props;
  return (
    <Container className="pt-3">
      <div className=" flex flex-row items-center justify-start space-x-10">
        <div className="w-20 h-20">
          {icon !== "media/icons/default/activity.svg" ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log("")}
              width="3rem"
              leftalign
              widthmobile="3rem"
              url={icon}
              noLazy
            ></ImageLoader>
          ) : (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log("")}
              width="3.25rem"
              height="3.25rem"
              leftalign
              widthmobile="6rem"
              url={"media/icons/general/dice.png"}
              noLazy
            ></ImageLoader>
          )}
        </div>
        <div className="">{heading}</div>
      </div>
    </Container>
  );
}
