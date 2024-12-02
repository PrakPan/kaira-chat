import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import DesktopBanner from "../../components/containers/Banner";
import Banner from "../homepage/banner/Mobile";
import media from "../../components/media";
import openTailoredModal from "../../services/openTailoredModal";
import NewYearBanner from "../../components/newYear/banner/banner";
import BannerContent, { Banner2Content } from "../../components/newYear/banner/bannerContent";
import Packages from "../../components/newYear/Packages";
import NewYearUnique from "../../components/newYear/NewYearUnique";
import WhyUs from "../../components/newYear/WhyUs";
import OurCustomers from "../../components/newYear/OurCustomers";
import BannerCards from "../../components/newYear/BannerCards";


const NewYearPage = (props) => {
    const router = useRouter();
    let isPageWide = media("(min-width: 768px)");

    return (
        <div className="space-y-[100px] mb-[100px]">
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

            <div className="w-[85%] flex flex-col mx-auto gap-[100px]">
                <Packages />

                <NewYearUnique />

                <WhyUs />

                <BannerCards />
            </div>

            <NewYearBanner
                heightmobile={"30rem"}
                height={"35rem"}
                filter={"brightness(0.8)"}
                zIndex={-1}
                center={isPageWide ? false : true}
                resizeMode={"fill"}
                url={"media/new-year/banner2.png"}
            >
                <Banner2Content />
            </NewYearBanner>

            <div className="w-[85%] flex flex-col mx-auto gap-[100px]">
                <OurCustomers />
            </div>

            <DesktopBanner
                onclick={() => openTailoredModal(router)}
                text="Want to personalize your own experience?"
            ></DesktopBanner>

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
