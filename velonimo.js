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
const COLOR_JERSEY = 90;

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
const VALUE_JERSEY = 10;

// Special cards ID
const CARD_ID_JERSEY = 0;

// DOM IDs
const DOM_ID_APP = 'velonimo-game';
const DOM_ID_BOARD_CARPET = 'board-carpet';
const DOM_ID_CARDS_DECK = 'cards-deck';
const DOM_ID_CARDS_DECK_CARDS = 'cards-deck-cards';
const DOM_ID_ATTACK_REWARD_CARD = 'attack-reward-card';
const DOM_ID_PLAYED_CARDS_WRAPPER = 'played-cards';
const DOM_ID_LAST_PLAYED_CARDS = 'last-played-cards';
const DOM_ID_PREVIOUS_LAST_PLAYED_CARDS = 'previous-last-played-cards';
const DOM_ID_PLAYER_HAND = 'my-hand';
const DOM_ID_PLAYER_HAND_TITLE = 'my-hand-title';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON = 'toggle-sort-button';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL = 'toggle-sort-button-label';
const DOM_ID_CURRENT_ROUND = 'current-round';
const DOM_ID_ACTION_BUTTON_PLAY_CARDS = 'action-button-play-cards';
const DOM_ID_ACTION_BUTTON_PASS_TURN = 'action-button-pass-turn';
const DOM_ID_ACTION_BUTTON_SELECT_PLAYER = 'action-button-select-player';
const DOM_ID_ACTION_BUTTON_GIVE_CARDS = 'action-button-give-cards';

