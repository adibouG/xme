import React from 'react';
import MapComponent from '../components/Map/Map.jsx';
import { useIonViewDidEnter,IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  const resizeEvent = () => window.dispatchEvent(new Event('resize'));


   useIonViewDidEnter(() => {
    console.log('useIonViewDidEnter')
    React.useLayoutEffect( () => {
     resizeEvent();
   } , [])
  })
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>X.me</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
       <MapComponent />   
      </IonContent>
    </IonPage>
  );
};

export default Home;
