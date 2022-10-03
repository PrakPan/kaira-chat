import React,{useState} from 'react';
import styled from 'styled-components';
// import arrow from '../../../assets/DropDownArrow.svg';
// import arrow from '../../../public/assets/DropDownArrow.svg';
/*
Description:
a separate dropdownlist component for DropdownWhyUS with fixed height in text dropdown to prevent 
wasted render.
!! height must be changed depending on paragraph length or set overflow scroll !!
------------------------------------------------------------------------------------------------
Props:
none
------------------------------------------------------------------------------------------------
Components used:
styled
*/

const ArrowIcon=styled.img`
cursor:pointer;
float:right;
height: 1.3rem;
transition: all 0.3s ease-out;
transform: ${props => (props.rotate ? `rotate(180deg)` : "")};
@media screen and (min-width: 768px){
height: 3.4rem;
}
@media only screen and (min-device-width : 768px) and (max-device-width : 1024px)  { 
    height: 2.5rem;
    }   
`;

const HeadingContainer=styled.div`
transition: font-weight 0.3s ease-in-out;
font-weight: ${props => (props.rotate ? `900` : "100")};
font-size:0.8rem;
width:10rem;
@media screen and (min-width: 768px){
    width: 25rem;
    font-size: 2rem;
    }
    @media only screen and (min-device-width : 768px) and (max-device-width : 1024px)  { 
        font-size: 1.4rem;
        width: 20rem;
    }
`;

const Heading=styled.span`
text-align:left;
`;

const WidthContainer=styled.div`
@media screen and (min-width: 768px){
display:flex;
justify-content: flex-end;
align-items: flex-end;
}
`;

const Paragraph=styled.p`
width:100%;
text-align: left;
font-size: 0.9rem;
overflow-x:hidden;
height: ${props => (props.toggle ? `5rem` : '0')};
transition: all 0.5s ease-in-out;
opacity: ${props => (props.toggle ? `1` : '0')};
@media screen and (min-width: 768px){
    font-size: 1rem;
}
`;

const DropDownList = ()=>{
    const [rotate1, setRotate1]=useState(false);
    const [toggle1, setToggle1]=useState(false);
    const [rotate2, setRotate2]=useState(false);
    const [toggle2, setToggle2]=useState(false); 
    const [rotate3, setRotate3]=useState(false);
    const [toggle3, setToggle3]=useState(false); 
    const [rotate4, setRotate4]=useState(false);
    const [toggle4, setToggle4]=useState(false);  

    const toggler1 = ()=>{
        setToggle1(!toggle1);
        setRotate1(!rotate1); 
        if((toggle2==true&&rotate2==true)||(toggle3==true&&rotate3==true)||(toggle4==true&&rotate4==true)){
            setToggle2(false);
            setRotate2(false);
            setToggle3(false);
            setRotate3(false);
            setToggle4(false);
            setRotate4(false);
        }    
    }
    const toggler2 = ()=>{
        setToggle2(!toggle2);
        setRotate2(!rotate2); 
        if((toggle1==true&&rotate1==true)||(toggle3==true&&rotate3==true)||(toggle4==true&&rotate4==true)){
            setToggle1(false);
            setRotate1(false);
            setToggle3(false);
            setRotate3(false);
            setToggle4(false);
            setRotate4(false);
        }        
    }
    const toggler3 = ()=>{
        setToggle3(!toggle3);
        setRotate3(!rotate3); 
        if((toggle2==true&&rotate2==true)||(toggle1==true&&rotate1==true)||(toggle4==true&&rotate4==true)){
            setToggle2(false);
            setRotate2(false);
            setToggle1(false);
            setRotate1(false);
            setToggle4(false);
            setRotate4(false);
        }        
    }
    const toggler4 = ()=>{
        setToggle4(!toggle4);
        setRotate4(!rotate4); 
        if((toggle2==true&&rotate2==true)||(toggle3==true&&rotate3==true)||(toggle1==true&&rotate1==true)){
            setToggle2(false);
            setRotate2(false);
            setToggle3(false);
            setRotate3(false);
            setToggle1(false);
            setRotate1(false);
        }        
    }

    return(
        <div>           
            <WidthContainer>
               <HeadingContainer className="font-opensans" rotate={rotate1}>
                 <Heading>For Old Age</Heading>                       
                 {/* <ArrowIcon rotate={rotate1} src={arrow} onClick={toggler1} />         */}
               </HeadingContainer>
            </WidthContainer>                                
            <Paragraph toggle={toggle1} className="font-nunito">
                 “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer 
                 Lorem Ipsum Talking to customer Lorem Ipsum Talking to customer 
                 “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer            
            </Paragraph>

            <WidthContainer>      
               <HeadingContainer className="font-opensans" rotate={rotate2}   >
                 <Heading>For Startups </Heading>
                 {/* <ArrowIcon rotate={rotate2}  src={arrow} onClick={toggler2}/> */}
               </HeadingContainer> 
             </WidthContainer>                              
            <Paragraph toggle={toggle2} className="font-nunito">
                “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer 
                Lorem Ipsum Talking to customer Lorem Ipsum Talking to customerLorem 
                Ipsum Talking to customer Lorem Ipsum Talking to customer”
            </Paragraph>

            <WidthContainer>      
               <HeadingContainer className="font-opensans" rotate={rotate3}    >
                 <Heading>For Corporates </Heading>
                 {/* <ArrowIcon rotate={rotate3} src={arrow} onClick={toggler3}/> */}
               </HeadingContainer>
            </WidthContainer>      
            <Paragraph toggle={toggle3} className="font-nunito">
                “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer 
                 Lorem Ipsum Talking to customer Lorem Ipsum Talking to customerLorem 
                 Ipsum Talking to customer Lorem Ipsum Talking to customer”
            </Paragraph>
     
            <WidthContainer>      
                <HeadingContainer className="font-opensans" rotate={rotate4}    >
                 <Heading>For Institutions </Heading>
                 {/* <ArrowIcon rotate={rotate4} src={arrow} onClick={toggler4}/>             */}
                </HeadingContainer>
            </WidthContainer>                   
            <Paragraph toggle={toggle4} className="font-nunito">
               “Lorem Ipsum Talking to customerLorem Ipsum Talking to customer 
                Lorem Ipsum Talking to customer Lorem Ipsum Talking to customerLorem 
                Ipsum Talking to customer Lorem Ipsum Talking to customer”
            </Paragraph> 
        </div>
    );
}
export default DropDownList;