/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Velonimo implementation : © Oliver THEBAULT (a.k.a. Oliboy50)
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * velonimo.js
 *
 * Velonimo user interface script
 *
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

/**
 * Velonimo JS coding rules
 *
 * Since this JS file is not transpiled,
 * we cannot use the latest ecmascript features,
 * so we target the following browsers:
 *  - "Edge" 15+
 *  - "Firefox" 54+
 *  - "Chrome" 51+
 *  - "Safari" 10+
 *  - "Opera" 38+
 *  - "Opera Mobile" 64+
 *  - "Samsung Internet" 5+
 *
 * Use https://caniuse.com/ to see if you can use a feature.
 */

// Cards color ID
const COLOR_BLUE = 10;
const COLOR_BROWN = 20;
const COLOR_GRAY = 30;
const COLOR_GREEN = 40;
const COLOR_PINK = 50;
const COLOR_RED = 60;
const COLOR_YELLOW = 70;
const COLOR_ADVENTURER = 80;

// Cards value
const VALUE_1 = 1;
const VALUE_2 = 2;
const VALUE_3 = 3;
const VALUE_4 = 4;
const VALUE_5 = 5;
const VALUE_6 = 6;
const VALUE_7 = 7;
const VALUE_25 = 25;
const VALUE_30 = 30;
const VALUE_35 = 35;
const VALUE_40 = 40;
const VALUE_45 = 45;
const VALUE_50 = 50;

// Jersey value
const JERSEY_VALUE = 10;

// DOM IDs
const DOM_ID_APP = 'velonimo-game';
const DOM_ID_BOARD = 'board';
const DOM_ID_BOARD_CARPET = 'board-carpet';
const DOM_ID_PLAYER_HAND = 'my-hand';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON = 'toggle-sort-button';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL = 'toggle-sort-button-label';
const DOM_ID_CURRENT_ROUND = 'current-round';
const DOM_ID_ACTION_BUTTON_PLAY_CARDS = 'action-button-play-cards';
const DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY = 'action-button-play-cards-with-jersey';
const DOM_ID_ACTION_BUTTON_PASS_TURN = 'action-button-pass-turn';
const DOM_ID_ACTION_BUTTON_SELECT_PLAYER = 'action-button-select-player';
const DOM_ID_ACTION_BUTTON_GIVE_CARDS = 'action-button-give-cards';

// DOM classes
const DOM_CLASS_PLAYER_TABLE = 'player-table'
const DOM_CLASS_PLAYER_IS_WEARING_JERSEY = 'is-wearing-jersey'
const DOM_CLASS_PLAYER_HAS_USED_JERSEY = 'has-used-jersey'
const DOM_CLASS_CARDS_STACK = 'cards-stack'
const DOM_CLASS_DISABLED_ACTION_BUTTON = 'disabled'
const DOM_CLASS_ACTIVE_PLAYER = 'active'
const DOM_CLASS_SELECTABLE_PLAYER = 'selectable'
const DOM_CLASS_NON_SELECTABLE_CARD = 'non-selectable-player-card'

// Player hand sorting modes
const PLAYER_HAND_SORT_BY_COLOR = 'color';
const PLAYER_HAND_SORT_BY_VALUE = 'value';

// Style
const BOARD_CARPET_WIDTH = 740;
const BOARD_CARPET_HEIGHT = 450;
const CARD_WIDTH = 90;
const CARD_HEIGHT = 126;
const PLAYER_TABLE_WIDTH = 130;
const PLAYER_TABLE_HEIGHT = 130;
const PLAYER_TABLE_BORDER_SIZE = 2;
const MARGIN_BETWEEN_PLAYERS = 20;
const TABLE_STYLE_HORIZONTAL_LEFT = `left: ${MARGIN_BETWEEN_PLAYERS}px;`;
const TABLE_STYLE_HORIZONTAL_CENTER = `left: ${(BOARD_CARPET_WIDTH / 2) - (PLAYER_TABLE_WIDTH / 2) - (MARGIN_BETWEEN_PLAYERS / 2)}px;`;
const TABLE_STYLE_HORIZONTAL_RIGHT = `right: ${MARGIN_BETWEEN_PLAYERS}px;`;
const TABLE_STYLE_VERTICAL_TOP = `top: ${MARGIN_BETWEEN_PLAYERS}px;`;
const TABLE_STYLE_VERTICAL_BOTTOM = `bottom: ${MARGIN_BETWEEN_PLAYERS}px;`;
const CARDS_STYLE_ABOVE_TABLE = `top: -${CARD_HEIGHT + PLAYER_TABLE_BORDER_SIZE}px; left: -${PLAYER_TABLE_BORDER_SIZE}px;`;
const CARDS_STYLE_BELOW_TABLE = `bottom: -${CARD_HEIGHT + PLAYER_TABLE_BORDER_SIZE}px; left: -${PLAYER_TABLE_BORDER_SIZE}px;`;
// the current player (index 0 == current player) place is always at the bottom of the board, in a way that players always stay closed to their hand
const PLAYERS_PLACES_BY_NUMBER_OF_PLAYERS = {
    2: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
    },
    3: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
    },
    // @TODO: place player 1 and player 3 at the center left and the center right
    //        and move their played cards to the right and the left respectively
    4: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
    },
    // @TODO: place player 1 and player 4 at the center left and the center right
    //        and move their played cards to the right and the left respectively
    //        + place player 2 and 3 at the top middle-left and top middle-right respectively
    5: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            cardsStyle: CARDS_STYLE_BELOW_TABLE,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
        4: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            cardsStyle: CARDS_STYLE_ABOVE_TABLE,
        },
    },
};

