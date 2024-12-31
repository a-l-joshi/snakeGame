import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForward, arrowDownOutline, arrowUpOutline } from 'ionicons/icons';
import { useEffect, useRef, useState } from 'react';
import './snakeGame.scss';

const snakeGame: React.FC = () => {
  //Game board borders.
  const [gameBoardTopEnd, setGameBoardTopEnd] = useState(0);
  const [gameBoardRightEnd, setGameBoardRightEnd] = useState(0);
  const [gameBoardBottomEnd, setGameBoardBottomEnd] = useState(0);
  const [gameBoardLeftEnd, setGameBoardLeftEnd] = useState(0);

  //Sanke direction manager. Tip - Used useRef beacuse upadted state not accessable in gameLoop. 
  const snakeDirection = useRef('right');

  //Length of snake. Initially 3 //Head-Body-Tail.
  const snakeLength = useRef(3);

  //Food for snake.
  const food = useRef({ top: 100, left: 100 });

  //Game score.
  const [score, setScore] = useState(0);

  //Create snake board dynamically according to screen size.
  let createSnakeBoard = () => {
    const gameArea = document.getElementById('snake-game'); //Main div.

    if (gameArea) {
      if (gameArea.offsetHeight == 0 || gameArea.offsetWidth == 0) {
        return; //If not loaded.
      }

      let gameAreaHeight = gameArea.offsetHeight - 150 - 100; //gameArea.offsetHeight - Buttons height - Title height;
      let gameAreaWidth = gameArea.offsetWidth - 20; //gameArea.offsetWidth - Left,Right Padding;

      //Number divisible by 10 because snake is 10*10.
      let gameBoardHeight = Math.round(gameAreaHeight / 10) * 10;
      let gameBoardWidth = Math.round(gameAreaWidth / 10) * 10;

      const gameBoard = document.getElementById('game-board');
      if (gameBoard) {
        // Apply the calculated height and width to the game board.
        gameBoard.style.height = `${gameBoardHeight}px`;
        gameBoard.style.width = `${gameBoardWidth}px`;

        //Set borders of snake board
        let topBorder = 0;
        let rightBorder = gameBoardWidth - 30; //gameBoardWidth - Right,Left margin;
        let bottomBorder = gameBoardHeight - 30; //gameBoardHeight - Top,Bottom margin;
        let leftBorder = 0;

        setGameBoardTopEnd(topBorder);
        setGameBoardRightEnd(rightBorder);
        setGameBoardBottomEnd(bottomBorder);
        setGameBoardLeftEnd(leftBorder);
      }
    }
  }

  let startGame = () => {
    let lastTime = 0;
    let speed = 210; // Speed of snake (time between frames in ms)

    const gameLoop = (timestamp: number) => {
      // Calculate the time elapsed since the last frame
      const timeElapsed = timestamp - lastTime;

      // Only update the game state after the specified speed interval
      if (timeElapsed > speed) {
        lastTime = timestamp;

        const snakeHead = document.getElementById("snake-0");
        if (snakeHead) {
          //Get current dimensions of snake head.
          let computedStyle = window.getComputedStyle(snakeHead);
          let snakeTopCurr = parseFloat(computedStyle.top);
          let snakeLeftCurr = parseFloat(computedStyle.left);

          let snakeTopNew = snakeTopCurr;
          let snakeLeftNew = snakeLeftCurr;

          //Update snake head dimensions according to direction.
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

          //Update snake all body part location. (Head -> New location/ Body -> head/ Tail -> Body).
          for (let i = 0; i < snakeLength.current; i++) {
            const currentSnake = document.getElementById('snake-' + i);
            if (currentSnake) {
              //Save curren dimensions of snake part to assign his previous part.
              let currentSnakeComputedStyle = window.getComputedStyle(currentSnake);
              let currentSnakeTop = parseFloat(currentSnakeComputedStyle.top);
              let currentSnakeLeft = parseFloat(currentSnakeComputedStyle.left);

              if (i == 0 && snakeTopNew < gameBoardTopEnd || snakeTopNew > gameBoardBottomEnd || snakeLeftNew < gameBoardLeftEnd || snakeLeftNew > gameBoardRightEnd) {
                reStartGame();
                return; // Stop the game if the snake hits the border.
              }

              //Stop the game if the snake hits his self.
              if (i == 0) { //Check for sanke head only. You know why. -__-
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

              //Update snake location.
              currentSnake.style.top = snakeTopNew + 'px';
              currentSnake.style.left = snakeLeftNew + 'px';

              //If snake eat food.
              if (i == 0 && food.current.top == snakeTopNew && food.current.left == snakeLeftNew) {
                const currentSnakeTail = document.getElementById('snake-' + (snakeLength.current - 1));
                const gameBoard = document.getElementById('game-board');
                if (currentSnakeTail && gameBoard) {
                  let currentSnakeTailComputedStyle = window.getComputedStyle(currentSnakeTail);
                  let currentSnakeTailTop = parseFloat(currentSnakeTailComputedStyle.top);
                  let currentSnakeTailLeft = parseFloat(currentSnakeTailComputedStyle.left);

                  //Create new snake tail and assign dimensions of current snake tail. Inshort increase snake.
                  const newSnakeTail = document.createElement('div');
                  newSnakeTail.classList.add('snake');
                  newSnakeTail.id = 'snake-' + snakeLength.current;
                  newSnakeTail.style.top = currentSnakeTailTop + 'px';
                  newSnakeTail.style.left = currentSnakeTailLeft + 'px';
                  gameBoard.appendChild(newSnakeTail);
                  snakeLength.current += 1;

                  // Generate new food
                  createNewFood();
                }
              }
              //update snake new dimensions as current snake dimensions for next body part to take his place.
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

  let createNewFood = () => {
    //Max dimensions to generate food.
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

    setScore((prevScore) => prevScore + 1);

    let highScore = Number(localStorage.getItem('highScore') || 0);
    let currentScore = snakeLength.current - 3; //Score state latest value is not accessable in game loop.
    if(currentScore > highScore) {
      localStorage.setItem('highScore','' +currentScore);
    }
  }

  //On click of play button hide play button and start game.
  let playGame = () => {
    const playContainer = document.getElementById('play-container');
    const snakeGame = document.getElementById('snake-game');
    if (playContainer && snakeGame) {
      playContainer.style.display = 'none';
      snakeGame.style.filter = 'none';
      startGame();
    }
  }

  // Restart game.
  let reStartGame = () => {
    const restartContainer = document.getElementById('restart-container');
    const snakeGame = document.getElementById('snake-game');
    if (restartContainer && snakeGame) {
      restartContainer.style.display = 'block';
      snakeGame.style.filter = 'blur(5px)';
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }

  //Create snakeBoard with 100ms delay because div is not rendered initially.
  useEffect(() => {
    setTimeout(() => {
      createSnakeBoard();
    }, 100);
  }, []);

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
        <div className="restart-container" id='restart-container'>
          <div className='your-score'>Your score : {score}</div>
          <div className='high-score'>High score : {localStorage.getItem('highScore') || 0 }</div>
        </div>
        <div className='snake-game' id='snake-game'>
          <div className='title'><img src="public/logo.png" className='logo' alt="logo" />SNAKE GAME</div>
          {/*Game area*/}
          <div className='game-board' id='game-board'>
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
