import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import Banner from "../homepage/banner/Mobile";
import DesktopBanner from "../../components/containers/Banner";
import media from "../../components/media";
import openTailoredModal from "../../services/openTailoredModal";
import NewYearBanner from "../../components/newYear/banner/banner";
import BannerContent from "../../components/newYear/banner/bannerContent";
import Packages from "../../components/newYear/Packages";
import NewYearUnique from "../../components/newYear/NewYearUnique";
import WhyUs from "../../components/newYear/WhyUs";
import OurCustomers from "../../components/newYear/OurCustomers";
import BannerCards from "../../components/newYear/BannerCards";

const NewYearPage = (props) => {
  const router = useRouter();
  let isPageWide = media("(min-width: 768px)");

  return (
    <div className="space-y-[50px] md:space-y-[100px] mb-[100px]">
      <NewYearBanner
        heightmobile={"30rem"}
        height={"40rem"}
        filter={"brightness(0.8)"}
        zIndex={-1}
        center={isPageWide ? false : true}
        url={"media/new-year/new-year.jpeg"}
      >
        <BannerContent />
      </NewYearBanner>

      <DesktopBanner
        newYear
        onclick={() => openTailoredModal(router)}
        text="Want to personalize your own experience?"
      ></DesktopBanner>

      <div className="w-[85%] flex flex-col mx-auto gap-[50px] md:gap-[100px]">
        <Packages />

        <NewYearUnique />

        <WhyUs />

        <BannerCards />

        <OurCustomers />
      </div>

      {!isPageWide && (
        <div>
          <Banner
            onclick={() => openTailoredModal(router)}
            text="Want to craft your own travel experience?"
            buttontext="Start Now"
            color="black"
            buttonbgcolor="#f7e700"
          ></Banner>
        </div>
      )}
    </div>
  );
};

export default NewYearPage;