// @TODO: improve current round display
// @TODO: show cards in logs (especially the cards picked/gave for the impacted players)
// @TODO: color player names (logs, action messages)
// @TODO: support 2 players game
// @TODO: ? game rounds topology instead of choosing number of rounds
// @TODO: ? be able to move cards individually in your hand
// @TODO: ? add the winner in the end of round log
// @TODO: ? be able to click on the jersey to play it instead of having a 2nd button
// @TODO: ? improve the visibility of the jersey that has been played with the combination on the table
define([
    'dojo','dojo/_base/declare',
    'ebg/core/gamegui',
    'ebg/counter',
    'ebg/stock',
],
function (dojo, declare) {
    return declare('bgagame.velonimo', ebg.core.gamegui, {
        constructor: function () {
            this.currentState = null;
            this.currentRound = -1;
            this.currentPlayerHasJersey = false;
            this.jerseyHasBeenUsedInTheCurrentRound = false;
            this.howManyRounds = -1;
            this.playedCardsValue = -1;
            this.howManyCardsToGiveBack = -1;
            this.players = [];
            this.playerHand = null; // https://en.doc.boardgamearena.com/Stock
        },
        setup: function (gamedatas) {
            this.currentState = gamedatas.gamestate.name;
            this.currentRound = gamedatas.currentRound;
            this.jerseyHasBeenUsedInTheCurrentRound = gamedatas.jerseyHasBeenUsedInTheCurrentRound;
            this.howManyRounds = gamedatas.howManyRounds;

            // Setup board
            dojo.place(
                `<div id="${DOM_ID_BOARD}">
    <div id="${DOM_ID_BOARD_CARPET}"></div>
    <div id="game-info" class="player-board">
        <div id="${DOM_ID_CURRENT_ROUND}"></div>
    </div>
</div>
<div id="my-hand-wrapper" class="whiteblock">
    <div id="my-hand-title-wrapper">
        <h3 id="my-hand-title">${_('My hand')}</h3>
        <a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON}" class="bgabutton bgabutton_gray"><span id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL}"></span></a>
    </div>
    <div id="${DOM_ID_PLAYER_HAND}"></div>
</div>`,
                DOM_ID_APP
            );

            // Setup players
            this.players = gamedatas.players;
            const howManyPlayers = Object.keys(this.players).length;
            const playersPlace = PLAYERS_PLACES_BY_NUMBER_OF_PLAYERS[howManyPlayers];
            this.sortPlayersToHaveTheCurrentPlayerFirstIfPresent(
                this.sortPlayersByTurnOrderPosition(Object.entries(this.players).map((entry) => entry[1])),
                gamedatas.currentPlayerId
            ).forEach((player, index) => {
                const playerPosition = playersPlace[index];

                dojo.place(
                    `<div id="player-table-${player.id}" class="player-table" style="${playerPosition.tableStyle}">
    <div id="player-table-${player.id}-name" class="player-table-name" style="color:#${player.color}">${(player.name.length > 10 ? (player.name.substr(0,10) + '...') : player.name)}</div>
    <div id="player-table-${player.id}-hand" class="player-table-hand"><span id="player-table-${player.id}-number-of-cards" class="number-of-cards">${player.howManyCards}</span></div>
    <div id="player-table-${player.id}-cards" class="player-table-cards" style="${playerPosition.cardsStyle}"></div>
    <div id="player-table-${player.id}-jersey" class="player-table-jersey"><span class="jersey-overlay"></span></div>
</div>`,
                    DOM_ID_BOARD_CARPET);
            });
            this.setupNumberOfCardsInPlayersHand();

            // @TODO: support spectators (do not show "my hand" in this case)
            // Init playerHand "ebg.stock" component
            this.playerHand = new ebg.stock();
            this.playerHand.create(this, $(DOM_ID_PLAYER_HAND), CARD_WIDTH, CARD_HEIGHT);
            this.playerHand.setSelectionAppearance('class');
            this.playerHand.image_items_per_row = 7;
            // create cards
            const cardsImageUrl = g_gamethemeurl+'img/cards.png';
            this.execFnForEachCardsInGame((color, value) => {
                const cardPositionInSprite = this.getCardPositionInSpriteByColorAndValue(color, value);
                this.playerHand.addItemType(
                    cardPositionInSprite, // stock item ID
                    cardPositionInSprite, // card weight (used for sorting)
                    cardsImageUrl, // sprite URL
                    cardPositionInSprite // position in sprite
                );
            });
            // sort cards
            this.onClickOnTogglePlayerHandSortButton();
            dojo.connect($(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON), 'onclick', this, 'onClickOnTogglePlayerHandSortButton');


            // Setup currentPlayer cards
            dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged');
            this.addCardsToPlayerHand(gamedatas.currentPlayerCards);

            // Setup cards played on table
            this.playedCardsValue = gamedatas.playedCardsValue;
            this.moveCardsFromPlayerHandToTable(gamedatas.playedCardsPlayerId, gamedatas.playedCards);

            // Setup jersey
            if (gamedatas.jerseyHasBeenUsedInTheCurrentRound) {
                this.useJerseyForCurrentRound();
            } else {
                this.restoreJerseyForCurrentRound();
            }
            this.moveJerseyToCurrentWinner();

            // Setup extra info
            this.setupPlayersScore();
            this.setupRoundsInfo();

            // Setup game notifications to handle
            this.setupNotifications();
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        ///////////////////////////////////////////////////
        onEnteringState: function (state, data) {
            this.currentState = state;
            switch (state) {
                case 'firstPlayerTurn':
                case 'playerTurn':
                    // show active player
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);
                    break;
                case 'playerSelectNextPlayer':
                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectNextPlayer);
                    break;
                case 'playerSelectPlayerToPickCards':
                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectPlayerToPickCards);
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    // show active player
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.howManyCardsToGiveBack = data.args.numberOfCards;

                    if (this.isCurrentPlayerActive()) {
                        this.unselectAllCards();
                    }
                    break;
            }
        },
        onLeavingState: function (state) {
            // hide active player
            dojo.query(`.${DOM_CLASS_PLAYER_TABLE}`).removeClass(DOM_CLASS_ACTIVE_PLAYER);

            // do special things for state
            switch (state) {
                case 'playerSelectNextPlayer':
                case 'playerSelectPlayerToPickCards':
                    Object.entries(this.players).forEach((entry) => {
                        const player = entry[1];
                        dojo.removeClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                        this.disconnect($(`player-table-${player.id}`), 'onclick');
                    });
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    this.howManyCardsToGiveBack = -1;
                    break;
            }

            // reset currentState
            this.currentState = null;
        },
        onUpdateActionButtons: function (state, args) {
            this.removeActionButtons();

            if (!this.isCurrentPlayerActive()) {
                return;
            }

            switch (state) {
                case 'firstPlayerTurn':
                    this.setupPlayCardsActionButton();
                    break;
                case 'playerTurn':
                    this.addActionButton(DOM_ID_ACTION_BUTTON_PASS_TURN, _('Pass'), 'onPassTurn');
                    // check if player can play or auto-pass its turn
                    if (!this.currentPlayerCanPlayCards()) {
                        // click on "Pass" after either 5, 6, 7, 8 or 9 seconds
                        this.clickActionButtonAfterAFewSeconds(DOM_ID_ACTION_BUTTON_PASS_TURN, Math.floor((Math.random() * 5) + 5));
                    } else {
                        this.setupPlayCardsActionButton();
                    }
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    this.setupGiveCardsBackAfterPickingActionButton();
                    break;
            }
        },
        onPlayerHandSelectionChanged: function (controlName, itemId) {
            if (typeof itemId === 'undefined') {
                return;
            }
            const isCurrentPlayerActive = this.isCurrentPlayerActive();

            if (
                isCurrentPlayerActive
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                this.setupGiveCardsBackAfterPickingActionButton();
                return;
            }

            // cards combo helper (disable cards that cannot be played with current selection)
            const cardId = parseInt(itemId, 10);
            if (this.playerHand.isSelected(cardId)) {
                this.onPlayerCardSelected(cardId);
            } else {
                this.onPlayerCardUnselected(cardId);
            }

            switch (this.currentState) {
                case 'firstPlayerTurn':
                case 'playerTurn':
                    if (isCurrentPlayerActive) {
                        this.setupPlayCardsActionButton();
                    }
                    break;
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods
        ///////////////////////////////////////////////////
        /**
         * @param {string} action
         * @param {Object} data
         */
        requestAction: function (action, data) {
            if (
                typeof data !== 'object'
                || data.hasOwnProperty('lock')
                || data.hasOwnProperty('action')
                || data.hasOwnProperty('module')
                || data.hasOwnProperty('class')
            ) {
                console.error('[requestAction] Invalid data');
                return;
            }

            this.ajaxcall(
                `/velonimo/velonimo/${action}.html`,
                Object.assign({}, data, { lock: true }),
                this,
                () => {}
            );
        },
        /**
         * Return true if:
         *  - the current player is spectator
         *  - the current player is in replay mode
         *  - the game has ended (a.k.a. archive mode)
         *
         * @see https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js
         *
         * @returns {boolean}
         */
        isReadOnly() {
            return this.isSpectator || typeof g_replayFrom !== 'undefined' || g_archive_mode;
        },
        /**
         * Setup a countdown to automatically click on an action button after a few seconds.
         *
         * @see https://github.com/bga-devs/tisaac-boilerplate/blob/master/modules/js/Core/game.js#L251-L297
         *
         * @param {string} buttonId
         * @param {number} howManySeconds
         */
        clickActionButtonAfterAFewSeconds: function (buttonId, howManySeconds) {
            const button = $(buttonId);
            if (!button || this.isReadOnly()) {
                return;
            }

            this._actionTimerLabel = button.innerHTML;
            this._actionTimerSeconds = howManySeconds;
            this._actionTimerFunction = () => {
                const button = $(buttonId);
                if (!button) {
                    this.clearTimerForClickActionButtonAfterAFewSeconds();
                    return;
                }
                if (this._actionTimerSeconds-- > 1) {
                    button.innerHTML = `${this._actionTimerLabel} (${this._actionTimerSeconds})`;
                    return;
                }

                button.click();
                this.clearTimerForClickActionButtonAfterAFewSeconds();
            };
            this._actionTimerFunction();
            this._actionTimerId = setInterval(this._actionTimerFunction, 1000);
        },
        clearTimerForClickActionButtonAfterAFewSeconds: function () {
            if (this._actionTimerId) {
                clearInterval(this._actionTimerId);
                delete this._actionTimerId;
            }
        },
        setupRoundsInfo: function () {
            $(DOM_ID_CURRENT_ROUND).innerHTML = `${this.currentRound} / ${this.howManyRounds}`;
        },
        setupNumberOfCardsInPlayersHand: function () {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                $(`player-table-${player.id}-number-of-cards`).innerHTML = player.howManyCards;
            });
        },
        setupPlayersScore: function () {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                if (this.scoreCtrl.hasOwnProperty(player.id)) {
                    this.scoreCtrl[player.id].toValue(player.score);
                }
            });
        },
        /**
         * @param {number?} currentJerseyWearerId
         */
        moveJerseyToCurrentWinner: function (currentJerseyWearerId) {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                if (player.isWearingJersey) {
                    this.currentPlayerHasJersey = this.player_id === player.id;

                    if (!dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY)) {
                        if (currentJerseyWearerId) {
                            // move jersey from player A to player B,
                            // then add isWearingJersey class to player B at the end of the animation
                            const animation = this.slideTemporaryObject(
                                `<div class="moving-jersey"></div>`,
                                `player-table-${currentJerseyWearerId}-jersey`,
                                DOM_ID_BOARD,
                                `player-table-${player.id}-jersey`
                            );
                            dojo.connect(animation, 'onEnd', () => dojo.addClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY));
                            animation.play();
                        } else {
                            dojo.addClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY);
                        }
                    }
                } else {
                    if (dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY)) {
                        dojo.removeClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY);
                    }
                }
            });
        },
        /**
         * @returns {number|undefined}
         */
        getCurrentJerseyWearerIdIfExists: function () {
            const players = Object.entries(this.players);
            for (let i = 0; i < players.length; i++) {
                const player = players[i][1];
                if (player.isWearingJersey) {
                    return player.id;
                }
            }

            return undefined;
        },
        useJerseyForCurrentRound: function () {
            this.jerseyHasBeenUsedInTheCurrentRound = true;

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                if (
                    player.isWearingJersey
                    && !dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_USED_JERSEY)
                ) {
                    dojo.addClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_USED_JERSEY);
                }
            });
        },
        restoreJerseyForCurrentRound: function () {
            this.jerseyHasBeenUsedInTheCurrentRound = false;

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                if (dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_USED_JERSEY)) {
                    dojo.removeClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_USED_JERSEY);
                }
            });
        },
        setupPlayCardsActionButton: function () {
            const selectedCards = this.getSelectedPlayerCards();
            const selectedCardsValue = this.getCardsValue(selectedCards, false);

            // setup play cards button without jersey
            if (!$(DOM_ID_ACTION_BUTTON_PLAY_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_PLAY_CARDS, _('Play selected cards'), () => this.onPlayCards(false));
                dojo.place(`<span id="${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value"> (${selectedCardsValue})</span>`, DOM_ID_ACTION_BUTTON_PLAY_CARDS);
                this.addTooltip(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`, _('Total value of selected cards'), '');
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_PLAY_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCardsValue <= this.playedCardsValue);
            $(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`).innerText = ` (${selectedCardsValue})`;

            // setup play cards button with jersey
            if (
                this.currentPlayerHasJersey
                && !this.jerseyHasBeenUsedInTheCurrentRound
            ) {
                const selectedCardsWithJerseyValue = this.getCardsValue(selectedCards, true);
                if (!$(DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY)) {
                    this.addActionButton(DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY, _('Play jersey with selected cards'), () => this.onPlayCards(true));
                    dojo.place(`<span id="${DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY}-value"> (${selectedCardsWithJerseyValue})</span>`, DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY);
                    this.addTooltip(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY}-value`, _(`Total value of selected cards + jersey (${JERSEY_VALUE})`), '');
                }
                dojo.toggleClass(DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCardsWithJerseyValue <= this.playedCardsValue);
                $(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS_WITH_JERSEY}-value`).innerText = ` (${selectedCardsWithJerseyValue})`;
            }
        },
        /**
         *
         * @param {number} activePlayerId
         * @param {Object[]} selectablePlayers Indexed by playerId.
         * @param {function(number)} onClickOnActionButton The function arg is the selected playerId.
         */
        setupSelectPlayerAction: function (activePlayerId, selectablePlayers, onClickOnActionButton) {
            if (this.isCurrentPlayerActive()) {
                // hide active player state for active player
                dojo.removeClass(`player-table-${activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                Object.entries(selectablePlayers).forEach((entry) => {
                    const player = entry[1];

                    // setup click on player tables
                    dojo.addClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                    this.connect($(`player-table-${player.id}`), 'onclick', () => onClickOnActionButton.bind(this)(player.id));

                    // setup click on action buttons
                    this.addActionButton(`${DOM_ID_ACTION_BUTTON_SELECT_PLAYER}-${player.id}`, player.name, () => onClickOnActionButton.bind(this)(player.id), null, false, 'gray');
                    dojo.style(`${DOM_ID_ACTION_BUTTON_SELECT_PLAYER}-${player.id}`, 'color', `#${player.color}`);
                });
            } else {
                // show active player for other players
                dojo.addClass(`player-table-${activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);
            }
        },
        setupGiveCardsBackAfterPickingActionButton: function () {
            const selectedCards = this.getSelectedPlayerCards();
            if (!$(DOM_ID_ACTION_BUTTON_GIVE_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_GIVE_CARDS, _('Give selected cards'), () => this.onSelectCardsToGiveBack());
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_GIVE_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCards.length !== this.howManyCardsToGiveBack);
        },
        /**
         * @param {function (number, number)} fn such as (color, value) => {...}
         */
        execFnForEachCardsInGame: function (fn) {
            // colored cards
            [
                COLOR_BLUE,
                COLOR_BROWN,
                COLOR_GRAY,
                COLOR_GREEN,
                COLOR_PINK,
                COLOR_RED,
                COLOR_YELLOW,
            ].forEach((color) => {
                [
                    VALUE_1,
                    VALUE_2,
                    VALUE_3,
                    VALUE_4,
                    VALUE_5,
                    VALUE_6,
                    VALUE_7,
                ].forEach((value) => fn.bind(this)(color, value));
            });

            // adventurer cards
            [
                VALUE_25,
                VALUE_30,
                VALUE_35,
                VALUE_40,
                VALUE_45,
                VALUE_50,
            ].forEach((value) => fn.bind(this)(COLOR_ADVENTURER, value));
        },
        /**
         * This function gives the position of the card in the sprite "cards.png",
         * it also gives weight to cards to sort them by color (blue-1, blue-2, ...) just like in the sprite,
         * it also gives the type ID for the stock component.
         *
         *
         * @param {number} color
         * @param {number} value
         * @returns {number}
         */
        getCardPositionInSpriteByColorAndValue: function (color, value) {
            switch (color) {
                case COLOR_BLUE:
                    return value - 1;
                case COLOR_BROWN:
                    return 7 + value - 1;
                case COLOR_GRAY:
                    return 14 + value - 1;
                case COLOR_GREEN:
                    return 21 + value - 1;
                case COLOR_PINK:
                    return 28 + value - 1;
                case COLOR_RED:
                    return 35 + value - 1;
                case COLOR_YELLOW:
                    return 42 + value - 1;
                case COLOR_ADVENTURER:
                    switch (value) {
                        case VALUE_25:
                            return 49;
                        case VALUE_30:
                            return 50;
                        case VALUE_35:
                            return 51;
                        case VALUE_40:
                            return 52;
                        case VALUE_45:
                            return 53;
                        case VALUE_50:
                            return 54;
                        default:
                            return 55;
                    }
                default:
                    return 55;
            }
        },
        sortPlayerCardsByColor: function () {
            const cardsWeightByPosition = {};
            this.execFnForEachCardsInGame((color, value) => {
                const cardPositionAndWeight = this.getCardPositionInSpriteByColorAndValue(color, value);
                cardsWeightByPosition[cardPositionAndWeight] = cardPositionAndWeight;
            });

            this.playerHand.changeItemsWeight(cardsWeightByPosition);
        },
        /**
         * @param {number} color
         * @param {number} value
         * @returns {number}
         */
        getCardWeightForColorAndValueToSortThemByValue: function (color, value) {
            return (value * 100) + color;
        },
        sortPlayerCardsByValue: function () {
            const cardsWeightByPosition = {};
            this.execFnForEachCardsInGame((color, value) => {
                cardsWeightByPosition[this.getCardPositionInSpriteByColorAndValue(color, value)] = this.getCardWeightForColorAndValueToSortThemByValue(color, value);
            });

            this.playerHand.changeItemsWeight(cardsWeightByPosition);
        },
        /**
         * @param {number} position
         * @returns {number}
         */
        getAbsoluteCardBackgroundPositionXFromCardPosition: function (position) {
            return (position % 7) * CARD_WIDTH;
        },
        /**
         * @param {number} position
         * @returns {number}
         */
        getAbsoluteCardBackgroundPositionYFromCardPosition: function (position) {
            return Math.floor(position / 7) * CARD_HEIGHT;
        },
        /**
         *
         * @param {number} position
         * @param {number} cardId
         * @returns {Object}
         */
        getCardObjectFromPositionInSpriteAndId: function (position, cardId) {
            let color;
            let value;

            switch (position) {
                case 0:
                    color = COLOR_BLUE;
                    value = VALUE_1;
                    break;
                case 1:
                    color = COLOR_BLUE;
                    value = VALUE_2;
                    break;
                case 2:
                    color = COLOR_BLUE;
                    value = VALUE_3;
                    break;
                case 3:
                    color = COLOR_BLUE;
                    value = VALUE_4;
                    break;
                case 4:
                    color = COLOR_BLUE;
                    value = VALUE_5;
                    break;
                case 5:
                    color = COLOR_BLUE;
                    value = VALUE_6;
                    break;
                case 6:
                    color = COLOR_BLUE;
                    value = VALUE_7;
                    break;
                case 7:
                    color = COLOR_BROWN;
                    value = VALUE_1;
                    break;
                case 8:
                    color = COLOR_BROWN;
                    value = VALUE_2;
                    break;
                case 9:
                    color = COLOR_BROWN;
                    value = VALUE_3;
                    break;
                case 10:
                    color = COLOR_BROWN;
                    value = VALUE_4;
                    break;
                case 11:
                    color = COLOR_BROWN;
                    value = VALUE_5;
                    break;
                case 12:
                    color = COLOR_BROWN;
                    value = VALUE_6;
                    break;
                case 13:
                    color = COLOR_BROWN;
                    value = VALUE_7;
                    break;
                case 14:
                    color = COLOR_GRAY;
                    value = VALUE_1;
                    break;
                case 15:
                    color = COLOR_GRAY;
                    value = VALUE_2;
                    break;
                case 16:
                    color = COLOR_GRAY;
                    value = VALUE_3;
                    break;
                case 17:
                    color = COLOR_GRAY;
                    value = VALUE_4;
                    break;
                case 18:
                    color = COLOR_GRAY;
                    value = VALUE_5;
                    break;
                case 19:
                    color = COLOR_GRAY;
                    value = VALUE_6;
                    break;
                case 20:
                    color = COLOR_GRAY;
                    value = VALUE_7;
                    break;
                case 21:
                    color = COLOR_GREEN;
                    value = VALUE_1;
                    break;
                case 22:
                    color = COLOR_GREEN;
                    value = VALUE_2;
                    break;
                case 23:
                    color = COLOR_GREEN;
                    value = VALUE_3;
                    break;
                case 24:
                    color = COLOR_GREEN;
                    value = VALUE_4;
                    break;
                case 25:
                    color = COLOR_GREEN;
                    value = VALUE_5;
                    break;
                case 26:
                    color = COLOR_GREEN;
                    value = VALUE_6;
                    break;
                case 27:
                    color = COLOR_GREEN;
                    value = VALUE_7;
                    break;
                case 28:
                    color = COLOR_PINK;
                    value = VALUE_1;
                    break;
                case 29:
                    color = COLOR_PINK;
                    value = VALUE_2;
                    break;
                case 30:
                    color = COLOR_PINK;
                    value = VALUE_3;
                    break;
                case 31:
                    color = COLOR_PINK;
                    value = VALUE_4;
                    break;
                case 32:
                    color = COLOR_PINK;
                    value = VALUE_5;
                    break;
                case 33:
                    color = COLOR_PINK;
                    value = VALUE_6;
                    break;
                case 34:
                    color = COLOR_PINK;
                    value = VALUE_7;
                    break;
                case 35:
                    color = COLOR_RED;
                    value = VALUE_1;
                    break;
                case 36:
                    color = COLOR_RED;
                    value = VALUE_2;
                    break;
                case 37:
                    color = COLOR_RED;
                    value = VALUE_3;
                    break;
                case 38:
                    color = COLOR_RED;
                    value = VALUE_4;
                    break;
                case 39:
                    color = COLOR_RED;
                    value = VALUE_5;
                    break;
                case 40:
                    color = COLOR_RED;
                    value = VALUE_6;
                    break;
                case 41:
                    color = COLOR_RED;
                    value = VALUE_7;
                    break;
                case 42:
                    color = COLOR_YELLOW;
                    value = VALUE_1;
                    break;
                case 43:
                    color = COLOR_YELLOW;
                    value = VALUE_2;
                    break;
                case 44:
                    color = COLOR_YELLOW;
                    value = VALUE_3;
                    break;
                case 45:
                    color = COLOR_YELLOW;
                    value = VALUE_4;
                    break;
                case 46:
                    color = COLOR_YELLOW;
                    value = VALUE_5;
                    break;
                case 47:
                    color = COLOR_YELLOW;
                    value = VALUE_6;
                    break;
                case 48:
                    color = COLOR_YELLOW;
                    value = VALUE_7;
                    break;
                case 49:
                    color = COLOR_ADVENTURER;
                    value = VALUE_25;
                    break;
                case 50:
                    color = COLOR_ADVENTURER;
                    value = VALUE_30;
                    break;
                case 51:
                    color = COLOR_ADVENTURER;
                    value = VALUE_35;
                    break;
                case 52:
                    color = COLOR_ADVENTURER;
                    value = VALUE_40;
                    break;
                case 53:
                    color = COLOR_ADVENTURER;
                    value = VALUE_45;
                    break;
                case 54:
                    color = COLOR_ADVENTURER;
                    value = VALUE_50;
                    break;
                default:
                    throw new Error(`Unsupported card position in sprite: ${position}`);
            }

            return {
                id: cardId,
                color: color,
                value: value,
            };
        },
        /**
         * @param {number} color
         * @param {number} value
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        getCardsThatCanBePlayedWithCard: function (color, value, cards) {
            return cards.filter((card) => {
                if (color === COLOR_ADVENTURER && value !== card.value) {
                    return false;
                }

                if (color === card.color) {
                    return true;
                }

                return value === card.value;
            });
        },
        /**
         * @param {Object[]} playerCards
         * @returns {function (Object[], Object, number, Object[]): Object[]}
         */
        getPlayerCardsThatCanBePlayedWithCardsReducer: function (playerCards) {
            return (acc, card, i, cards) => acc.concat(
                this.getCardsThatCanBePlayedWithCard(card.color, card.value, playerCards)
                    .filter((c) => acc.every((accCard) => c.id !== accCard.id))
            ).filter((c) => cards.every((cardsCard) => c.id !== cardsCard.id));
        },
        /**
         * @param {number} color
         * @param {number} value
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        getCardsThatCannotBePlayedWithCard: function (color, value, cards) {
            return cards.filter((card) => {
                if (color === COLOR_ADVENTURER && value !== card.value) {
                    return true;
                }

                if (color === card.color) {
                    return false;
                }

                return value !== card.value;
            });
        },
        /**
         * @param {Object[]} playerCards
         * @returns {function (Object[], Object): Object[]}
         */
        getPlayerCardsThatCannotBePlayedWithCardsReducer: function (playerCards) {
            return (acc, card) => acc.concat(
                this.getCardsThatCannotBePlayedWithCard(card.color, card.value, playerCards)
                    .filter((c) => acc.every((accCard) => c.id !== accCard.id))
            );
        },
        /**
         * @returns {Object[]}
         */
        getAllPlayerCards: function () {
            return this.playerHand.getAllItems()
                .map((item) => this.getCardObjectFromPositionInSpriteAndId(item.type, item.id));
        },
        /**
         * @returns {Object[]}
         */
        getSelectedPlayerCards: function () {
            return this.playerHand.getSelectedItems()
                .map((item) => this.getCardObjectFromPositionInSpriteAndId(item.type, item.id));
        },
        /**
         * @returns {Object[]}
         */
        getPlayerCardsCombinationsSortedByHighestValue: function () {
            const playerCards = this.getAllPlayerCards();
            const sortCardsById = (a, b) => a.id - b.id;
            const highestPlayableGroupOfCards = playerCards.reduce((acc, card) => {
                const cardsThatCanBePlayedWithCard = [card]
                    .reduce(this.getPlayerCardsThatCanBePlayedWithCardsReducer(playerCards), []);

                if (!cardsThatCanBePlayedWithCard.length) {
                    // add single card combination
                    return [...acc, [card]];
                }

                return [
                    ...acc,
                    // add highest color combination
                    [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.color === card.color).sort(sortCardsById),
                    // add highest value combination
                    [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.value === card.value).sort(sortCardsById),
                ];

            }, []);

            return highestPlayableGroupOfCards
                // format combinations
                .map((cards) => ({
                    cards: cards,
                    value: this.getCardsValue(cards, false),
                }))
                // sort combinations by highest value
                .sort((a, b) => {
                    return b.value - a.value;
                })
                // remove duplicated combinations
                .filter((combination, i, combinations) => {
                    if (
                        i <= 0
                        || combinations[i - 1].value !== combination.value
                    ) {
                        return true;
                    }

                    return !combinations[i - 1].cards.every((c, idx) => c.id === combination.cards[idx].id);
                });
        },
        /**
         * @param {Object[]} cards
         * @param {boolean} withJersey
         * @returns {number}
         */
        getCardsValue: function (cards, withJersey) {
            if (!cards.length) {
                return 0;
            }

            // the jersey cannot be played with an adventurer
            if (withJersey && cards.map((c) => c.color).includes(COLOR_ADVENTURER)) {
                return 0;
            }

            const addJerseyValueIfUsed = (value) => value + (withJersey ? JERSEY_VALUE : 0);

            if (cards.length === 1) {
                return addJerseyValueIfUsed(cards[0].value);
            }

            let minCardValue = 1000;
            cards.forEach((card) => {
                if (card.value < minCardValue) {
                    minCardValue = card.value;
                }
            });

            return addJerseyValueIfUsed((cards.length * 10) + minCardValue);
        },
        /**
         * @returns {boolean}
         */
        currentPlayerCanPlayCards: function () {
            const playerCardsCombinations = this.getPlayerCardsCombinationsSortedByHighestValue();
            if (!playerCardsCombinations.length) {
                return false;
            }

            const playerCanPlayJersey = this.currentPlayerHasJersey && !this.jerseyHasBeenUsedInTheCurrentRound;

            return this.playedCardsValue < (playerCardsCombinations[0].value + (playerCanPlayJersey ? JERSEY_VALUE : 0));
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardSelected: function (cardId) {
            const playerCards = this.getAllPlayerCards();
            const selectedCards = this.getSelectedPlayerCards();
            const playerCardsThatCannotBePlayedWithSelectedCards = selectedCards.reduce(
                this.getPlayerCardsThatCannotBePlayedWithCardsReducer(playerCards),
                []
            );

            // unselect selected cards that cannot be played with the last selected card
            selectedCards.forEach((card) => {
                if (
                    playerCardsThatCannotBePlayedWithSelectedCards.map((c) => c.id).includes(card.id)
                    && cardId !== card.id
                ) {
                    this.playerHand.unselectItem(card.id);
                }
            });

            // display non-selectable cards as non-selectable
            this.displayCardsAsNonSelectable(
                this.getSelectedPlayerCards()
                    .reduce(this.getPlayerCardsThatCannotBePlayedWithCardsReducer(playerCards), [])
            );
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardUnselected: function (cardId) {
            const playerCards = this.getAllPlayerCards();

            // display non-selectable cards as non-selectable
            this.displayCardsAsNonSelectable(
                this.getSelectedPlayerCards()
                    .reduce(this.getPlayerCardsThatCannotBePlayedWithCardsReducer(playerCards), [])
            );
        },
        /**
         * @param {Object[]} cards
         */
        displayCardsAsNonSelectable: function (cards) {
            this.getAllPlayerCards().forEach((playedCard) => {
                dojo.toggleClass(
                    `${DOM_ID_PLAYER_HAND}_item_${playedCard.id}`,
                    DOM_CLASS_NON_SELECTABLE_CARD,
                    cards.map((card) => card.id).includes(playedCard.id)
                );
            });
        },
        unselectAllCards: function () {
            this.playerHand.unselectAll();
            this.displayCardsAsNonSelectable([]);
        },
        /**
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        sortPlayedCards: function (cards) {
            return [...cards].sort((a, b) => b.value - a.value);
        },
        /**
         * @param {Object[]} players
         * @returns {Object[]}
         */
        sortPlayersByTurnOrderPosition: function (players) {
            return [...players].sort((a, b) => a.position - b.position);
        },
        /**
         * @param {Object[]} players
         * @param {number} currentPlayerId
         * @returns {Object[]}
         */
        sortPlayersToHaveTheCurrentPlayerFirstIfPresent: function (players, currentPlayerId) {
            const currentPlayerIndex = players.findIndex((player) => player.id === currentPlayerId);
            if (currentPlayerIndex <= 0) {
                return players;
            }

            return [...players.slice(currentPlayerIndex), ...players.slice(0, currentPlayerIndex)];
        },
        /**
         * @param {number} playerId
         * @param {Object[]} cards
         */
        moveCardsFromPlayerHandToTable: function (playerId, cards) {
            if (cards.length <= 0) {
                return;
            }

            const stackedCards = this.sortPlayedCards(cards);
            const topOfStackCardId = stackedCards[stackedCards.length - 1].id;

            // create played cards
            const stackWith = ((stackedCards.length - 1) * (CARD_WIDTH / 3)) + CARD_WIDTH;
            dojo.place(
                `<div id="cards-stack-${topOfStackCardId}" class="cards-stack" style="width: ${stackWith}px;"></div>`,
                `player-table-${playerId}-cards`
            );
            stackedCards.forEach((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const x = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const y = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                dojo.place(
                    `<div id="card-in-stack-${card.id}" class="velonimo-card front-side" style="background-position: -${x}px -${y}px;"></div>`,
                    `cards-stack-${topOfStackCardId}`
                );
            });

            // place cards from where the animation will start
            if (playerId !== this.player_id) {
                this.placeOnObject(`cards-stack-${topOfStackCardId}`, `player-table-${playerId}-hand`);
            } else if ($(`${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`)) {
                this.placeOnObject(`cards-stack-${topOfStackCardId}`, `${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`);
                stackedCards.forEach((card) => {
                    this.playerHand.removeFromStockById(card.id);
                });
            }

            // move cards to their destination
            this.slideToObject(`cards-stack-${topOfStackCardId}`, `player-table-${playerId}-cards`).play();
        },
        /**
         * @param {number} senderId
         * @param {Object[]} cards
         */
        receiveCardsFromAnotherPlayer: function (senderId, cards) {
            cards.forEach((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const backgroundPositionX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const backgroundPositionY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                this.slideTemporaryObject(
                    `<div class="velonimo-card front-side" style="position: absolute; background-position: -${backgroundPositionX}px -${backgroundPositionY}px;"></div>`,
                    `player-table-${senderId}-hand`,
                    `player-table-${senderId}-hand`,
                    DOM_ID_PLAYER_HAND
                ).play();
                this.playerHand.addToStockWithId(position, card.id);
            });
        },
        /**
         * @param {number} receiverId
         * @param {Object[]} cards
         */
        sendCardsToAnotherPlayer: function (receiverId, cards) {
            cards.forEach((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const backgroundPositionX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const backgroundPositionY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                const animationStartDomId = $(`${DOM_ID_PLAYER_HAND}_item_${card.id}`) ? `${DOM_ID_PLAYER_HAND}_item_${card.id}` : DOM_ID_PLAYER_HAND;
                this.slideTemporaryObject(
                    `<div class="velonimo-card front-side" style="position: absolute; background-position: -${backgroundPositionX}px -${backgroundPositionY}px;"></div>`,
                    animationStartDomId,
                    animationStartDomId,
                    `player-table-${receiverId}-hand`
                ).play();
                this.playerHand.removeFromStockById(card.id);
            });
        },
        /**
         * @param {number} senderId
         * @param {number} receiverId
         * @param {number} numberOfCards
         */
        moveCardsBetweenTwoOtherPlayers: function (senderId, receiverId, numberOfCards) {
            for (let i = 0; i < numberOfCards; i++) {
                this.slideTemporaryObject(
                    `<div class="velonimo-card back-side" style="position: absolute;"></div>`,
                    `player-table-${senderId}-hand`,
                    `player-table-${senderId}-hand`,
                    `player-table-${receiverId}-hand`
                ).play();
            }
        },
        /**
         * @param {Object[]} cards
         */
        addCardsToPlayerHand: function (cards) {
            cards.forEach((card) => {
                this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id);
            });
        },
        discardCards: function () {
            this.playedCardsValue = -1;
            dojo.query(`.${DOM_CLASS_CARDS_STACK}`).forEach(dojo.destroy);
        },

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////
        /**
         * @param {boolean} withJersey
         */
        onPlayCards: function (withJersey) {
            if (!this.checkAction('playCards')) {
                return;
            }

            const playedCards = this.getSelectedPlayerCards();
            if (playedCards.length <= 0) {
                return;
            }

            this.requestAction('playCards', {
                cards: playedCards.map(card => card.id).join(';'),
                withJersey: withJersey,
            });

            this.unselectAllCards();
            this.setupPlayCardsActionButton();
        },
        onPassTurn: function () {
            if (!this.checkAction('passTurn')) {
                return;
            }

            this.requestAction('passTurn', {});
        },
        /**
         * @param {number} selectedPlayerId
         */
        onSelectNextPlayer: function (selectedPlayerId) {
            if (!this.checkAction('selectNextPlayer')) {
                return;
            }

            this.requestAction('selectNextPlayer', {
                selectedPlayerId: selectedPlayerId,
            });
        },
        /**
         * @param {number} selectedPlayerId
         */
        onSelectPlayerToPickCards: function (selectedPlayerId) {
            if (!this.checkAction('selectPlayerToPickCards')) {
                return;
            }

            this.requestAction('selectPlayerToPickCards', {
                selectedPlayerId: selectedPlayerId,
            });
        },
        onSelectCardsToGiveBack: function () {
            if (!this.checkAction('selectCardsToGiveBack')) {
                return;
            }

            const selectedCards = this.getSelectedPlayerCards();
            if (selectedCards.length <= 0) {
                return;
            }

            this.requestAction('selectCardsToGiveBack', {
                cards: selectedCards.map(card => card.id).join(';'),
            });

            this.unselectAllCards();
        },
        onClickOnTogglePlayerHandSortButton: function () {
            const currentSortingMode = dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort');
            if (currentSortingMode === PLAYER_HAND_SORT_BY_COLOR) {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sort by color');
                dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort', PLAYER_HAND_SORT_BY_VALUE);
                this.sortPlayerCardsByValue();
            } else {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sort by value');
                dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort', PLAYER_HAND_SORT_BY_COLOR);
                this.sortPlayerCardsByColor();
            }
        },

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications
        ///////////////////////////////////////////////////
        setupNotifications: function () {
            [
                ['roundStarted', 1],
                ['cardsDealt', 1],
                ['cardsPlayed', 1000],
                ['cardsDiscarded', 1],
                ['cardsReceivedFromAnotherPlayer', 1000],
                ['cardsSentToAnotherPlayer', 1000],
                ['cardsMovedBetweenTwoOtherPlayers', 1000],
                ['roundEnded', 1],
            ].forEach((notif) => {
                const name = notif[0];
                const lockDurationInMs = notif[1];

                dojo.subscribe(name, this, `notif_${name}`);
                this.notifqueue.setSynchronous(name, lockDurationInMs);
            });
        },
        notif_roundStarted: function (data) {
            this.currentRound = data.args.currentRound;
            this.players = data.args.players;
            this.setupRoundsInfo();
            this.setupNumberOfCardsInPlayersHand();
        },
        notif_cardsDealt: function (data) {
            this.playerHand.removeAll();
            this.addCardsToPlayerHand(data.args.cards);
        },
        notif_cardsPlayed: function (data) {
            // remove last played cards
            this.discardCards();

            // place new played cards
            this.playedCardsValue = data.args.playedCardsValue;
            this.moveCardsFromPlayerHandToTable(data.args.playedCardsPlayerId, data.args.playedCards);

            // update number of cards in players hand
            this.players[data.args.playedCardsPlayerId].howManyCards = this.players[data.args.playedCardsPlayerId].howManyCards - data.args.playedCards.length;

            // update jersey state if it has been used
            if (data.args.withJersey) {
                this.useJerseyForCurrentRound();
            }

            this.setupNumberOfCardsInPlayersHand();
        },
        notif_cardsDiscarded: function (data) {
            this.discardCards();
        },
        notif_cardsReceivedFromAnotherPlayer: function (data) {
            this.players[data.args.senderPlayerId].howManyCards = this.players[data.args.senderPlayerId].howManyCards - data.args.cards.length;

            this.receiveCardsFromAnotherPlayer(data.args.senderPlayerId, data.args.cards);

            this.players[this.player_id].howManyCards = this.players[this.player_id].howManyCards + data.args.cards.length;

            this.setupNumberOfCardsInPlayersHand();
        },
        notif_cardsSentToAnotherPlayer: function (data) {
            this.players[this.player_id].howManyCards = this.players[this.player_id].howManyCards - data.args.cards.length;

            this.sendCardsToAnotherPlayer(data.args.receiverPlayerId, data.args.cards);

            this.players[data.args.receiverPlayerId].howManyCards = this.players[data.args.receiverPlayerId].howManyCards + data.args.cards.length;

            this.setupNumberOfCardsInPlayersHand();
        },
        notif_cardsMovedBetweenTwoOtherPlayers: function (data) {
            this.players[data.args.senderPlayerId].howManyCards = this.players[data.args.senderPlayerId].howManyCards - data.args.numberOfCards;

            this.moveCardsBetweenTwoOtherPlayers(data.args.senderPlayerId, data.args.receiverPlayerId, data.args.numberOfCards);

            this.players[data.args.receiverPlayerId].howManyCards = this.players[data.args.receiverPlayerId].howManyCards + data.args.numberOfCards;

            this.setupNumberOfCardsInPlayersHand();
        },
        notif_roundEnded: function (data) {
            const currentJerseyWearerId = this.getCurrentJerseyWearerIdIfExists();
            this.players = data.args.players;

            this.setupPlayersScore();

            // restore and move jersey before the next round begin,
            // in order to have a beautiful jersey for the winner of the game (at the very end)
            this.restoreJerseyForCurrentRound();
            this.moveJerseyToCurrentWinner(currentJerseyWearerId);
        },
   });
});
