import React, { useState, useEffect } from 'react';
// import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import chatbottheme from './settings';
import Header from './Header';
// import user from '../../public/assets/user.webp';
import axios from 'axios';
import axiostailoredinstance from '../../services/leads/tailored';
const ExperienceChat = (props) => {
  const [open, setOpen] = useState(false);
  let answers = {
    locations: '',
    duration: '',
    budget: '',
    message: '',
    name: '',
    phone: '',
    email: '',
  };
  const _sendAnswersHandler = () => {
    const data = {
      locations: answers.locations,
      experience_filters_selected: [],
      budget: answers.budget,
      duration: answers.duration,
      extra_data: answers.message,
      lead_contact_details: {
        first_name: answers.name,
        last_name: '',
        phone: answers.phone,
        email: answers.email,
      },
    };
    axiostailoredinstance.post('/', data).then(
      (answers = {
        locations: '',
        duration: '',
        budget: '',
        message: '',
        name: '',
        phone: '',
        email: '',
      })
    );
  };

  const steps = [
    {
      id: '1',
      message: 'Hey there!',
      trigger: '2',
    },
    {
      id: '2',
      message:
        'Hey There! Welcome to your one-stop solution to everything travel. How may I assist you today?',
      trigger: 'select-query',
    },
    {
      id: 'select-query',
      options: [
        // { value: 1, label: ' I want to book a travel experience', trigger: () => {props.history.push('/itinerary'); return('1')} },
        {
          value: 1,
          label: ' I want to book a travel experience',
          trigger: 'book-experience-options',
        },
        {
          value: 2,
          label: ' I want to personalize a travel experience',
          trigger: 'book-experience-personalise',
        },
        {
          value: 3,
          label: 'I want to get in touch with a travel expert',
          trigger: 'book-experience-personalise-name',
        },
        // { value: 4, label: 'I have another query', trigger: 'other' },
      ],
    },
    {
      id: 'book-experience-options',
      message: 'What kind of help are you looking for with booking?',
      trigger: 'book-experience-select',
    },
    {
      id: 'book-experience-select',
      options: [
        {
          value: 1,
          label: 'I want to personalize an experience',
          trigger: 'book-experience-personalise',
        },
        {
          value: 2,
          label: 'I have a few additional questions about booking',
          trigger: 'book-experience-personalise-name',
        },
      ],
    },
    {
      id: 'book-experience-personalise',
      message: 'Have you decided where you want to go?',
      trigger: 'book-experience-personalise-waiting-locationselect',
    },
    {
      id: 'book-experience-personalise-waiting-locationselect',
      options: [
        {
          value: 1,
          label: 'Yes',
          trigger: 'book-experience-personalise-locationenter',
        },
        {
          value: 2,
          label: 'No',
          trigger: 'book-experience-personalise-budget',
        },
      ],
    },
    {
      id: 'book-experience-personalise-budget',
      message: 'What budget are we expecting for this experience?',
      trigger: 'book-experience-personalise-waiting-budget',
    },
    {
      id: 'book-experience-personalise-waiting-budget',
      options: [
        {
          value: 1,
          label: 'Affordable',
          trigger: () => {
            answers = { ...answers, budget: 'Affordable' };
            return 'book-experience-personalise-duration';
          },
        },
        {
          value: 2,
          label: 'Average',
          trigger: () => {
            answers = { ...answers, budget: 'Average' };
            return 'book-experience-personalise-duration';
          },
        },
        {
          value: 3,
          label: 'Luxury',
          trigger: () => {
            answers = { ...answers, budget: 'Luxury' };
            return 'book-experience-personalise-duration';
          },
        },
      ],
    },
    {
      id: 'book-experience-personalise-duration',
      message: 'How long would you want your experience to last?',
      trigger: 'book-experience-personalise-waiting-duration',
    },
    {
      id: 'book-experience-personalise-waiting-duration',
      options: [
        {
          value: 1,
          label: 'Less Than a Week',
          trigger: () => {
            answers = { ...answers, duration: 'Less Than a Week' };
            return 'book-experience-personalise-message';
          },
        },
        {
          value: 2,
          label: '7 - 14 Days',
          trigger: () => {
            answers = { ...answers, duration: '7 - 14 Days' };
            return 'book-experience-personalise-message';
          },
        },
        {
          value: 3,
          label: 'More than 14 Days',
          trigger: () => {
            answers = { ...answers, duration: 'More than 14 Days' };
            return 'book-experience-personalise-message';
          },
        },
      ],
    },
    {
      id: 'book-experience-personalise-message',
      message: 'Please mention anything else you would like to add',
      trigger: 'book-experience-personalise-waiting-message',
    },
    {
      id: 'book-experience-personalise-waiting-message',
      trigger: (value) => {
        answers = { ...answers, message: value.value };
        return 'book-experience-personalise-name';
      },
      user: true,
    },
    {
      id: 'book-experience-personalise-name',
      message: 'Name?',
      trigger: 'book-experience-personalise-waiting-name',
    },

    {
      id: 'book-experience-personalise-waiting-name',
      user: true,
      trigger: (value) => {
        answers = { ...answers, name: value.value };
        return 'book-experience-personalise-mobile';
      },
    },
    {
      id: 'book-experience-personalise-mobile',
      message: 'Mobile?',
      trigger: 'book-experience-personalise-waiting-mobile',
    },
    {
      id: 'book-experience-personalise-waiting-mobile',
      user: true,
      trigger: (value) => {
        answers = { ...answers, phone: value.value };
        return 'book-experience-personalise-email';
      },
    },
    {
      id: 'book-experience-personalise-email',
      message: 'Email?',
      trigger: 'book-experience-personalise-waiting-email',
    },
    {
      id: 'book-experience-personalise-waiting-email',
      user: true,
      trigger: (value) => {
        answers = { ...answers, email: value.value };
        _sendAnswersHandler();
        return 'book-experience-personalise-complete';
      },
    },
    {
      id: 'book-experience-personalise-complete',
      message: 'Thank You Message',
      trigger: () => {
        return 'more-help';
      },
    },
    {
      id: 'book-experience-personalise-locationenter',
      message: 'Which places are on your mind?',
      trigger: 'book-experience-personalise-waiting-locationenter',
    },
    {
      id: 'book-experience-personalise-waiting-locationenter',
      user: true,
      trigger: (value) => {
        answers = { ...answers, locations: value.value };
        return 'book-experience-personalise-budget';
      },
    },
    {
      id: 'more-help',
      message: 'Do you require any further assistance?',
      trigger: 'more-help-waiting',
    },
    {
      id: 'more-help-waiting',
      options: [
        { value: 1, label: 'Yes', trigger: 'select-query' },
        { value: 2, label: 'No', trigger: '1' },
      ],
    },
    {
      id: 'other',
      options: [
        { value: 1, label: 'Safety / health concerns', trigger: '1' },
        { value: 2, label: 'FAQs', trigger: '1' },
        { value: 3, label: 'Talk to an executive', trigger: '1' },
      ],
    },
  ];
  const toggleFloating = ({ opened }) => {
    setOpen({ opened });
  };
  return (
    <ThemeProvider theme={chatbottheme}>
      {/* <ChatBot 
        opened={open} 
        botDelay={500}
        customDelay={500}
        userDelay={500}
        toggleFloating={toggleFloating}  
        botAvatar={null} steps={steps} 
        headerComponent={<Header onhide={() => setOpen(false)}/>} 
        floating="true"
        /> */}
      {/* <div style={{position: 'fixed', bottom: '56px', right: '66px', zIndex: '10000' , backgroundColor: 'red', width: '1rem'}}>1</div> */}
    </ThemeProvider>
  );
};

export default ExperienceChat;
