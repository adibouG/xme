import React from 'react';
import { useIonViewDidEnter,IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import MapComponent from '../components/Map/Map.jsx';
import Toolbar from '../components/Toolbar/Toolbar';
import './Home.css';
const APPTITLE = import.meta.env.VITE_APP_TITLE || 'X.me';


const Home: React.FC = () => {
  const resizeEvent = () => window.dispatchEvent(new Event('resize'));
  useIonViewDidEnter(() => {
    console.log('useIonViewDidEnter')
    React.useLayoutEffect(() => {
      resizeEvent();
      return;
    }, [])
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
       <MapComponent  />   
      </IonContent>
    </IonPage>
  );
};

export default Home;
