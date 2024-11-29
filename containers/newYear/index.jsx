import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import DesktopBanner from "../../components/containers/Banner";
import Banner from "../homepage/banner/Mobile";
import media from "../../components/media";
import openTailoredModal from "../../services/openTailoredModal";
import NewYearBanner from "../../components/newYear/banner/banner";
import BannerContent from "../../components/newYear/banner/bannerContent";



const NewYearPage = (props) => {
    const router = useRouter();
    let isPageWide = media("(min-width: 768px)");

    return (
        <div>
            <NewYearBanner
                heightmobile={"30rem"}
                height={"40rem"}
                filter={"brightness(0.8)"}
                zIndex={-1}
                center={isPageWide ? false : true}
                url={
                    isPageWide
                        ? "media/new-year/new-year.jpeg"
                        : "media/new-year/new-year.jpeg"
                }
            >
                <BannerContent />
            </NewYearBanner>

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
