import React from 'react';
import { useIonViewWillEnter ,useIonViewDidEnter,IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import MapComponent from '../components/Map/Map.jsx';
import Toolbar from '../components/Toolbar/Toolbar';
import { getDeviceLocation, lastLocationWatch } from '../Helpers/GeoLoc/GeoLoc.js';
import { getDeviceType } from '../Helpers/Device/Device.js';
import './Home.css';
const APPTITLE = import.meta.env.VITE_APP_TITLE || 'X.me';


const Home: React.FC = () => {
  const [deviceType, setDeviceType] = React.useState(null);
  const [deviceLocation, setDeviceLocation] = React.useState(null);

  const resizeEvent = () => window.dispatchEvent(new Event('resize'));
  
  const getDeviceData = async () => {
    const deviceLocation = await getDeviceLocation();
    setDeviceLocation(deviceLocation);
    const deviceType = await getDeviceType();
    setDeviceType(deviceLocation);
  }
  
  React.useLayoutEffect(() => {
    resizeEvent();
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
       <MapComponent myPos={false} mapCenterValue={false} 
                    zoomValue={17}
                    markerPositions={[]} 
        />   
      </IonContent>
    </IonPage>
  );
};

export default Home;
