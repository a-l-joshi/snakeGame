import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForward, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import './snakeGame.scss';

const snakeGame: React.FC = () => {

  const rendered = useRef(false);
  const [topEnd, setTopEnd] = useState(0);
  const [rightEnd, setRightEnd] = useState(0);
  const [bottomEnd, setBottomEnd] = useState(0);
  const [leftEnd, setLeftEnd] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const direction = useRef('');
  const [directionUpdated, setDirectionUpdated] = useState(false);
  const snakeLength = useRef(3);
  const food = useRef({ top: 100, left: 100 });
  const [score,setScore] = useState(0);

  let adjustSnakeBoardHeightWidth = () => {
    const gameArea = document.getElementById('snake-game');

    if (gameArea) {
      if (gameArea.offsetHeight == 0 || gameArea.offsetWidth == 0) {
        return;
      }

      let gameAreaHeight = gameArea.offsetHeight - 150;
      let gameAreaWidth = gameArea.offsetWidth - 20;

      let gameBoardHeight = Math.round(gameAreaHeight / 10) * 10;
      let gameBoardWidth = Math.round(gameAreaWidth / 10) * 10;

      const snakeDiv = document.getElementById('snake-div');
      if (snakeDiv) {
        // Apply the adjusted height and width back to the div
        snakeDiv.style.height = `${gameBoardHeight}px`;
        snakeDiv.style.width = `${gameBoardWidth}px`;

        //Set border of snake
        let topBorder = 0;
        let rightBorder = gameBoardWidth - 30;
        let bottomBorder = gameBoardHeight - 30;
        let leftBorder = 0;
        setTopEnd(topBorder);
        setRightEnd(rightBorder);
        setBottomEnd(bottomBorder);
        setLeftEnd(leftBorder);
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      adjustSnakeBoardHeightWidth();
      rendered.current = true;
    }, 100);
  }, []);

  let startGame = () => {

    const intervalId = setInterval(() => {
      const snake = document.getElementById("snake-0");
      if (snake) {
        let computedStyle = window.getComputedStyle(snake);
        let snakeTopCurr = parseFloat(computedStyle.top);
        let snakeLeftCurr = parseFloat(computedStyle.left);

        let snakeTopNew = snakeTopCurr;
        let snakeLeftNew = snakeLeftCurr;
        if (direction.current == 'up') {
          snakeTopNew = snakeTopCurr - 10;
          snakeLeftNew = snakeLeftCurr;
        } else if (direction.current == 'right') {
          snakeTopNew = snakeTopCurr;
          snakeLeftNew = snakeLeftCurr + 10;
        } else if (direction.current == 'down') {
          snakeTopNew = snakeTopCurr + 10;
          snakeLeftNew = snakeLeftCurr;
        } else {
          snakeTopNew = snakeTopCurr;
          snakeLeftNew = snakeLeftCurr - 10;
        }

        for (let i = 0; i < snakeLength.current; i++) {
          const currentSnake = document.getElementById('snake-' + i);
          if (currentSnake) {
            let currentSnakeComputedStyle = window.getComputedStyle(currentSnake);
            let currentSnakeTop = parseFloat(currentSnakeComputedStyle.top);
            let currentSnakeLeft = parseFloat(currentSnakeComputedStyle.left);

            if (currentSnakeTop < topEnd || currentSnakeTop > bottomEnd || currentSnakeLeft < leftEnd || currentSnakeLeft > rightEnd) {
              clearInterval(intervalId);
              return;
            }

            currentSnake.style.top = snakeTopNew + 'px';
            currentSnake.style.left = snakeLeftNew + 'px';

            if (i == 0 && food.current.top == snakeTopNew && food.current.left == snakeLeftNew) {
              const currentSnakeTail = document.getElementById('snake-' + (snakeLength.current - 1));
              const snakeDiv = document.getElementById('snake-div');
              if (currentSnakeTail && snakeDiv) {
                let currentSnakeTailComputedStyle = window.getComputedStyle(currentSnakeTail);
                let currentSnakeTailTop = parseFloat(currentSnakeComputedStyle.top);
                let currentSnakeTailLeft = parseFloat(currentSnakeComputedStyle.left);
                const newSnakeTail = document.createElement('div');
                newSnakeTail.classList.add('snake');
                newSnakeTail.id = 'snake-' + snakeLength.current;
                newSnakeTail.style.top = currentSnakeTailTop + 'px';
                newSnakeTail.style.left = currentSnakeTailLeft + 'px';
                snakeDiv.appendChild(newSnakeTail);
                snakeLength.current = snakeLength.current + 1;
                updateFoodLocation();
              }
            }
            snakeTopNew = currentSnakeTop;
            snakeLeftNew = currentSnakeLeft;
          }
        }
      }
    }, 400); // Snake speed
  }

  let updateFoodLocation = () => {
    let minTop = topEnd;
    let maxTop = bottomEnd;
    let minLeft = leftEnd;
    let maxLeft = rightEnd;

    if(minTop > maxTop || minLeft > maxLeft) {
      return;
    }

    //Generate random number
    const randomTop = Math.floor(Math.random() * ((maxTop - minTop) / 10 + 1)) * 10 + minTop;
    const randomLeft = Math.floor(Math.random() * ((maxLeft - minLeft) / 10 + 1)) * 10 + minLeft;

    food.current.top = randomTop;
    food.current.top = randomLeft;
    setScore((score) => { return score + 1 });
  }

  useEffect(() => {
    if (!gameStarted && direction.current != '') {
      setGameStarted(true);
      startGame();
    }
  }, [directionUpdated]);

  useEffect(() => {
    console.log(score);
  },[score])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Snake Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className='snake-game' id='snake-game'>
          {/*Game area*/}
          <div className='snake-div' id='snake-div'>
            <div className='food' id='food' style={{position: 'absolute', top: food.current.top, left: food.current.left}}></div>
            <div className='snake' id='snake-0'></div>
            <div className='snake' id='snake-1'></div>
            <div className='snake' id='snake-2'></div>
          </div>

          {/*Buttons*/}
          <div className='btn-div'>
            <IonButton className='up-btn' size="small" onClick={() => { direction.current = 'up'; setDirectionUpdated(!directionUpdated) }}>
              <IonIcon aria-hidden="true" icon={arrowUpOutline} />
            </IonButton>
            <div className='horizontal-btn-div'>
              <IonButton className='left-btn' size="small" onClick={() => { direction.current = 'left'; setDirectionUpdated(!directionUpdated) }}>
                <IonIcon aria-hidden="true" icon={arrowBack} />
              </IonButton>
              <div className='score-board'>{score}</div>
              <IonButton className='right-btn' size="small" onClick={() => { direction.current = 'right'; setDirectionUpdated(!directionUpdated) }}>
                <IonIcon aria-hidden="true" icon={arrowForward} />
              </IonButton>
            </div>
            <IonButton className='down-btn' size="small" onClick={() => { direction.current = 'down'; setDirectionUpdated(!directionUpdated) }}>
              <IonIcon aria-hidden="true" icon={arrowDownOutline} />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default snakeGame;
