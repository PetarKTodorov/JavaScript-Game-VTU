import { deepCopy, sleepAsync, getRandomInt } from '../common/functions.js';

// Game constants
const PLAYER_INDEX_IDENTIFICATOR = 1;
const WALL_INDEX_IDENTIFICATOR = 2;
const EXIT_INDEX_IDENTIFICATOR = 3;
const MOVE_DELAY_IN_MILLISECONDS = 1_000;
const DEFAULT_PLAYER_POSITION = { x: 0, y: 0 };
const DEFAULT_BOARD_SIZE = 3;
const GAME_OVER_WIN_MESSAGE = 'You win.';
const GAME_OVER_LOSE_MESSAGE = 'You lose.';

class Game {
    #playerPosition = deepCopy(DEFAULT_PLAYER_POSITION);
    #isGameOver = false;
    #board = null;
    #lastBoardMatrixIndex = null;
    #gameMessage = '';
    #htmlSelectors = null;

    constructor(HTMLSelectors, boardSize = DEFAULT_BOARD_SIZE) {
        this.#htmlSelectors = deepCopy(HTMLSelectors);
        this.#lastBoardMatrixIndex = boardSize - 1;
        this.board = boardSize;
        this.playerMoves = [];

        this.setMoveControlButtonsClickEventHandler();
        this.generateBoardHTML();
    }

    get board() {
        return this.#board;
    }

