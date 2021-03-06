function initGame() {
    const playerMoves = [];

    function setMoveControlButtonsClickEventHandler() {
        let controlButtons = document.querySelectorAll('.application__header .controls__list .controls__link');
        controlButtons = Array.from(controlButtons).filter((button) => button.getAttribute('id') != 'play-button');

        controlButtons.forEach((button) => {
            const move = button.getAttribute('data-move');

            button.addEventListener('click', () => onClickControlsButtonHandler(move));
        });
    }

    function onClickControlsButtonHandler(move) {
        playerMoves.push(move);

        addMoveToNavigation(move);
    }

    function addMoveToNavigation(move) {
        const gameMovesNavigationContainer = document.querySelector('.game__moves-navigation .controls--in-game .controls__list');

        const htmlMove = generateMoveHTML(move);

        gameMovesNavigationContainer.appendChild(htmlMove);
    }

    function generateMoveHTML(move) {
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

        movelistItem.innerHTML = link

        return movelistItem;
    }

    setMoveControlButtonsClickEventHandler();
}

export default initGame;