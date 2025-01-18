import { GoArrowRight } from "react-icons/go";
import Button from "../../components/ui/button/Index"
import ImageLoader from "../../components/ImageLoader";
import media from "../../components/media";


export default function WhyChoosePackages(props) {

    const handlePlanButton = () => {
        if (isPageWide) {
          setShowTailoredModal(true);
        } else {
          openTailoredModal(router, props.page_id, props.destination);
        }
    
        logEvent({
          action: "Plan_Itinerary",
          params: {
            page: props.page ? props.page : "",
            event_category: "Button Click",
            event_label: "Plan Itinerary For Free!",
            event_action: "Banner",
          },
        });
      };
    let isPageWide = media("(min-width: 768px)");

    return (
        <div className="mt-5 py-5 flex flex-col gap-4 md:flex-row">

            <div className=" md:pt-0  flex flex-col gap-3">
                <div className="text-[27px] md:text-[40px] font-[700] leading-[56px]">Why Choose Our <br/>Honeymoon Packages ?</div>
                <div className="flex flex-col gap-3 text-[16px] font-[400] leading-[26px] justify-start">
                    <div className="">
                    Planning the perfect honeymoon can feel overwhelming, but with our expertly curated packages, you can focus on what truly matters—each other. We specialize in creating experiences that blend romance, relaxation, and adventure, ensuring your journey together starts with unforgettable moments. Whether you dream of strolling hand-in-hand on a pristine beach, exploring scenic mountain trails, or indulging in luxurious spa treatments, our packages are designed to cater to your unique preferences. Let us make your honeymoon as special as your love story.
                    </div>
                <div>
               <Button
              padding="0.75rem 1rem"
              fontSize="18px"
              fontWeight="500"
              bgColor="#f7e700"
              borderRadius="7px"
              color="black"
              borderWidth="1px"
              onclick={handlePlanButton}
              margin="3vh 0 1vh 0"
            >
              Plan Your Honeymoon!
            </Button>
          </div>
                </div>

                
            </div>
            <div className="px-2 md:px-0">
                <ImageLoader url={"https://d31aoa0ehgvjdi.cloudfront.net/media/themes/why-choose.png"} width={isPageWide ? 560 : 290} height={isPageWide ? 536 : 300} borderRadius={8} />
            </div>
            
        </div>
    )
}
