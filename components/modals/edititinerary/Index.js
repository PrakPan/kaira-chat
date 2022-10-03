import React, {useState} from 'react';
import {Modal} from 'react-bootstrap';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretLeft,faCaretRight , faSearch, faCheck, faTimes} from '@fortawesome/free-solid-svg-icons';
// import ImageElement from '../../itinerary/dayelements/ImageElement';
// import ImageElement2 from './ImageElementVertical';

import Filters from './Filters';
const InputContainer = styled.div`
    display: grid;
    grid-template-columns: max-content auto;
`;

const morepois=[
    {
        element: "AD",
        heading: "Half Day Cycle Tour",
        text: "Tour is a spirited and satiating plunge, straight into the deep-end of Old Delhi (Shahjahanabad). At the peak of Emperor Shah Jahan’s rule, his loyal noblemen (Emirs) controlled the social, cultural and economic affairs of the great metropolis of Shajahanabad .",
        image: "media/ruby/cycletour.jpg",
        notes: {
            "Cost": "Rs 2000",
        }
    },
    {
        element: "AD",
        heading: "Old Delhi Walk",
        text: "Unlike the rest of Delhi, Old Delhi still mantains the charm of days past. You'll find street hawkers selling delicious snacks and small shops selling everything from masala (spices) to clothes and perfumes which they have been doing for generations now. The best way to explore Old Delhi is on foot and the following route is perhaps the best and easiest way to make sense of the chaotic streets of Old Delhi.",
        image: "media/ruby/annie-spratt-A9D4qiTJtoQ-unsplash.jpg",
        notes: {
                "Cost": "Free",
            }
    },
    {
        element: "AD",
        heading: "Bollywood Dance Class",
        text: "There you'll learn some popular moves on Indian dance songs and they'll even make a dance video with you and the other participants in traditional Indian attires.",
        image: "media/ruby/pavan-gupta-_HzlOHmboSk-unsplash.jpg",
        notes: {
            "Cost": "Rs 2000",
        }
    },
    
    {
        element: "AD",
        heading: "Museum of Modern Art",
        text: "This quiet museum houses an excellent collection of modern Indian art but is rarely crowded.",
        image: "media/ruby/modernart",
        notes: {
                "Cost": "Free",
            }
    },
    {
        element: "AD",
        heading: "India Gate",
        text: "The All India War Memorial, also referred to as the India Gate is an aweinspiring monument often compared to Arch de Tromphe in France. Believe it or not, doing this is one of the most Delhi things to do and every one in Delhi has been on a picnic here (Including our team) at least once.",
        image: "media/ruby/indiagate.jpg",
        notes: {
            "Cost": "Rs Free",
        }
    },
    {
        element: "AD",
        heading: "Bangla Sahib",
        text: "Gurudwara Bangla Sahib is one of the most prominent Sikh gurdwara, or Sikh house of worship, in Delhi, India, and known for its association with the eighth Sikh Guru, Guru Har Krishan, as well as the holy river inside its complex, known as the Sarovor",
        image: "media/ruby/Screen Shot 2020-09-22 at 2.15.57 AM.png",
        notes: {
            "Cost": "Rs Free",
        }
    },
    {
        element: "AD",
        heading: "Sanjay Van",
        text: "Sanjay Van is a sprawling city forest area near Vasant Kunj and Mehrauli in Delhi, India. It is spread over an area of 443 acres. It is one of the most thickly wooded areas of the city’s green lungs.",
        image: "media/ruby/Screen Shot 2020-09-22 at 2.24.41 AM.png",
        notes: {
            "Cost": "Rs 2000",
        }
    }
  
]
const VerticalElementContainer = styled.div`
    width: 100%;
    color: black !important;
    text-align: center;
`;

const VerticalPoiName = styled.p`
    font-size: ${props => props.theme.fontsizes.desktop.text.default};
    font-weight: 600;
    margin : 0.5rem 0;
    &:hover{
        
    }
`;
const PoiDescription = styled.p`
    font-size: ${props => props.theme.fontsizes.desktop.text.defaault};
    font-weight: 300;
    margin-bottom : 0.25rem;
`;
const VerticalImgContainer = styled.div`

    width: 7vw;
    margin: auto;
    height: 7vw;
    border-radius: 50%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    &:hover{
        
        cursor: pointer;
    }
    `;
