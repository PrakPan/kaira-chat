import { useEffect } from "react";
import { connect } from "react-redux";
import setHotLocationSearch from "../../store/actions/hotLocationSearch";
import CountryPage from "../../containers/country/Index";
import ThemePage from "../../containers/travelplanner/ThemePage";

const CountryPageWrapper = (props) => {
  useEffect(() => {
    props.setHotLocationSearch(props.hotLocationSearch);
  }, []);
  console.log("props are: ",props);

  return (
    <>
      {props.pageData && props.data?.page_data?.slug != "india" ? (
        <ThemePage 
          themePage 
          experienceData={props.Data?.page_data} 
          slug={props.Data?.page_data?.slug}
        />
      ) : (
        <CountryPage
          continetCarousel={props?.continetCarousel}
          data={props?.data}
          locations={props?.locations}
          page_id={props.page_id || ""}
          type={props?.Type}
        />
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setHotLocationSearch: (payload) => dispatch(setHotLocationSearch(payload)),
  };
};

export default connect(null, mapDispatchToProps)(CountryPageWrapper); 