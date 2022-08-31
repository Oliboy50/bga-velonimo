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
const DOM_ID_PLAYER_HAND_TITLE_WRAPPER = 'my-hand-title-wrapper';
const DOM_ID_PLAYER_HAND_TITLE = 'my-hand-title';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON = 'toggle-sort-button';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL = 'toggle-sort-button-label';
const DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON = 'group-cards-button';
const DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON = 'ungroup-cards-button';
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
const DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED = 'previous-last-played-cards';
const DOM_CLASS_DISABLED_ACTION_BUTTON = 'disabled';
const DOM_CLASS_ACTIVE_PLAYER = 'active';
const DOM_CLASS_SELECTABLE_PLAYER = 'selectable';
const DOM_CLASS_NON_SELECTABLE_CARD = 'non-selectable-player-card';
const DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW = 'show-bubble';
const DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW_TEMPORARY = 'temporary-show-bubble';
const DOM_CLASS_SPEECH_BUBBLE = 'player-table-speech-bubble';
const DOM_CLASS_SPEECH_BUBBLE_LEFT = 'speech-bubble-on-left';
const DOM_CLASS_SPEECH_BUBBLE_RIGHT = 'speech-bubble-on-right';
const DOM_CLASS_CARDS_GROUP_CARD = 'cards-group-card';
const DOM_CLASS_CARDS_GROUP_CARD_LEFT = 'cards-group-card-left';
const DOM_CLASS_CARDS_GROUP_CARD_RIGHT = 'cards-group-card-right';

// Player hand sorting modes
const PLAYER_HAND_SORT_BY_COLOR = 'color';
const PLAYER_HAND_SORT_BY_VALUE = 'value';

// Style
const BOARD_CARPET_WIDTH = 740;
const CARD_WIDTH = 90;
const CARD_HEIGHT = 126;
const PLAYER_TABLE_WIDTH = 200;
const PLAYER_TABLE_HEIGHT = CARD_HEIGHT;
const PLAYER_TABLE_HORIZONTAL_MIDDLE_MARGIN = 100;
const TABLE_STYLE_HORIZONTAL_LEFT = `left: 0;`;
const TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT = `left: ${PLAYER_TABLE_HORIZONTAL_MIDDLE_MARGIN}px;`;
const TABLE_STYLE_HORIZONTAL_CENTER = `left: ${(BOARD_CARPET_WIDTH / 2) - (PLAYER_TABLE_WIDTH / 2)}px;`;
const TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT = `left: ${BOARD_CARPET_WIDTH - (PLAYER_TABLE_WIDTH + PLAYER_TABLE_HORIZONTAL_MIDDLE_MARGIN)}px;`;
const TABLE_STYLE_HORIZONTAL_RIGHT = `left: ${BOARD_CARPET_WIDTH - PLAYER_TABLE_WIDTH}px;`;
const TABLE_STYLE_VERTICAL_TOP = `top: 0;`;
const TABLE_STYLE_VERTICAL_BOTTOM = `bottom: 0;`;
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
            this.resetCurrentState();
            this.currentRound = 0;
            this.currentPlayerHasJersey = false;
            this.jerseyHasBeenUsedInTheCurrentRound = false;
            this.howManyRounds = 0;
            this.playedCardsValue = 0;
            this.howManyCardsToGiveBack = 0;
            this.players = {};
            this.playerHand = null; // https://en.doc.boardgamearena.com/Stock
            // /!\ 2P mode only
            this.howManyCardsInDeck = 0;
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.timeoutToRefreshDisplayedNumberOfCards = null;
            this.resetCardsGroups();
        },
        setup: function (gamedatas) {
            this.currentState = gamedatas.gamestate.name;
            this.currentRound = gamedatas.currentRound;
            this.jerseyHasBeenUsedInTheCurrentRound = gamedatas.jerseyHasBeenUsedInTheCurrentRound;
            this.howManyRounds = gamedatas.howManyRounds;

            // setup board
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
    <div id="${DOM_ID_PLAYER_HAND_TITLE_WRAPPER}">
        <h3 id="${DOM_ID_PLAYER_HAND_TITLE}">${_('My hand')}</h3>
        <a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON}" class="bgabutton bgabutton_gray"><span id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL}"></span></a>
    </div>
    <div id="${DOM_ID_PLAYER_HAND}"></div>
