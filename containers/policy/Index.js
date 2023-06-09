import styled from 'styled-components';
import { useState, useEffect } from 'react';
import axiosflightpolicyinstance from '../../services/bookings/FetchFlightPolicy';
import LoadingPage from '../../components/LoadingPage';
const Container = styled.div`

`;


const Policy = (props) => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    useEffect(() => {
        axiosflightpolicyinstance.get(`/?booking=`+props.booking_id)
        .then(res => { 
             setData(res.data.policy)
            setLoading(false);
        })
    },[]);
    if(!loading)
    return(
        <Container dangerouslySetInnerHTML={{__html: data}} />
        
    );
    else return <LoadingPage></LoadingPage>
}

export default Policy;