import Game from './game/game.js';

(() => {
    const neededGameHTMLSelectors = {
        moveControlButtonsSelector: '.application__header .controls__list .controls__link',
        playButtonId: 'play-button',
        moveAttribute: 'data-move',
        gameMovesNavigationContainerSelector: '.game__moves-navigation .controls--in-game .controls__list',
        currentNavigationButtonClass: 'controls__link--active',
        gameBoardSelector: '.game__board',
        gameMessageContainerSelector: '.message',
        gameMessageTextSelector: '.message__text',
    }

    const boardSize = 3;

    const game = new Game(neededGameHTMLSelectors, boardSize);

    game.start();
})();