// components/modals/AccommodationDetailDrawer/Index.jsx

import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import useMediaQuery from "../../media";
import SkeletonCard from "../../ui/SkeletonCard";
import { openNotification } from "../../../store/actions/notification";
import { useDispatch } from "react-redux";
import Drawer from "../../ui/Drawer";
import ScrollableMenuTabs from "../../ScrollableMenuTabs";
import NextImage from "next/image";
import ImageLoader from "../../ImageLoader";
import { MERCURY_HOST } from "../../../services/constants";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const svgIcons = {
  location: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 10 14" fill="none">
      <path d="M4.99968 13.6666C3.8219 13.6666 2.86079 13.4805 2.11634 13.1083C1.3719 12.736 0.999675 12.2555 0.999675 11.6666C0.999675 11.3999 1.08023 11.1527 1.24134 10.9249C1.40245 10.6971 1.62745 10.4999 1.91634 10.3333L2.96634 11.3166C2.86634 11.361 2.75801 11.411 2.64134 11.4666C2.52468 11.5221 2.43301 11.5888 2.36634 11.6666C2.51079 11.8444 2.84412 11.9999 3.36634 12.1333C3.88856 12.2666 4.43301 12.3333 4.99968 12.3333C5.56634 12.3333 6.11357 12.2666 6.64134 12.1333C7.16912 11.9999 7.50523 11.8444 7.64968 11.6666C7.5719 11.5777 7.4719 11.5055 7.34968 11.4499C7.22746 11.3944 7.11079 11.3444 6.99968 11.2999L8.03301 10.2999C8.34412 10.4777 8.58301 10.6805 8.74968 10.9083C8.91634 11.136 8.99968 11.3888 8.99968 11.6666C8.99968 12.2555 8.62746 12.736 7.88301 13.1083C7.13857 13.4805 6.17745 13.6666 4.99968 13.6666ZM5.01634 9.99992C6.11634 9.18881 6.94412 8.37492 7.49968 7.55825C8.05523 6.74158 8.33301 5.92214 8.33301 5.09992C8.33301 3.96659 7.9719 3.11103 7.24968 2.53325C6.52745 1.95547 5.77745 1.66659 4.99968 1.66659C4.2219 1.66659 3.4719 1.95547 2.74968 2.53325C2.02745 3.11103 1.66634 3.96659 1.66634 5.09992C1.66634 5.84436 1.93856 6.61936 2.48301 7.42492C3.02745 8.23047 3.8719 9.08881 5.01634 9.99992ZM4.99968 11.6666C3.43301 10.511 2.26356 9.38881 1.49134 8.29992C0.719119 7.21103 0.333008 6.14436 0.333008 5.09992C0.333008 4.31103 0.474675 3.61936 0.758008 3.02492C1.04134 2.43047 1.40523 1.93325 1.84968 1.53325C2.29412 1.13325 2.79412 0.833252 3.34968 0.633252C3.90523 0.433252 4.45523 0.333252 4.99968 0.333252C5.54412 0.333252 6.09412 0.433252 6.64968 0.633252C7.20523 0.833252 7.70523 1.13325 8.14968 1.53325C8.59412 1.93325 8.95801 2.43047 9.24134 3.02492C9.52468 3.61936 9.66634 4.31103 9.66634 5.09992C9.66634 6.14436 9.28023 7.21103 8.50801 8.29992C7.73579 9.38881 6.56634 10.511 4.99968 11.6666ZM4.99968 6.33325C5.36634 6.33325 5.68023 6.2027 5.94134 5.94159C6.20245 5.68047 6.33301 5.36658 6.33301 4.99992C6.33301 4.63325 6.20245 4.31936 5.94134 4.05825C5.68023 3.79714 5.36634 3.66658 4.99968 3.66658C4.63301 3.66658 4.31912 3.79714 4.05801 4.05825C3.7969 4.31936 3.66634 4.63325 3.66634 4.99992C3.66634 5.36658 3.7969 5.68047 4.05801 5.94159C4.31912 6.2027 4.63301 6.33325 4.99968 6.33325Z" fill="#ACACAC" />
    </svg>
  ),
  maps: (
    <svg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip_maps)">
        <rect y="0.800781" width="22.4" height="22.4" rx="4" fillOpacity="0.09" />
        <path d="M13.2 18L9.20001 16.6L6.10001 17.8C5.87779 17.8889 5.67223 17.8639 5.48335 17.725C5.29446 17.5861 5.20001 17.4 5.20001 17.1667V7.83333C5.20001 7.68889 5.24168 7.56111 5.32501 7.45C5.40835 7.33889 5.52223 7.25556 5.66668 7.2L9.20001 6L13.2 7.4L16.3 6.2C16.5222 6.11111 16.7278 6.13611 16.9167 6.275C17.1056 6.41389 17.2 6.6 17.2 6.83333V16.1667C17.2 16.3111 17.1583 16.4389 17.075 16.55C16.9917 16.6611 16.8778 16.7444 16.7333 16.8L13.2 18ZM12.5333 16.3667V8.56667L9.86668 7.63333V15.4333L12.5333 16.3667ZM13.8667 16.3667L15.8667 15.7V7.8L13.8667 8.56667V16.3667ZM6.53335 16.2L8.53335 15.4333V7.63333L6.53335 8.3V16.2Z" fill="#3A85FC" />
      </g>
      <defs>
        <clipPath id="clip_maps">
          <rect y="0.800781" width="22.4" height="22.4" rx="4" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
};

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  font-size: 14px;
  padding: 0 0.75rem 0.75rem 0.75rem;
  @media screen and (min-width: 768px) {
    padding: 0 1.25rem 1.25rem 1.25rem;
  }
