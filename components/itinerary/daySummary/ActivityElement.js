import { Container } from "../../../containers/itinerary/New_Itenary_DBD/New_itenaryStyled";
import ImageLoader from "../../../components/ImageLoader";

export default function ActivityElement(props) {
  const { icon, heading } = props;
  return (
    <Container className="pt-0">
      <div className=" flex flex-row items-center justify-start w-full">
        <div className="w-[20%] pr-3 flex items-center justify-end">
          {icon !== "media/icons/default/activity.svg" ? (
            <ImageLoader
              dimensions={{ width: 300, height: 300 }}
              dimensionsMobile={{ width: 300, height: 300 }}
              borderRadius="8px"
              hoverpointer
              onclick={() => console.log("")}
              width="2rem"
              leftalign
              widthmobile="2rem"
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
              width="2.25rem"
              height="2.25rem"
              leftalign
              widthmobile="4rem"
              url={"media/icons/general/dice.png"}
              noLazy
            ></ImageLoader>
          )}
        </div>
        <div className="w-[80%] text-sm">{heading}</div>
      </div>
    </Container>
  );
}