</div>`,
                DOM_ID_APP
            );

            // setup players
            this.players = gamedatas.players;
            const howManyPlayers = Object.keys(this.players).length;
            const playersPlace = PLAYERS_PLACES_BY_NUMBER_OF_PLAYERS[howManyPlayers];
            this.sortPlayersToHaveTheCurrentPlayerFirstIfPresent(
                this.sortPlayersByTurnOrderPosition(Object.entries(this.players).map((entry) => entry[1])),
                gamedatas.currentPlayerId
            ).forEach((player, index) => {
                const playerPosition = playersPlace[index];
                const playerColorRGB = `#${player.color}`;
                const isPositionTop = playerPosition.tableStyle.indexOf('top') !== -1;
                const hasJerseyOnLeft = playerPosition.bubbleClass.indexOf('left') !== -1;

                dojo.place(
                    `<div id="player-table-${player.id}" class="${DOM_CLASS_PLAYER_TABLE} ${isPositionTop ? 'player-position-top' : 'player-position-bottom'} ${hasJerseyOnLeft ? 'player-position-jersey-left' : 'player-position-jersey-right'}" style="width: ${PLAYER_TABLE_WIDTH}px; height: ${PLAYER_TABLE_HEIGHT}px; ${playerPosition.tableStyle}">
    <div class="player-table-name" style="color: ${playerColorRGB};"><span>${(player.name.length > 10 ? (player.name.substr(0,10) + '...') : player.name)}</span></div>
    <div id="player-table-${player.id}-hand" class="player-table-hand"><div id="player-table-${player.id}-hand-cards" class="player-table-hand-cards"></div></div>
    <div id="player-table-${player.id}-jersey" class="player-table-jersey"></div>
    <div id="player-table-${player.id}-finish-position" class="player-table-finish-position"></div>
    <div id="player-table-${player.id}-speech-bubble" class="${DOM_CLASS_SPEECH_BUBBLE} ${playerPosition.bubbleClass}" style="color: ${playerColorRGB};"></div>
</div>`,
                    DOM_ID_BOARD_CARPET);
            });
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.setupPlayersHiddenCards();
            this.setupPlayersFinishPosition();

            // setup jersey
            if (gamedatas.jerseyHasBeenUsedInTheCurrentRound) {
                this.useJerseyForCurrentRound();
            } else {
                this.restoreJerseyForCurrentRound();
            }
            this.moveJerseyToCurrentWinner();

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

            // init playerHand "ebg.stock" component
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
            dojo.connect(this.playerHand, 'onChangeSelection', this, (_, itemId) => {
                if (typeof itemId === 'undefined') {
                    return;
                }

                const cardId = parseInt(itemId, 10);
                if (this.playerHand.isSelected(cardId)) {
                    this.onPlayerCardSelected(cardId);
                } else {
                    this.onPlayerCardUnselected(cardId);
                }
            });
            // sort cards
            this.onClickOnTogglePlayerHandSortButton();
            dojo.connect($(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON), 'onclick', this, 'onClickOnTogglePlayerHandSortButton');
            // setup currentPlayer cards
            this.addCardsToPlayerHand(
                (this.currentPlayerHasJersey && !this.jerseyHasBeenUsedInTheCurrentRound)
                    ? this.addJerseyToCards(gamedatas.currentPlayerCards)
                    : gamedatas.currentPlayerCards,
                false
            );

            // setup cards played on table
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

            // setup players score
            this.setupPlayersScore();

            // setup rounds info
            this.setupRoundsInfo();

            // handle game notifications
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
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);
                    break;
                case 'playerSelectNextPlayer':
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectNextPlayer);
                    break;
                case 'playerSelectWhoTakeAttackReward':
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectWhoTakeAttackReward);
                    break;
                case 'playerSelectPlayerToPickCards':
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.setupSelectPlayerAction(data.args.activePlayerId, data.args.selectablePlayers, this.onSelectPlayerToPickCards);
                    break;
                case 'playerGiveCardsBackAfterPicking':
                    dojo.addClass(`player-table-${data.args.activePlayerId}`, DOM_CLASS_ACTIVE_PLAYER);

                    this.howManyCardsToGiveBack = data.args.numberOfCards;
                    break;
            }
        },
        onLeavingState: function (state) {
            dojo.query(`.${DOM_CLASS_PLAYER_TABLE}`).removeClass(DOM_CLASS_ACTIVE_PLAYER);

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

            this.resetCurrentState();
        },
        onUpdateActionButtons: function (state, args) {
            this.removeActionButtons();

            if (!this.isCurrentPlayerActive()) {
                return;
            }

            this.currentState = state;
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

        ///////////////////////////////////////////////////
        //// Utility methods
        ///////////////////////////////////////////////////
        /**
         * @Override format_string_recursive BGA framework function
         * @see https://en.doc.boardgamearena.com/BGA_Studio_Cookbook#Inject_images_and_styled_html_in_the_log
         */
        format_string_recursive: function (log, args) {
            try {
                if (log && args && !args.processed) {
                    args.processed = true;

                    for (let key in args) {
                        switch (key) {
                            case 'cardsImage':
                                args[key] = this.getLogHtmlForCards(args[key]);
                                break;
                        }
                    }
                }
            } catch (e) {
                console.error("Custom format_string_recursive thrown", log, args, e.stack);
            }
            return this.inherited(arguments); // equivalent to "super()"
        },
        /**
         * @param {Object[]} cards
         * @returns {string}
         */
        getLogHtmlForCards: function (cards) {
            const getWidthForCard = (card) => {
                if (card.color === COLOR_ADVENTURER) {
                    return 32;
                }
                if (card.color === COLOR_JERSEY) {
                    return 25;
                }
                return 17;
            };
            const getBackgroundOffsetXForCard = (card) => {
                if (card.color === COLOR_ADVENTURER) {
                    return 6;
                }
                if (card.value === VALUE_1) {
                    return 12;
                }
                if (card.value === VALUE_2) {
                    return 63;
                }
                if (card.value === VALUE_7) {
                    return 10;
                }
                if (card.color === COLOR_JERSEY) {
                    return 6;
                }
                return 11;
            };
            const getBackgroundOffsetYForCard = (card) => {
                if (card.color === COLOR_ADVENTURER) {
                    return 8;
                }
                return 7;
            };

            return this.sortPlayedCards(cards).map((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const backgroundX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position) + getBackgroundOffsetXForCard(card);
                const backgroundY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position) + getBackgroundOffsetYForCard(card);

                return `<div class="velonimo-card front-side" style="width: ${getWidthForCard(card)}px; height: 24px; background-position: -${backgroundX}px -${backgroundY}px;"></div>`;
            }).join(' ');
        },
        /**
         * @param {Object} card
         * @returns {[string, string]|null}
         * @see https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Tooltips
         */
        getTooltipTextsForCard: function (card) {
            switch (card.color) {
                case COLOR_BLUE:
                case COLOR_BROWN:
                case COLOR_GRAY:
                case COLOR_GREEN:
                case COLOR_PINK:
                case COLOR_RED:
                case COLOR_YELLOW:
                    if (card.value === VALUE_1) {
                        return [
                            _('Leader - Value: 1 - For each leader played, you must randomly pick 1 card from the player hand of your choice, then give this player back 1 card of your choice.'),
                            '',
                        ];
                    } else if (
                        card.value === VALUE_2
                        && this.is2PlayersMode()
                    ) {
                        return [
                            _('Water carrier - Value: 2 - For each water carrier played, you must draw 1 card from the deck (even if this was your last card).'),
                            '',
                        ];
                    } else {
                        return null;
                    }
                case COLOR_ADVENTURER:
                    return [
                        dojo.string.substitute(_('Adventurer - Value: ${v} - This card cannot be played with others, because the adventurers does not belong to a team, they always play solo.'), { v: card.value }),
                        '',
                    ];
                case COLOR_JERSEY:
                    return [
                        _('Carrot polka dot Jersey - Value: +10 - It adds 10 points to any valid card combinations (one or more colored cards). It cannot be played with adventurers.'),
                        ''
                    ];
                default:
                    return null;
            }
        },
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
        resetDisplayedNumberOfCardsByPlayerId: function () {
            this.displayedNumberOfCardsByPlayerId = {};
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                this.displayedNumberOfCardsByPlayerId[player.id] = player.howManyCards;
            });
        },
        setupRoundsInfo: function () {
            $(DOM_ID_CURRENT_ROUND).innerHTML = `${this.currentRound} / ${this.howManyRounds}`;
        },
        setupPlayersHiddenCards: function () {
            const getCardRotateDeg = (numberOfCards, i) => {
                if (numberOfCards === 1) {
                    return 0;
                }

                const offset = numberOfCards * 2;

                return offset + ((i * -1) * 5);
            };
            Object.entries(this.displayedNumberOfCardsByPlayerId).forEach((entry) => {
                const playerId = entry[0];
                const howManyCards = entry[1];

                const playerCardsHtml = [];
                for (let i = 0; i < howManyCards; i++) {
                    playerCardsHtml.push(`<div id="player-table-${playerId}-card-${i}" class="velonimo-card back-side" style="transform: rotate(${getCardRotateDeg(howManyCards, i)}deg);"></div>`);
                }
                $(`player-table-${playerId}-hand-cards`).innerHTML = playerCardsHtml.join('');
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
        setupPlayersFinishPosition: function () {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                const playerCurrentRoundRank = this.getCurrentRoundRankFromPlayerRoundsRanking(player.roundsRanking || {});
                dojo.removeClass(`player-table-${player.id}`, `has-finished-1`);
                dojo.removeClass(`player-table-${player.id}`, `has-finished-2`);
                dojo.removeClass(`player-table-${player.id}`, `has-finished-3`);
                if (playerCurrentRoundRank) {
                    dojo.addClass(`player-table-${player.id}`, `has-finished-${playerCurrentRoundRank}`);
                }
            });
        },
        setupPlayCardsActionButtonIfNeeded: function () {
            if (
                this.isCurrentPlayerActive()
                && (
                    this.currentState === 'firstPlayerTurn'
                    || this.currentState === 'playerTurn'
                )
                && this.currentPlayerCanPlayCards()
            ) {
                this.setupPlayCardsActionButton();
            }
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
                Object.entries(selectablePlayers).forEach((entry) => {
                    const player = entry[1];

                    // setup click on player tables
                    dojo.addClass(`player-table-${player.id}`, DOM_CLASS_SELECTABLE_PLAYER);
                    this.connect($(`player-table-${player.id}`), 'onclick', () => onClickOnActionButton.bind(this)(player.id));

                    // setup click on action buttons
                    this.addActionButton(`${DOM_ID_ACTION_BUTTON_SELECT_PLAYER}-${player.id}`, player.name, () => onClickOnActionButton.bind(this)(player.id), null, false, 'gray');
                    dojo.style(`${DOM_ID_ACTION_BUTTON_SELECT_PLAYER}-${player.id}`, 'color', `#${player.color}`);
                });
            }
        },
        setupGiveCardsBackAfterPickingActionButton: function () {
            this.setupPlayerHandSelectableCards();

            const selectedCards = this.getSelectedPlayerCards();
            if (!$(DOM_ID_ACTION_BUTTON_GIVE_CARDS)) {
                this.addActionButton(DOM_ID_ACTION_BUTTON_GIVE_CARDS, _('Give selected cards'), 'onSelectCardsToGiveBack');
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_GIVE_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, (selectedCards.length === 0) || (selectedCards.length !== this.howManyCardsToGiveBack));
        },
        /**
         * @param {number|undefined} [previousJerseyWearerId]
         */
        moveJerseyToCurrentWinner: function (previousJerseyWearerId) {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                const isCurrentPlayer = this.player_id === player.id;

                if (player.isWearingJersey) {
                    this.currentPlayerHasJersey = isCurrentPlayer;

                    if (!dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_IS_WEARING_JERSEY)) {
                        if (previousJerseyWearerId) {
                            // move jersey from player A to player B,
                            // then add isWearingJersey class to player B at the end of the animation
                            const animation = this.slideTemporaryObject(
                                `<div class="moving-jersey"></div>`,
                                `player-table-${previousJerseyWearerId}-jersey`,
                                `player-table-${previousJerseyWearerId}-jersey`,
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
        /**
         * @param {Object} roundsRanking
         * @returns {number|undefined}
         */
        getCurrentRoundRankFromPlayerRoundsRanking: function (roundsRanking) {
            if (!roundsRanking[this.currentRound]) {
                return undefined;
            }

            return roundsRanking[this.currentRound];
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
        getSortingWeightForCardsGroups: function () {
            const cardsWeightByPosition = {};
            this.cardsGroups.forEach((group) => {
                const groupValue = this.getCardsValue(group.cards);
                group.cards.forEach((card, i) => {
                    const cardPosition = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                    cardsWeightByPosition[cardPosition] = ((-10 * group.id) - (1000 * groupValue)) + i;
                });
            });

            return cardsWeightByPosition;
        },
        sortPlayerCardsByCurrentSortingMode: function () {
            const currentSortingMode = this.getCurrentPlayerCardsSortingMode();
            if (currentSortingMode === PLAYER_HAND_SORT_BY_COLOR) {
                this.sortPlayerCardsByColor();
            } else {
                this.sortPlayerCardsByValue();
            }
        },
        sortPlayerCardsByColor: function () {
            const cardsWeightByPosition = {};
            this.execFnForEachCardsInGame((color, value) => {
                const cardPositionAndWeight = this.getCardPositionInSpriteByColorAndValue(color, value);
                cardsWeightByPosition[cardPositionAndWeight] = cardPositionAndWeight;
            });

            this.playerHand.changeItemsWeight(Object.assign(cardsWeightByPosition, this.getSortingWeightForCardsGroups()));
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

            this.playerHand.changeItemsWeight(Object.assign(cardsWeightByPosition, this.getSortingWeightForCardsGroups()));
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
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        getPlayerCardsThatCanBePlayedWithCards: function (cards) {
            const playerCards = this.getAllPlayerCards();
            if (cards.length === 0) {
                return playerCards;
            }

            return cards.reduce(
                (acc, card, i, cards) => acc.concat(
                    this.getCardsThatCanBePlayedWithCard(card.color, card.value, playerCards)
                        .filter((c) => acc.every((accCard) => c.id !== accCard.id))
                ).filter((c) => cards.every((cardsCard) => c.id !== cardsCard.id)),
                []
            );
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
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        getPlayerCardsThatCannotBePlayedWithCards: function (cards) {
            if (cards.length === 0) {
                return [];
            }

            const playerCards = this.getAllPlayerCards();

            return cards.reduce(
                (acc, card) => acc.concat(
                    this.getCardsThatCannotBePlayedWithCard(card.color, card.value, playerCards)
                        .filter((c) => acc.every((accCard) => c.id !== accCard.id))
                ),
                []
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
                const cardsThatCanBePlayedWithCard = this.getPlayerCardsThatCanBePlayedWithCards([card]);

                if (!cardsThatCanBePlayedWithCard.length) {
                    // add single card combination
                    return [...acc, [card]];
                }

                return [
                    ...acc,
                    // add highest color combination
                    [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.color === card.color || c.id === CARD_ID_JERSEY).sort(sortCardsById),
                    // add highest value combination
                    [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.value === card.value || c.id === CARD_ID_JERSEY).sort(sortCardsById),
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

            // an adventurer is only playable solo (and without jersey)
            const adventurer = cardsWithoutJersey.find((c) => c.color === COLOR_ADVENTURER);
            if (adventurer) {
                return adventurer.value;
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

            return this.playedCardsValue < playerCardsCombinations[0].value;
        },
        setupPlayerHandSelectableCards: function () {
            const selectedCards = this.getSelectedPlayerCards();

            if (
                this.isCurrentPlayerActive()
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                if (this.playerHand.isSelected(CARD_ID_JERSEY)) {
                    this.playerHand.unselectItem(CARD_ID_JERSEY);
                }
                this.displayCardsAsNonSelectable(this.addJerseyToCards([]));
            } else {
                this.displayCardsAsNonSelectable(this.getPlayerCardsThatCannotBePlayedWithCards(selectedCards));
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
        /**
         * @param {Object[]} cards
         */
        selectCards: function (cards) {
            cards.forEach((c) => {
                if (
                    $(`${DOM_ID_PLAYER_HAND}_item_${c.id}`)
                    && !this.playerHand.isSelected(c.id)
                ) {
                    this.playerHand.selectItem(c.id);
                }
            });
            this.setupPlayerHandSelectableCards();
            this.setupGroupCardsButton();
            this.setupPlayCardsActionButtonIfNeeded();
        },
        /**
         * @param {Object[]} cards
         */
        unselectCards: function (cards) {
            cards.forEach((c) => {
                if (
                    $(`${DOM_ID_PLAYER_HAND}_item_${c.id}`)
                    && this.playerHand.isSelected(c.id)
                ) {
                    this.playerHand.unselectItem(c.id);
                }
            });
            this.setupPlayerHandSelectableCards();
            this.setupGroupCardsButton();
            this.setupPlayCardsActionButtonIfNeeded();
        },
        unselectAllCards: function () {
            this.playerHand.unselectAll();
            this.setupPlayerHandSelectableCards();
            this.setupGroupCardsButton();
            this.setupPlayCardsActionButtonIfNeeded();
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
                console.error(cards, placeDomId);
                throw new Error(`buildAndPlacePlayedStackOfCards`);
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
         * @param {function(number)} [onBeforeFirstAnimation]
         * @param {function(number)} [onAfterEachAnimation]
         */
        moveTemporaryCardsFromDomIdToPlayerHand: function (cards, domId, onBeforeFirstAnimation, onAfterEachAnimation) {
            if (cards.length <= 0) {
                return;
            }

            if (typeof onBeforeFirstAnimation === 'function') {
                onBeforeFirstAnimation.bind(this)(0);
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
                if (typeof onAfterEachAnimation === 'function') {
                    dojo.connect(animations[i], 'onEnd', () => onAfterEachAnimation.bind(this)(i));
                }
                animations[i].play();
            }
        },
        /**
         * @param {string} fromDomId
         * @param {string} toDomId
         * @param {number} numberOfCards
         * @param {function(number)} [onBeforeFirstAnimation]
         * @param {function(number)} [onAfterEachAnimation]
         */
        moveHiddenTemporaryCardsFromDomIdToDomId: function (fromDomId, toDomId, numberOfCards, onBeforeFirstAnimation, onAfterEachAnimation) {
            if (numberOfCards <= 0) {
                return;
            }

            if (typeof onBeforeFirstAnimation === 'function') {
                onBeforeFirstAnimation.bind(this)(0);
            }

            let animations = [];
            for (let i = 0; i < numberOfCards; i++) {
                animations[i] = this.slideTemporaryObject(
                    `<div class="velonimo-card back-side moving-card" style="position: absolute; z-index: ${100 - i};"></div>`,
                    fromDomId,
                    fromDomId,
                    toDomId,
                    1000,
                    i * 1000
                );
                if (typeof onAfterEachAnimation === 'function') {
                    dojo.connect(animations[i], 'onEnd', () => onAfterEachAnimation.bind(this)(i));
                }
                animations[i].play();
            }
        },
        /**
         * /!\ 2P mode only
         *
         * @param {Object[]} cards
         */
        moveCardsFromDeckToPlayerHand: function (cards) {
            this.moveTemporaryCardsFromDomIdToPlayerHand(
                cards,
                DOM_ID_CARDS_DECK,
                () => {
                    this.decreaseNumberOfCardsInDeck(1);
                },
                (animationIndex) => {
                    if ((animationIndex + 1) < cards.length) {
                        this.decreaseNumberOfCardsInDeck(1);
                    }

                    this.addCardsToPlayerHand([cards[animationIndex]]);
                }
            );
        },
        /**
         * /!\ 2P mode only
         *
         * @param {number} receiverId
         * @param {number} numberOfCards
         */
        moveCardsFromDeckToAnotherPlayer: function (receiverId, numberOfCards) {
            this.moveHiddenTemporaryCardsFromDomIdToDomId(
                DOM_ID_CARDS_DECK,
                `player-table-${receiverId}-hand`,
                numberOfCards,
                () => {
                    this.decreaseNumberOfCardsInDeck(1);
                },
                (animationIndex) => {
                    if ((animationIndex + 1) < numberOfCards) {
                        this.decreaseNumberOfCardsInDeck(1);
                    }

                    this.increaseNumberOfCardsOfPlayer(receiverId, 1);
                }
            );
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
            const removableNumberOfCards = Math.max(0, Math.min(numberOfCards, this.howManyCardsInDeck));
            this.howManyCardsInDeck = this.howManyCardsInDeck - removableNumberOfCards;
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
                } else {
                    this.increaseNumberOfCardsOfPlayer(receiverPlayerId, cards.length);
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
         */
        showTurnPassedBubbleForAFewSeconds: function (playerId) {
            $(`player-table-${playerId}-speech-bubble`).innerHTML = '<i class="fa fa-repeat"></i>';
            dojo.addClass(`player-table-${playerId}-speech-bubble`, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW_TEMPORARY);
            setTimeout(
                () => dojo.removeClass(`player-table-${playerId}-speech-bubble`, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW_TEMPORARY),
                1000
            );
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
                cards.forEach((card) => {
                    if (card.id !== CARD_ID_JERSEY) {
                        this.decreaseNumberOfCardsOfPlayer(playerId, 1);
                    }
                });
            } else if ($(`${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`)) {
                this.placeOnObject(`cards-stack-${topOfStackCardId}`, `${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`);
                cards.forEach((card) => {
                    this.removeCardFromPlayerHand(card.id);
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
            this.moveTemporaryCardsFromDomIdToPlayerHand(
                cards,
                `player-table-${senderId}-hand`,
                () => {
                    this.decreaseNumberOfCardsOfPlayer(senderId, 1);
                },
                (animationIndex) => {
                    if ((animationIndex + 1) < cards.length) {
                        this.decreaseNumberOfCardsOfPlayer(senderId, 1);
                    }

                    this.addCardsToPlayerHand([cards[animationIndex]]);
                }
            );
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

            this.removeCardFromPlayerHand(sortedCards[0].id);

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
                        this.removeCardFromPlayerHand(sortedCards[i + 1].id);
                    }
                    // sort cards after the last animation (in case a group has been removed)
                    if (i + 1 === sortedCards.length) {
                        this.sortPlayerCardsByCurrentSortingMode();
                    }

                    this.increaseNumberOfCardsOfPlayer(receiverId, 1);
                });
                animations[i].play();
            }
        },
        /**
         * @param {number} senderId
         * @param {number} receiverId
         * @param {number} numberOfCards
         */
        moveCardsBetweenTwoOtherPlayers: function (senderId, receiverId, numberOfCards) {
            this.moveHiddenTemporaryCardsFromDomIdToDomId(
                `player-table-${senderId}-hand`,
                `player-table-${receiverId}-hand`,
                numberOfCards,
                () => {
                    this.decreaseNumberOfCardsOfPlayer(senderId, 1);
                },
                (animationIndex) => {
                    if ((animationIndex + 1) < numberOfCards) {
                        this.decreaseNumberOfCardsOfPlayer(senderId, 1);
                    }

                    this.increaseNumberOfCardsOfPlayer(receiverId, 1);
                }
            );
        },
        /**
         * @param {number} playerId
         * @param {number} numberOfCards
         */
        increaseNumberOfCardsOfPlayer: function (playerId, numberOfCards) {
            const addableNumberOfCards = Math.max(0, numberOfCards);
            this.displayedNumberOfCardsByPlayerId[playerId] = this.displayedNumberOfCardsByPlayerId[playerId] + addableNumberOfCards;

            this.updatePlayersHiddenCardsWithEventualConsistency();
        },
        /**
         * @param {number} playerId
         * @param {number} numberOfCards
         */
        decreaseNumberOfCardsOfPlayer: function (playerId, numberOfCards) {
            const removableNumberOfCards = Math.max(0, Math.min(numberOfCards, this.displayedNumberOfCardsByPlayerId[playerId]));
            this.displayedNumberOfCardsByPlayerId[playerId] = this.displayedNumberOfCardsByPlayerId[playerId] - removableNumberOfCards;

            this.updatePlayersHiddenCardsWithEventualConsistency();
        },
        /**
         * Setup players hidden cards and eventually update the correct number of cards for each player (in case some card animations did not work)
         */
        updatePlayersHiddenCardsWithEventualConsistency: function () {
            this.setupPlayersHiddenCards();

            if (this.timeoutToRefreshDisplayedNumberOfCards !== null) {
                clearTimeout(this.timeoutToRefreshDisplayedNumberOfCards);
            }
            this.timeoutToRefreshDisplayedNumberOfCards = setTimeout(
                () => {
                    this.resetDisplayedNumberOfCardsByPlayerId();
                    this.setupPlayersHiddenCards();
                },
                3000
            );
        },
        /**
         * @param {Object[]} cards
         * @param {boolean=true} updateNumberOfCards
         */
        addCardsToPlayerHand: function (cards, updateNumberOfCards) {
            if (typeof updateNumberOfCards === 'undefined') {
                updateNumberOfCards = true;
            }

            cards.forEach((card) => {
                if (
                    updateNumberOfCards
                    && card.id !== CARD_ID_JERSEY
                ) {
                    this.increaseNumberOfCardsOfPlayer(this.player_id, 1);
                }
                this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id);
                const tooltipTextsForCard = this.getTooltipTextsForCard(card);
                if (tooltipTextsForCard) {
                    this.addTooltip(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, tooltipTextsForCard[0], tooltipTextsForCard[1]);
                }
            });
            this.setupPlayerHandSelectableCards();
        },
        /**
         * @param {number} cardId
         */
        removeCardFromPlayerHand: function (cardId) {
            this.cardsGroups.forEach((group) => {
                if (group.cards.map((c) => c.id).includes(cardId)) {
                    this.removeCardsGroup(group.id);
                }
            });
            this.setupGroupCardsButton();

            this.playerHand.removeFromStockById(cardId);
            if (cardId !== CARD_ID_JERSEY) {
                this.decreaseNumberOfCardsOfPlayer(this.player_id, 1);
            }
            this.setupPlayerHandSelectableCards();
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
        /**
         * @returns {string}
         */
        getCurrentPlayerCardsSortingMode: function () {
            return dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort');
        },
        setupGroupCardsButton: function () {
            // clean cards group buttons
            if ($(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON)) {
                this.disconnect($(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON), 'onclick');
                dojo.destroy(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON);
            }
            if ($(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON)) {
                this.disconnect($(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON), 'onclick');
                dojo.destroy(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON);
            }

            const selectedCards = this.getSelectedPlayerCards();
            if (!selectedCards.length) {
                return;
            }

            const selectedCardsGroup = this.getCardsGroupForCards(selectedCards);
            if (selectedCardsGroup) {
                if (!$(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON)) {
                    dojo.place(
                        `<a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON}" class="bgabutton bgabutton_red"><span>${_('Ungroup cards')}</span></a>`,
                        DOM_ID_PLAYER_HAND_TITLE_WRAPPER
                    );
                    this.addTooltip(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON, '', _('Click this button to stop grouping selected cards.'));
                    this.connect($(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON), 'onclick', 'onClickOnUngroupCardsButton');
                }
            } else if (selectedCards.length > 1) {
                if (!$(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON)) {
                    dojo.place(
                        `<a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON}" class="bgabutton bgabutton_blue"><span>${_('Group cards')}</span></a>`,
                        DOM_ID_PLAYER_HAND_TITLE_WRAPPER
                    );
                    this.addTooltip(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON, '', _('Click this button to group selected cards. Grouped cards are not affected by sorting.'));
                    this.connect($(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON), 'onclick', 'onClickOnGroupCardsButton');
                }
            }
        },
        /**
         * @param {number} cardId
         * @returns {Object|undefined}
         */
        getCardsGroupOfCard: function (cardId) {
            return this.cardsGroups.find((group) => group.cards.map((c) => c.id).includes(cardId));
        },
        /**
         * @param {Object[]} cards
         * @returns {Object|undefined}
         */
        getCardsGroupForCards: function (cards) {
            const cardsGroups = this.getCardsGroupsForCards(cards);

            return cardsGroups.find((group) => this.areCardsAllInGroup(cards, group));
        },
        /**
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        getCardsGroupsForCards: function (cards) {
            return this.cardsGroups.filter((group) => cards.some((card) => group.cards.map((c) => c.id).includes(card.id)));
        },
        /**
         * @param {Object[]} cards
         * @param {Object} group
         * @returns {boolean}
         */
        areCardsAllInGroup: function (cards, group) {
            const groupCardsIds = group.cards.map((c) => c.id);

            return cards.every((card) => groupCardsIds.includes(card.id));
        },
        /**
         * @param {Object[]} cards
         */
        addCardsGroupForCards: function (cards) {
            if (cards.length === 0) {
                return;
            }

            const sortedCards = this.sortPlayedCards(cards);

            // make sure the ID of the new group is unique
            let groupId = 1;
            while (this.cardsGroups.find((g) => g.id === groupId)) {
                groupId = groupId + 1;
            }

            // create group
            this.cardsGroups.push({
                id: groupId,
                cards: sortedCards,
            });

            // create group style
            sortedCards.forEach((card, i) => {
                if ($(`${DOM_ID_PLAYER_HAND}_item_${card.id}`)) {
                    dojo.addClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, `cards-group-${groupId}`);
                    dojo.addClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD);
                    if (i === 0) {
                        dojo.addClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD_LEFT);
                    }
                    if (i === (cards.length - 1)) {
                        dojo.addClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD_RIGHT);
                    }
                }
            });
        },
        /**
         * @param {number} groupId
         */
        removeCardsGroup: function (groupId) {
            const removedGroup = this.cardsGroups.find((g) => g.id === groupId);

            // delete group style
            removedGroup.cards.forEach((card, i) => {
                if ($(`${DOM_ID_PLAYER_HAND}_item_${card.id}`)) {
                    dojo.removeClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, `cards-group-${groupId}`);
                    dojo.removeClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD);
                    dojo.removeClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD_LEFT);
                    dojo.removeClass(`${DOM_ID_PLAYER_HAND}_item_${card.id}`, DOM_CLASS_CARDS_GROUP_CARD_RIGHT);
                }
            });

            // delete group
            this.cardsGroups = this.cardsGroups.filter((g) => g.id !== groupId);
        },
        resetCardsGroups: function () {
            this.cardsGroups = [];
        },
        resetCurrentState: function () {
            this.currentState = null;
        },
        /**
         * @param {Object[]} cardsA
         * @param {Object[]} cardsB
         * @returns {boolean}
         */
        areSameCards: function (cardsA, cardsB) {
            if (cardsA.length !== cardsB.length) {
                return false;
            }

            const cardsAIds = cardsA.map((c) => c.id);
            const cardsBIds = cardsB.map((c) => c.id);

            return cardsAIds.every((AId) => cardsBIds.includes(AId));
        },

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////
        /**
         * @param {number} cardId
         */
        onPlayerCardSelected: function (cardId) {
            if (
                this.isCurrentPlayerActive()
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                this.setupGiveCardsBackAfterPickingActionButton();
                return;
            }

            const selectedCards = this.getSelectedPlayerCards();
            const selectedCardsWithoutLastSelectedCard = selectedCards.filter((card) => card.id !== cardId);
            const playerCardsThatCannotBePlayedWithSelectedCards = this.getPlayerCardsThatCannotBePlayedWithCards(selectedCards);
            const selectedCardGroup = this.getCardsGroupOfCard(cardId);

            // if a card in a group has been selected
            if (selectedCardGroup) {
                const playerCardsThatCannotBePlayedWithSelectedCardGroup = this.getPlayerCardsThatCannotBePlayedWithCards(selectedCardGroup.cards);
                // if this is the first card selected
                if (selectedCards.length === 1) {
                    this.selectCards(selectedCardGroup.cards);
                }
                // if all cards in this group are playable with already selected cards
                else if (this.areSameCards(playerCardsThatCannotBePlayedWithSelectedCards, playerCardsThatCannotBePlayedWithSelectedCardGroup)) {
                    this.selectCards(selectedCardGroup.cards);
                }
                // otherwise
                else {
                    this.unselectCards(selectedCardsWithoutLastSelectedCard);
                    this.selectCards(selectedCardGroup.cards);
                }
            }
            // otherwise
            else {
                this.unselectCards(selectedCards.filter(
                    (card) => playerCardsThatCannotBePlayedWithSelectedCards.map((c) => c.id).includes(card.id)
                        && cardId !== card.id
                ));
            }
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardUnselected: function (cardId) {
            if (
                this.isCurrentPlayerActive()
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                this.setupGiveCardsBackAfterPickingActionButton();
                return;
            }

            this.unselectCards(this.getAllPlayerCards().filter((card) => card.id === cardId));
        },
        onClickOnTogglePlayerHandSortButton: function () {
            const currentSortingMode = this.getCurrentPlayerCardsSortingMode();
            if (currentSortingMode === PLAYER_HAND_SORT_BY_COLOR) {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sort by color');
                dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort', PLAYER_HAND_SORT_BY_VALUE);
                this.addTooltip(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, '', _('Click this button to sort your hand by color.'));
                this.sortPlayerCardsByValue();
            } else {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sort by value');
                dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort', PLAYER_HAND_SORT_BY_COLOR);
                this.addTooltip(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, '', _('Click this button to sort your hand by value.'));
                this.sortPlayerCardsByColor();
            }
        },
        onClickOnGroupCardsButton: function () {
            const selectedCards = this.getSelectedPlayerCards();
            if (!selectedCards.length) {
                return;
            }
            const selectedCardsGroup = this.getCardsGroupForCards(selectedCards);
            if (selectedCardsGroup) {
                // all selected cards are in a same existing group
                // (this should never happen because the button should have called the "ungroup" function in this case)
                this.onClickOnUngroupCardsButton();
                return;
            }

            const selectedCardsGroups = this.getCardsGroupsForCards(selectedCards);
            selectedCardsGroups.forEach((group) => {
                this.removeCardsGroup(group.id);
            });
            this.addCardsGroupForCards(selectedCards);
            this.unselectAllCards();
            this.sortPlayerCardsByCurrentSortingMode();
        },
        onClickOnUngroupCardsButton: function () {
            const selectedCards = this.getSelectedPlayerCards();
            const selectedCardsGroup = this.getCardsGroupForCards(selectedCards);
            if (!selectedCardsGroup) {
                return;
            }

            this.removeCardsGroup(selectedCardsGroup.id);
            this.unselectAllCards();
            this.sortPlayerCardsByCurrentSortingMode();
        },
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

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications
        ///////////////////////////////////////////////////
        setupNotifications: function () {
            const isReadOnly = this.isReadOnly();
            [
                ['roundStarted', 1],
                ['roundEnded', 1],
                ['cardsDealt', 1],
                ['cardsPlayed', 1000],
                ['turnPassed', isReadOnly ? 1000 : 1],
                ['playerHasFinishedRound', 1],
                ['playedCardsDiscarded', 1],
                ['cardsReceivedFromAnotherPlayer', isReadOnly ? 3000 : 1500],
                ['cardsSentToAnotherPlayer', isReadOnly ? 3000 : 1500],
                ['cardsMovedBetweenTwoOtherPlayers', isReadOnly ? 2000 : 1500, (notif) => (notif.args.receiverPlayerId === this.player_id || notif.args.senderPlayerId === this.player_id)],
                // /!\ 2P mode only
                ['attackRewardCardsDiscarded', 1],
                // /!\ 2P mode only
                ['attackRewardCardsMovedToPlayer', 1000],
                // /!\ 2P mode only
                ['attackRewardCardsRevealed', 1000],
                // /!\ 2P mode only
                ['cardsReceivedFromDeck', isReadOnly ? 2000 : 1000],
                // /!\ 2P mode only
                ['cardsMovedFromDeckToAnotherPlayer', isReadOnly ? 2000 : 1500, (notif) => notif.args.receiverPlayerId === this.player_id],
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
            this.resetCardsGroups();
            this.addCardsToPlayerHand((this.currentPlayerHasJersey && !this.jerseyHasBeenUsedInTheCurrentRound)
                ? this.addJerseyToCards(data.args.cards)
                : data.args.cards,
                false
            );
        },
        notif_roundStarted: function (data) {
            this.currentRound = data.args.currentRound;
            this.setupRoundsInfo();

            this.players = data.args.players;
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.setupPlayersHiddenCards();
            this.setupPlayersFinishPosition();

            if (this.is2PlayersMode()) {
                this.howManyCardsInDeck = data.args.numberOfCardsInDeck;
                this.setupDeckOfCards();
            }
        },
        notif_cardsPlayed: function (data) {
            this.players = data.args.players;
            this.discardPlayerSpeechBubbles();
            this.movePlayedCardsToPreviousPlayedCards();

            // place new played cards
            this.playedCardsValue = data.args.playedCardsValue;
            const playedCardsWithJersey = data.args.withJersey
                ? this.addJerseyToCards(data.args.playedCards)
                : data.args.playedCards;
            this.moveCardsFromPlayerHandToTable(data.args.playedCardsPlayerId, playedCardsWithJersey);

            // update jersey state if it has been used
            if (data.args.withJersey) {
                this.useJerseyForCurrentRound();
            }
        },
        notif_turnPassed: function (data) {
            this.showTurnPassedBubbleForAFewSeconds(data.args.playerId);
        },
        notif_playerHasFinishedRound: function (data) {
            this.players[data.args.playerId].roundsRanking = data.args.roundsRanking;
            this.setupPlayersFinishPosition();
        },
        notif_playedCardsDiscarded: function (data) {
            this.discardPlayerSpeechBubbles();
            this.discardPlayedCards();
        },
        notif_cardsReceivedFromAnotherPlayer: function (data) {
            this.players = data.args.players;
            this.receiveCardsFromAnotherPlayer(data.args.senderPlayerId, data.args.cards);
        },
        notif_cardsSentToAnotherPlayer: function (data) {
            this.players = data.args.players;
            this.sendCardsToAnotherPlayer(data.args.receiverPlayerId, data.args.cards);
        },
        notif_cardsMovedBetweenTwoOtherPlayers: function (data) {
            this.players = data.args.players;
            this.moveCardsBetweenTwoOtherPlayers(data.args.senderPlayerId, data.args.receiverPlayerId, data.args.numberOfCards);
        },
        notif_roundEnded: function (data) {
            // restore and move jersey before the next round begin,
            // in order to have a beautiful jersey for the winner of the game (at the very end)
            if (
                this.currentPlayerHasJersey
                && !this.jerseyHasBeenUsedInTheCurrentRound
            ) {
                this.removeCardFromPlayerHand(CARD_ID_JERSEY);
            }
            const previousJerseyWearerId = this.getCurrentJerseyWearerIdIfExists();
            this.players = data.args.players;
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.setupPlayersHiddenCards();
            this.restoreJerseyForCurrentRound();
            this.moveJerseyToCurrentWinner(previousJerseyWearerId);

            this.setupPlayersScore();
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
            this.players = data.args.players;
            this.moveAttackRewardCardsToPlayer(data.args.receiverPlayerId, data.args.cards);
        },
        /**
         * /!\ 2P mode only
         */
        notif_attackRewardCardsRevealed: function (data) {
            this.setupAttackRewardCards(data.args.cards);
            this.decreaseNumberOfCardsInDeck(data.args.cards.length);
        },
        /**
         * /!\ 2P mode only
         */
        notif_cardsReceivedFromDeck: function (data) {
            this.players = data.args.players;
            this.moveCardsFromDeckToPlayerHand(data.args.cards);
        },
        /**
         * /!\ 2P mode only
         */
        notif_cardsMovedFromDeckToAnotherPlayer: function (data) {
            this.players = data.args.players;
            this.moveCardsFromDeckToAnotherPlayer(data.args.receiverPlayerId, data.args.numberOfCards);
        },
   });
});
