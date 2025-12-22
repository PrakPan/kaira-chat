import * as actionTypes from "../actions/actionsTypes";

const initialReducer = {
    slideOne: {
        startingLocation: null,
        selectedCities: [
            // { id: null, input_id: Date.now(), data: null, }
        ],
        valueStart: null,
        valueEnd: null,
        selectedPreferences: [],
        date: {
            type: "fixed",
            month: null,
            year: null,
            duration: null,
            start_date: null,
            end_date: null
        }
    },
    itineraryInititateData: null,
    slideThree: {
        groupType: "Solo",
        numberOfAdults: 1,
        numberOfChildren: 0,
        numberOfInfants: 0,
        roomConfiguration: [{adults: 1, children: 0, infants: 0, childAges: []}],
        submitSecondSlide: false,
        addHotels: true,
        addFlights: true,
        addInclusions: true,
    },
    slideFour: {
        hotelType: ['3','4','5'],
        mealPreferences: [],
        specialRequests: ""
    },
    itineraryCreated: false
}

const reducer = (state = initialReducer, action) => {
    switch (action.type) {
        case actionTypes.SET_START_LOCATION:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    startingLocation: action.payload,
                },
            };
        case actionTypes.SET_DESTINATIONS:
            const { id, input_id, data } = action.payload;
            // console.log("id os: ", id)
            let cityExists = false;

            const newCities = state.slideOne.selectedCities.map((item) => {
                if (item.input_id === input_id) {
                    cityExists = true;
                    // console.log("id os selectedcity: ", item)
                    return { ...item, ...data, id };
                }
                return item;
            });

            if (!cityExists) {
                newCities.push({ id, input_id, ...data });
            }

            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    selectedCities: newCities,
                },
            };
        case actionTypes.SET_DATE_RANGE:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    valueStart: action.payload.start,
                    valueEnd: action.payload.end,
                },
            };
        case actionTypes.TOGGLE_PREFERENCE: {
            const preference = action.payload;
            const alreadySelected = state.slideOne.selectedPreferences.includes(preference);

            const updatedPreferences = alreadySelected
                ? state.slideOne.selectedPreferences.filter((p) => p !== preference)
                : [...state.slideOne.selectedPreferences, preference];

            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    selectedPreferences: updatedPreferences,
                },
            };
        }
        case actionTypes.RESET_SELECTED_CITY:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    selectedCities: state.slideOne.selectedCities.map((e) =>
                        e.input_id === action.payload ? { input_id: action.payload } : e
                    ),
                },
            };

        case actionTypes.UPDATE_SELECTED_CITY:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    selectedCities: state.slideOne.selectedCities.map((e) =>
                        e.input_id === action.payload.input_id
                            ? {
                                input_id: action.payload.input_id,
                                ...action.payload.data,
                                id: action.payload.id,
                            }
                            : e
                    ),
                }
            };

        case actionTypes.DELETE_SELECTED_CITY:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    selectedCities: (state.slideOne.selectedCities || []).filter(
                        (e) => e.input_id !== action.payload
                    ),
                }
            };

        case actionTypes.SET_CALENDAR_DATES:
            // console.log("Setting calendar dates:", action.payload);
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    date: {
                        ...state.slideOne.date,
                        start_date: action.payload.start,
                        end_date: action.payload.end,
                    }
                },
            };

        case actionTypes.SET_DATE_TYPE:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    date: {
                        type: action.payload,
                        month: null,
                        year: null,
                        duration: null,
                        start_date: null,
                        end_date: null
                    }
                }
            };

        case actionTypes.SET_FIXED_DATE:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    date: {
                        type: "fixed",
                        start_date: action.payload.start_date,
                        end_date: action.payload.end_date,
                        month: null,
                        year: null,
                        duration: (action.payload.end_date - action.payload.start_date) / (1000 * 60 * 60 * 24)+1,
                    }
                }
            };

        case actionTypes.SET_FLEXIBLE_DATE:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    date: {
                        type: "flexible",
                        month: action.payload.month,
                        year: action.payload.year,
                        duration: action.payload.duration,
                        start_date: null,
                        end_date: null
                    }
                }
            };

        case actionTypes.SET_ANYTIME_DATE:
            return {
                ...state,
                slideOne: {
                    ...state.slideOne,
                    date: {
                        type: "anytime",
                        duration: action.payload.duration,
                        month: null,
                        year: null,
                        start_date: null,
                        end_date: null
                    }
                }
            };

        case actionTypes.SET_ITINERARY_INITIATE_DATA:
            // console.log("itinerary initiate data is:2  ", action.payload)
            return {
                ...state,
                itineraryInititateData: action.payload,
            };


        case actionTypes.SET_GROUP_TYPE:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    groupType: action.payload,
                },
            };

        case actionTypes.SET_NUMBER_OF_ADULTS:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    numberOfAdults: action.payload,
                },
            };

        case actionTypes.SET_NUMBER_OF_CHILDREN:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    numberOfChildren: action.payload,
                },
            };

        case actionTypes.SET_NUMBER_OF_INFANTS:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    numberOfInfants: action.payload,
                },
            };

        case actionTypes.SET_ROOM_CONFIGURATION:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    roomConfiguration: action.payload,
                },
            };

        case actionTypes.SET_SUBMIT_SECOND_SLIDE:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    submitSecondSlide: action.payload,
                },
            };

        case actionTypes.SET_ADD_HOTELS:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    addHotels: action.payload,
                },
            };

        case actionTypes.SET_ADD_FLIGHTS:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    addFlights: action.payload,
                },
            };

        case actionTypes.SET_ADD_INCLUSIONS:
            return {
                ...state,
                slideThree: {
                    ...state.slideThree,
                    addInclusions: action.payload,
                },
            };

        case actionTypes.HANDLE_SHOW_PAX: {
            const groupType = action.payload;
            if (groupType === "Solo") {
                return {
                    ...state,
                    slideThree: {
                        ...state.slideThree,
                        groupType: "Solo",
                        numberOfAdults: 1,
                        numberOfChildren: 0,
                        numberOfInfants: 0,
                        roomConfiguration: [
                            { adults: 1, children: 0, infants: 0, childAges: [] },
                        ],
                        submitSecondSlide: true,
                    },
                };
            } else {
                return {
                    ...state,
                    slideThree: {
                        ...state.slideThree,
                        groupType,
                        numberOfAdults: 2,
                        numberOfChildren: 0,
                        numberOfInfants: 0,
                        roomConfiguration: [
                            { adults: 2, children: 0, infants: 0, childAges: [] },
                        ],
                        submitSecondSlide: true,
                    },
                };
            }
        }
        case actionTypes.SET_HOTEL_TYPE:
            return state.slideFour.hotelType.includes(action.payload)
                ? {
                    ...state,
                    slideFour: {
                        ...state.slideFour,
                        hotelType: state.slideFour.hotelType.filter((h) => h !== action.payload)
                    }
                }
                : {
                    ...state,
                    slideFour: {
                        ...state.slideFour,
                        hotelType: [...state.slideFour.hotelType, action.payload]
                    }
                };
        case actionTypes.SET_MEAL_PREFERENCE:
            return state.slideFour.mealPreferences.includes(action.payload)
                ? {
                    ...state,
                    slideFour: {
                        ...state.slideFour,
                        mealPreferences: state.slideFour.mealPreferences.filter((p) => p !== action.payload)
                    }
                }
                :
                {
                    ...state,
                    slideFour: {
                        ...state.slideFour,
                        mealPreferences: [...state.slideFour.mealPreferences, action.payload]
                    }
                }

        case actionTypes.SET_SPECIAL_REQUESTS:
            return {
                ...state,
                slideFour: {
                    ...state.slideFour,
                    specialRequests: action.payload
                }
            };
        case actionTypes.SET_ITINERARY_CREATED:
            return {
                ...state,
                itineraryCreated: action.payload
            }
        default:
            return state;
    }
}

export default reducer;