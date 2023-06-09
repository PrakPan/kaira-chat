import questioncontansts from "./questioncontansts";
 
  export default {
    questions: [
        questioncontansts.LOCATIONS,
        questioncontansts.FILTERS,
        questioncontansts.PAX,
        questioncontansts.BUDGET,
        questioncontansts.DURATION,
        questioncontansts.WORKCATION,
        '',
        ""
      ],
    options: [
      [{text: 'Himachal Pradesh', image: 'media/icons/Questionnaire/Adventure/canoeing.svg'},{text: 'Uttarakhand', image: 'media/icons/Questionnaire/Nature/waterfall.svg'},{text: 'Rajasthan', image: 'media/icons/Questionnaire/heritage/taj-mahal.svg'},{text: 'Kerala', image: 'media/icons/Questionnaire/Shopping/shopping-bag.svg'},{text: 'Andaman & Nicobar', image: 'media/icons/Questionnaire/Spiritual/meditation.svg'},{text: 'Ladakh', image: 'media/icons/Questionnaire/isolated/pavan-gupta-_HzlOHmboSk-unsplash.svg'}],
      [{heading: 'Isolated', image: 'media/icons/Questionnaire/isolated/isolated.png'}, {heading: 'Romantic', image: 'media/icons/Questionnaire/Romantic/romantic.png'}, {heading: 'Heritage', image: 'media/icons/Questionnaire/heritage/taj-mahal1.png'},{heading: 'Spiritual', image: 'media/icons/Questionnaire/Spiritual/spiritual1.png'}, {heading: 'Art and Culture', image: 'media/icons/Questionnaire/Culture/art.png'}, {heading: 'Shopping', image: 'media/icons/Questionnaire/Shopping/shopping-cart.png'},  {heading: 'Adventure and Outdoors', image: 'media/icons/Questionnaire/Adventure/adventure.png'},{heading: 'Nature and Retreat', image: 'media/icons/Questionnaire/Nature/nature.png'},{heading: 'Nightlife and Events', image: 'media/icons/Questionnaire/nightlife.png'}, {heading: 'Science and Knowledge', image: 'media/icons/Questionnaire/science.png'}],
      [{heading: 'Solo', image: 'media/icons/Questionnaire/Group Type/solo.png'},{ heading: 'Couple', image: 'media/icons/Questionnaire/Group Type/couple.png'},{ heading: 'Family', image: 'media/icons/Questionnaire/Group Type/family.png'}, { heading: 'Friends', image: 'media/icons/Questionnaire/Group Type/friends.png'}, { heading: 'Large Group', image: 'media/icons/Questionnaire/Group Type/Large group.png'}],
      [{heading: "Affordable", text: 'Below ₹3,000 per night', image: 'media/icons/Questionnaire/Budget/affordable.png'},{heading: "Average", text: '₹3,000-6,000 per night', image: 'media/icons/Questionnaire/Budget/average.png'},{heading: "Luxury", text: '₹6,000 - ₹10,000 per night', image: 'media/icons/Questionnaire/Budget/luxury.png'}, {heading: "Luxury +", text: 'Above ₹10,000 per night', image: 'media/icons/Questionnaire/Budget/ultra luxury.png'}],
        [{heading: 'Weekend Getaway', text: '2-4 Days', image: 'media/icons/Questionnaire/How long/Weekend.png'},{heading: ' A week or so', text: '5-8 Days', image: 'media/icons/Questionnaire/How long/A weeek.png'},{heading: 'More than a week', text: '9-14 Days', image: 'media/icons/Questionnaire/How long/more than a week.png'}, {heading: 'Even more', text: '15 Days+',  image: 'media/icons/Questionnaire/How long/even more.png'}],
        [{heading: 'Yes', image: 'media/icons/Questionnaire/yes.png'}, {heading: 'No', image: 'media/icons/Questionnaire/no.png'}],
        [null],
        
    ]
}; 