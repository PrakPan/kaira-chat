import styled from "styled-components";
import media from "../../../components/media";
import SkeletonCard from "../../ui/SkeletonCard";
import { TbArrowBack } from "react-icons/tb";
import { IoMdClose } from "react-icons/io";
import BackArrow from "../../ui/BackArrow";

const ActivityDetailsSkeleton = (props) => {
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    @media screen and (min-width: 768px) {
      ${(props) => (props.width ? "width: " + props.width : "width: 50vm")}
    }
  `;
  const Title = styled.p`
    font-weight: 800;
    font-size: 20px;
  `;
  const BackContainer = styled.div`
    margin: 0;
    gap: 0.5rem;
    position: sticky;
    z-index: 1;
    background: white;
    top: 0;
    padding-block: 0.75rem;

    @media screen and (min-width: 768px) {
      padding-block: 1rem;
    }
  `;
  const BackText = styled.div`
    font-size: 1.5rem;
    line-height: 2rem;
  `;
  let isPageWide = media("(min-width: 768px)");

  return (
    <Container width={props.width} className="gap-4 px-4">
      {/* {!props.itineraryDrawer ? (
        <div onClick={props.handleCloseDrawer}>
          <TbArrowBack
            style={{ height: "32px", width: "32px" }}
            cursor={"pointer"}
          />
        </div>
      ) : (
        <></>
        // <div className="flex flex-col gap-[16px] font-lexend">
        //   <IoMdClose
        //     className="hover-pointer mt-4"
        //     onClick={(e) => {
        //       props.handleCloseDrawer(e);
        //     }}
        //     style={{ fontSize: "2rem" }}
        //   ></IoMdClose>
        //   <BackText className="text-[24px] font-semibold">Activity Details</BackText>
        // </div>
      )} */}

<div className="h-[100vh] overflow-y-auto ">
      <div className="flex flex-col gap-4 mb-[100px]">
        <div className="sticky top-0 z-1 flex flex-row items-center gap-2 mt-4 bg-white">
          <BackArrow handleClick={props.handleCloseDrawer}/>
        </div>
        <div className="flex justify-between items-center">
          <SkeletonCard width="180px" height="32px" />
          <SkeletonCard width="80px" height="32px" />
        </div>
        <div className="flex flex-col gap-4 opacity-100">
          <div className="h-[180px] md:h-[300px] relative">
            <SkeletonCard width="100%" height={isPageWide ? "300px" : "180px"} />
          </div>
          <div className="flex flex-col gap-3">
            <SkeletonCard width="200px" height="28px" />
            <SkeletonCard width="100px" height="20px" />
            <div className="flex flex-row gap-2">
              <SkeletonCard width="60px" height="20px" />
              <SkeletonCard width="60px" height="20px" />
              <SkeletonCard width="60px" height="20px" />
            </div>
            <SkeletonCard width="100%" height="40px" />
          </div>
          <SkeletonCard width="120px" height="20px" />
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <SkeletonCard width="180px" height="24px" />
              <SkeletonCard width="100%" height="40px" />
            </div>
          ))}
          <div className="flex flex-col gap-2 relative">
            <SkeletonCard width="120px" height="24px" />
            <SkeletonCard width="100%" height="32px" />
            <div className="flex flex-col gap-2">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} width="100%" height="32px" />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t-2 fixed bottom-0 right-0 left-0 flex justify-end gap-1 py-[12px] px-[20px] bg-white shadow-md z-50 flex justify-between items-center">
        <div className="font-bold flex flex-col">
          <SkeletonCard width="120px" height="28px" />
          <SkeletonCard width="80px" height="20px" />
        </div>
        <div className="flex flex-col gap-1">
          <SkeletonCard width="140px" height="40px" />
          <SkeletonCard width="80px" height="20px" />
        </div>
      </div>
    </div>
    </Container>
  );
};

<<<<<<< HEAD
export default ActivityDetailsSkeleton;



=======
export default ActivityDetailsSkeleton;
>>>>>>> d6698f8bec35d092714a44e3d6350afb31b747de