`;

const FlexBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

const GridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(4, 0.4fr);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  height: 19rem;
`;

const MGridImage = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  grid-column-gap: 7px;
  grid-row-gap: 7px;
  height: 15rem;
`;

const Child = styled.div`
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  height: 100%;
  width: 100%;
  grid-area: ${(props) => props.area};
`;

const ImageContainer = styled.div`
  width: 100%;
  position: relative;
  margin-top: 1.2rem;
  min-height: 30vh;
  @media screen and (min-width: 768px) {
    min-height: 20vh;
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const starRating = (rating) => {
  const stars = [];
  for (let i = 0; i < Math.floor(rating); i++) stars.push(<FaStar key={i} />);
  if (Math.floor(rating) < rating) stars.push(<FaStarHalfAlt key="half" />);
  return stars;
};

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * AccommodationDetailDrawer
 *
 * Props:
 *  show               {boolean}  — controls drawer visibility
 *  onHide             {function} — close handler
 *  accommodationId    {string}   — UUID passed to the API
 *  onChangeHotel      {function} — called when "Change Hotel" is clicked
 *  onAddHotel         {function} — called when "Add to Itinerary" is clicked
 *                                   (chat-opened flow). When provided, an
 *                                   "Add to Itinerary" CTA is rendered.
 *  itinerary_city_id  {string}   — chat-opened context, forwarded to caller
 *  check_in           {string}   — chat-opened context
 *  check_out          {string}   — chat-opened context
 *  bookingId          {string}   — present when the hotel is already booked
 *                                   in the itinerary; suppresses "Add" CTA.
 *  setShowLoginModal  {function}
 *  _setImagesHandler  {function} — opens full-screen gallery
 */
const AccommodationDetailDrawer = ({
  show,
  onHide,
  accommodationId,
  onChangeHotel,
  onAddHotel,
  itinerary_city_id,
  check_in,
  check_out,
  bookingId,
  setShowLoginModal,
  _setImagesHandler = undefined,
}) => {
  const isDesktop = useMediaQuery("(min-width:1148px)");
  const dispatch = useDispatch();

  const [data, setData] = useState(null);       // accommodation object
  const [loading, setLoading] = useState(false);

  const [ImagesLoaded, setImagesLoaded] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [ImagesError, setImagesError]   = useState({ 0: false, 1: false, 2: false, 3: false });

  const [activeFacilities, setActiveFacilities] = useState([]);
  const [viewMoreFacilities, setViewMoreFacilities] = useState(false);

  const scrollableTabRef = useRef(null);

  const defaultTabs = [
    { id: "section-1", label: "About",    link: "About"    },
    { id: "section-2", label: "Location", link: "Location" },
  ];
  const [tabs, setTabs] = useState(defaultTabs);

  // ── Fetch ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!show || !accommodationId) return;
    fetchAccommodation();
  }, [show, accommodationId]);

  const fetchAccommodation = async () => {
    try {
      setLoading(true);
      setData(null);
      const token = localStorage.getItem("access_token");
      const res = await fetch(
        `${MERCURY_HOST}/api/v1/hotels/accommodation/${accommodationId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Failed to fetch accommodation");
      const json = await res.json();
      const acc = json?.data?.accommodation;
      setData(acc);
      calculateVisibleFacilities(acc?.hotel_facilities || [], false);

      // Add amenities tab if facilities exist
      if (acc?.hotel_facilities?.length > 0) {
        setTabs([
          { id: "section-1", label: "About",      link: "About"      },
          { id: "section-3", label: "Amenities",  link: "Amenities"  },
          { id: "section-2", label: "Location",   link: "Location"   },
        ]);
      }
    } catch (err) {
      dispatch(openNotification({ type: "error", text: err?.message || "Unable to get details", heading: "Error!" }));
    } finally {
      setLoading(false);
    }
  };

  // ── Image helpers ──────────────────────────────────────────────────────────

  const images = (data?.images || []).map((img) => img.image).filter(Boolean);

  const onImgLoad  = (i) => setImagesLoaded((p) => ({ ...p, [i]: true  }));
  const onImgError = (i) => setImagesError ((p) => ({ ...p, [i]: true  }));

  const fallback = "https://d31aoa0ehgvjdi.cloudfront.net/media/icons/bookings/notfounds/noroom.png";
  const imgSrc   = (i) => (ImagesError[i] ? fallback : images[i]);

  // ── Facilities ─────────────────────────────────────────────────────────────

  const calculateVisibleFacilities = (items, showAll) => {
    setViewMoreFacilities(showAll);
    setActiveFacilities(showAll ? items : items.slice(0, 6));
  };

  // ── Tab scroll ─────────────────────────────────────────────────────────────

  const handleTabChange = (tabId) => {
    const target    = document.getElementById(tabId);
    const container = scrollableTabRef.current;
    if (target && container) {
      const delta = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
      container.scrollTo({ top: container.scrollTop + delta, behavior: "smooth" });
    }
  };

  // ── Gallery overlay ────────────────────────────────────────────────────────

  const viewAllOverlay = images.length > 0 && ImagesLoaded[0] ? (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-trans-black_70"
      onClick={() => _setImagesHandler?.(data?.images || [])}
    >
      <span className="font-600 text-sm-md border-solid border-b-sm border-text-white text-white cursor-pointer">
        Show all photos
      </span>
    </div>
  ) : null;

  // ── Image grid (reusable slot renderer) ───────────────────────────────────

  const ImgSlot = ({ index, area, className: cls = "" }) => (
    <Child area={area} className={cls}>
      {ImagesLoaded[index] ? null : (
        <div style={{ height: "100%", overflow: "hidden" }}>
          <SkeletonCard lottieDimension="50rem" />
        </div>
      )}
      <div style={{ display: ImagesLoaded[index] ? "block" : "none" }} className="relative h-full w-full">
        <ImageLoader
          url={imgSrc(index)}
          fit="cover"
          width="100%"
          height="100%"
          onload={() => onImgLoad(index)}
          onfail={() => onImgError(index)}
          noLazy
        />
        {data?.images?.[index]?.caption && (
          <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs top-md left-md">
            {data.images[index].caption}
          </div>
        )}
      </div>
    </Child>
  );

  // ── Skeleton ───────────────────────────────────────────────────────────────

  const Skeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse mt-4">
      <div className="h-6 w-40 bg-gray-200 rounded" />
      <div className="h-8 w-64 bg-gray-200 rounded" />
      <div className="h-4 w-48 bg-gray-200 rounded" />
      <div className="h-[19rem] w-full bg-gray-200 rounded-2xl" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-5/6 bg-gray-200 rounded" />
      <div className="h-4 w-4/6 bg-gray-200 rounded" />
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Drawer
      show={show}
      anchor="right"
      backdrop
      className="font-lexend"
      onHide={onHide}
      width="50%"
      mobileWidth="100%"
    >
      <Container>
        {/* Back arrow */}
        <div className="my-[1rem]">
          <NextImage
            src="/backarrow.svg"
            className="cursor-pointer"
            width={22}
            height={2}
            onClick={onHide}
          />
        </div>

        {loading ? (
          <Skeleton />
        ) : !data ? null : 
        
          <div>
            {/* Star category badge */}
            {data.name ? (
              <span className=" text-sm md:text-xl font-semibold">
                {data?.name}
              </span>
            ) : null}

            {/* Location + rating row */}
            <div className="flex gap-sm mt-sm flex-wrap">
              <div className="flex gap-xs text-sm-md text-text-spacegrey font-[400] items-center">
                {svgIcons.location}
                <span>{[data.city_name, data.state_name, data.country_name].filter(Boolean).join(", ")}</span>
              </div>

              {data.rating_ext && (
                <div className="gap-1 flex flex-row items-center text-sm-md text-text-spacegrey font-[400] pl-sm border-l-sm border-solid border-text-disabled">
                  <div className="flex flex-row text-[#FFD201]">
                    {starRating(data.rating_ext)}
                  </div>
                  <div>{data.rating_ext}</div>
                  {data.num_reviews_ext > 0 && (
                    <div className="underline">({data.num_reviews_ext})</div>
                  )}
                </div>
              )}
            </div>

            {/* Scrollable content */}
            <div
              className="overflow-y-auto"
              ref={scrollableTabRef}
              style={{ height: "calc(100vh - 195px)" }}
            >
              {/* ── Image gallery ── */}
              <ImageContainer className="mb-lg">
                {isDesktop ? (
                  <>
                    {images.length >= 4 ? (
                      <GridImage>
                        <ImgSlot index={0} area="1 / 1 / 5 / 7"  />
                        <ImgSlot index={2} area="1 / 7 / 3 / 12" />
                        <Child area="3 / 7 / 5 / 12" className="relative overflow-hidden rounded-2xl">
                          {!ImagesLoaded[3] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                          <div style={{ display: ImagesLoaded[3] ? "block" : "none" }} className="relative h-full w-full">
                            <ImageLoader url={imgSrc(3)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(3)} onfail={() => onImgError(3)} noLazy />
                            {data?.images?.[3]?.caption && (
                              <div className="bg-text-smokywhite absolute rounded-67br text-sm font-500 leading-lg px-md py-xs top-md left-md">{data.images[3].caption}</div>
                            )}
                            {/* {viewAllOverlay} */}
                          </div>
                        </Child>
                      </GridImage>
                    ) : images.length === 3 ? (
                      <GridImage>
                        <ImgSlot index={0} area="1 / 1 / 5 / 4"  />
                        <ImgSlot index={1} area="1 / 4 / 5 / 7"  />
                        <Child area="1 / 7 / 5 / 11" className="relative overflow-hidden rounded-2xl">
                          {!ImagesLoaded[2] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                          <div style={{ display: ImagesLoaded[2] ? "block" : "none" }} className="relative h-full w-full">
                            <ImageLoader url={imgSrc(2)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(2)} onfail={() => onImgError(2)} noLazy />
                            {/* {viewAllOverlay} */}
                          </div>
                        </Child>
                      </GridImage>
                    ) : images.length === 2 ? (
                      <GridImage>
                        <ImgSlot index={0} area="1 / 1 / 5 / 6" />
                        <Child area="1 / 6 / 5 / 11" className="relative overflow-hidden rounded-2xl">
                          {!ImagesLoaded[1] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                          <div style={{ display: ImagesLoaded[1] ? "block" : "none" }} className="relative h-full w-full">
                            <ImageLoader url={imgSrc(1)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(1)} onfail={() => onImgError(1)} noLazy />
                            {/* {viewAllOverlay} */}
                          </div>
                        </Child>
                      </GridImage>
                    ) : (
                      <Child style={{ height: "19rem" }}>
                        {!ImagesLoaded[0] && <div style={{ height: "100%", overflow: "hidden", borderRadius: "8px" }}><SkeletonCard lottieDimension="100%" /></div>}
                        <div style={{ display: ImagesLoaded[0] ? "block" : "none" }} className="relative h-full w-full">
                          <ImageLoader url={imgSrc(0)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(0)} onfail={() => onImgError(0)} noLazy />
                        </div>
                      </Child>
                    )}
                  </>
                ) : (
                  /* Mobile grid */
                  <MGridImage>
                    {images.length >= 3 ? (
                      <>
                        <ImgSlot index={0} area="1 / 1 / 4 / 7" />
                        <ImgSlot index={1} area="4 / 1 / 7 / 4" />
                        <Child area="4 / 4 / 7 / 7" className="relative overflow-hidden rounded-2xl">
                          {!ImagesLoaded[2] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                          <div style={{ display: ImagesLoaded[2] ? "block" : "none" }} className="relative h-full w-full">
                            <ImageLoader url={imgSrc(2)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(2)} onfail={() => onImgError(2)} noLazy />
                            {/* {viewAllOverlay} */}
                          </div>
                        </Child>
                      </>
                    ) : images.length === 2 ? (
                      <>
                        <ImgSlot index={0} area="1 / 1 / 4 / 7" />
                        <Child area="4 / 1 / 7 / 7" className="relative overflow-hidden rounded-2xl">
                          {!ImagesLoaded[1] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                          <div style={{ display: ImagesLoaded[1] ? "block" : "none" }} className="relative h-full w-full">
                            <ImageLoader url={imgSrc(1)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(1)} onfail={() => onImgError(1)} noLazy />
                            {/* {viewAllOverlay} */}
                          </div>
                        </Child>
                      </>
                    ) : (
                      <Child area="1 / 1 / 7 / 7">
                        {!ImagesLoaded[0] && <div style={{ height: "100%", overflow: "hidden" }}><SkeletonCard lottieDimension="50rem" /></div>}
                        <div style={{ display: ImagesLoaded[0] ? "block" : "none" }} className="relative h-full w-full">
                          <ImageLoader url={imgSrc(0)} fit="cover" width="100%" height="100%" onload={() => onImgLoad(0)} onfail={() => onImgError(0)} noLazy />
                        </div>
                      </Child>
                    )}
                  </MGridImage>
                )}
              </ImageContainer>

              {/* ── Tabs ── */}
              <div className="flex flex-col">
                <div className="sticky top-0 z-10 bg-white border-b-sm border-solid border-text-disabled">
                  <ScrollableMenuTabs
                    classStyle="w-100"
                    items={tabs}
                    scrollContainerRef={scrollableTabRef}
                    handleActiveTab={handleTabChange}
                  />
                </div>

                <div>
                  {/* ── Section 1: About ── */}
                  <div id="section-1">
                    {data.description && (
                      <div className="flex flex-col gap-1 mt-lg">
                        <div
                          className="text-sm-xl font-400 leading-xl gl-dynamic-render-elements"
                          dangerouslySetInnerHTML={{ __html: data.description }}
                        />
                      </div>
                    )}

                    {/* Accommodation type + price range */}
                    {(data.accommodation_type || data.price_lower_range_ext) && (
                      <div className="flex gap-4 mt-lg flex-wrap">
                        {data.accommodation_type && (
                          <div>
                            <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Type</div>
                            <div className="text-sm-md font-400 leading-xl">{data.accommodation_type}</div>
                          </div>
                        )}
                        {data.price_lower_range_ext && (
                          <div>
                            <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Starting from</div>
                            <div className="text-sm-md font-400 leading-xl">
                              {data.currency} {Math.round(data.price_lower_range_ext).toLocaleString()}
                            </div>
                          </div>
                        )}
                        {data.distance_from_city_centre && (
                          <div>
                            <div className="text-sm-xl font-600 leading-xl mb-xxs-md">Distance from centre</div>
                            <div className="text-sm-md font-400 leading-xl">{data.distance_from_city_centre} km</div>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="my-lg" />
                  </div>

                  {/* ── Section 3: Amenities ── */}
                  {data.hotel_facilities?.length > 0 && (
                    <div id="section-3">
                      <div className="text-md-lg font-600 leading-xl mb-lg">Hotel Amenities</div>
                      <ul className="grid grid-cols-3 gap-y-2 gap-x-4 !pl-md">
                        {activeFacilities.map((item, i) => (
                          <li key={i} className="text-sm-md font-400 leading-xl list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                      {!viewMoreFacilities && data.hotel_facilities.length > 6 && (
                        <div
                          className="text-sm underline font-500 leading-lg cursor-pointer mt-2"
                          onClick={() => calculateVisibleFacilities(data.hotel_facilities, true)}
                        >
                          + {data.hotel_facilities.length - activeFacilities.length} more
                        </div>
                      )}
                      {viewMoreFacilities && (
                        <div
                          className="text-sm underline font-500 leading-lg cursor-pointer mt-2"
                          onClick={() => calculateVisibleFacilities(data.hotel_facilities, false)}
                        >
                          Show Less
                        </div>
                      )}
                      <hr className="my-lg" />
                    </div>
                  )}

                  {/* ── Section 2: Location ── */}
                 {/* ── Section 2: Location ── */}
                  <div id="section-2" className="mb-lg">
                    <div className="text-md-lg font-600 leading-xl mb-lg">Location</div>
                    <div className="flex gap-2 mb-sm">
                      {svgIcons.location}
                      <div className="text-sm-md text-text-spacegrey font-[400]">
                        {[data.addr1, data.addr2, data.city_name, data.state_name, data.country_name]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>

                    {(data.google_maps_link || (data.latitude && data.longitude)) && (
                      <div className="flex items-center gap-3 mt-2">
                        {svgIcons.maps}
                         <a
                          href={
                            data.google_maps_link ||
                            `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}+(${data.name?.split(" ").join("+")})`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm-md text-blue"
                        >
                          View on Google Maps
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
}

        {/* Bottom CTA bar — chat-opened flow. Renders "Add to Itinerary" when
            no booking exists yet, or "Change Hotel" when there's already a
            booking for this city+dates. Both callbacks emit a widget action
            to the chat orchestrator; they do not book directly. */}
        {data && (onAddHotel || onChangeHotel) && (
          <div
            className="fixed bottom-0 left-0 right-0 md:absolute flex items-center justify-between gap-3 border-t-2 bg-white px-[20px] py-[12px] shadow-md"
            style={{ zIndex: 50 }}
          >
            <div className="flex flex-col">
              {check_in && check_out && (
                <span className="text-[12px] text-text-spacegrey">
                  {check_in} → {check_out}
                </span>
              )}
              {data.price_lower_range_ext && (
                <span className="text-[14px] font-semibold">
                  From {data.currency} {Math.round(data.price_lower_range_ext).toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {onChangeHotel && bookingId && (
                <button
                  onClick={onChangeHotel}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-[14px] font-medium text-gray-800 hover:bg-gray-50"
                >
                  Change Hotel
                </button>
              )}
              {onAddHotel && !bookingId && (
                <button
                  onClick={onAddHotel}
                  className="ttw-btn-fill-yellow"
                >
                  Add to Itinerary
                </button>
              )}
            </div>
          </div>
        )}

      </Container>
    </Drawer>
  );
};

export default AccommodationDetailDrawer;