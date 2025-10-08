import React from "react";

const CabDetailModal = ({ segments, provider, resultIndex, setShowDetails ,fareRule}) => {
    const [fareRules, setFareRules] = useState(fareRule?.fareRuleDetail);
    const [fareRulesLoading, setFareRulesLoading] = useState(false);
    const [fareRUlesError, setFareRulesError] = useState(false);
  
    useEffect(() => {
      if(fareRules==null){
        getFareRules();
      }
    }, []);
  
    const getFareRules = () => {
      setFareRulesLoading(true);
      setFareRulesError(false);
  
      const traceId = localStorage.getItem(`${provider}_trace_id`);
      const data = {
        trace_id: traceId,
        result_index: resultIndex,
      };
  
      axiosFlightFareRule
        .post("", data)
        .then((response) => {
          setFareRules(response.data.results[0].fare_rule_detail);
          setFareRulesLoading(false);
        })
        .catch((err) => {
          setFareRulesError(true);
          setFareRulesLoading(false);
        });
    };
  
    return (
      <div className="relative flex flex-col gap-4 bg-gray-100 p-2 rounded-md">
        <div className="flex flex-col gap-2">
          <div className="w-fit py-2 text-lg font-bold">Flight Details</div>
  
          <FlightSegment segments={segments} />
        </div>
  
        {fareRulesLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-4 border-t-[#F8E000] rounded-full animate-spin"></div>
          </div>
        ) : fareRUlesError ? (
          <div className="text-sm text-center">
            Something went wrong, please try again
          </div>
        ) : (
            <div className="flex flex-col">
            <div className="text-sm-xl font-400 leading-xl gl-dynamic-render-elements">
          <h6 className="section-heading">
            Fare Details and Rules
          </h6>

        
            <div
              dangerouslySetInnerHTML={{
                __html: fareRules,
              }}
              className="section-content pl-lg"
            ></div>
          </div>
        </div>
          // <div className="flex flex-col">
          //   <div className="w-fit py-2 mb-2 text-lg font-bold">
          //     Fare Details and Rules
          //   </div>
  
          //   <div
          //     dangerouslySetInnerHTML={{
          //       __html: fareRules,
          //     }}
          //     className="flex flex-col gap-1 text-sm"
          //   ></div>
          // </div>
        )}
      </div>
    );
  };
  
export default CabDetailModal