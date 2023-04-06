import * as React from 'react';
import { MapContainer } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
// import 'leaflet/dist/leaflet.css';

import styled from 'styled-components';
// import { useRouter } from 'next/router';
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   Polygon,
//   // ZoomControl,
//   Polyline,
// } from 'react-leaflet';
// import { Browser, Icon } from 'leaflet';
// import { RiPhoneFill } from 'react-icons/ri';
// import { MdEmail } from 'react-icons/md';
// import { BsArrowRightCircleFill } from 'react-icons/bs';

// import { statesData } from './GeoData.js';
// import { useStateContext } from '../../context/StateContext';
// import NearestLocation from '../../function/NearestLocation';
// import useMediaQuery from '../../Hooks/CustomMediaQuery';

const MapInside = styled.div`
  flex: 3;
  width: 50%;

  z-index: 8;
  @media screen and (max-width: 768px) {
    height: 20% !important;
  }
`;
// // function style(feature) {
// //   return {
// //     fillColor: '#ED1C24',
// //     weight: 0.6,
// //     opacity: 1,
// //     color: 'white',
// //     dashArray: '0',
// //     fillOpacity: 0,
// //   };
// // }
// const MapInside = styled.div`
//   flex: 3;
//   width: 100%;

//   zindex: 8;
//   @media screen and (max-width: 768px) {
//     height: 40% !important;
//   }
// `;
// const limeOptions = { color: 'lime' };
// const covidIcon = new Icon({
//   iconUrl:
//     'https://raw.githubusercontent.com/Kalfreight-In/KalTires_new/4622c2c6940e5fc26a7eb95e48f3c42a7855014e/Assets/Images/iconMapMarker.svg',
//   iconSize: [25, 25],
// });
// const userIcon = new Icon({
//   iconUrl:
//     'https://raw.githubusercontent.com/Kalfreight-In/KalTires_new/478d02cff59c0d7439d979755f5172ea0a32fc9b/Assets/Images/userIcon.svg',
//   iconSize: [25, 25],
// });
const LeafMap = ({location}) => {
  // const isDesktop = useMediaQuery('(min-width:1148px)');
  // const { typeAddress, Currentlatlong } = useStateContext();
  // // console.log(
  // //   `changes in location inside the fetch from the context api${
  // //     Currentlatlong
  // //       ? [Currentlatlong.latitude, Currentlatlong.longitude]
  // //       : null
  // //   }`
  // // );
  // const mapRef = React.useRef(null);
  // const [maps, setMaps] = useState(null);

  // const [polyline, setpolyline] = useState(null);
  // const [currentPopup, setcurrentPopup] = useState(null);
  // const [office, setoffice] = useState(null);
  // let nearestlocationData = null;
  // const Polylines = [];
  // const DataS = [...Data, ...Data2];
  // const [officeListss, setofficeListss] = useState(DataS);
  // // console.log(`..........${officeListss[0]}`);
  // // console.log(`...........${location}`);
  // // function handleOnSerchResults(data) {
  // //   console.log('serch Results', data);
  // // }
  // useLayoutEffect(() => {
  //   if (maps) {
  //     setTimeout(() => {
  //       maps.flyTo(typeAddress || [40.8054, -99.0241], 9, {
  //         duration: 1,
  //       });
  //       // setTimeout(() => {
  //       //   maps.flyTo([40.8054, -99.0241], 9, {
  //       //     duration: 1,
  //       //   });
  //       // }, 2000);
  //       setTimeout(() => {
  //         maps.flyTo(nearestlocationData.geometry.coordinates, 9, {
  //           duration: 2,
  //         });
  //       }, 2000);
  //     }, 1000);
  //   }

  //   // console.log(`from inside the laef an  d using context ${typeAddress}`);
  //   if (typeAddress) {
  //     nearestlocationData = NearestLocation(typeAddress);
  //     console.log(`lol location${nearestlocationData.geometry.coordinates}`);
  //     Polylines.push(nearestlocationData.geometry.coordinates);
  //     const Adress = [typeAddress.lat, typeAddress.lng];
  //     Polylines.push(Adress);
  //     const ass = [Polylines];
  //     console.log(ass);
  //     setpolyline(ass);
  //     console.log(`polyyyyyline${Polylines}`);
  //   }
  // }, [typeAddress]);
  // useLayoutEffect(() => {
  //   // const control = geosearch();
  //   // control.addTo(MapContainer);
  //   // control.on('results', handleOnSerchResults);

  //   // console.log(`...........${maps}`);
  //   // if(office){
  //   //   Data.filter
  //   // }
  //   if (location) {
  //     const officeA = officeListss.filter(
  //       (off) => off.geometry.coordinates === location
  //     );
  //     // console.log(
  //     //   `popuop click in use effect ${officeA[0]}`
  //     // );
  //     setoffice(officeA[0]);
  //   }
  //   if (maps) {
  //     setTimeout(() => {
  //       maps.flyTo(location || [40.8054, -99.0241], isDesktop ? 5 : 4, {
  //         duration: 1,
  //       });
  //     }, 1000);
  //   }
  //   // return () => {
  //   //   control.off('results', handleOnSerchResults);
  //   // };
  // }, [location, maps]);
  // useLayoutEffect(() => {
  //   const query = window.location.search;
  //   const target = query.split('=')[1];
  //   if (window.location.search) {
  //     console.log(`lool${target}`);
  //     const element = document.getElementById(target);
  //     const headerOffset = 117;
  //     const elementPosition = element.getBoundingClientRect().top;
  //     const offsetPosition =
  //       elementPosition + window.pageYOffset - headerOffset;

  //     window.scrollTo({
  //       top: offsetPosition,
  //       behavior: 'smooth',
  //     });
  //   }
  // }, []);
  // const router = useRouter();
  // function scrollToTargetAdjusted(target) {
  //   if (window.location.pathname === '/') {
  //     router.push({ pathname: '/locations', query: { scroll: target } });
  //     return;
  //   }
  //   console.log(`lool${target}`);
  //   const element = document.getElementById(target);
  //   const headerOffset = 117;
  //   const elementPosition = element.getBoundingClientRect().top;
  //   const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  //   window.scrollTo({
  //     top: offsetPosition,
  //     behavior: 'smooth',
  //   });
  // }

  return (
    <MapInside id="map">
      <MapContainer
      
        // ref={setMaps}
        // dragging={!Browser.mobile}
        // // whenCreated={(map) => setMaps(map)}
        center={[40.8054, -99.0241]}
        zoom={ 13 }
        // ZoomControl={false}
        // scrollWheelZoom={false}
        className="lg:h-mapheightFull h-mapheightMob "
        style={{ width: '100%' }}
      >
          <ReactLeafletGoogleLayer apiKey='AIzaSyAn7MlgjpLEwzJ_o6CX--Ux7IL5bkPD39E' type={'satellite'} />
      </MapContainer>
    </MapInside>
  );
};

export default LeafMap;
