import React, { useEffect } from 'react';
import { useIonViewWillEnter ,useIonViewDidEnter,IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import MapComponent from '../components/Map/Map.jsx';
import Toolbar from '../components/Toolbar/Toolbar';
import { getDeviceLocation, lastLocationWatch } from '../Helpers/GeoLoc/GeoLoc.js';
import { getDeviceType } from '../Helpers/Device/Device.js';
import './Home.css';
const APPTITLE = import.meta.env.VITE_APP_TITLE || 'X.me';


const Home: React.FC = () => {
  const [deviceType, setDeviceType] = React.useState("");
  const [deviceLocation, setDeviceLocation] = React.useState({
    timestamp: 0,
    coords: {
      lng: null,
      lat: null
    }
  });

  const resizeEvent = () => window.dispatchEvent(new Event('resize'));
  
 const getDeviceData = async () => {
    const devLocation = await getDeviceLocation();
    console.log('devLocation: ', devLocation);  
    if (!devLocation) return ;
    else if (!deviceLocation.coords.lng || !deviceLocation.coords.lat) setDeviceLocation(devLocation);
  }

  
  React.useLayoutEffect(() => {
    getDeviceData();
  }, [])

  useIonViewWillEnter(() => {
    console.log('useIonViewWillEnter')
    getDeviceData();
  })

  useIonViewDidEnter(() => {
    console.log('useIonViewDidEnter')
    resizeEvent();
  })
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{APPTITLE}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
       <Toolbar />
     
       <MapComponent key={`${deviceLocation.timestamp}`} 
                    myPos={deviceLocation} 
                    mapCenterLat={deviceLocation.coords.lat} 
                    mapCenterLng={deviceLocation.coords.lng} 
                    zoomValue={17}
                    markerPositions={[]} 
                  
        /> 
       
      </IonContent>
    </IonPage>
  );
};

export default Home;