// DOM classes
const DOM_CLASS_PLAYER_TABLE = 'player-table';
const DOM_CLASS_PLAYER_IS_WEARING_JERSEY = 'is-wearing-jersey';
const DOM_CLASS_PLAYER_HAS_USED_JERSEY = 'has-used-jersey';
const DOM_CLASS_CARDS_STACK = 'cards-stack';
const DOM_CLASS_TEXT_ON_CARDS = 'text-on-cards';
const DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED = 'previous-last-played-cards';
const DOM_CLASS_DISABLED_ACTION_BUTTON = 'disabled';
const DOM_CLASS_ACTIVE_PLAYER = 'active';
const DOM_CLASS_SELECTABLE_PLAYER = 'selectable';
const DOM_CLASS_NON_SELECTABLE_CARD = 'non-selectable-player-card';
const DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW = 'show-bubble';
const DOM_CLASS_SPEECH_BUBBLE_LEFT = 'speech-bubble-on-left';
const DOM_CLASS_SPEECH_BUBBLE_RIGHT = 'speech-bubble-on-right';

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
const BOARD_MARGIN = 10;
const TABLE_STYLE_HORIZONTAL_LEFT = `left: ${BOARD_MARGIN}px;`;
const TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT = `left: ${BOARD_MARGIN + PLAYER_TABLE_WIDTH}px;`;
const TABLE_STYLE_HORIZONTAL_CENTER = `left: ${(BOARD_CARPET_WIDTH / 2) - (PLAYER_TABLE_WIDTH / 2)}px;`;
const TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT = `left: ${BOARD_CARPET_WIDTH - (BOARD_MARGIN + (PLAYER_TABLE_WIDTH * 2))}px;`;
const TABLE_STYLE_HORIZONTAL_RIGHT = `left: ${BOARD_CARPET_WIDTH - (BOARD_MARGIN + PLAYER_TABLE_WIDTH)}px;`;
const TABLE_STYLE_VERTICAL_TOP = `top: ${BOARD_MARGIN}px;`;
const TABLE_STYLE_VERTICAL_BOTTOM = `bottom: ${BOARD_MARGIN}px;`;
// the current player (index 0 == current player) place is always at the bottom of the board, in a way that players always stay closed to their hand
const PLAYERS_PLACES_BY_NUMBER_OF_PLAYERS = {
    2: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
    },
    3: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
    },
    4: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
    },
    5: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        4: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
    },
};

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
            this.currentRound = 0;
            this.currentPlayerHasJersey = false;
            this.jerseyHasBeenUsedInTheCurrentRound = false;
            this.howManyRounds = 0;
            this.playedCardsValue = 0;
            this.howManyCardsToGiveBack = 0;
            this.players = [];
            this.playerHand = null; // https://en.doc.boardgamearena.com/Stock
            // /!\ 2P mode only
            this.howManyCardsInDeck = 0;
        },
        setup: function (gamedatas) {
            this.currentState = gamedatas.gamestate.name;
            this.currentRound = gamedatas.currentRound;
            this.jerseyHasBeenUsedInTheCurrentRound = gamedatas.jerseyHasBeenUsedInTheCurrentRound;
            this.howManyRounds = gamedatas.howManyRounds;

            // Setup board
            dojo.place(
                `<div id="board">
    <div id="${DOM_ID_BOARD_CARPET}">
        <div id="${DOM_ID_PLAYED_CARDS_WRAPPER}">
            <div id="${DOM_ID_PREVIOUS_LAST_PLAYED_CARDS}"></div>
            <div id="${DOM_ID_LAST_PLAYED_CARDS}"></div>
        </div>
    </div>
    <div id="game-info" class="player-board">
        ${_('Round')}
        <div id="${DOM_ID_CURRENT_ROUND}"></div>
    </div>
</div>
<div id="my-hand-wrapper" class="whiteblock">
    <div id="my-hand-title-wrapper">
        <h3 id="${DOM_ID_PLAYER_HAND_TITLE}">${_('My hand')}</h3>
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
                const playerColorRGB = `#${player.color}`;

                dojo.place(
                    `<div id="player-table-${player.id}" class="player-table" style="${playerPosition.tableStyle}">
    <div class="player-table-name" style="color: ${playerColorRGB};">${(player.name.length > 10 ? (player.name.substr(0,10) + '...') : player.name)}</div>
    <div id="player-table-${player.id}-hand" class="player-table-hand"><span id="player-table-${player.id}-number-of-cards" class="${DOM_CLASS_TEXT_ON_CARDS}"></span></div>
    <div id="player-table-${player.id}-jersey" class="player-table-jersey"></div>
    <div id="player-table-${player.id}-speech-bubble" class="player-table-speech-bubble ${playerPosition.bubbleClass}" style="color: ${playerColorRGB};"></div>
</div>`,
                    DOM_ID_BOARD_CARPET);
            });
            this.setupNumberOfCardsInPlayersHand();

            // show 2P mode items
            if (this.is2PlayersMode()) {
                dojo.place(
                    `<div id="${DOM_ID_CARDS_DECK}"><div id="${DOM_ID_CARDS_DECK_CARDS}"></div></div>
<div id="${DOM_ID_ATTACK_REWARD_CARD}"></div>`,
                    DOM_ID_BOARD_CARPET
                );

                this.howManyCardsInDeck = gamedatas.numberOfCardsInDeck;
                this.setupDeckOfCards();
                this.setupAttackRewardCards(gamedatas.attackRewardCards);
            }

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
            this.setupPreviousPlayedCards(
                (gamedatas.previousPlayedCardsValue === (this.getCardsValue(gamedatas.previousPlayedCards) + VALUE_JERSEY))
                    ? this.addJerseyToCards(gamedatas.previousPlayedCards)
                    : gamedatas.previousPlayedCards
            );
            this.moveCardsFromPlayerHandToTable(
                gamedatas.playedCardsPlayerId,
                (this.playedCardsValue === (this.getCardsValue(gamedatas.playedCards) + VALUE_JERSEY))
                    ? this.addJerseyToCards(gamedatas.playedCards)
                    : gamedatas.playedCards
            );

            // Setup jersey
            if (gamedatas.jerseyHasBeenUsedInTheCurrentRound) {
                this.useJerseyForCurrentRound();
            } else {
                this.restoreJerseyForCurrentRound();
            }
            this.moveJerseyToCurrentWinner();
            if (
                this.currentPlayerHasJersey
                && !this.jerseyHasBeenUsedInTheCurrentRound
            ) {
                this.addJerseyToPlayerHand();
            }

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
                case 'playerSelectWhoTakeAttackReward':
                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectWhoTakeAttackReward);
                    break;
                case 'playerSelectPlayerToPickCards':
                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectPlayerToPickCards);
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    // show active player
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.howManyCardsToGiveBack = data.args.numberOfCards;
                    break;
            }
        },
        onLeavingState: function (state) {
            // hide active player
            dojo.query(`.${DOM_CLASS_PLAYER_TABLE}`).removeClass(DOM_CLASS_ACTIVE_PLAYER);

            // do special things for state
            switch (state) {
                case 'playerSelectNextPlayer':
                case 'playerSelectWhoTakeAttackReward':
                case 'playerSelectPlayerToPickCards':
                    Object.entries(this.players).forEach((entry) => {
                        const player = entry[1];
                        dojo.removeClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                        this.disconnect($(`player-table-${player.id}`), 'onclick');
                    });
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    this.howManyCardsToGiveBack = 0;
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
                    // add "play cards" button if player can play
                    if (this.currentPlayerCanPlayCards()) {
                        this.setupPlayCardsActionButton();
                    }
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    if (this.isCurrentPlayerActive()) {
                        this.unselectAllCards();
                    }
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
                    if (isCurrentPlayerActive && this.currentPlayerCanPlayCards()) {
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
         * @returns {boolean}
         */
        is2PlayersMode: function () {
            return Object.keys(this.players).length === 2;
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
                const isCurrentPlayer = this.player_id === player.id;

                if (player.isWearingJersey) {
                    this.currentPlayerHasJersey = isCurrentPlayer;

                    if (!dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY)) {
                        if (currentJerseyWearerId) {
                            // move jersey from player A to player B,
                            // then add isWearingJersey class to player B at the end of the animation
                            const animation = this.slideTemporaryObject(
                                `<div class="moving-jersey"></div>`,
                                `player-table-${currentJerseyWearerId}-jersey`,
                                `player-table-${currentJerseyWearerId}-jersey`,
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

                    if (isCurrentPlayer) {
                        this.removeJerseyFromPlayerHand();
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
            const selectedCardsValue = this.getCardsValue(selectedCards);

            // setup play cards button
            if (!$(DOM_ID_ACTION_BUTTON_PLAY_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_PLAY_CARDS, _('Play selected cards'), 'onPlayCards');
                dojo.place(`<span id="${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value"> (${selectedCardsValue})</span>`, DOM_ID_ACTION_BUTTON_PLAY_CARDS);
                this.addTooltip(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`, _('Total value of selected cards'), '');
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_PLAY_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCardsValue <= this.playedCardsValue);
            $(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`).innerText = ` (${selectedCardsValue})`;
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
            this.refreshPlayerHandSelectableCards();

            const selectedCards = this.getSelectedPlayerCards();
            if (!$(DOM_ID_ACTION_BUTTON_GIVE_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_GIVE_CARDS, _('Give selected cards'), () => this.onSelectCardsToGiveBack());
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_GIVE_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, (selectedCards.length === 0) || (selectedCards.length !== this.howManyCardsToGiveBack));
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

            // jersey card
            fn.bind(this)(COLOR_JERSEY, VALUE_JERSEY);
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
                            return 50;
                        case VALUE_30:
                            return 51;
                        case VALUE_35:
                            return 52;
                        case VALUE_40:
                            return 53;
                        case VALUE_45:
                            return 54;
                        case VALUE_50:
                            return 55;
                        default:
                            throw new Error('Unsupported');
                    }
                default:
                    // Jersey
                    return 49;
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
                    color = COLOR_JERSEY;
                    value = VALUE_JERSEY;
                    break;
                case 50:
                    color = COLOR_ADVENTURER;
                    value = VALUE_25;
                    break;
                case 51:
                    color = COLOR_ADVENTURER;
                    value = VALUE_30;
                    break;
                case 52:
                    color = COLOR_ADVENTURER;
                    value = VALUE_35;
                    break;
                case 53:
                    color = COLOR_ADVENTURER;
                    value = VALUE_40;
                    break;
                case 54:
                    color = COLOR_ADVENTURER;
                    value = VALUE_45;
                    break;
                case 55:
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
                if (color === COLOR_JERSEY) {
                    return card.color !== COLOR_ADVENTURER;
                }
                if (card.color === COLOR_JERSEY) {
                    return color !== COLOR_ADVENTURER;
                }

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
                if (color === COLOR_JERSEY) {
                    return card.color === COLOR_ADVENTURER;
                }
                if (card.color === COLOR_JERSEY) {
                    return color === COLOR_ADVENTURER;
                }

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
                    value: this.getCardsValue(cards),
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
         * @returns {number}
         */
        getCardsValue: function (cards) {
            const withJersey = cards.map((c) => c.id).includes(CARD_ID_JERSEY);
            const cardsWithoutJersey = cards.filter((c) => c.id !== CARD_ID_JERSEY);
            if (!cardsWithoutJersey.length) {
                return 0;
            }

            // the jersey cannot be played with an adventurer
            if (withJersey && cardsWithoutJersey.map((c) => c.color).includes(COLOR_ADVENTURER)) {
                return 0;
            }

            const addJerseyValueIfUsed = (value) => value + (withJersey ? VALUE_JERSEY : 0);

            if (cardsWithoutJersey.length === 1) {
                return addJerseyValueIfUsed(cardsWithoutJersey[0].value);
            }

            let minCardValue = 1000;
            cardsWithoutJersey.forEach((card) => {
                if (card.value < minCardValue) {
                    minCardValue = card.value;
                }
            });

            return addJerseyValueIfUsed((cardsWithoutJersey.length * 10) + minCardValue);
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

            return this.playedCardsValue < (playerCardsCombinations[0].value + (playerCanPlayJersey ? VALUE_JERSEY : 0));
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

            this.refreshPlayerHandSelectableCards();
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardUnselected: function (cardId) {
            this.refreshPlayerHandSelectableCards();
        },
        refreshPlayerHandSelectableCards: function () {
            const playerCards = this.getAllPlayerCards();
            const selectedCards = this.getSelectedPlayerCards();

            if (
                this.isCurrentPlayerActive()
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                if (this.playerHand.isSelected(CARD_ID_JERSEY)) {
                    this.playerHand.unselectItem(CARD_ID_JERSEY);
                }
                this.displayCardsAsNonSelectable(this.addJerseyToCards([]));
            } else if (selectedCards.length === 0) {
                this.displayCardsAsNonSelectable([]);
            } else {
                this.displayCardsAsNonSelectable(
                    selectedCards.reduce(this.getPlayerCardsThatCannotBePlayedWithCardsReducer(playerCards), [])
                );
            }
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
            this.refreshPlayerHandSelectableCards();
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
         * @param {Object[]} cards
         * @param {string} placeDomId
         * @returns {number} Top of stack card ID
         */
        buildAndPlacePlayedStackOfCards: function (cards, placeDomId) {
            if (
                cards.length <= 0
                || !placeDomId
            ) {
                return;
            }

            const stackedCards = this.sortPlayedCards(cards);
            const topOfStackCardId = stackedCards[stackedCards.length - 1].id;

            // create played cards
            const stackWith = ((stackedCards.length - 1) * (CARD_WIDTH / 3)) + CARD_WIDTH;
            dojo.place(
                `<div id="cards-stack-${topOfStackCardId}" class="${DOM_CLASS_CARDS_STACK}" style="width: ${stackWith}px;"></div>`,
                placeDomId
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

            return topOfStackCardId;
        },
        /**
         * @param {Object[]} cards
         * @param {string} domId
         */
        moveTemporaryCardsFromDomIdToPlayerHand: function (cards, domId) {
            if (cards.length <= 0) {
                return;
            }

            let animations = [];
            for (let i = 0; i < cards.length; i++) {
                const position = this.getCardPositionInSpriteByColorAndValue(cards[i].color, cards[i].value);
                const backgroundPositionX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const backgroundPositionY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                animations[i] = this.slideTemporaryObject(
                    `<div class="velonimo-card front-side moving-card" style="position: absolute; background-position: -${backgroundPositionX}px -${backgroundPositionY}px; z-index: ${100 - i};"></div>`,
                    domId,
                    domId,
                    `player-table-${this.player_id}-hand`,
                    1000,
                    i * 1000
                );
                dojo.connect(animations[i], 'onEnd', () => {
                    this.playerHand.addToStockWithId(position, cards[i].id);
                    this.refreshPlayerHandSelectableCards();
                });
                animations[i].play();
            }
        },
        /**
         * @param {string} fromDomId
         * @param {string} toDomId
         * @param {number} numberOfCards
         */
        moveHiddenTemporaryCardsFromDomIdToDomId: function (fromDomId, toDomId, numberOfCards) {
            for (let i = 0; i < numberOfCards; i++) {
                this.slideTemporaryObject(
                    `<div class="velonimo-card back-side moving-card" style="position: absolute; z-index: ${100 - i};"></div>`,
                    fromDomId,
                    fromDomId,
                    toDomId,
                    1000,
                    i * 1000
                ).play();
            }
        },
        /**
         * /!\ 2P mode only
         *
         * @param {Object[]} cards
         */
        moveCardsFromDeckToPlayerHand: function (cards) {
            this.moveTemporaryCardsFromDomIdToPlayerHand(cards, DOM_ID_CARDS_DECK);
        },
        /**
         * /!\ 2P mode only
         *
         * @param {number} receiverId
         * @param {number} numberOfCards
         */
        moveCardsFromDeckToAnotherPlayer: function (receiverId, numberOfCards) {
            this.moveHiddenTemporaryCardsFromDomIdToDomId(DOM_ID_CARDS_DECK, `player-table-${receiverId}-hand`, numberOfCards);
        },
        /**
         * /!\ 2P mode only
         */
        setupDeckOfCards: function () {
            const numberOfCards = this.howManyCardsInDeck;
            const maxStackHeightInPx = 10;

            let stackShadow = `box-shadow: ${3}px ${3}px ${10}px ${0}px #222222;`;
            if (numberOfCards === 1) {
                stackShadow = '';
            } else if (numberOfCards < 4) {
                stackShadow = `box-shadow: ${1}px ${1}px ${10}px ${0}px #222222;`
            } else if (numberOfCards < 6) {
                stackShadow = `box-shadow: ${2}px ${2}px ${10}px ${0}px #222222;`
            }

            let cardsInDeckHtml = '';
            for (let i = 0; i < numberOfCards; i++) {
                cardsInDeckHtml += `<div class="card-in-deck" style="top: -${Math.min(i/4, maxStackHeightInPx)}px; left: -${Math.min(i/4, maxStackHeightInPx)}px; ${i === 0 ? stackShadow : ''}"></div>`;
            }

            $(DOM_ID_CARDS_DECK_CARDS).innerHTML = cardsInDeckHtml;
        },
        /**
         * /!\ 2P mode only
         *
         * @param {number} numberOfCards
         */
        decreaseNumberOfCardsInDeck: function (numberOfCards) {
            this.howManyCardsInDeck = (this.howManyCardsInDeck || numberOfCards) - numberOfCards;
            this.setupDeckOfCards();
        },
        /**
         * /!\ 2P mode only
         *
         * @param {Object[]} cards
         */
        setupAttackRewardCards: function (cards) {
            if (cards.length <= 0) {
                return;
            }

            const topOfStackCardId = this.buildAndPlacePlayedStackOfCards(cards, DOM_ID_ATTACK_REWARD_CARD);

            // place cards from where the animation will start
            this.placeOnObject(`cards-stack-${topOfStackCardId}`, DOM_ID_CARDS_DECK);

            // move cards to their destination
            this.slideToObject(`cards-stack-${topOfStackCardId}`, DOM_ID_ATTACK_REWARD_CARD).play();
        },
        /**
         * /!\ 2P mode only
         *
         * @param {number} receiverPlayerId
         * @param {Object[]} cards
         */
        moveAttackRewardCardsToPlayer: function (receiverPlayerId, cards) {
            if (cards.length <= 0) {
                return;
            }

            const rewardCardDomId = `cards-stack-${cards[0].id}`;
            const animation = this.slideToObject(
                rewardCardDomId,
                `player-table-${receiverPlayerId}-hand`
            );
            dojo.connect(animation, 'onEnd', () => {
                if (receiverPlayerId === this.player_id) {
                    this.addCardsToPlayerHand(cards);
                    this.refreshPlayerHandSelectableCards();
                }
                this.fadeOutAndDestroy(rewardCardDomId);
            });
            animation.play();
        },
        /**
         * @param {Object[]} cards
         */
        setupPreviousPlayedCards: function (cards) {
            if (cards.length <= 0) {
                return;
            }

            const topOfStackCardId = this.buildAndPlacePlayedStackOfCards(cards, DOM_ID_PREVIOUS_LAST_PLAYED_CARDS);

            // place cards from where the animation will start
            this.placeOnObject(`cards-stack-${topOfStackCardId}`, DOM_ID_LAST_PLAYED_CARDS);

            // move cards to their destination
            dojo.addClass(`cards-stack-${topOfStackCardId}`, DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED);
            this.slideToObject(`cards-stack-${topOfStackCardId}`, DOM_ID_PREVIOUS_LAST_PLAYED_CARDS).play();
        },
        /**
         * @param {number} playerId
         * @param {Object[]} cards
         */
        moveCardsFromPlayerHandToTable: function (playerId, cards) {
            if (cards.length <= 0) {
                return;
            }

            const topOfStackCardId = this.buildAndPlacePlayedStackOfCards(cards, DOM_ID_LAST_PLAYED_CARDS);

            // place cards from where the animation will start
            if (playerId !== this.player_id) {
                this.placeOnObject(`cards-stack-${topOfStackCardId}`, `player-table-${playerId}-hand`);
            } else if ($(`${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`)) {
                this.placeOnObject(`cards-stack-${topOfStackCardId}`, `${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`);
                cards.forEach((card) => {
                    this.playerHand.removeFromStockById(card.id);
                    this.refreshPlayerHandSelectableCards();
                });
            }

            // move cards to their destination
            this.slideToObject(`cards-stack-${topOfStackCardId}`, DOM_ID_LAST_PLAYED_CARDS).play();

            // show speech bubble
            $(`player-table-${playerId}-speech-bubble`).innerHTML = `${this.playedCardsValue}`;
            dojo.addClass(`player-table-${playerId}-speech-bubble`, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW);
        },
        /**
         * @param {number} senderId
         * @param {Object[]} cards
         */
        receiveCardsFromAnotherPlayer: function (senderId, cards) {
            this.moveTemporaryCardsFromDomIdToPlayerHand(cards, `player-table-${senderId}-hand`);
        },
        /**
         * @param {number} receiverId
         * @param {Object[]} cards
         */
        sendCardsToAnotherPlayer: function (receiverId, cards) {
            if (cards.length <= 0) {
                return;
            }

            // sort cards to always send them from right to left (to avoid a visual bug in player hand)
            const currentSortingMode = this.getCurrentPlayerCardsSortingMode();
            const sortedCards = [...cards].sort((a, b) => {
                switch (currentSortingMode) {
                    case PLAYER_HAND_SORT_BY_COLOR:
                        return this.getCardPositionInSpriteByColorAndValue(b.color, b.value) - this.getCardPositionInSpriteByColorAndValue(a.color, a.value);
                    case PLAYER_HAND_SORT_BY_VALUE:
                        return this.getCardWeightForColorAndValueToSortThemByValue(b.color, b.value) - this.getCardWeightForColorAndValueToSortThemByValue(a.color, a.value);
                    default:
                        return 0;
                }
            });

            let animations = [];
            for (let i = 0; i < sortedCards.length; i++) {
                const position = this.getCardPositionInSpriteByColorAndValue(sortedCards[i].color, sortedCards[i].value);
                const backgroundPositionX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const backgroundPositionY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                const animationStartDomId = $(`${DOM_ID_PLAYER_HAND}_item_${sortedCards[i].id}`) ? `${DOM_ID_PLAYER_HAND}_item_${sortedCards[i].id}` : `player-table-${this.player_id}-hand`;
                animations[i] = this.slideTemporaryObject(
                    `<div class="velonimo-card front-side moving-card" style="position: absolute; background-position: -${backgroundPositionX}px -${backgroundPositionY}px; z-index: ${100 - i};"></div>`,
                    `player-table-${this.player_id}-hand`,
                    animationStartDomId,
                    `player-table-${receiverId}-hand`,
                    1000,
                    i * 1000
                );
                dojo.connect(animations[i], 'onEnd', () => {
                    if (sortedCards[i + 1]) {
                        this.playerHand.removeFromStockById(sortedCards[i + 1].id);
                        this.refreshPlayerHandSelectableCards();
                    }
                });
                animations[i].play();
            }
            this.playerHand.removeFromStockById(sortedCards[0].id);
            this.refreshPlayerHandSelectableCards();
        },
        /**
         * @param {number} senderId
         * @param {number} receiverId
         * @param {number} numberOfCards
         */
        moveCardsBetweenTwoOtherPlayers: function (senderId, receiverId, numberOfCards) {
            this.moveHiddenTemporaryCardsFromDomIdToDomId(`player-table-${senderId}-hand`, `player-table-${receiverId}-hand`, numberOfCards);
        },
        /**
         * @param {number} playerId
         * @param {number} numberOfCards
         */
        increaseNumberOfCardsOfPlayer: function (playerId, numberOfCards) {
            this.players[playerId].howManyCards = this.players[playerId].howManyCards + numberOfCards;

            this.setupNumberOfCardsInPlayersHand();
        },
        /**
         * @param {number} playerId
         * @param {number} numberOfCards
         */
        decreaseNumberOfCardsOfPlayer: function (playerId, numberOfCards) {
            this.players[playerId].howManyCards = this.players[playerId].howManyCards - numberOfCards;

            this.setupNumberOfCardsInPlayersHand();
        },
        /**
         * @param {Object[]} cards
         */
        addCardsToPlayerHand: function (cards) {
            cards.forEach((card) => {
                this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id);
            });
        },
        addJerseyToPlayerHand: function () {
            const cards = this.getAllPlayerCards();
            if (cards.map((c) => c.id).includes(CARD_ID_JERSEY)) {
                return;
            }

            this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(COLOR_JERSEY, VALUE_JERSEY), CARD_ID_JERSEY);
        },
        /**
         * @param {Object[]} cards
         */
        addJerseyToCards: function (cards) {
            return cards.concat(
                this.getCardObjectFromPositionInSpriteAndId(
                    this.getCardPositionInSpriteByColorAndValue(COLOR_JERSEY, VALUE_JERSEY),
                    CARD_ID_JERSEY
                )
            );
        },
        removeJerseyFromPlayerHand: function () {
            const cards = this.getAllPlayerCards();
            if (!cards.map((c) => c.id).includes(CARD_ID_JERSEY)) {
                return;
            }

            this.playerHand.removeFromStockById(CARD_ID_JERSEY);
            this.refreshPlayerHandSelectableCards();
        },
        movePlayedCardsToPreviousPlayedCards: function () {
            dojo.query(`.${DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED}`).forEach(this.fadeOutAndDestroy);
            dojo.query(`#${DOM_ID_LAST_PLAYED_CARDS} .${DOM_CLASS_CARDS_STACK}`).forEach((elementDomId) => {
                dojo.addClass(elementDomId, DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED);
                const animation = this.slideToObject(elementDomId, DOM_ID_PREVIOUS_LAST_PLAYED_CARDS);
                dojo.connect(animation, 'onEnd', () => this.attachToNewParent(elementDomId, DOM_ID_PREVIOUS_LAST_PLAYED_CARDS));
                animation.play();
            });
        },
        discardAttackRewardCards: function () {
            dojo.query(`#${DOM_ID_ATTACK_REWARD_CARD} .${DOM_CLASS_CARDS_STACK}`).forEach(this.fadeOutAndDestroy);
        },
        discardPlayedCards: function () {
            this.playedCardsValue = 0;
            dojo.query(`#${DOM_ID_PLAYED_CARDS_WRAPPER} .${DOM_CLASS_CARDS_STACK}`).forEach(this.fadeOutAndDestroy);
        },
        discardPlayerSpeechBubbles: function () {
            dojo.query(`.${DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW}`).forEach((elementDomId) => {
                dojo.removeClass(elementDomId, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW);
            });
        },

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////
        onPlayCards: function () {
            if (!this.checkAction('playCards')) {
                return;
            }

            const cards = this.getSelectedPlayerCards();
            const withJersey = cards.map((c) => c.id).includes(CARD_ID_JERSEY);
            const playedCards = cards.filter((c) => c.id !== CARD_ID_JERSEY);
            if (playedCards.length <= 0) {
                return;
            }

            this.requestAction('playCards', {
                cards: playedCards.map(card => card.id).join(';'),
                withJersey: withJersey,
            });

            this.unselectAllCards();
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
        onSelectWhoTakeAttackReward: function (selectedPlayerId) {
            if (
                !this.is2PlayersMode()
                || !this.checkAction('selectWhoTakeAttackReward')
            ) {
                return;
            }

            this.requestAction('selectWhoTakeAttackReward', {
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
            if (selectedCards.length !== this.howManyCardsToGiveBack) {
                return;
            }

            this.requestAction('selectCardsToGiveBack', {
                cards: selectedCards.map(card => card.id).join(';'),
            });

            this.unselectAllCards();
        },
        /**
         * @returns {string}
         */
        getCurrentPlayerCardsSortingMode: function () {
            return dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort');
        },
        onClickOnTogglePlayerHandSortButton: function () {
            const currentSortingMode = this.getCurrentPlayerCardsSortingMode();
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
                ['cardsDealt', 1],
                ['roundStarted', 1],
                ['cardsPlayed', 1000],
                ['playedCardsDiscarded', 1],
                ['cardsReceivedFromAnotherPlayer', 1000],
                ['cardsSentToAnotherPlayer', 1000],
                ['cardsMovedBetweenTwoOtherPlayers', 1000, (notif) => (notif.args.receiverPlayerId === this.player_id || notif.args.senderPlayerId === this.player_id)],
                ['roundEnded', 1],
                // /!\ 2P mode only
                ['attackRewardCardsDiscarded', 1],
                // /!\ 2P mode only
                ['attackRewardCardsMovedToPlayer', 1000],
                // /!\ 2P mode only
                ['attackRewardCardsRevealed', 1000],
                // /!\ 2P mode only
                ['cardsReceivedFromDeck', 1000],
                // /!\ 2P mode only
                ['cardsMovedFromDeckToAnotherPlayer', 1000, (notif) => notif.args.receiverPlayerId === this.player_id],
            ].forEach((notif) => {
                const name = notif[0];
                const lockDurationInMs = notif[1];
                const ignoreNotifIfTrue = notif[2];

                dojo.subscribe(name, this, `notif_${name}`);
                this.notifqueue.setSynchronous(name, lockDurationInMs);

                if (ignoreNotifIfTrue) {
                    this.notifqueue.setIgnoreNotificationCheck(name, ignoreNotifIfTrue);
                }
            });
        },
        notif_cardsDealt: function (data) {
            this.playerHand.removeAll();
            this.addCardsToPlayerHand(data.args.cards);
            if (
                this.currentPlayerHasJersey
                && !this.jerseyHasBeenUsedInTheCurrentRound
            ) {
                this.addJerseyToPlayerHand();
            }
            this.refreshPlayerHandSelectableCards();
        },
        notif_roundStarted: function (data) {
            this.currentRound = data.args.currentRound;
            this.setupRoundsInfo();

            this.players = data.args.players;
            this.setupNumberOfCardsInPlayersHand();

            this.howManyCardsInDeck = data.args.numberOfCardsInDeck;
            this.setupDeckOfCards();
        },
        notif_cardsPlayed: function (data) {
            this.discardPlayerSpeechBubbles();
            this.movePlayedCardsToPreviousPlayedCards();

            // place new played cards
            this.playedCardsValue = data.args.playedCardsValue;
            const playedCardsWithJersey = data.args.withJersey
                ? this.addJerseyToCards(data.args.playedCards)
                : data.args.playedCards;
            this.moveCardsFromPlayerHandToTable(data.args.playedCardsPlayerId, playedCardsWithJersey);

            // update number of cards in players hand
            this.decreaseNumberOfCardsOfPlayer(data.args.playedCardsPlayerId, data.args.playedCards.length)

            // update jersey state if it has been used
            if (data.args.withJersey) {
                this.useJerseyForCurrentRound();
            }
        },
        notif_playedCardsDiscarded: function (data) {
            this.discardPlayerSpeechBubbles();
            this.discardPlayedCards();
        },
        notif_cardsReceivedFromAnotherPlayer: function (data) {
            this.decreaseNumberOfCardsOfPlayer(data.args.senderPlayerId, data.args.cards.length);

            this.receiveCardsFromAnotherPlayer(data.args.senderPlayerId, data.args.cards);

            this.increaseNumberOfCardsOfPlayer(this.player_id, data.args.cards.length);
        },
        notif_cardsSentToAnotherPlayer: function (data) {
            this.decreaseNumberOfCardsOfPlayer(this.player_id, data.args.cards.length);

            this.sendCardsToAnotherPlayer(data.args.receiverPlayerId, data.args.cards);

            this.increaseNumberOfCardsOfPlayer(data.args.receiverPlayerId, data.args.cards.length);
        },
        notif_cardsMovedBetweenTwoOtherPlayers: function (data) {
            this.decreaseNumberOfCardsOfPlayer(data.args.senderPlayerId, data.args.numberOfCards);

            this.moveCardsBetweenTwoOtherPlayers(data.args.senderPlayerId, data.args.receiverPlayerId, data.args.numberOfCards);

            this.increaseNumberOfCardsOfPlayer(data.args.receiverPlayerId, data.args.numberOfCards);
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
        /**
         * /!\ 2P mode only
         */
        notif_attackRewardCardsDiscarded: function (data) {
            this.discardAttackRewardCards();
        },
        /**
         * /!\ 2P mode only
         */
        notif_attackRewardCardsMovedToPlayer: function (data) {
            this.moveAttackRewardCardsToPlayer(data.args.receiverPlayerId, data.args.cards);

            this.increaseNumberOfCardsOfPlayer(data.args.receiverPlayerId, data.args.cards.length);
        },
        /**
         * /!\ 2P mode only
         */
        notif_attackRewardCardsRevealed: function (data) {
            this.decreaseNumberOfCardsInDeck(data.args.cards.length);
            this.setupAttackRewardCards(data.args.cards);
        },
        /**
         * /!\ 2P mode only
         */
        notif_cardsReceivedFromDeck: function (data) {
            this.moveCardsFromDeckToPlayerHand(data.args.cards);

            this.decreaseNumberOfCardsInDeck(data.args.numberOfCards);
            this.increaseNumberOfCardsOfPlayer(this.player_id, data.args.numberOfCards);
        },
        /**
         * /!\ 2P mode only
         */
        notif_cardsMovedFromDeckToAnotherPlayer: function (data) {
            this.moveCardsFromDeckToAnotherPlayer(data.args.receiverPlayerId, data.args.numberOfCards);

            this.decreaseNumberOfCardsInDeck(data.args.numberOfCards);
            this.increaseNumberOfCardsOfPlayer(data.args.receiverPlayerId, data.args.numberOfCards);
        },
   });
});
