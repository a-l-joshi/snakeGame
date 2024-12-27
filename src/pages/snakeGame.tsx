import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './snakeGame.scss';
import { arrowBack, arrowForward, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Snake Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div className='snake-game'>
          <div className='main-div'>
            <div className='snake-div'></div>
            <div className='btn-div'>
              <IonButton className='up-btn'>
                <IonIcon aria-hidden="true" icon={arrowUpOutline} />
              </IonButton>
              <IonButton className='left-btn'>
                <IonIcon aria-hidden="true" icon={arrowBack} />
              </IonButton>
              <IonButton className='down-btn'>
                <IonIcon aria-hidden="true" icon={arrowDownOutline} />
              </IonButton>
              <IonButton className='right-btn'>
                <IonIcon aria-hidden="true" icon={arrowForward} />
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
