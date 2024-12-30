import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForward, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import './snakeGame.scss';

const snakeGame: React.FC = () => {
  const [gameBoardTopEnd, setGameBoardTopEnd] = useState(0);
  const [gameBoardRightEnd, setGameBoardRightEnd] = useState(0);
  const [gameBoardBottomEnd, setGameBoardBottomEnd] = useState(0);
  const [gameBoardLeftEnd, setGameBoardLeftEnd] = useState(0);
  const snakeDirection = useRef('right');
  const snakeLength = useRef(3);
  const food = useRef({ top: 100, left: 100 });
  const [score, setScore] = useState(0);

  let adjustSnakeBoardHeightWidth = () => {
    const gameArea = document.getElementById('snake-game');

    if (gameArea) {
      if (gameArea.offsetHeight == 0 || gameArea.offsetWidth == 0) {
        return;
      }

      let gameAreaHeight = gameArea.offsetHeight - 150 - 100;
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
        setGameBoardTopEnd(topBorder);
        setGameBoardRightEnd(rightBorder);
        setGameBoardBottomEnd(bottomBorder);
        setGameBoardLeftEnd(leftBorder);
      }
    }
  }

  useEffect(() => {
    setTimeout(() => {
      adjustSnakeBoardHeightWidth();
    }, 100);
  }, []);

  let startGame = () => {
    let lastTime = 0;
    let speed = 210; // Speed of snake (time between frames in ms)

    const gameLoop = (timestamp: number) => {
      // Calculate the time elapsed since the last frame
      const timeElapsed = timestamp - lastTime;

      // Only update the game state after the specified speed interval
      if (timeElapsed > speed) {
        lastTime = timestamp;

        const snake = document.getElementById("snake-0");
        if (snake) {
          let computedStyle = window.getComputedStyle(snake);
          let snakeTopCurr = parseFloat(computedStyle.top);
          let snakeLeftCurr = parseFloat(computedStyle.left);

          let snakeTopNew = snakeTopCurr;
          let snakeLeftNew = snakeLeftCurr;
          if (snakeDirection.current == 'up') {
            snakeTopNew = snakeTopCurr - 10;
            snakeLeftNew = snakeLeftCurr;
          } else if (snakeDirection.current == 'right') {
            snakeTopNew = snakeTopCurr;
            snakeLeftNew = snakeLeftCurr + 10;
          } else if (snakeDirection.current == 'down') {
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

              if (i == 0 && currentSnakeTop < gameBoardTopEnd || currentSnakeTop > gameBoardBottomEnd || currentSnakeLeft < gameBoardLeftEnd || currentSnakeLeft > gameBoardRightEnd) {
                reStartGame();
                return; // Stop the game if the snake hits the border
              }

              //Stop the game if the snake hits his self.
              if (i == 0) {
                for (let i = 1; i < snakeLength.current; i++) {
                  const snakeBody = document.getElementById('snake-' + i);
                  if (snakeBody) {
                    let snakeBodyComputedStyle = window.getComputedStyle(snakeBody);
                    let snakeBodyTop = parseFloat(snakeBodyComputedStyle.top);
                    let snakeBodyLeft = parseFloat(snakeBodyComputedStyle.left);

                    // If the body position matches snake head position, Game over.
                    if (snakeTopNew === snakeBodyTop && snakeLeftNew === snakeBodyLeft) {
                      reStartGame();
                      return;
                    }
                  }
                }
              }

              currentSnake.style.top = snakeTopNew + 'px';
              currentSnake.style.left = snakeLeftNew + 'px';

              if (i == 0 && food.current.top == snakeTopNew && food.current.left == snakeLeftNew) {
                const currentSnakeTail = document.getElementById('snake-' + (snakeLength.current - 1));
                const snakeDiv = document.getElementById('snake-div');
                if (currentSnakeTail && snakeDiv) {
                  let currentSnakeTailComputedStyle = window.getComputedStyle(currentSnakeTail);
                  let currentSnakeTailTop = parseFloat(currentSnakeTailComputedStyle.top);
                  let currentSnakeTailLeft = parseFloat(currentSnakeTailComputedStyle.left);

                  const newSnakeTail = document.createElement('div');
                  newSnakeTail.classList.add('snake');
                  newSnakeTail.id = 'snake-' + snakeLength.current;
                  newSnakeTail.style.top = currentSnakeTailTop + 'px';
                  newSnakeTail.style.left = currentSnakeTailLeft + 'px';
                  snakeDiv.appendChild(newSnakeTail);
                  snakeLength.current += 1;
                  updateFoodLocation(); // Generate new food
                }
              }
              snakeTopNew = currentSnakeTop;
              snakeLeftNew = currentSnakeLeft;
            }
          }
        }
      }

      // Continue the animation loop
      requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    requestAnimationFrame(gameLoop);
  };

  let updateFoodLocation = () => {
    let minTop = gameBoardTopEnd;
    let maxTop = gameBoardBottomEnd;
    let minLeft = gameBoardLeftEnd;
    let maxLeft = gameBoardRightEnd;

    if (minTop > maxTop || minLeft > maxLeft) {
      return;
    }

    let foodPositionValid = false;
    let randomTop = 0;
    let randomLeft = 0;

    // Keep generating food until it's placed in a valid position
    while (!foodPositionValid) {
      // Generate random food position
      randomTop = Math.floor(Math.random() * ((maxTop - minTop) / 10 + 1)) * 10 + minTop;
      randomLeft = Math.floor(Math.random() * ((maxLeft - minLeft) / 10 + 1)) * 10 + minLeft;

      // Check if the food collides with any snake block
      foodPositionValid = true; // Assume valid until proven otherwise

      for (let i = 0; i < snakeLength.current; i++) {
        const currentSnake = document.getElementById('snake-' + i);
        if (currentSnake) {
          let currentSnakeComputedStyle = window.getComputedStyle(currentSnake);
          let currentSnakeTop = parseFloat(currentSnakeComputedStyle.top);
          let currentSnakeLeft = parseFloat(currentSnakeComputedStyle.left);

          // If the food position matches any snake position, it's not valid
          if (currentSnakeTop === randomTop && currentSnakeLeft === randomLeft) {
            foodPositionValid = false;
            break;
          }
        }
      }
    }

    // If valid, update the food's position and increment the score
    food.current.top = randomTop;
    food.current.left = randomLeft;
    setScore((prevScore) => prevScore + 1); // Increment the score
  }

  let playGame = () => {
    const playContainer = document.getElementById('play-container');
    const snakeGame = document.getElementById('snake-game');
    if (playContainer && snakeGame) {
      playContainer.style.display = 'none';
      snakeGame.style.filter = 'none';
      startGame();
    }
  }

  let reStartGame = () => {
    window.location.reload();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Snake Game</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="play-container" id='play-container'>
          <button className="play-button" onClick={playGame}>
            <img src='public/play.png' className='play-Button-image'></img>
            Play
          </button>
        </div>
        <div className='snake-game' id='snake-game'>
          <div className='title'><img src="public/logo.png" className='logo' alt="logo" />SNAKE GAME</div>
          {/*Game area*/}
          <div className='snake-div' id='snake-div'>
            <div className='food' id='food' style={{ position: 'absolute', top: food.current.top, left: food.current.left }}></div>
            <div className='snake' id='snake-0'></div>
            <div className='snake' id='snake-1'></div>
            <div className='snake' id='snake-2'></div>
          </div>

          {/*Buttons*/}
          <div className='btn-div'>
            <IonButton className='up-btn' size="small" onClick={() => { snakeDirection.current != 'down' ? snakeDirection.current = 'up' : ''; }}>
              <IonIcon aria-hidden="true" icon={arrowUpOutline} />
            </IonButton>
            <div className='horizontal-btn-div'>
              <IonButton className='left-btn' size="small" onClick={() => { snakeDirection.current != 'right' ? snakeDirection.current = 'left' : ''; }}>
                <IonIcon aria-hidden="true" icon={arrowBack} />
              </IonButton>
              <div className='score-board'>{score}</div>
              <IonButton className='right-btn' size="small" onClick={() => { snakeDirection.current != 'left' ? snakeDirection.current = 'right' : ''; }}>
                <IonIcon aria-hidden="true" icon={arrowForward} />
              </IonButton>
            </div>
            <IonButton className='down-btn' size="small" onClick={() => { snakeDirection.current != 'up' ? snakeDirection.current = 'down' : ''; }}>
              <IonIcon aria-hidden="true" icon={arrowDownOutline} />
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default snakeGame;
