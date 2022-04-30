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

// DOM IDs
const DOM_ID_BOARD_CARPET = 'board-carpet';
const DOM_ID_PLAYER_HAND = 'my-hand';
const DOM_ID_CURRENT_ROUND = 'current-round';
const DOM_ID_ACTION_BUTTON_PLAY_CARDS = 'action-button-play-cards';
const DOM_ID_ACTION_BUTTON_PASS_TURN = 'action-button-pass-turn';
const DOM_ID_ACTION_BUTTON_SELECT_NEXT_PLAYER = 'action-button-select-next-player';

// DOM classes
const DOM_CLASS_PLAYER_TABLE = 'player-table'
const DOM_CLASS_CARDS_STACK = 'cards-stack'
const DOM_CLASS_DISABLED_ACTION_BUTTON = 'disabled'
const DOM_CLASS_ACTIVE_PLAYER = 'active'
const DOM_CLASS_SELECTABLE_PLAYER = 'selectable'
const DOM_CLASS_NON_SELECTABLE_CARD = 'non-selectable-player-card'

define([
    'dojo','dojo/_base/declare',
    'ebg/core/gamegui',
    'ebg/counter',
    'ebg/stock',
],
function (dojo, declare) {
    return declare('bgagame.velonimo', ebg.core.gamegui, {
        /*
            Init global variables
         */
        constructor: function () {
            // GameInfo
            this.currentRound = 0;
            this.howManyRounds = 0;
            this.howManyPlayers = 0;
            this.players = [];

            // Board
            this.boardCarpetWidth = 740;
            this.boardCarpetHeight = 450;

            // Cards
            this.playerHand = null; // https://en.doc.boardgamearena.com/Stock
            this.cardWidth = 90;
            this.cardHeight = 126;

            // Player tables (a.k.a player places)
            this.playerTableWidth = 130;
            this.playerTableHeight = 130;
            this.playerTableBorderSize = 0;
            this.marginBetweenPlayers = 20;
            const TABLE_STYLE_HORIZONTAL_LEFT = `left: ${this.marginBetweenPlayers}px;`;
            const TABLE_STYLE_HORIZONTAL_CENTER = `left: ${(this.boardCarpetWidth / 2) - (this.playerTableWidth / 2) - (this.marginBetweenPlayers / 2)}px;`;
            const TABLE_STYLE_HORIZONTAL_RIGHT = `right: ${this.marginBetweenPlayers}px;`;
            const TABLE_STYLE_VERTICAL_TOP = `top: ${this.marginBetweenPlayers}px;`;
            const TABLE_STYLE_VERTICAL_BOTTOM = `bottom: ${this.marginBetweenPlayers}px;`;
            const CARDS_STYLE_ABOVE_TABLE = `top: -${this.cardHeight + this.playerTableBorderSize}px; left: -${this.playerTableBorderSize}px;`;
            const CARDS_STYLE_BELOW_TABLE = `bottom: -${this.cardHeight + this.playerTableBorderSize}px; left: -${this.playerTableBorderSize}px;`;
            // the current player place is always at the bottom of the board,
            // in a way that players always stay closed to their hand
            this.playersPlaceByNumberOfPlayers = {
                2: {
                    1: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                    2: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_BELOW_TABLE,
                    },
                },
                3: {
                    1: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
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
                4: {
                    1: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                    2: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_BELOW_TABLE,
                    },
                    3: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
                        cardsStyle: CARDS_STYLE_BELOW_TABLE,
                    },
                    4: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                },
                5: {
                    1: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                    2: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                    3: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
                        cardsStyle: CARDS_STYLE_BELOW_TABLE,
                    },
                    4: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
                        cardsStyle: CARDS_STYLE_BELOW_TABLE,
                    },
                    5: {
                        tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
                        cardsStyle: CARDS_STYLE_ABOVE_TABLE,
                    },
                },
            };
        },
        /*
            setup:

            This method must set up the game user interface according to current game situation specified
            in parameters.

            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player refreshes the game page (F5)

            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        setup: function (gamedatas) {
            console.log(gamedatas);
            this.currentRound = gamedatas.currentRound;
            this.howManyRounds = gamedatas.howManyRounds;

            // Setup board
            dojo.place(
                `<div id="${DOM_ID_BOARD_CARPET}"></div>
<div id="game-info" class="player-board">
    <div id="${DOM_ID_CURRENT_ROUND}"></div>
</div>`,
                'board'
            );

            // Setup players
            this.players = gamedatas.players;
            const playerIds = Object.keys(this.players);
            this.howManyPlayers = playerIds.length;
            // @TODO: always place the current player at the same position
            // @TODO: support spectators
            // let playerId = gamedatas.currentPlayerId;
            // if(!playerIds.includes(playerId)) {
            //     playerId = playerIds[0];
            // }
            const playersPlace = this.playersPlaceByNumberOfPlayers[this.howManyPlayers];
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                const playerPosition = playersPlace[player.position];

                dojo.place(this.format_block('jstpl_player_table', {
                    id: player.id,
                    color: player.color,
                    name: (player.name.length > 10 ? (player.name.substr(0,10) + '...') : player.name),
                    numberOfCardsInHand: player.howManyCards,
                    tableStyle: playerPosition.tableStyle,
                    cardsStyle: playerPosition.cardsStyle,
                }), DOM_ID_BOARD_CARPET);
            });

            // Init playerHand "ebg.stock" component
            this.playerHand = new ebg.stock();
            this.playerHand.create(this, $(DOM_ID_PLAYER_HAND), this.cardWidth, this.cardHeight);
            this.playerHand.setSelectionAppearance('class');
            this.playerHand.image_items_per_row = 7;
            const cardsImageUrl = g_gamethemeurl+'img/cards.png';
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
                ].forEach((value) => {
                    const cardPositionInSprite = this.getCardPositionInSpriteByColorAndValue(color, value);
                    this.playerHand.addItemType(
                        cardPositionInSprite, // stock item ID
                        cardPositionInSprite, // card weight (used for sorting)
                        cardsImageUrl, // sprite URL
                        cardPositionInSprite // position in sprite
                    );
                });
            });
            // adventurer cards
            [
                VALUE_25,
                VALUE_30,
                VALUE_35,
                VALUE_40,
                VALUE_45,
                VALUE_50,
            ].forEach((value) => {
                const cardPositionInSprite = this.getCardPositionInSpriteByColorAndValue(COLOR_ADVENTURER, value);
                this.playerHand.addItemType(
                    cardPositionInSprite, // stock item ID
                    cardPositionInSprite, // card weight (used for sorting)
                    cardsImageUrl, // sprite URL
                    cardPositionInSprite // position in sprite
                );
            });

            // Setup currentPlayer cards
            dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged');
            this.addCardsToPlayerHand(gamedatas.currentPlayerCards);

            // Setup cards played on table
            this.displayCardsOnTable(gamedatas.playedCardsPlayerId, gamedatas.playedCards);

            // Setup game info
            this.refreshGameInfos();

            // Setup game notifications to handle
            this.setupNotifications();
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        ///////////////////////////////////////////////////
        onEnteringState: function (state, data) {
            // show active player
            if (
                state === 'firstPlayerTurn'
                || state === 'playerTurn'
                || state === 'playerSelectNextPlayer'
            ) {
                dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);
            }

            // do special things for state
            switch (state) {
                case 'playerSelectNextPlayer':
                    if (this.player_id === data.args.activePlayerId) {
                        // hide active player
                        dojo.removeClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                        Object.entries(data.args.selectablePlayers).forEach((entry) => {
                            const player = entry[1];

                            // setup click on player tables
                            dojo.addClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                            this.connect($(`player-table-${player.id}`), 'onclick', () => this.onSelectNextPlayer(player.id));

                            // setup click on action buttons
                            this.addActionButton(`${DOM_ID_ACTION_BUTTON_SELECT_NEXT_PLAYER}-${player.id}`, player.name, () => this.onSelectNextPlayer(player.id), null, false, 'gray');
                            dojo.style(`${DOM_ID_ACTION_BUTTON_SELECT_NEXT_PLAYER}-${player.id}`, 'color', `#${player.color}`);
                        });
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
                    Object.entries(this.players).forEach((entry) => {
                        const player = entry[1];
                        dojo.removeClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                        this.disconnect($(`player-table-${player.id}`), 'onclick');
                    });
                    break;
            }
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
                    this.setupPlayCardsActionButton();
                    break;
            }
        },
        onPlayerHandSelectionChanged: function (controlName, itemId) {
            if (typeof itemId === 'undefined') {
                return;
            }

            const cardId = parseInt(itemId, 10);
            if (this.playerHand.isSelected(cardId)) {
                this.onPlayerCardSelected(cardId);
            } else {
                this.onPlayerCardUnselected(cardId);
            }

            const state = this.gamedatas.gamestate.name;
            switch (state) {
                case 'firstPlayerTurn':
                case 'playerTurn':
                    if (!this.isCurrentPlayerActive()) {
                        return;
                    }

                    this.setupPlayCardsActionButton();
                    break;
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods
        ///////////////////////////////////////////////////

        /**
         * @param {string} action
         * @param {object} data
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
        refreshGameInfos: function () {
            // display players data
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                // score
                if (this.scoreCtrl.hasOwnProperty(player.id)) {
                    this.scoreCtrl[player.id].toValue(player.score);
                }
                // number of remaining cards in player hand
                $(`player-table-${player.id}-number-of-cards`).innerHTML = player.howManyCards;
            });

            // display current round
            $(DOM_ID_CURRENT_ROUND).innerHTML = `${this.currentRound} / ${this.howManyRounds}`;
        },
        setupPlayCardsActionButton: function () {
            // @TODO: auto-pass if cannot play higher than last played value
            if (!$(DOM_ID_ACTION_BUTTON_PLAY_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_PLAY_CARDS, _('Play selected cards'), 'onPlayCards');
                dojo.place(`<span id="${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value"></span>`, DOM_ID_ACTION_BUTTON_PLAY_CARDS);
                this.addTooltip(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`, _('Total value of selected cards'), '');
            }

            // @TODO: do not enable button if less than last played value
            const selectedCards = this.getSelectedPlayerCards();
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_PLAY_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCards.length <= 0);
            $(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`).innerHTML = ` (${this.getCardsValue(selectedCards)})`;
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
        /**
         *
         * @param {number} position
         * @param {number} cardId
         * @returns {object}
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
         * @param {object[]} cards
         * @returns {object[]}
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
         * @param {object[]} playerCards
         * @returns {function (object[], object): object[]}
         */
        getPlayerCardsThatCannotBePlayedWithSelectedCardsReducer: function (playerCards) {
            return (acc, card) => acc.concat(
                this.getCardsThatCannotBePlayedWithCard(card.color, card.value, playerCards)
                    .filter((c) => acc.every((accCard) => c.id !== accCard.id))
            );
        },
        /**
         * @returns {object[]}
         */
        getAllPlayerCards: function () {
            return this.playerHand.getAllItems()
                .map((item) => this.getCardObjectFromPositionInSpriteAndId(item.type, item.id));
        },
        /**
         * @returns {object[]}
         */
        getSelectedPlayerCards: function () {
            return this.playerHand.getSelectedItems()
                .map((item) => this.getCardObjectFromPositionInSpriteAndId(item.type, item.id));
        },
        /**
         * @param {object[]} cards
         */
        getCardsValue: function (cards) {
            if (!cards.length) {
                return 0;
            }

            if (cards.length === 1) {
                return cards[0].value;
            }

            let minCardValue = 1000;
            cards.forEach((card) => {
                if (card.value < minCardValue) {
                    minCardValue = card.value;
                }
            });

            return (cards.length * 10) + minCardValue;
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardSelected: function (cardId) {
            const playerCards = this.getAllPlayerCards();
            const selectedCards = this.getSelectedPlayerCards();
            const playerCardsThatCannotBePlayedWithSelectedCards = selectedCards.reduce(
                this.getPlayerCardsThatCannotBePlayedWithSelectedCardsReducer(playerCards),
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
                    .reduce(this.getPlayerCardsThatCannotBePlayedWithSelectedCardsReducer(playerCards), [])
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
                    .reduce(this.getPlayerCardsThatCannotBePlayedWithSelectedCardsReducer(playerCards), [])
            );
        },
        /**
         * @param {object[]} cards
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
        /**
         * @param {object[]} cards
         */
        sortPlayedCards: function (cards) {
            return [...cards].sort((a, b) => b.value - a.value);
        },
        /**
         * @param {number} playerId
         * @param {object[]} cards
         */
        displayCardsOnTable: function (playerId, cards) {
            if (cards.length <= 0) {
                return;
            }

            const stackedCards = this.sortPlayedCards(cards);
            const topOfStackCardId = stackedCards[stackedCards.length - 1].id;

            // create played cards
            dojo.place(
                this.format_block('jstpl_cards_stack', {
                    id: topOfStackCardId,
                    width: ((stackedCards.length - 1) * (this.cardWidth / 3)) + this.cardWidth,
                }),
                `player-table-${playerId}-cards`
            );
            stackedCards.forEach((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value)
                dojo.place(
                    this.format_block('jstpl_card_in_stack', {
                        id: card.id,
                        x: (position % 7) * this.cardWidth,
                        y: Math.floor(position / 7) * this.cardHeight,
                    }),
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
         * @param {object[]} cards
         */
        addCardsToPlayerHand: function (cards) {
            cards.forEach((card) => {
                this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id );
            });
        },
        discardCards: function () {
            dojo.query(`.${DOM_CLASS_CARDS_STACK}`).forEach(dojo.destroy);
        },

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////

        onPlayCards: function () {
            if (!this.checkAction('playCards')) {
                return;
            }

            const playedCards = this.getSelectedPlayerCards();
            if (playedCards.length <= 0) {
                return;
            }

            this.requestAction('playCards', {
                cards: playedCards.map(card => card.id).join(';')
            });

            // reset cards selection
            this.playerHand.unselectAll();
            this.displayCardsAsNonSelectable([]);
            this.setupPlayCardsActionButton();
        },
        onPassTurn: function () {
            if (!this.checkAction('passTurn')) {
                return;
            }

            this.requestAction('passTurn', {});
        },
        onSelectNextPlayer: function (selectedPlayerId) {
            if (!this.checkAction('selectNextPlayer')) {
                return;
            }

            this.requestAction('selectNextPlayer', {
                selectedPlayerId: selectedPlayerId,
            });
        },

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications
        ///////////////////////////////////////////////////

        /*
            setupNotifications:

            In this method, you associate each of your game notifications with your local method to handle it.

            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your velonimo.game.php file.

        */
        setupNotifications: function () {
            [
                ['roundStarted', 1],
                ['cardsGiven', 1],
                ['cardsPlayed', 1000],
                ['cardsDiscarded', 1],
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
            this.refreshGameInfos();
        },
        notif_cardsGiven: function (data) {
            this.playerHand.removeAll();
            this.addCardsToPlayerHand(data.args.cards);
        },
        notif_cardsPlayed: function (data) {
            // remove last played cards
            this.discardCards();

            // place new played cards
            this.displayCardsOnTable(data.args.playerId, data.args.playedCards);

            // update number of cards in players hand
            this.players[data.args.playerId].howManyCards = data.args.remainingNumberOfCards;
            this.refreshGameInfos();
        },
        notif_cardsDiscarded: function (data) {
            this.discardCards();
        },
        notif_roundEnded: function (data) {
            this.players = data.args.players;
            this.refreshGameInfos();
        },
   });
});