const Selected = styled.div`
    width: max-content;
`;
const Edit = (props) => {
    const imgUrlEndPoint = "https://d31aoa0ehgvjdi.cloudfront.net/";
    let imageRequest = JSON.stringify({
        bucket: "thetarzanway-web",
        key: "",
        edits: {
          resize: {
            width: 300,
            height: 300,
            fit: "cover"
          }
        }
    });
    const [navColorState, setNavColorState] = useState({
        itinerary: {
            bg: "black",
            color: "white",
        },
        accommodation: {
            bg: "white",
            color: "black",
        }
    })
    const [dayPois, setDayPois] = useState([
        {
            heading: "Lotus Temple",
            image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747649/demo/lotustemplesquare.jpg",
        },
        {
            heading: "Qutub Minar",
            image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747636/demo/qutubminarsquare.jpg"
        },
        {
            heading: "Humayun's Tomb",
            image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747620/demo/humayuntombsquare.jpg"
        }
    ])
    const [morePois, setMorePois] = useState(
        morepois
    );
     const [selectedState, setSelectedState] = useState({
        one: true,
        two: false,
        three: false,
    });
    const [hoverState, setHoverState] = useState({
        one: false,
        two: false,
        three: false,
    });
    const _addPoiHandler = (val) => {
        
        if(val === 1){
        setMorePois([
            {
                element: "AD",
                heading: "Half Day Cycle Tour",
                text: "Tour is a spirited and satiating plunge, straight into the deep-end of Old Delhi (Shahjahanabad). At the peak of Emperor Shah Jahan’s rule, his loyal noblemen (Emirs) controlled the social, cultural and economic affairs of the great metropolis of Shajahanabad .",
                image: "media/ruby/cycletour.jpg",
                notes: {
                    "Cost": "Rs 2000",
                }
            },
            
            {
                element: "AD",
                heading: "Museum of Modern Art",
                text: "This quiet museum houses an excellent collection of modern Indian art but is rarely crowded.",
                image: "media/ruby/modernart",
                notes: {
                        "Cost": "Free",
                    }
            },
            {
                element: "AD",
                heading: "India Gate",
                text: "The All India War Memorial, also referred to as the India Gate is an aweinspiring monument often compared to Arch de Tromphe in France. Believe it or not, doing this is one of the most Delhi things to do and every one in Delhi has been on a picnic here (Including our team) at least once.",
                image: "media/ruby/indiagate.jpg",
                notes: {
                    "Cost": "Rs Free",
                }
            },
            {
                element: "AD",
                heading: "Bangla Sahib",
                text: "Gurudwara Bangla Sahib is one of the most prominent Sikh gurdwara, or Sikh house of worship, in Delhi, India, and known for its association with the eighth Sikh Guru, Guru Har Krishan, as well as the holy river inside its complex, known as the Sarovor",
                image: "media/ruby/Screen Shot 2020-09-22 at 2.15.57 AM.png",
                notes: {
                    "Cost": "Rs Free",
                }
            },
            {
                element: "AD",
                heading: "Sanjay Van",
                text: "Sanjay Van is a sprawling city forest area near Vasant Kunj and Mehrauli in Delhi, India. It is spread over an area of 443 acres. It is one of the most thickly wooded areas of the city’s green lungs.",
                image: "media/ruby/Screen Shot 2020-09-22 at 2.24.41 AM.png",
                notes: {
                    "Cost": "Rs 2000",
                }
            },
          
        ])
        setDayPois(
            [
                {
                    heading: "Old Delhi Walk",
                    image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747611/demo/olddelhisquare.jpg",
                },
                {
                    heading: "Qutub Minar",
                    image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747636/demo/qutubminarsquare.jpg"
                },
                {
                    heading: "Bollywood Dance Class",
                    image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747598/demo/dancesquare.jpg"
                }
            ]
        )
        }
        else {
            setMorePois([
                {
                    element: "AD",
                    heading: "Half Day Cycle Tour",
                    text: "Tour is a spirited and satiating plunge, straight into the deep-end of Old Delhi (Shahjahanabad). At the peak of Emperor Shah Jahan’s rule, his loyal noblemen (Emirs) controlled the social, cultural and economic affairs of the great metropolis of Shajahanabad .",
                    image: "media/ruby/cycletour.jpg",
                    notes: {
                        "Cost": "Rs 2000",
                    }
                },
                {
                    element: "AD",
                    heading: "Bollywood Dance Class",
                    text: "There you'll learn some popular moves on Indian dance songs and they'll even make a dance video with you and the other participants in traditional Indian attires.",
                    image: "media/ruby/pavan-gupta-_HzlOHmboSk-unsplash.jpg",
                    notes: {
                        "Cost": "Rs 2000",
                    }
                },
                
                {
                    element: "AD",
                    heading: "Museum of Modern Art",
                    text: "This quiet museum houses an excellent collection of modern Indian art but is rarely crowded.",
                    image: "media/ruby/modernart",
                    notes: {
                            "Cost": "Free",
                        }
                },
                {
                    element: "AD",
                    heading: "India Gate",
                    text: "The All India War Memorial, also referred to as the India Gate is an aweinspiring monument often compared to Arch de Tromphe in France. Believe it or not, doing this is one of the most Delhi things to do and every one in Delhi has been on a picnic here (Including our team) at least once.",
                    image: "media/ruby/indiagate.jpg",
                    notes: {
                        "Cost": "Rs Free",
                    }
                },
                {
                    element: "AD",
                    heading: "Bangla Sahib",
                    text: "Gurudwara Bangla Sahib is one of the most prominent Sikh gurdwara, or Sikh house of worship, in Delhi, India, and known for its association with the eighth Sikh Guru, Guru Har Krishan, as well as the holy river inside its complex, known as the Sarovor",
                    image: "media/ruby/Screen Shot 2020-09-22 at 2.15.57 AM.png",
                    notes: {
                        "Cost": "Rs Free",
                    }
                },
                {
                    element: "AD",
                    heading: "Sanjay Van",
                    text: "Sanjay Van is a sprawling city forest area near Vasant Kunj and Mehrauli in Delhi, India. It is spread over an area of 443 acres. It is one of the most thickly wooded areas of the city’s green lungs.",
                    image: "media/ruby/Screen Shot 2020-09-22 at 2.24.41 AM.png",
                    notes: {
                        "Cost": "Rs 2000",
                    }
                },
              
            ])
            setDayPois(
                [
                    {
                        heading: "Old Delhi Walk",
                        image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747611/demo/olddelhisquare.jpg",
                    },
                    {
                        heading: "Qutub Minar",
                        image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747636/demo/qutubminarsquare.jpg"
                    },
                    {
                        heading: "Humayun's Tomb",
                        image: "https://res.cloudinary.com/devanshchawla/image/upload/v1600747620/demo/humayuntombsquare.jpg"
                    }
                ]
            )
        }
    } 
    const _setSelectedStateHandler = (target) => {
        if(target==="one"){
            if(!selectedState.one) setSelectedState({
                one: true,
                two: false,
                three: false,
            });
        }
        if(target==="two"){
            if(!selectedState.two) setSelectedState({
                one: false,
                two: true,
                three: false,
            });
        }
        if(target==="three"){
            if(!selectedState.three) setSelectedState({
                one: false,
                two: false,
                three: true,
            });
        }
    }
    let MorePoisArr=[];
 
    for( var i = 0 ; i< morePois.length ; i++){
        if( morePois[i].heading==="Bollywood Dance Class")
        MorePoisArr.push(                        
            // <ImageElement noRecommendations name={morePois[i].heading} text={morePois[i].text}  url={morePois[i].image} notes={morePois[i].notes} add _addPoiHandler={_addPoiHandler} val={1}></ImageElement>
        );
        else{
            MorePoisArr.push(                        
                // <ImageElement noRecommendations name={morePois[i].heading} text={morePois[i].text}  url={morePois[i].image} notes={morePois[i].notes} add _addPoiHandler={_addPoiHandler}></ImageElement>
            );
        }
        if(i === morePois.length-1) MorePoisArr.push(<div style={{height: "20vh"}}></div>)
    }
    const _showAccommodationHandler = () => {
      setNavColorState({itinerary: {bg: "white", color: "black"}, accommodation: {bg: "black", color: "white"}});
      setMorePois([
        {
            element: "AB",
            heading: "Resort Whispering Pines, Agra",
            text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries, Spa, Swimming Pool",
            image: "media/ruby/Accommodation images/alexander-kaunas-67-sOi7mVIk-unsplash.jpg",
            notes: {
                "Cost": "Rs 2800",
            }
        },
        {
            element: "AB",
            heading: "Littl Kochi Beach Cottage, Kochi",
            text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries.",
            image: "media/ruby/Accommodation images/chaitanya-maheshwari-NpjE6Q69RgI-unsplash.jpg",
            notes: {
                "Cost": "Rs 1900",
            }
        },
        {
            element: "AB",
            heading: "Zostel, Jaipur",
            text: "Amenities: Breakfast included, Wifi, Personal washroom, Linen, Basic toiletries.",
            image: "media/ruby/Accommodation images/marcus-loke-WQJvWU_HZFo-unsplash.jpg",
            notes: {
                "Cost": "Rs 800",
            }
        },
        {
            element: "AB",
            heading: "Lake View Camps, Udaipur",
            text: "Amenities: Breakfast included, Shared Washroom, Linen, Basic toiletries.",
            image: "media/ruby/Accommodation images/pexels-snapwire-699558.jpg",
            notes: {
                "Cost": "Rs 1100",
            }
        },
      ])
    }
   
  return(
        <Modal show={true} size="xl" onHide={props.hideModalHandler} className="edit-modal" style={{position: "absolute"}}>
            {/* <Modal.Header style={{borderStyle: "solid solid none solid", borderColor: "#F7e700", borderWidth: "0.5rem", display: "block"}} closeButton>
                
            </Modal.Header> */}
            <Modal.Body>
                <div style={{display: "grid", gridTemplateColumns: "20% 70% 10%", gridGap: "1rem"}}>
                        <div><div className="font-nunito" style={{fontWeight: "100", fontSize: "0.75rem"}}>CURRENTLY EXPLORING</div>
                        <div className="font-opensan" style={{fontWeight: "600", fontSize: "1.25rem"}}>
                        Delhi<FontAwesomeIcon icon={faCaretDown} style={{marginLeft: "0.5rem"}}></FontAwesomeIcon>
                        </div>
                    </div>
                    <InputContainer>
                            <div style={{borderStyle: "solid none solid solid", borderColor: "#E4E4E4", borderRadius: "5px 0 0 5px ", padding: "0.5rem", borderWidth: "1px"}}><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></div>
                            <input type="text" placeholder="Search POIs" style={{width: "100%", borderRadius: " 0 5px 5px 0", borderColor: "#E4E4E4", padding: "0.5rem", borderStyle: "solid solid solid none", borderWidth: "1px"}}></input>

                    </InputContainer>
                    <div style={{textAlign: "right", paddingRight: "2rem"}}>
                        <FontAwesomeIcon style={{fontSize: "1.5rem"}} icon={faTimes} onClick={props.hideModalHandler} ></FontAwesomeIcon>
                    </div>
                </div>
                <div style={{display: "grid", gridTemplateColumns: "20% 70% 10%", gridGap: "1rem", marginTop: "1rem", maxHeight: "65vh", overflow:"scroll"}}>

                    <div style={{marginRight: "12px"}}><Filters></Filters></div>
                    <div style={{padding: "0 1rem" ,borderStyle: "none solid none solid", borderWidth: "1px", borderColor: "#E4E4E4"}}>
                        
                        {/* <ImageElement noRecommendations name={morepois[0].heading} text={morepois[0].text}  url={morepois[0].image} notes={morepois[0].notes} add></ImageElement>
                        <ImageElement noRecommendations name={morepois[1].heading} text={morepois[1].text} url={morepois[1].image} notes={morepois[1].notes} add> </ImageElement>
                        <ImageElement noRecommendations name={morepois[2].heading} text={morepois[2].text} url={morepois[2].image} notes={morepois[2].notes} add> </ImageElement> */}
                    {MorePoisArr}
                    </div>
                   
                </div>
                {/* <p style={{textAlign: "center", margin: "2rem", fontWeight: "300"}} className="font-nunito">Any recommendations missing? Request here.</p> */}
                <hr></hr>
                {/* <p style={{textAlign: "center"}} className="font-nunito"><FontAwesomeIcon icon={faCaretLeft}></FontAwesomeIcon><b>  Replacing from Day 5  </b><FontAwesomeIcon icon={faCaretRight}></FontAwesomeIcon></p> */}
                <div style={{display: "grid", gridTemplateColumns: "repeat(3,1fr)", width: "80%", margin: "auto", gridGap:"3rem"}}>
                    {/* <ImageElement2 image={img1} name="Lotus Temple" text="A testament to the acceptance of diverse cultures in India, visit the beatiful edifice dedicated to the Baha'i faith. Made in the form of a stupendous white petal lotus, it is one of the most visited establishements in the world."></ImageElement2> */}
                    <VerticalElementContainer>
                        <VerticalImgContainer className="center-div" onClick={() => _setSelectedStateHandler("one")} style={{backgroundImage :  'url('+dayPois[0].image+')'}} onMouseEnter={() => setHoverState({...hoverState, one: true})} onMouseLeave={()=> setHoverState({...hoverState, one: false})}>
                        {selectedState.one  ? 
                        <div style={{backgroundColor: "rgba(247, 231, 0, 0.6)", height: "100%", width: "100%", borderRadius: "50%"}} className="center-div"><Selected><FontAwesomeIcon icon={faCheck} ></FontAwesomeIcon></Selected></div>
                        : null}
                        {
                            hoverState.one && !selectedState.one ? <div style={{backgroundColor: "rgba(0, 0, 0, 0.4)", height: "100%", width: "100%", borderRadius: "50%"}}></div>
                            :null
                        }
                        </VerticalImgContainer>
                        <div style={{padding: "0 1rem"}}>
                            <VerticalPoiName className=""><b>{dayPois[0].heading}</b></VerticalPoiName>
                            {/* <PoiDescription>{morepois[0].text}</PoiDescription> */}
                        </div>
                    </VerticalElementContainer>
                    <VerticalElementContainer>
                        <VerticalImgContainer className="center-div" onClick={() => _setSelectedStateHandler("two")} style={{backgroundImage :  'url('+dayPois[1].image+')'}} onMouseEnter={() => setHoverState({...hoverState, two: true})} onMouseLeave={()=> setHoverState({...hoverState, two: false})}>
                        {selectedState.two  ? 
                        <div style={{backgroundColor: "rgba(247, 231, 0, 0.6)", height: "100%", width: "100%", borderRadius: "50%"}} className="center-div"><Selected><FontAwesomeIcon icon={faCheck} ></FontAwesomeIcon></Selected></div>
                        : null}
                        {
                            hoverState.two && !selectedState.two ? <div style={{backgroundColor: "rgba(0, 0, 0, 0.4)", height: "100%", width: "100%", borderRadius: "50%"}}></div>
                            :null
                        }
                        </VerticalImgContainer>
                        <div style={{padding: "0 1rem"}}>
                            <VerticalPoiName className=""><b>{dayPois[1].heading}</b></VerticalPoiName>
                            {/* <PoiDescription>The next location is the beautiful Qutab Minar, a UNESCO World Heritage sight and the tallest individual tower in the world. With a long history, having being destroyed multiple times by natural disasters and rebuilt by Mughal, Lodi and British rulers alike. VIsiting the Qutab Minar will be like peeping into India's history.</PoiDescription> */}
                        </div>
                        </VerticalElementContainer>
                        <VerticalElementContainer>
                        <VerticalImgContainer className="center-div" onClick={() => _setSelectedStateHandler("three")} style={{backgroundImage :  'url('+dayPois[2].image+')'}} onMouseEnter={() => setHoverState({...hoverState, three: true})} onMouseLeave={()=> setHoverState({...hoverState, one: false})}>
                        {selectedState.three  ? 
                        <div style={{backgroundColor: "rgba(247, 231, 0, 0.6)", height: "100%", width: "100%", borderRadius: "50%"}} className="center-div"><Selected><FontAwesomeIcon icon={faCheck} ></FontAwesomeIcon></Selected></div>
                        : null}
                        {
                            hoverState.three && !selectedState.three ? <div style={{backgroundColor: "rgba(0, 0, 0, 0.4)", height: "100%", width: "100%", borderRadius: "50%"}}></div>
                            :null
                        }
                        </VerticalImgContainer>
                        <div style={{padding: "0 1rem"}}>
                            <VerticalPoiName className=""><b>{dayPois[2].heading}</b></VerticalPoiName>
                            {/* <PoiDescription>Sitting on the banks of river Yamuna, the tomb of Emperor Humayun is a beautiful structure sitting in the middle of a huge ornate Mughal garden. Make sure you don't miss out on this beautiful mix of Mughal & Persian architecture</PoiDescription> */}
                        </div>
                    </VerticalElementContainer>
                </div>
            </Modal.Body>
      </Modal>
  );


}

export default Edit;