    set board(boardSize) {
        this.#board = Array(boardSize).fill().map(() => Array(boardSize).fill(0));

        // set player position
        this.#board[0][0] = PLAYER_INDEX_IDENTIFICATOR;

        // set exit position
        this.#board[this.#lastBoardMatrixIndex][this.#lastBoardMatrixIndex] = EXIT_INDEX_IDENTIFICATOR;

        // set wall position
        let firstWallIndex;
        let secondWallIndex;
        let isWallIndexesInvalid;

        do {
            firstWallIndex = getRandomInt(boardSize);
            secondWallIndex = getRandomInt(boardSize);

            isWallIndexesInvalid = ((firstWallIndex !== 0 || secondWallIndex !== 0)
                && (firstWallIndex !== this.#lastBoardMatrixIndex || secondWallIndex !== this.#lastBoardMatrixIndex)) == false;

        } while (isWallIndexesInvalid);

        this.#board[firstWallIndex][secondWallIndex] = WALL_INDEX_IDENTIFICATOR;
    }

    restoreDefaultProperties() {
        this.#playerPosition = deepCopy(DEFAULT_PLAYER_POSITION);
        this.#isGameOver = false;
        this.#gameMessage = '';
        this.playerMoves = [];
    }

    start() {
        this.setPlayButtonClickEventHandler();
    }

    setPlayButtonClickEventHandler() {
        const playButton = document.getElementById(this.#htmlSelectors.playButtonId);

        playButton.addEventListener('click', () => this.onClickPlayButtonHandler());
    }

    async onClickPlayButtonHandler() {
        for (let moveIndex = 0; moveIndex < this.playerMoves.length; moveIndex++) {
            this.paintCurrentMove(moveIndex);

            await sleepAsync(MOVE_DELAY_IN_MILLISECONDS);

            const move = this.playerMoves[moveIndex];

            const tempPlayerPosition = deepCopy(this.#playerPosition);

            switch (move) {
                case 'left':
                    tempPlayerPosition.x -= 1;
                    break;
                case 'up':
                    tempPlayerPosition.y -= 1;
                    break;
                case 'down':
                    tempPlayerPosition.y += 1;
                    break;
                case 'right':
                    tempPlayerPosition.x += 1;
                    break;
            }

            this.checkIsGameOver(tempPlayerPosition);

            if (this.#isGameOver) {
                this.showGameMessage();

                this.restoreDefaultProperties();
            }

            this.#playerPosition = deepCopy(tempPlayerPosition);
        }

        const isPlayerDontReachExit = this.#playerPosition.x !== this.#lastBoardMatrixIndex
            && this.#playerPosition.y !== this.#lastBoardMatrixIndex;

        if (isPlayerDontReachExit) {
            this.#isGameOver = true;
            this.#gameMessage = GAME_OVER_LOSE_MESSAGE;

            this.showGameMessage();

            this.restoreDefaultProperties();
        }
    }

    checkIsGameOver(player) {
        const isPlayerOutOfBoard = player.x < 0
            || player.y < 0
            || player.x > this.#lastBoardMatrixIndex
            || player.y > this.#lastBoardMatrixIndex;

        const isPlayerHitWall = isPlayerOutOfBoard || this.board[player.y][player.x] === WALL_INDEX_IDENTIFICATOR;
        const isPlayerReachExit = isPlayerOutOfBoard || this.board[player.y][player.x] === EXIT_INDEX_IDENTIFICATOR;

        if (isPlayerOutOfBoard || isPlayerHitWall || isPlayerReachExit) {
            this.#isGameOver = true;
            this.#gameMessage = GAME_OVER_LOSE_MESSAGE;

            if (isPlayerReachExit && !isPlayerOutOfBoard) {
                this.#gameMessage = GAME_OVER_WIN_MESSAGE;
            }
        }
    }

    showGameMessage() {
        const messageContainer = document.querySelector(this.#htmlSelectors.gameMessageContainerSelector);
        const messageTextContainer = messageContainer.querySelector(this.#htmlSelectors.gameMessageTextSelector);

        messageTextContainer.textContent = this.#gameMessage;
        messageContainer.style.display = 'block';
    }

    paintCurrentMove(currentMoveIndex) {
        const gameMovesNavigationContainer = document.querySelector(this.#htmlSelectors.gameMovesNavigationContainerSelector);
        const lastMove = document.querySelector('.' + this.#htmlSelectors.currentNavigationButtonClass);

        if (lastMove) {
            lastMove.classList.remove(this.#htmlSelectors.currentNavigationButtonClass);
        }

        const link = gameMovesNavigationContainer.children[currentMoveIndex].children[0];

        link.classList.add(this.#htmlSelectors.currentNavigationButtonClass);
    }

    setMoveControlButtonsClickEventHandler() {
        let controlButtons = document.querySelectorAll(this.#htmlSelectors.moveControlButtonsSelector);
        controlButtons = Array.from(controlButtons).filter((button) => button.getAttribute('id') != this.#htmlSelectors.playButtonId);

        controlButtons.forEach((button) => {
            const move = button.getAttribute(this.#htmlSelectors.moveAttribute);

            button.addEventListener('click', () => this.onClickControlsButtonHandler(move));
        });
    }

    onClickControlsButtonHandler(move) {
        this.playerMoves.push(move);

        this.addMoveToNavigation(move);
    }

    addMoveToNavigation(move) {
        const gameMovesNavigationContainer = document.querySelector(this.#htmlSelectors.gameMovesNavigationContainerSelector);

        const htmlMove = this.generateMoveHTML(move);

        gameMovesNavigationContainer.appendChild(htmlMove);
    }

    generateMoveHTML(move) {
        let iconArrowClass = 'arrow--';

        switch (move) {
            case 'left': iconArrowClass += move; break;
            case 'up': iconArrowClass = null; break;
            case 'down': iconArrowClass += move; break;
            case 'right': iconArrowClass += move; break;

            default: console.error(`Move ${move} is not recognized.`); break;
        }

        const link = `
            <a href="#" class="controls__link">
                <span class="icon-svg-wrapper">
                    <svg class="icon-svg ${iconArrowClass}">
                        <use href="./assets/images/html/icons/svg-s/icon-sprite.svg#icon-arrow-up"></use>
                    </svg>
                </span>
            </a>
        `;

        const movelistItem = document.createElement('li');
        movelistItem.className = 'controls__item';

        movelistItem.innerHTML = link;

        return movelistItem;
    }

    generateBoardHTML() {
        const boardHTML = document.querySelector(this.#htmlSelectors.gameBoardSelector);
        const gridStyle = `repeat(${this.board.length}, 10rem)`;

        boardHTML.style.gridTemplateColumns = gridStyle;
        boardHTML.style.gridTemplateRows = gridStyle;

        for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
            const row = this.board[rowIndex];

            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                const boardElement = this.board[rowIndex][columnIndex];

                const boradFieldHTML = document.createElement('div');
                let boradFieldHTMLClassName = 'game__field';

                if (boardElement === PLAYER_INDEX_IDENTIFICATOR) {
                    boradFieldHTMLClassName += ` ${boradFieldHTMLClassName}--player`;
                } else if (boardElement === WALL_INDEX_IDENTIFICATOR) {
                    boradFieldHTMLClassName += ` ${boradFieldHTMLClassName}--wall`;
                } else if (boardElement === EXIT_INDEX_IDENTIFICATOR) {
                    boradFieldHTMLClassName += ` ${boradFieldHTMLClassName}--exit`;
                }

                boradFieldHTML.className = boradFieldHTMLClassName;

                boardHTML.appendChild(boradFieldHTML);
            }
        }
    }
}

export default Game;