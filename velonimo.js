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
const COLOR_SPECIAL = 90;

const SIMPLE_COLORS = [COLOR_BLUE, COLOR_BROWN, COLOR_GRAY, COLOR_GREEN, COLOR_PINK, COLOR_RED, COLOR_YELLOW];

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
const VALUE_JERSEY_PLUS_TEN = 10;
const VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE = 5;
const VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER = -4;
const VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR = -5;
const VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN = -6;
const VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR = -7;
const VALUE_LEGENDS_ELEPHANT_STOP = -8;

// Special cards ID
const CARD_ID_JERSEY_PLUS_TEN = -2;
const CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE = -3;
const CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER = -4;
const CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR = -5;
const CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN = -6;
const CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR = -7;
const CARD_ID_LEGENDS_ELEPHANT_STOP = -8;

// Sprites
const NUMBER_OF_COLUMNS_IN_CARDS_SPRITE = 7;
const NUMBER_OF_ROWS_IN_CARDS_SPRITE = 9;

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
const DOM_ID_PLAYER_HAND_TITLE_WRAPPER_LEFT = 'my-hand-title-wrapper-left';
const DOM_ID_PLAYER_HAND_TITLE_WRAPPER_RIGHT = 'my-hand-title-wrapper-right';
const DOM_ID_PLAYER_HAND_TITLE = 'my-hand-title';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON = 'toggle-sort-button';
const DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL = 'toggle-sort-button-label';
const DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON = 'group-cards-button';
const DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON = 'ungroup-cards-button';
const DOM_ID_PLAYER_HAND_SELECTED_CARDS = 'my-hand-selected-cards';
const DOM_ID_CURRENT_ROUND = 'current-round';
const DOM_ID_ACTION_BUTTON_PLAY_CARDS = 'action-button-play-cards';
const DOM_ID_ACTION_BUTTON_PASS_TURN = 'action-button-pass-turn';
const DOM_ID_ACTION_BUTTON_SELECT_PLAYER = 'action-button-select-player';
const DOM_ID_ACTION_BUTTON_GIVE_CARDS = 'action-button-give-cards';

// DOM classes
const DOM_CLASS_PLAYER_TABLE = 'player-table';
const DOM_CLASS_PLAYER_JERSEY = 'player-table-jersey';
const DOM_CLASS_PLAYER_LEGENDS_BROOM_WAGON = 'player-table-legends-broom-wagon';
const DOM_CLASS_PLAYER_LEGENDS_COACH = 'player-table-legends-coach';
const DOM_CLASS_PLAYER_HAS_JERSEY = 'has-jersey';
const DOM_CLASS_PLAYER_HAS_LEGENDS_BROOM_WAGON = 'has-legends-broom-wagon';
const DOM_CLASS_PLAYER_HAS_LEGENDS_EAGLE = 'has-legends-coach-eagle';
const DOM_CLASS_PLAYER_HAS_LEGENDS_PANDA = 'has-legends-coach-panda';
const DOM_CLASS_PLAYER_HAS_LEGENDS_SHARK = 'has-legends-coach-shark';
const DOM_CLASS_PLAYER_HAS_LEGENDS_BADGER = 'has-legends-coach-badger';
const DOM_CLASS_PLAYER_HAS_LEGENDS_ELEPHANT = 'has-legends-coach-elephant';
const DOM_CLASS_PLAYER_HAS_USED_JERSEY = 'has-used-jersey';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BROOM_WAGON = 'has-used-legends-broom-wagon';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_EAGLE = 'has-used-legends-coach-eagle';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_PANDA = 'has-used-legends-coach-panda';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_SHARK = 'has-used-legends-coach-shark';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BADGER = 'has-used-legends-coach-badger';
const DOM_CLASS_PLAYER_HAS_USED_LEGENDS_ELEPHANT = 'has-used-legends-coach-elephant';
const DOM_CLASS_PLAYER_PANEL_CONTAINER = 'player-panel-velonimo-wrapper';
const DOM_CLASS_PLAYER_PANEL_LEFT = 'player-panel-velonimo-left';
const DOM_CLASS_PLAYER_PANEL_RIGHT = 'player-panel-velonimo-right';
const DOM_CLASS_JERSEY_IN_PLAYER_PANEL = 'player-panel-jersey';
const DOM_CLASS_LEGENDS_BROOM_WAGON_IN_PLAYER_PANEL = 'player-panel-legends-broom-wagon';
const DOM_CLASS_LEGENDS_EAGLE_IN_PLAYER_PANEL = 'player-panel-legends-coach-eagle';
const DOM_CLASS_LEGENDS_PANDA_IN_PLAYER_PANEL = 'player-panel-legends-coach-panda';
const DOM_CLASS_LEGENDS_SHARK_IN_PLAYER_PANEL = 'player-panel-legends-coach-shark';
const DOM_CLASS_LEGENDS_BADGER_IN_PLAYER_PANEL = 'player-panel-legends-coach-badger';
const DOM_CLASS_LEGENDS_ELEPHANT_IN_PLAYER_PANEL = 'player-panel-legends-coach-elephant';
const DOM_CLASS_NUMBER_OF_REMAINING_CARDS_IN_PLAYER_PANEL = 'player-panel-number-of-remaining-cards';
const DOM_CLASS_CARDS_STACK = 'cards-stack';
const DOM_CLASS_CARDS_STACK_PREVIOUS_PLAYED = 'previous-last-played-cards';
const DOM_CLASS_DISABLED_ACTION_BUTTON = 'disabled';
const DOM_CLASS_ACTIVE_PLAYER = 'active';
const DOM_CLASS_SELECTABLE_PLAYER = 'selectable';
const DOM_CLASS_NON_SELECTABLE_CARD = 'non-selectable-player-card';
const DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW = 'show-bubble';
const DOM_CLASS_SPEECH_BUBBLE = 'player-table-speech-bubble';
const DOM_CLASS_SPEECH_BUBBLE_LEFT = 'speech-bubble-on-left';
const DOM_CLASS_SPEECH_BUBBLE_RIGHT = 'speech-bubble-on-right';
const DOM_CLASS_CARDS_GROUP_CARD = 'cards-group-card';
const DOM_CLASS_CARDS_GROUP_CARD_LEFT = 'cards-group-card-left';
const DOM_CLASS_CARDS_GROUP_CARD_RIGHT = 'cards-group-card-right';
const DOM_CLASS_VELONIMO_CARD = 'velonimo-card';
const DOM_CLASS_CARD_FRONT_SIDE = 'front-side';
const DOM_CLASS_CARD_BACK_SIDE = 'back-side';
const DOM_CLASS_MOVING_CARD = 'moving-card';

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
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
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
    },
    4: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
    },
    5: {
        0: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        1: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_LEFT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        2: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_CENTER}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
        },
        3: {
            tableStyle: `${TABLE_STYLE_VERTICAL_TOP} ${TABLE_STYLE_HORIZONTAL_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_LEFT,
        },
        4: {
            tableStyle: `${TABLE_STYLE_VERTICAL_BOTTOM} ${TABLE_STYLE_HORIZONTAL_MIDDLE_RIGHT}`,
            bubbleClass: DOM_CLASS_SPEECH_BUBBLE_RIGHT,
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
            this.currentPlayerHasLegendsBroomWagon = false;
            this.currentPlayerHasLegendsEagle = false;
            this.currentPlayerHasLegendsPanda = false;
            this.currentPlayerHasLegendsShark = false;
            this.currentPlayerHasLegendsBadger = false;
            this.currentPlayerHasLegendsElephant = false;
            this.jerseyIsNotPlayable = false;
            this.legendsBroomWagonIsNotPlayable = false;
            this.legendsEagleIsNotPlayable = false;
            this.legendsPandaIsNotPlayable = false;
            this.legendsSharkIsNotPlayable = false;
            this.legendsBadgerIsNotPlayable = false;
            this.legendsElephantIsNotPlayable = false;
            this.isExtensionLegendsEnabled = false;
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
            this.jerseyIsNotPlayable = gamedatas.jerseyIsNotPlayable;
            this.legendsBroomWagonIsNotPlayable = gamedatas.legendsBroomWagonIsNotPlayable;
            this.legendsEagleIsNotPlayable = gamedatas.legendsEagleIsNotPlayable;
            this.legendsPandaIsNotPlayable = gamedatas.legendsPandaIsNotPlayable;
            this.legendsSharkIsNotPlayable = gamedatas.legendsSharkIsNotPlayable;
            this.legendsBadgerIsNotPlayable = gamedatas.legendsBadgerIsNotPlayable;
            this.legendsElephantIsNotPlayable = gamedatas.legendsElephantIsNotPlayable;
            this.howManyRounds = gamedatas.howManyRounds;
            this.isExtensionLegendsEnabled = gamedatas.isExtensionLegendsEnabled === true;

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
        <div id="${DOM_ID_PLAYER_HAND_TITLE_WRAPPER_LEFT}">
            <i class="fa fa-hand-paper-o"></i>
            <h3 id="${DOM_ID_PLAYER_HAND_TITLE}">${_('My hand')}</h3>
            <a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON}" class="bgabutton bgabutton_gray"><span id="${DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL}"></span></a>
        </div>
        <div id="${DOM_ID_PLAYER_HAND_TITLE_WRAPPER_RIGHT}"></div>
    </div>
    <div id="${DOM_ID_PLAYER_HAND}"></div>
</div>`,
                DOM_ID_APP
            );

            // setup players
            this.players = gamedatas.players;
            const howManyPlayers = Object.keys(this.players).length;
            const playersPlace = PLAYERS_PLACES_BY_NUMBER_OF_PLAYERS[howManyPlayers];
            this.sortPlayersToStartWithPlayerIdIfPresent(
                this.sortPlayersByTurnOrderPosition(Object.entries(this.players).map((entry) => entry[1])),
                gamedatas.currentPlayerId
            ).forEach((player, index) => {
                const playerPosition = playersPlace[index];
                const playerColorRGB = `#${player.color}`;
                const isPositionTop = playerPosition.tableStyle.indexOf('top') !== -1;

                // setup player on board
                dojo.place(
                    `<div id="player-table-${player.id}" class="${DOM_CLASS_PLAYER_TABLE} ${isPositionTop ? 'player-position-top' : 'player-position-bottom'}" style="width: ${PLAYER_TABLE_WIDTH}px; height: ${PLAYER_TABLE_HEIGHT}px; ${playerPosition.tableStyle}">
    <div class="player-table-name" style="color: ${playerColorRGB};"><span>${(player.name.length > 20 ? (player.name.substring(0,20) + '...') : player.name)}</span></div>
    <div id="player-table-${player.id}-hand" class="player-table-hand"><div id="player-table-${player.id}-hand-cards" class="player-table-hand-cards"></div></div>
    <div id="player-table-${player.id}-special-cards" class="player-special-cards"></div>
    <div id="player-table-${player.id}-finish-position" class="player-table-finish-position"></div>
    <div id="player-table-${player.id}-speech-bubble" class="${DOM_CLASS_SPEECH_BUBBLE} ${playerPosition.bubbleClass}" style="color: ${playerColorRGB};"></div>
</div>`,
                    DOM_ID_BOARD_CARPET
                );

                // setup player panel
                dojo.place(
                    `<div class="${DOM_CLASS_PLAYER_PANEL_CONTAINER}">
    <div id="player-panel-${player.id}-velonimo-left"  class="${DOM_CLASS_PLAYER_PANEL_LEFT}">
        <div id="player-panel-${player.id}-remaining-cards" class="${DOM_CLASS_NUMBER_OF_REMAINING_CARDS_IN_PLAYER_PANEL}">
            <i class="fa fa-hand-paper-o"></i><span id="player-panel-${player.id}-remaining-cards-number">0</span>
        </div>
    </div>
    <div id="player-panel-${player.id}-velonimo-right"  class="${DOM_CLASS_PLAYER_PANEL_RIGHT}"></div>
</div>`,
                    `player_board_${player.id}`
                );
                this.addTooltip(`player-panel-${player.id}-remaining-cards`, _('Number of cards in hand'), '');
            });
            this.setupPlayersFinishPosition();

            if (this.isExtensionLegendsEnabled) {
                // setup legends coaches
                if (gamedatas.legendsEagleIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER);
                }
                if (gamedatas.legendsPandaIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR);
                }
                if (gamedatas.legendsSharkIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);
                }
                if (gamedatas.legendsBadgerIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR);
                }
                if (gamedatas.legendsElephantIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_ELEPHANT_STOP);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_ELEPHANT_STOP);
                }
                this.moveLegendsCoachToPlayers();

                // setup legends broom wagon
                if (gamedatas.legendsBroomWagonIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
                }
                this.moveLegendsBroomWagonToLastLoser();
            }

            // setup jersey (if not 2P mode)
            if (!this.is2PlayersMode()) {
                if (this.jerseyIsNotPlayable) {
                    this.useSpecialCardForCurrentRound(CARD_ID_JERSEY_PLUS_TEN);
                } else {
                    this.restoreSpecialCardForCurrentRound(CARD_ID_JERSEY_PLUS_TEN);
                }
                this.moveJerseyToCurrentWinner();
            }

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
            this.playerHand.resizeItems(CARD_WIDTH, CARD_HEIGHT, CARD_WIDTH * NUMBER_OF_COLUMNS_IN_CARDS_SPRITE, CARD_HEIGHT * NUMBER_OF_ROWS_IN_CARDS_SPRITE);
            this.playerHand.setSelectionAppearance('class');
            this.playerHand.image_items_per_row = NUMBER_OF_COLUMNS_IN_CARDS_SPRITE;
            // create cards
            const cardsImageUrl = g_gamethemeurl+'img/cards.png';
            this.execFnForEachCardInGame((color, value) => {
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

                if (
                    this.isCurrentPlayerActive()
                    && this.currentState === 'playerGiveCardsBackAfterPicking'
                ) {
                    this.setupGiveCardsBackAfterPickingActionButton();
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
                this.addSpecialCardsToCards(this.getSpecialPlayerCardIds(), gamedatas.currentPlayerCards),
                false
            );

            // setup cards played on table
            this.playedCardsValue = gamedatas.playedCardsValue;
            this.setupPreviousPlayedCards(
                gamedatas.previousPlayedCards.concat(gamedatas.previousPlayedSpecialCards)
            );
            this.moveCardsFromPlayerHandToTable(
                gamedatas.playedCardsPlayerId,
                gamedatas.playedCards.concat(gamedatas.playedSpecialCards)
            );
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.setupPlayersHiddenCards();
            this.setupTurnPassedBubbles(gamedatas.playedCardsPlayerId, gamedatas.activePlayerId);

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
                    if (this.isCurrentPlayerActive()) {
                        this.unselectAllCards();
                        this.displayCardsAsNonSelectable([]);
                    }
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
                    this.unselectAllCards();
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
            return this.sortPlayedCards(cards).map((card) => {
                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const backgroundX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position) + this.getLogHtmlBackgroundOffsetXForCard(card);
                const backgroundY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position) + this.getLogHtmlBackgroundOffsetYForCard(card);

                return `<div class="${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE}" style="width: ${this.getLogHtmlWidthForCard(card)}px; height: 24px; background-position: -${backgroundX}px -${backgroundY}px;"></div>`;
            }).join(' ');
        },
        getLogHtmlWidthForCard: function (card) {
            if (card.color === COLOR_ADVENTURER) {
                return 33;
            }
            if (card.color === COLOR_SPECIAL) {
                return 30;
            }
            return 17;
        },
        getLogHtmlBackgroundOffsetXForCard: function (card) {
            if (card.color === COLOR_ADVENTURER) {
                return 3;
            }
            if (card.value === VALUE_2) {
                return 66;
            }
            if (card.value === VALUE_6) {
                return 7;
            }
            if (card.value === VALUE_7) {
                return 7;
            }
            if (
                card.color === COLOR_SPECIAL
                && [
                    VALUE_JERSEY_PLUS_TEN,
                    VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                ].includes(card.value)
            ) {
                return 1;
            }
            if (
                card.color === COLOR_SPECIAL
                && [
                    VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                    VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                    VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                    VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                    VALUE_LEGENDS_ELEPHANT_STOP,
                ].includes(card.value)
            ) {
                return 30;
            }
            return 8;
        },
        getLogHtmlBackgroundOffsetYForCard: function (card) {
            if (card.color === COLOR_ADVENTURER) {
                return 5;
            }
            if (
                card.color === COLOR_SPECIAL
                && card.value === VALUE_JERSEY_PLUS_TEN
            ) {
                return 2;
            }
            if (
                card.color === COLOR_SPECIAL
                && card.value === VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE
            ) {
                return 1;
            }
            if (
                card.color === COLOR_SPECIAL
                && [
                    VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                    VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                    VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                    VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                    VALUE_LEGENDS_ELEPHANT_STOP,
                ].includes(card.value)
            ) {
                return 91;
            }
            return 4;
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
                case COLOR_SPECIAL:
                    switch (card.value) {
                        case VALUE_JERSEY_PLUS_TEN:
                            return [
                                dojo.string.substitute(_('Carrot polka dot Jersey - Given to the current winner of the game - It adds ${v} points to any valid card combinations (one or more colored cards). It cannot be played with adventurers.'), { v: VALUE_JERSEY_PLUS_TEN }),
                                ''
                            ];
                        case VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE:
                            return [
                                dojo.string.substitute(_('Broom Wagon - Given to the loser of the previous round - It adds ${v} points to any valid card combinations (one or more colored cards). It cannot be played with adventurers.'), { v: VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE }),
                                ''
                            ];
                        case VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                            return [
                                _('Coach Eagle - Allow to add a card of a different value to card(s) that share the same value.'),
                                ''
                            ];
                        case VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                            return [
                                _('Coach Panda - Allow to add a card of a different color to card(s) that share the same color.'),
                                ''
                            ];
                        case VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                            return [
                                _('Coach Shark - Multiply the value of a single red card by 10 (e.g. a "5 red" played with this coach is equal to "50").'),
                                ''
                            ];
                        case VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                            return [
                                _('Coach Badger - Allow to combine a single card of each color, even if they do not share the same value.'),
                                ''
                            ];
                        case VALUE_LEGENDS_ELEPHANT_STOP:
                            return [
                                _('Coach Elephant - The card(s) played with this coach immediately end the current turn (i.e. like if no other players wanted to play on top of it).'),
                                ''
                            ];
                        default:
                            return null;
                    }
                default:
                    return null;
            }
        },
        /**
         * @returns {string}
         */
        getTranslatedTextForSelectedCardsValue: function () {
            return _('Combined value of selected cards');
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
                    playerCardsHtml.push(`<div id="player-table-${playerId}-card-${i}" class="${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_BACK_SIDE}" style="transform: rotate(${getCardRotateDeg(howManyCards, i)}deg);"></div>`);
                }
                $(`player-table-${playerId}-hand-cards`).innerHTML = playerCardsHtml.join('');
                $(`player-panel-${playerId}-remaining-cards-number`).innerHTML = howManyCards;
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
                dojo.removeClass(`player-table-${player.id}`, `has-finished-4`);
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
                this.addTooltip(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`, this.getTranslatedTextForSelectedCardsValue(), '');
            }
            dojo.toggleClass(DOM_ID_ACTION_BUTTON_PLAY_CARDS, DOM_CLASS_DISABLED_ACTION_BUTTON, selectedCardsValue <= this.playedCardsValue);
            $(`${DOM_ID_ACTION_BUTTON_PLAY_CARDS}-value`).innerText = ` (${selectedCardsValue})`;
        },
        setupSelectedCardsValueInPlayerHand: function () {
            if ($(DOM_ID_PLAYER_HAND_SELECTED_CARDS)) {
                dojo.destroy(DOM_ID_PLAYER_HAND_SELECTED_CARDS);
            }

            const selectedCards = this.getSelectedPlayerCards();
            if (!selectedCards.length) {
                return;
            }

            const getIcon = (cardsValue) => {
                if (cardsValue < 20) {
                    return 'battery-empty';
                } else if (cardsValue < 30) {
                    return 'battery-quarter';
                } else if (cardsValue < 40) {
                    return 'battery-half';
                } else if (cardsValue < 50) {
                    return 'battery-three-quarters';
                } else {
                    return 'battery-full';
                }
            };

            const selectedCardsValue = this.getCardsValue(selectedCards);
            dojo.place(`<div id="${DOM_ID_PLAYER_HAND_SELECTED_CARDS}"><i class="fa fa-${getIcon(selectedCardsValue)}"></i><span id="${DOM_ID_PLAYER_HAND_SELECTED_CARDS}-value">${selectedCardsValue}</span></div>`, DOM_ID_PLAYER_HAND_TITLE_WRAPPER_RIGHT);
            this.addTooltip(DOM_ID_PLAYER_HAND_SELECTED_CARDS, this.getTranslatedTextForSelectedCardsValue(), '');
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
        moveJerseyToCurrentWinner: function () {
            const card = this.addSpecialCardsToCards([CARD_ID_JERSEY_PLUS_TEN], [])[0];
            const tooltipTexts = this.getTooltipTextsForCard(card);
            const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
            const backgroundX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position) + this.getLogHtmlBackgroundOffsetXForCard(card);
            const backgroundY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position) + this.getLogHtmlBackgroundOffsetYForCard(card);

            const applyJersey = (playerId) => {
                dojo.place(`<div id="player-table-${playerId}-jersey" class="${DOM_CLASS_PLAYER_JERSEY}" style="background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-table-${playerId}-special-cards`);
                this.addTooltip(`player-table-${playerId}-jersey`, tooltipTexts[0], tooltipTexts[1]);
                dojo.addClass(`player-table-${playerId}`, DOM_CLASS_PLAYER_HAS_JERSEY);
                dojo.place(`<div id="player-panel-${playerId}-jersey" class="${DOM_CLASS_JERSEY_IN_PLAYER_PANEL} ${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE}" style="width: ${this.getLogHtmlWidthForCard(card)}px; height: 30px; background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-panel-${playerId}-velonimo-right`);
                this.addTooltip(`player-panel-${playerId}-jersey`, tooltipTexts[0], tooltipTexts[1]);
            };
            const removeJersey = (playerId) => {
                dojo.removeClass(`player-table-${playerId}`, DOM_CLASS_PLAYER_HAS_JERSEY);
                this.fadeOutAndDestroy(`player-table-${playerId}-jersey`);
                this.fadeOutAndDestroy(`player-panel-${playerId}-jersey`);
            };

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                if (player.isWearingJersey) {
                    this.currentPlayerHasJersey = this.player_id === player.id;

                    if (!dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_JERSEY)) {
                        applyJersey(player.id);
                    }
                } else {
                    if (dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_JERSEY)) {
                        removeJersey(player.id);
                    }
                }
            });
        },
        moveLegendsBroomWagonToLastLoser: function () {
            if (!this.isExtensionLegendsEnabled) {
                return;
            }

            const card = this.addSpecialCardsToCards([CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE], [])[0];
            const tooltipTexts = this.getTooltipTextsForCard(card);
            const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
            const backgroundX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position) + this.getLogHtmlBackgroundOffsetXForCard(card);
            const backgroundY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position) + this.getLogHtmlBackgroundOffsetYForCard(card);

            const applyLegendsBroomWagon = (playerId) => {
                dojo.place(`<div id="player-table-${playerId}-legends-broom-wagon" class="${DOM_CLASS_PLAYER_LEGENDS_BROOM_WAGON}" style="background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-table-${playerId}-special-cards`);
                this.addTooltip(`player-table-${playerId}-legends-broom-wagon`, tooltipTexts[0], tooltipTexts[1]);
                dojo.addClass(`player-table-${playerId}`, DOM_CLASS_PLAYER_HAS_LEGENDS_BROOM_WAGON);
                dojo.place(`<div id="player-panel-${playerId}-legends-broom-wagon" class="${DOM_CLASS_LEGENDS_BROOM_WAGON_IN_PLAYER_PANEL} ${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE}" style="width: ${this.getLogHtmlWidthForCard(card)}px; height: 30px; background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-panel-${playerId}-velonimo-right`);
                this.addTooltip(`player-panel-${playerId}-legends-broom-wagon`, tooltipTexts[0], tooltipTexts[1]);
            };
            const removeLegendsBroomWagon = (playerId) => {
                dojo.removeClass(`player-table-${playerId}`, DOM_CLASS_PLAYER_HAS_LEGENDS_BROOM_WAGON);
                this.fadeOutAndDestroy(`player-table-${playerId}-legends-broom-wagon`);
                this.fadeOutAndDestroy(`player-panel-${playerId}-legends-broom-wagon`);
            };

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                if (player.hasCardLegendsBroomWagon) {
                    this.currentPlayerHasLegendsBroomWagon = this.player_id === player.id;

                    if (!dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_LEGENDS_BROOM_WAGON)) {
                        applyLegendsBroomWagon(player.id);
                    }
                } else {
                    if (dojo.hasClass(`player-table-${player.id}`, DOM_CLASS_PLAYER_HAS_LEGENDS_BROOM_WAGON)) {
                        removeLegendsBroomWagon(player.id);
                    }
                }
            });
        },
        moveLegendsCoachToPlayers: function () {
            if (!this.isExtensionLegendsEnabled) {
                return;
            }

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                const cardId = this.getLegendsCoachCardIdFromPlayerIfExists(player);
                if (typeof cardId === 'undefined') {
                    return;
                }

                const card = this.addSpecialCardsToCards([cardId], [])[0];
                const specialCardDescription = this.getTooltipTextsForCard(card);
                let playerHasSpecialCardClass;
                let specialCardInPanelClass;
                let specialCardDomSuffix;
                let currentPlayerHasSpecialCardProperty;
                switch (cardId) {
                    case CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                        playerHasSpecialCardClass = DOM_CLASS_PLAYER_HAS_LEGENDS_EAGLE;
                        specialCardInPanelClass = DOM_CLASS_LEGENDS_EAGLE_IN_PLAYER_PANEL;
                        specialCardDomSuffix = 'legends-coach-eagle';
                        currentPlayerHasSpecialCardProperty = 'currentPlayerHasLegendsEagle';
                        break;
                    case CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                        playerHasSpecialCardClass = DOM_CLASS_PLAYER_HAS_LEGENDS_PANDA;
                        specialCardInPanelClass = DOM_CLASS_LEGENDS_PANDA_IN_PLAYER_PANEL;
                        specialCardDomSuffix = 'legends-coach-panda';
                        currentPlayerHasSpecialCardProperty = 'currentPlayerHasLegendsPanda';
                        break;
                    case CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                        playerHasSpecialCardClass = DOM_CLASS_PLAYER_HAS_LEGENDS_SHARK;
                        specialCardInPanelClass = DOM_CLASS_LEGENDS_SHARK_IN_PLAYER_PANEL;
                        specialCardDomSuffix = 'legends-coach-shark';
                        currentPlayerHasSpecialCardProperty = 'currentPlayerHasLegendsShark';
                        break;
                    case CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                        playerHasSpecialCardClass = DOM_CLASS_PLAYER_HAS_LEGENDS_BADGER;
                        specialCardInPanelClass = DOM_CLASS_LEGENDS_BADGER_IN_PLAYER_PANEL;
                        specialCardDomSuffix = 'legends-coach-badger';
                        currentPlayerHasSpecialCardProperty = 'currentPlayerHasLegendsBadger';
                        break;
                    case CARD_ID_LEGENDS_ELEPHANT_STOP:
                        playerHasSpecialCardClass = DOM_CLASS_PLAYER_HAS_LEGENDS_ELEPHANT;
                        specialCardInPanelClass = DOM_CLASS_LEGENDS_ELEPHANT_IN_PLAYER_PANEL;
                        specialCardDomSuffix = 'legends-coach-elephant';
                        currentPlayerHasSpecialCardProperty = 'currentPlayerHasLegendsElephant';
                        break;
                    default:
                        throw new Error('Unsupported cardId for moveLegendsCoachToPlayers');
                }

                const position = this.getCardPositionInSpriteByColorAndValue(card.color, card.value);
                const backgroundX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position) + this.getLogHtmlBackgroundOffsetXForCard(card);
                const backgroundY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position) + this.getLogHtmlBackgroundOffsetYForCard(card);

                this[currentPlayerHasSpecialCardProperty] = this.player_id === player.id;
                dojo.place(`<div id="player-table-${player.id}-legends-coach" class="${DOM_CLASS_PLAYER_LEGENDS_COACH}" style="background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-table-${player.id}-special-cards`);
                dojo.addClass(`player-table-${player.id}`, playerHasSpecialCardClass);
                this.addTooltip(`player-table-${player.id}-legends-coach`, specialCardDescription[0], specialCardDescription[1]);
                dojo.place(`<div id="player-panel-${player.id}-${specialCardDomSuffix}" class="${specialCardInPanelClass} ${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE}" style="width: ${this.getLogHtmlWidthForCard(card)}px; height: 30px; background-position: -${backgroundX}px -${backgroundY}px;"></div>`, `player-panel-${player.id}-velonimo-right`);
                this.addTooltip(`player-panel-${player.id}-${specialCardDomSuffix}`, specialCardDescription[0], specialCardDescription[1]);
            });
        },
        /**
         * @param {Object} player
         * @returns {number|undefined}
         */
        getLegendsCoachCardIdFromPlayerIfExists: function (player) {
            if (player.hasCardLegendsEagle) {
                return CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER;
            }
            if (player.hasCardLegendsPanda) {
                return CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR;
            }
            if (player.hasCardLegendsShark) {
                return CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN;
            }
            if (player.hasCardLegendsBadger) {
                return CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR;
            }
            if (player.hasCardLegendsElephant) {
                return CARD_ID_LEGENDS_ELEPHANT_STOP;
            }
            return undefined;
        },
        /**
         * @param {number} cardId
         */
        useSpecialCardForCurrentRound: function (cardId) {
            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];
                let playerHasSpecialCard;
                let playerHasUsedSpecialCardClass;
                switch (cardId) {
                    case CARD_ID_JERSEY_PLUS_TEN:
                        this.jerseyIsNotPlayable = true;
                        playerHasSpecialCard = player.isWearingJersey;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_JERSEY;
                        break;
                    case CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE:
                        this.legendsBroomWagonIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsBroomWagon;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BROOM_WAGON;
                        break;
                    case CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                        this.legendsEagleIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsEagle;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_EAGLE;
                        break;
                    case CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                        this.legendsPandaIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsPanda;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_PANDA;
                        break;
                    case CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                        this.legendsSharkIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsShark;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_SHARK;
                        break;
                    case CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                        this.legendsBadgerIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsBadger;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BADGER;
                        break;
                    case CARD_ID_LEGENDS_ELEPHANT_STOP:
                        this.legendsElephantIsNotPlayable = true;
                        playerHasSpecialCard = player.hasCardLegendsElephant;
                        playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_ELEPHANT;
                        break;
                    default:
                        throw new Error('Unsupported cardId for useSpecialCardForCurrentRound');
                }

                if (playerHasSpecialCard) {
                    if (!dojo.hasClass(`player-table-${player.id}`, playerHasUsedSpecialCardClass)) {
                        dojo.addClass(`player-table-${player.id}`, playerHasUsedSpecialCardClass);
                    }
                    if (!dojo.hasClass(`player-panel-${player.id}-velonimo-right`, playerHasUsedSpecialCardClass)) {
                        dojo.addClass(`player-panel-${player.id}-velonimo-right`, playerHasUsedSpecialCardClass);
                    }
                }
            });
        },
        /**
         * @param {number} cardId
         */
        restoreSpecialCardForCurrentRound: function (cardId) {
            let playerHasUsedSpecialCardClass;
            switch (cardId) {
                case CARD_ID_JERSEY_PLUS_TEN:
                    this.jerseyIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_JERSEY;
                    break;
                case CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE:
                    this.legendsBroomWagonIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BROOM_WAGON;
                    break;
                case CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                    this.legendsEagleIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_EAGLE;
                    break;
                case CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                    this.legendsPandaIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_PANDA;
                    break;
                case CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                    this.legendsSharkIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_SHARK;
                    break;
                case CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                    this.legendsBadgerIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_BADGER;
                    break;
                case CARD_ID_LEGENDS_ELEPHANT_STOP:
                    this.legendsElephantIsNotPlayable = false;
                    playerHasUsedSpecialCardClass = DOM_CLASS_PLAYER_HAS_USED_LEGENDS_ELEPHANT;
                    break;
                default:
                    throw new Error('Unsupported cardId for useSpecialCardForCurrentRound');
            }

            Object.entries(this.players).forEach((entry) => {
                const player = entry[1];

                if (dojo.hasClass(`player-table-${player.id}`, playerHasUsedSpecialCardClass)) {
                    dojo.removeClass(`player-table-${player.id}`, playerHasUsedSpecialCardClass);
                }
                if (dojo.hasClass(`player-panel-${player.id}-velonimo-right`, playerHasUsedSpecialCardClass)) {
                    dojo.removeClass(`player-panel-${player.id}-velonimo-right`, playerHasUsedSpecialCardClass);
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
        execFnForEachCardInGame: function (fn) {
            // colored cards
            SIMPLE_COLORS.forEach((color) => {
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

            // special cards
            fn.bind(this)(COLOR_SPECIAL, VALUE_JERSEY_PLUS_TEN);
            if (this.isExtensionLegendsEnabled) {
                [
                    VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                    VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                    VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                    VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                    VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                    VALUE_LEGENDS_ELEPHANT_STOP,
                ].forEach((value) => fn.bind(this)(COLOR_SPECIAL, value));
            }
        },
        /**
         * This function gives:
         *  - the position of the card in the sprite "cards.png"
         *  - weight to cards to sort them by color (blue-1, blue-2, ...) just like in the sprite
         *  - the type ID for the stock component
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
                case COLOR_SPECIAL:
                    switch (value) {
                        case VALUE_JERSEY_PLUS_TEN:
                            return 56;
                        case VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE:
                            return 57;
                        case VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                            return 58;
                        case VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                            return 59;
                        case VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                            return 60;
                        case VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                            return 61;
                        case VALUE_LEGENDS_ELEPHANT_STOP:
                            return 62;
                        default:
                            throw new Error('Unsupported');
                    }
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
                    // Card back
                    throw new Error('Unsupported');
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
            this.execFnForEachCardInGame((color, value) => {
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
            if (color === COLOR_SPECIAL) {
                return 10000 + this.getCardPositionInSpriteByColorAndValue(color, value);
            }

            return (value * 100) + color;
        },
        sortPlayerCardsByValue: function () {
            const cardsWeightByPosition = {};
            this.execFnForEachCardInGame((color, value) => {
                cardsWeightByPosition[this.getCardPositionInSpriteByColorAndValue(color, value)] = this.getCardWeightForColorAndValueToSortThemByValue(color, value);
            });

            this.playerHand.changeItemsWeight(Object.assign(cardsWeightByPosition, this.getSortingWeightForCardsGroups()));
        },
        /**
         * @param {number} position
         * @returns {number}
         */
        getAbsoluteCardBackgroundPositionXFromCardPosition: function (position) {
            return (position % NUMBER_OF_COLUMNS_IN_CARDS_SPRITE) * CARD_WIDTH;
        },
        /**
         * @param {number} position
         * @returns {number}
         */
        getAbsoluteCardBackgroundPositionYFromCardPosition: function (position) {
            return Math.floor(position / NUMBER_OF_COLUMNS_IN_CARDS_SPRITE) * CARD_HEIGHT;
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
                case 56:
                    color = COLOR_SPECIAL;
                    value = VALUE_JERSEY_PLUS_TEN;
                    break;
                case 57:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE;
                    break;
                case 58:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER;
                    break;
                case 59:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR;
                    break;
                case 60:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN;
                    break;
                case 61:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR;
                    break;
                case 62:
                    color = COLOR_SPECIAL;
                    value = VALUE_LEGENDS_ELEPHANT_STOP;
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
                // legends coach elephant
                if (
                    (color === COLOR_SPECIAL && value === VALUE_LEGENDS_ELEPHANT_STOP)
                    || card.id === CARD_ID_LEGENDS_ELEPHANT_STOP
                ) {
                    return true;
                }

                // adventurer
                if (
                    (color === COLOR_ADVENTURER || card.color === COLOR_ADVENTURER)
                    && value !== card.value
                ) {
                    return false;
                }

                // legends broom wagon
                if (color === COLOR_SPECIAL && value === VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
                    return card.color !== COLOR_ADVENTURER;
                }
                if (card.id === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
                    return color !== COLOR_ADVENTURER;
                }

                // jersey
                if (color === COLOR_SPECIAL && value === VALUE_JERSEY_PLUS_TEN) {
                    return (
                        card.color !== COLOR_ADVENTURER
                        && ![
                            CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                            CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                            CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                            CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                            CARD_ID_LEGENDS_ELEPHANT_STOP,
                        ].includes(card.id)
                    );
                }
                if (card.id === CARD_ID_JERSEY_PLUS_TEN) {
                    return (
                        color !== COLOR_ADVENTURER
                        && !(
                            color === COLOR_SPECIAL
                            && [
                                VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                                VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                                VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                                VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                                VALUE_LEGENDS_ELEPHANT_STOP,
                            ].includes(value)
                        )
                    );
                }

                // legends coach shark
                if (color === COLOR_SPECIAL && value === VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
                    return (card.color === COLOR_RED || card.id === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);
                }
                if (card.id === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
                    return (color === COLOR_RED || (color === COLOR_SPECIAL && value === VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN));
                }

                // legends coach eagle
                if (color === COLOR_SPECIAL && value === VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
                    return (
                        card.id === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER
                        || SIMPLE_COLORS.includes(card.color)
                    );
                }
                if (card.id === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
                    return (
                        (color === COLOR_SPECIAL && value === VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)
                        || SIMPLE_COLORS.includes(color)
                    );
                }

                // legends coach panda
                if (color === COLOR_SPECIAL && value === VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
                    return (
                        card.id === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR
                        || SIMPLE_COLORS.includes(card.color)
                    );
                }
                if (card.id === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
                    return (
                        (color === COLOR_SPECIAL && value === VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)
                        || SIMPLE_COLORS.includes(color)
                    );
                }

                // legends coach badger
                if (color === COLOR_SPECIAL && value === VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
                    return (
                        card.id === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR
                        || SIMPLE_COLORS.includes(card.color)
                    );
                }
                if (card.id === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
                    return (
                        (color === COLOR_SPECIAL && value === VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)
                        || SIMPLE_COLORS.includes(color)
                    );
                }

                // simple cards
                if (color === card.color) {
                    return true;
                }
                if (value === card.value) {
                    return true;
                }

                // everything else
                return false;
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

            const sortEntriesByLength = ([_k1, cards1], [_k2, cards2]) => cards2.length - cards1.length;

            const playerCards = this.getAllPlayerCards();
            const playerCardIds = playerCards.map((c) => c.id);
            const cardIds = cards.map((c) => c.id);

            /** @var {Object[]} nonPlayableCards */
            let nonPlayableCards = cards.reduce(
                (acc, card) => acc.concat(
                    playerCards.filter((c) => !this.getCardsThatCanBePlayedWithCard(card.color, card.value, playerCards).some((playableCard) => c.id === playableCard.id))
                ),
                []
            );
            const nonPlayableCardIds = nonPlayableCards.map((c) => c.id);

            if (playerCardIds.includes(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN)) {
                const selectedRedCards = cards.filter((c) => c.color === COLOR_RED);
                const numberOfSelectedRedCards = selectedRedCards.length;
                if (numberOfSelectedRedCards > 1) {
                    if (cardIds.includes(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN)) {
                        nonPlayableCards = [...selectedRedCards, ...nonPlayableCards];
                    } else if (!nonPlayableCardIds.includes(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN)) {
                        nonPlayableCards = this.addSpecialCardsToCards([CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN], nonPlayableCards);
                    }
                }
            } else if (playerCardIds.includes(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)) {
                const selectedSimpleCards = cards.filter((c) => SIMPLE_COLORS.includes(c.color));
                const selectedSimpleCardValues = selectedSimpleCards.map((c) => c.value);
                const numberOfDifferentValues = [...new Set(selectedSimpleCardValues)].length;
                const selectedSimpleCardsGroupedBySameValue = Object.entries(selectedSimpleCards.reduce((acc, c) => {
                    return {
                        ...acc,
                        [c.value]: [...(acc[c.value] || []), c],
                    };
                }, {})).sort(sortEntriesByLength);
                if (
                    numberOfDifferentValues > 2
                    || (
                        numberOfDifferentValues === 2
                        && selectedSimpleCardsGroupedBySameValue[0][1].length > 1
                        && selectedSimpleCardsGroupedBySameValue[1][1].length > 1
                    )
                ) {
                    if (cardIds.includes(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)) {
                        nonPlayableCards = [...selectedSimpleCards, ...nonPlayableCards];
                    } else if (!nonPlayableCardIds.includes(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)) {
                        nonPlayableCards = this.addSpecialCardsToCards([CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER], nonPlayableCards);
                    }
                } else if (cardIds.includes(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)) {
                    const selectedSimpleCardIds = selectedSimpleCards.map((c) => c.id);
                    const playerSimpleCardIds = playerCards.filter((c) => SIMPLE_COLORS.includes(c.color)).map((c) => c.id);
                    const nonPlayablePlayerSimpleCardIds = playerCards
                        .filter((c) => SIMPLE_COLORS.includes(c.color))
                        .filter((c) =>
                            !selectedSimpleCardIds.includes(c.id)
                            && numberOfDifferentValues > 1
                            && (
                                (
                                    selectedSimpleCardsGroupedBySameValue[0][1].length === 1
                                    && !selectedSimpleCardValues.includes(c.value)
                                ) || (
                                    selectedSimpleCardsGroupedBySameValue[0][1].length > 1
                                    && c.value !== parseInt(selectedSimpleCardsGroupedBySameValue[0][0], 10)
                                )
                            )
                        )
                        .map((c) => c.id);
                    nonPlayableCards = playerCards
                        .filter((c) => nonPlayablePlayerSimpleCardIds.includes(c.id) || (nonPlayableCardIds.includes(c.id) && !playerSimpleCardIds.includes(c.id)));
                }
            } else if (playerCardIds.includes(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)) {
                const selectedSimpleCards = cards.filter((c) => SIMPLE_COLORS.includes(c.color));
                const selectedSimpleCardColors = selectedSimpleCards.map((c) => c.color);
                const numberOfDifferentColors = [...new Set(selectedSimpleCardColors)].length;
                const selectedSimpleCardsGroupedBySameColor = Object.entries(selectedSimpleCards.reduce((acc, c) => {
                    return {
                        ...acc,
                        [c.color]: [...(acc[c.color] || []), c],
                    };
                }, {})).sort(sortEntriesByLength);
                if (
                    numberOfDifferentColors > 2
                    || (
                        numberOfDifferentColors === 2
                        && selectedSimpleCardsGroupedBySameColor[0][1].length > 1
                        && selectedSimpleCardsGroupedBySameColor[1][1].length > 1
                    )
                ) {
                    if (cardIds.includes(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)) {
                        nonPlayableCards = [...selectedSimpleCards, ...nonPlayableCards];
                    } else if (!nonPlayableCardIds.includes(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)) {
                        nonPlayableCards = this.addSpecialCardsToCards([CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR], nonPlayableCards);
                    }
                } else if (cardIds.includes(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)) {
                    const selectedSimpleCardIds = selectedSimpleCards.map((c) => c.id);
                    const playerSimpleCardIds = playerCards.filter((c) => SIMPLE_COLORS.includes(c.color)).map((c) => c.id);
                    const nonPlayablePlayerSimpleCardIds = playerCards
                        .filter((c) => SIMPLE_COLORS.includes(c.color))
                        .filter((c) =>
                            !selectedSimpleCardIds.includes(c.id)
                            && numberOfDifferentColors > 1
                            && (
                                (
                                    selectedSimpleCardsGroupedBySameColor[0][1].length === 1
                                    && !selectedSimpleCardColors.includes(c.color)
                                ) || (
                                    selectedSimpleCardsGroupedBySameColor[0][1].length > 1
                                    && c.color !== parseInt(selectedSimpleCardsGroupedBySameColor[0][0], 10)
                                )
                            )
                        )
                        .map((c) => c.id);
                    nonPlayableCards = playerCards
                        .filter((c) => nonPlayablePlayerSimpleCardIds.includes(c.id) || (nonPlayableCardIds.includes(c.id) && !playerSimpleCardIds.includes(c.id)));
                }
            } else if (playerCardIds.includes(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)) {
                const selectedSimpleCards = cards.filter((c) => SIMPLE_COLORS.includes(c.color));
                const selectedSimpleCardColors = selectedSimpleCards.map((c) => c.color);
                const numberOfDifferentColors = [...new Set(selectedSimpleCardColors)].length;
                if (numberOfDifferentColors !== selectedSimpleCardColors.length) {
                    if (cardIds.includes(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)) {
                        nonPlayableCards = [...selectedSimpleCards, ...nonPlayableCards];
                    } else if (!nonPlayableCardIds.includes(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)) {
                        nonPlayableCards = this.addSpecialCardsToCards([CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR], nonPlayableCards);
                    }
                } else if (cardIds.includes(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)) {
                    const selectedSimpleCardIds = selectedSimpleCards.map((c) => c.id);
                    const playerSimpleCardIds = playerCards.filter((c) => SIMPLE_COLORS.includes(c.color)).map((c) => c.id);
                    const nonPlayablePlayerSimpleCardIds = playerCards
                        .filter((c) => SIMPLE_COLORS.includes(c.color))
                        .filter((c) => !selectedSimpleCardIds.includes(c.id) && selectedSimpleCardColors.includes(c.color))
                        .map((c) => c.id);
                    nonPlayableCards = playerCards
                        .filter((c) => nonPlayablePlayerSimpleCardIds.includes(c.id) || (nonPlayableCardIds.includes(c.id) && !playerSimpleCardIds.includes(c.id)));
                }
            }

            return nonPlayableCards;
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
         * @returns {number[]}
         */
        getSpecialPlayerCardIds: function () {
            return [
                [CARD_ID_JERSEY_PLUS_TEN, () => this.currentPlayerHasJersey && !this.jerseyIsNotPlayable],
                [CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE, () => this.currentPlayerHasLegendsBroomWagon && !this.legendsBroomWagonIsNotPlayable],
                [CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER, () => this.currentPlayerHasLegendsEagle && !this.legendsEagleIsNotPlayable && !this.currentPlayerHasJersey],
                [CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR, () => this.currentPlayerHasLegendsPanda && !this.legendsPandaIsNotPlayable && !this.currentPlayerHasJersey],
                [CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN, () => this.currentPlayerHasLegendsShark && !this.legendsSharkIsNotPlayable && !this.currentPlayerHasJersey],
                [CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR, () => this.currentPlayerHasLegendsBadger && !this.legendsBadgerIsNotPlayable && !this.currentPlayerHasJersey],
                [CARD_ID_LEGENDS_ELEPHANT_STOP, () => this.currentPlayerHasLegendsElephant && !this.legendsElephantIsNotPlayable && !this.currentPlayerHasJersey],
            ].reduce((acc, cardIdAndPredicate) => {
                if (cardIdAndPredicate[1]()) {
                    return acc.concat(cardIdAndPredicate[0]);
                }
                return acc;
            }, []);
        },
        /**
         * @returns {Object[]}
         */
        getPlayerCardsCombinationsSortedByHighestValue: function () {
            const sortCardsById = (a, b) => a.id - b.id;
            const sortCardsByHighestValue = (a, b) => b.value - a.value;
            const sortEntriesByLengthThenHighestValues = ([_k1, cards1], [_k2, cards2]) => {
                if (!cards1.length) {
                    return 1;
                }
                if (!cards2.length) {
                    return -1;
                }
                if (cards1.length !== cards2.length) {
                    return cards2.length - cards1.length;
                }

                const sortedCards1 = [...cards1].sort(sortCardsByHighestValue);
                const sortedCards2 = [...cards2].sort(sortCardsByHighestValue);
                for (let i = 0; i < sortedCards1.length; i++) {
                    if (sortedCards1[i].value !== sortedCards2[i].value) {
                        return sortedCards2[i].value - sortedCards1[i].value;
                    }
                }
                return 0;
            };

            const playerCards = this.getAllPlayerCards();
            const simplePlayerCardsSortedByHighestValue = playerCards.filter((c) => SIMPLE_COLORS.includes(c.color)).sort(sortCardsByHighestValue);
            const highestPlayableGroupOfCards = playerCards.reduce((acc, card) => {
                if (card.id === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
                    const redCardsSortedByHighestValue = simplePlayerCardsSortedByHighestValue.filter((c) => c.color === COLOR_RED);
                    if (!redCardsSortedByHighestValue.length) {
                        return acc;
                    }

                    return [
                        ...acc,
                        [card, ...playerCards.filter((c) => [
                            redCardsSortedByHighestValue[0].id,
                            CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        ].includes(c.id))].sort(sortCardsById),
                    ];
                } else if (card.id === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
                    const simpleCardColors = simplePlayerCardsSortedByHighestValue.map((c) => c.color);
                    const differentColors = [...new Set(simpleCardColors)];
                    const simpleCardValues = simplePlayerCardsSortedByHighestValue.map((c) => c.value);
                    const differentValues = [...new Set(simpleCardValues)];
                    if (differentColors.length < 2 || differentValues.length < 2) {
                        return acc;
                    }

                    const simpleCardIdsWithHighestNumberOfCardsOfSameValue = Object.entries(
                        simplePlayerCardsSortedByHighestValue.reduce((acc, c) => {
                            return {
                                ...acc,
                                [c.value]: [...(acc[c.value] || []), c],
                            };
                        }, {})
                    ).sort(sortEntriesByLengthThenHighestValues)[0][1].map((c) => c.id);
                    const otherSimpleCardIdWithHighestValue = simplePlayerCardsSortedByHighestValue.filter((c) => !simpleCardIdsWithHighestNumberOfCardsOfSameValue.includes(c.id))[0].id;

                    return [
                        ...acc,
                        [card, ...playerCards.filter((c) => [
                            ...simpleCardIdsWithHighestNumberOfCardsOfSameValue,
                            otherSimpleCardIdWithHighestValue,
                            CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        ].includes(c.id))].sort(sortCardsById),
                    ];
                } else if (card.id === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
                    const simpleCardColors = simplePlayerCardsSortedByHighestValue.map((c) => c.color);
                    const differentColors = [...new Set(simpleCardColors)];
                    const simpleCardValues = simplePlayerCardsSortedByHighestValue.map((c) => c.value);
                    const differentValues = [...new Set(simpleCardValues)];
                    if (differentColors.length < 2 || differentValues.length < 2) {
                        return acc;
                    }

                    const simpleCardIdsWithHighestNumberOfCardsOfSameColor = Object.entries(
                        simplePlayerCardsSortedByHighestValue.reduce((acc, c) => {
                            return {
                                ...acc,
                                [c.color]: [...(acc[c.color] || []), c],
                            };
                        }, {})
                    ).sort(sortEntriesByLengthThenHighestValues)[0][1].map((c) => c.id);
                    const otherSimpleCardIdWithHighestValue = simplePlayerCardsSortedByHighestValue.filter((c) => !simpleCardIdsWithHighestNumberOfCardsOfSameColor.includes(c.id))[0].id;

                    return [
                        ...acc,
                        [card, ...playerCards.filter((c) => [
                            ...simpleCardIdsWithHighestNumberOfCardsOfSameColor,
                            otherSimpleCardIdWithHighestValue,
                            CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        ].includes(c.id))].sort(sortCardsById),
                    ];
                } else if (card.id === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
                    const simpleCardColors = simplePlayerCardsSortedByHighestValue.map((c) => c.color);
                    const differentColors = [...new Set(simpleCardColors)];
                    const simpleCardValues = simplePlayerCardsSortedByHighestValue.map((c) => c.value);
                    const differentValues = [...new Set(simpleCardValues)];
                    if (differentColors.length < 2 || differentValues.length < 2) {
                        return acc;
                    }

                    const simpleCardIdsOfHighestValueOfEachColor = Object.entries(
                        simplePlayerCardsSortedByHighestValue.reduce((acc, c) => {
                            if ((acc[c.color] || []).length) {
                                return acc;
                            }

                            return {
                                ...acc,
                                [c.color]: [c],
                            };
                        }, {})
                    ).map(([_color, cards]) => cards[0].id);

                    return [
                        ...acc,
                        [card, ...playerCards.filter((c) => [
                            ...simpleCardIdsOfHighestValueOfEachColor,
                            CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        ].includes(c.id))].sort(sortCardsById),
                    ];
                } else {
                    let cardsThatCanBePlayedWithCard = this.getCardsThatCanBePlayedWithCard(card.color, card.value, playerCards).filter((c) => card.id !== c.id);
                    if (!cardsThatCanBePlayedWithCard.length) {
                        // add single card combination
                        return [...acc, [card]];
                    }

                    return [
                        ...acc,
                        // add the highest color combination
                        [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.color === card.color || c.id === CARD_ID_JERSEY_PLUS_TEN || c.id === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE).sort(sortCardsById),
                        // add the highest value combination
                        [card, ...cardsThatCanBePlayedWithCard].filter((c) => c.value === card.value || c.id === CARD_ID_JERSEY_PLUS_TEN || c.id === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE).sort(sortCardsById),
                    ];
                }
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
                        || combinations[i - 1].cards.length > combination.cards.length
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
            // detect special cards
            const cardIds = cards.map((c) => c.id);
            const withJersey = cardIds.includes(CARD_ID_JERSEY_PLUS_TEN);
            const withLegendsBroomWagon = cardIds.includes(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
            const withLegendsShark = cardIds.includes(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);

            // remove special cards
            const cardsWithoutSpecialCards = cards.filter((c) => ![
                CARD_ID_JERSEY_PLUS_TEN,
                CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                CARD_ID_LEGENDS_ELEPHANT_STOP,
            ].includes(c.id));
            if (!cardsWithoutSpecialCards.length) {
                return 0;
            }

            // an adventurer is only playable solo (and without jersey)
            const adventurer = cardsWithoutSpecialCards.find((c) => c.color === COLOR_ADVENTURER);
            if (adventurer) {
                return adventurer.value;
            }

            // special cards rules
            const addJerseyValueIfUsed = (value) => value + (withJersey ? VALUE_JERSEY_PLUS_TEN : 0);
            const addLegendsBroomWagonValueIfUsed = (value) => value + (withLegendsBroomWagon ? VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE : 0);
            const addLegendsSharkValueIfUsed = (value) => (withLegendsShark ? value * 10 : value);

            // if single non-special card
            if (cardsWithoutSpecialCards.length === 1) {
                return addLegendsBroomWagonValueIfUsed(
                    addJerseyValueIfUsed(
                        addLegendsSharkValueIfUsed(cardsWithoutSpecialCards[0].value)
                    )
                );
            }

            // if multiple non-special cards
            let minCardValue = 1000;
            cardsWithoutSpecialCards.forEach((card) => {
                if (card.value < minCardValue) {
                    minCardValue = card.value;
                }
            });
            return addLegendsBroomWagonValueIfUsed(
                addJerseyValueIfUsed((cardsWithoutSpecialCards.length * 10) + minCardValue)
            );
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
            if (
                this.isCurrentPlayerActive()
                && this.currentState === 'playerGiveCardsBackAfterPicking'
            ) {
                let specialCardIdsThatCannotBeGiven = [CARD_ID_JERSEY_PLUS_TEN];
                if (this.isExtensionLegendsEnabled) {
                    specialCardIdsThatCannotBeGiven = [
                        ...specialCardIdsThatCannotBeGiven,
                        CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                        CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                        CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                        CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                        CARD_ID_LEGENDS_ELEPHANT_STOP,
                    ];
                }
                specialCardIdsThatCannotBeGiven.forEach((cardId) => {
                    if (this.playerHand.isSelected(cardId)) {
                        this.playerHand.unselectItem(cardId);
                    }
                });
                this.displayCardsAsNonSelectable(this.addSpecialCardsToCards(specialCardIdsThatCannotBeGiven, []));
            } else {
                const selectedCards = this.getSelectedPlayerCards();
                this.displayCardsAsNonSelectable(this.getPlayerCardsThatCannotBePlayedWithCards(selectedCards));
            }
        },
        /**
         * @param {Object[]} cards
         */
        displayCardsAsNonSelectable: function (cards) {
            this.getAllPlayerCards().forEach((playerCard) => {
                dojo.toggleClass(
                    `${DOM_ID_PLAYER_HAND}_item_${playerCard.id}`,
                    DOM_CLASS_NON_SELECTABLE_CARD,
                    cards.map((c) => c.id).includes(playerCard.id)
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
            this.setupSelectedCardsValueInPlayerHand();
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
            this.setupSelectedCardsValueInPlayerHand();
            this.setupPlayCardsActionButtonIfNeeded();
        },
        unselectAllCards: function () {
            this.playerHand.unselectAll();
            this.setupPlayerHandSelectableCards();
            this.setupGroupCardsButton();
            this.setupSelectedCardsValueInPlayerHand();
            this.setupPlayCardsActionButtonIfNeeded();
        },
        /**
         * @param {Object[]} cards
         * @returns {Object[]}
         */
        sortPlayedCards: function (cards) {
            return [...cards].sort((a, b) => {
                // coach at the end
                if ([
                    CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                    CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                    CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                    CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                    CARD_ID_LEGENDS_ELEPHANT_STOP,
                ].includes(b.id)) {
                    return -1;
                }
                if ([
                    CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                    CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                    CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                    CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                    CARD_ID_LEGENDS_ELEPHANT_STOP,
                ].includes(a.id)) {
                    return 1;
                }

                // then jersey
                if (b.id === CARD_ID_JERSEY_PLUS_TEN) {
                    return -1;
                }
                if (a.id === CARD_ID_JERSEY_PLUS_TEN) {
                    return 1;
                }

                // then broom wagon
                if (b.id === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
                    return -1;
                }
                if (a.id === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
                    return 1;
                }

                // then smallest values
                return b.value - a.value;
            });
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
         * @param {number} playerId
         * @returns {Object[]}
         */
        sortPlayersToStartWithPlayerIdIfPresent: function (players, playerId) {
            const playerIndex = players.findIndex((player) => player.id === playerId);
            if (playerIndex <= 0) {
                return players;
            }

            return [...players.slice(playerIndex), ...players.slice(0, playerIndex)];
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
                    `<div id="card-in-stack-${card.id}" class="${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE}" style="background-position: -${x}px -${y}px;"></div>`,
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

            for (let i = 0; i < cards.length; i++) {
                setTimeout(
                    () => {
                        this.addCardsToPlayerHand([cards[i]], true, domId);
                    },
                    i * 1000
                );
                setTimeout(
                    () => {
                        if (typeof onAfterEachAnimation === 'function') {
                            onAfterEachAnimation.bind(this)(i);
                        }
                    },
                    (i + 1) * 1000
                );
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
                    `<div class="${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_BACK_SIDE} ${DOM_CLASS_MOVING_CARD}" style="position: absolute; z-index: ${100 - i};"></div>`,
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
            if (receiverPlayerId === this.player_id) {
                this.addCardsToPlayerHand(cards, true, rewardCardDomId);
                dojo.destroy(rewardCardDomId);
            } else {
                const animation = this.slideToObject(
                    rewardCardDomId,
                    `player-table-${receiverPlayerId}-hand`
                );
                dojo.connect(animation, 'onEnd', () => {
                    this.increaseNumberOfCardsOfPlayer(receiverPlayerId, cards.length);
                    this.fadeOutAndDestroy(rewardCardDomId);
                });
                animation.play();
            }
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
         * @param {number} lastPlayedCardsPlayerId
         * @param {number} activePlayerId
         */
        setupTurnPassedBubbles: function (lastPlayedCardsPlayerId, activePlayerId) {
            const sortedPlayers = this.sortPlayersToStartWithPlayerIdIfPresent(
                this.sortPlayersByTurnOrderPosition(Object.entries(this.players).map((entry) => entry[1])),
                lastPlayedCardsPlayerId
            );

            const activePlayerIndex = sortedPlayers.findIndex((player) => player.id === activePlayerId);
            // if the active player is the first player after the last played cards player
            // or if the last played cards player is the active player
            // or if there is no active player among players (this may happen at the end of the game... maybe?)
            if (activePlayerIndex <= 1) {
                return;
            }

            for (let i = 1; i < activePlayerIndex; i++) {
                this.showTurnPassedBubble(sortedPlayers[i].id);
            }
        },
        /**
         * @param {number} playerId
         */
        showTurnPassedBubble: function (playerId) {
            $(`player-table-${playerId}-speech-bubble`).innerHTML = '<i class="fa fa-times"></i>';
            dojo.addClass(`player-table-${playerId}-speech-bubble`, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW);
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
                    if (![
                        CARD_ID_JERSEY_PLUS_TEN,
                        CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                        CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                        CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                        CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                        CARD_ID_LEGENDS_ELEPHANT_STOP,
                    ].includes(card.id)) {
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

            // sort cards like the ones in player hand but reversed,
            // to always send them from right to left,
            // in order to avoid a visual bug in player hand when cards leave the hand one by one
            const playerCardIds = this.getAllPlayerCards().map((c) => c.id);
            const sortedCards = [...cards].sort((a, b) => playerCardIds.indexOf(b.id) - playerCardIds.indexOf(a.id));

            let animations = [];
            this.removeCardFromPlayerHand(sortedCards[0].id);
            for (let i = 0; i < sortedCards.length; i++) {
                const position = this.getCardPositionInSpriteByColorAndValue(sortedCards[i].color, sortedCards[i].value);
                const backgroundPositionX = this.getAbsoluteCardBackgroundPositionXFromCardPosition(position);
                const backgroundPositionY = this.getAbsoluteCardBackgroundPositionYFromCardPosition(position);
                const animationStartDomId = $(`${DOM_ID_PLAYER_HAND}_item_${sortedCards[i].id}`) ? `${DOM_ID_PLAYER_HAND}_item_${sortedCards[i].id}` : `player-table-${this.player_id}-hand`;
                animations[i] = this.slideTemporaryObject(
                    `<div class="${DOM_CLASS_VELONIMO_CARD} ${DOM_CLASS_CARD_FRONT_SIDE} ${DOM_CLASS_MOVING_CARD}" style="position: absolute; background-position: -${backgroundPositionX}px -${backgroundPositionY}px; z-index: ${100 - i};"></div>`,
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
         * @param {boolean} updateNumberOfCards
         * @param {string=} fromDomId
         */
        addCardsToPlayerHand: function (cards, updateNumberOfCards, fromDomId) {
            cards.forEach((card) => {
                if (
                    updateNumberOfCards
                    && ![
                        CARD_ID_JERSEY_PLUS_TEN,
                        CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                        CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                        CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                        CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                        CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                        CARD_ID_LEGENDS_ELEPHANT_STOP,
                    ].includes(card.id)
                ) {
                    if (fromDomId) {
                        setTimeout(
                            () => {
                                this.increaseNumberOfCardsOfPlayer(this.player_id, 1);
                            },
                            1000
                        );
                    } else {
                        this.increaseNumberOfCardsOfPlayer(this.player_id, 1);
                    }
                }
                if (fromDomId) {
                    this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id, fromDomId);
                } else {
                    this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id);
                }
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
            this.playerHand.removeFromStockById(cardId);
            if (![
                CARD_ID_JERSEY_PLUS_TEN,
                CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                CARD_ID_LEGENDS_ELEPHANT_STOP,
            ].includes(cardId)) {
                this.decreaseNumberOfCardsOfPlayer(this.player_id, 1);
            }
            this.setupPlayerHandSelectableCards();
            this.setupGroupCardsButton();
            this.setupSelectedCardsValueInPlayerHand();
        },
        /**
         * @param {number[]} specialCardIds
         * @param {Object[]} cards
         */
        addSpecialCardsToCards: function (specialCardIds, cards) {
            const specialCards = specialCardIds.map((cardId) => {
                let value;
                switch (cardId) {
                    case CARD_ID_JERSEY_PLUS_TEN:
                        value = VALUE_JERSEY_PLUS_TEN;
                        break;
                    case CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE:
                        value = VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE;
                        break;
                    case CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER:
                        value = VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER;
                        break;
                    case CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR:
                        value = VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR;
                        break;
                    case CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN:
                        value = VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN;
                        break;
                    case CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR:
                        value = VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR;
                        break;
                    case CARD_ID_LEGENDS_ELEPHANT_STOP:
                        value = VALUE_LEGENDS_ELEPHANT_STOP;
                        break;
                    default:
                        throw new Error('Unsupported cardId for addSpecialCardsToCards');
                }

                return this.getCardObjectFromPositionInSpriteAndId(
                    this.getCardPositionInSpriteByColorAndValue(COLOR_SPECIAL, value),
                    cardId
                );
            });

            return cards.concat(specialCards);
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
                setTimeout(
                    () => dojo.removeClass(elementDomId, DOM_CLASS_PLAYER_SPEECH_BUBBLE_SHOW),
                    500
                );
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
                        `<a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON}" class="bgabutton bgabutton_gray"><span>${_('Ungroup cards')}</span></a>`,
                        DOM_ID_PLAYER_HAND_TITLE_WRAPPER_LEFT
                    );
                    this.addTooltip(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON, '', _('Click this button to stop grouping selected cards.'));
                    this.connect($(DOM_ID_PLAYER_HAND_UNGROUP_CARDS_BUTTON), 'onclick', 'onClickOnUngroupCardsButton');
                }
            } else if (selectedCards.length > 1 && this.getCardsValue(selectedCards) > 0) {
                if (!$(DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON)) {
                    dojo.place(
                        `<a href="javascript:void(0)" id="${DOM_ID_PLAYER_HAND_GROUP_CARDS_BUTTON}" class="bgabutton bgabutton_gray"><span>${_('Group cards')}</span></a>`,
                        DOM_ID_PLAYER_HAND_TITLE_WRAPPER_LEFT
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

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////
        /**
         * @param {number} cardId
         */
        onPlayerCardSelected: function (cardId) {
            const selectedCards = this.getSelectedPlayerCards();
            const selectedCardsWithoutLastSelectedCard = selectedCards.filter((card) => card.id !== cardId);
            const selectedCardGroup = this.getCardsGroupOfCard(cardId);

            // if a card in a group has been selected
            if (selectedCardGroup) {
                // if this is the first card selected
                if (selectedCards.length === 1) {
                    this.selectCards(selectedCardGroup.cards);
                } else {
                    this.unselectCards(selectedCardsWithoutLastSelectedCard);
                    this.selectCards(selectedCardGroup.cards);
                }
            } else {
                const selectedCardsWithoutLastSelectedCardGroups = this.getCardsGroupsForCards(selectedCardsWithoutLastSelectedCard);
                // if a cards group was selected
                if (selectedCardsWithoutLastSelectedCardGroups.length > 0) {
                    this.unselectCards(selectedCardsWithoutLastSelectedCard);
                } else {
                    const playerCardIdsThatCannotBePlayedWithSelectedCards = this.getPlayerCardsThatCannotBePlayedWithCards(selectedCards).map((c) => c.id);
                    this.unselectCards(selectedCards.filter((c) => playerCardIdsThatCannotBePlayedWithSelectedCards.includes(c.id) && cardId !== c.id));
                }
            }
        },
        /**
         * @param {number} cardId
         */
        onPlayerCardUnselected: function (cardId) {
            const unselectedCardGroup = this.getCardsGroupOfCard(cardId);
            if (unselectedCardGroup) {
                this.unselectCards(unselectedCardGroup.cards);
            } else {
                const selectedCards = this.getSelectedPlayerCards();
                const selectedCardsWithoutUnselectedCard = selectedCards.filter((card) => card.id !== cardId);
                const playerCardIdsThatCannotBePlayedWithRemainingSelectedCards = this.getPlayerCardsThatCannotBePlayedWithCards(selectedCardsWithoutUnselectedCard).map((c) => c.id);
                this.unselectCards(selectedCards.filter((c) => playerCardIdsThatCannotBePlayedWithRemainingSelectedCards.includes(c.id) || cardId === c.id));
            }
        },
        onClickOnTogglePlayerHandSortButton: function () {
            const currentSortingMode = this.getCurrentPlayerCardsSortingMode();
            if (currentSortingMode === PLAYER_HAND_SORT_BY_COLOR) {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sorted by value');
                dojo.attr(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, 'data-current-sort', PLAYER_HAND_SORT_BY_VALUE);
                this.addTooltip(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON, '', _('Click this button to sort your hand by color.'));
                this.sortPlayerCardsByValue();
            } else {
                $(DOM_ID_PLAYER_HAND_TOGGLE_SORT_BUTTON_LABEL).innerHTML = _('Sorted by color');
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
            const cardIds = cards.map((c) => c.id);
            const withJersey = cardIds.includes(CARD_ID_JERSEY_PLUS_TEN);
            const withLegendsBroomWagon = cardIds.includes(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
            const withLegendsEagle = cardIds.includes(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER);
            const withLegendsPanda = cardIds.includes(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR);
            const withLegendsShark = cardIds.includes(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);
            const withLegendsBadger = cardIds.includes(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR);
            const withLegendsElephant = cardIds.includes(CARD_ID_LEGENDS_ELEPHANT_STOP);
            const playedCards = cards.filter((c) => ![
                CARD_ID_JERSEY_PLUS_TEN,
                CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                CARD_ID_LEGENDS_ELEPHANT_STOP,
            ].includes(c.id));
            if (playedCards.length <= 0) {
                return;
            }

            this.requestAction('playCards', {
                cards: playedCards.map(card => card.id).join(';'),
                withJersey: withJersey,
                withLegendsBroomWagon: withLegendsBroomWagon,
                withLegendsEagle: withLegendsEagle,
                withLegendsPanda: withLegendsPanda,
                withLegendsShark: withLegendsShark,
                withLegendsBadger: withLegendsBadger,
                withLegendsElephant: withLegendsElephant,
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
        },

        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications
        ///////////////////////////////////////////////////
        /**
         * @Override ntf_tableWindow BGA framework function to supporting translating the title of the tableWindow
         * @param {Object|string} notif
         */
        ntf_tableWindow: function (notif) {
            if(typeof notif.args.title === 'object'){
                notif.args.title = this.format_string_recursive(notif.args.title.str, notif.args.title.args);
            }
            this.inherited(arguments);
        },
        setupNotifications: function () {
            const isReadOnly = this.isReadOnly();
            [
                ['roundStarted', 1],
                ['roundEnded', 1],
                ['cardsDealt', 1],
                ['legendsCoachCardDealt', 1],
                ['cardsPlayed', 1000],
                ['turnPassed', isReadOnly ? 1000 : 1],
                ['playerHasFinishedRound', 1],
                ['playedCardsDiscarded', 1],
                ['cardsReceivedFromAnotherPlayer', 3000],
                ['cardsSentToAnotherPlayer', 3000],
                ['cardsMovedBetweenTwoOtherPlayers', 3000, (notif) => (notif.args.receiverPlayerId === this.player_id || notif.args.senderPlayerId === this.player_id)],
                // /!\ 2P mode only
                ['attackRewardCardsDiscarded', 1],
                // /!\ 2P mode only
                ['attackRewardCardsMovedToPlayer', 1000],
                // /!\ 2P mode only
                ['attackRewardCardsRevealed', 1000],
                // /!\ 2P mode only
                ['cardsReceivedFromDeck', isReadOnly ? 2000 : 1000],
                // /!\ 2P mode only
                ['cardsMovedFromDeckToAnotherPlayer', isReadOnly ? 2000 : 1000, (notif) => notif.args.receiverPlayerId === this.player_id],
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
            this.addCardsToPlayerHand(
                this.addSpecialCardsToCards(this.getSpecialPlayerCardIds(), data.args.cards),
                false
            );
            this.sortPlayerCardsByCurrentSortingMode();
        },
        notif_legendsCoachCardDealt: function (data) {
            // this notif function is never called,
            // because it is only triggered once before the game starts,
            // before setupNotifications() is called
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
            this.moveCardsFromPlayerHandToTable(
                data.args.playedCardsPlayerId,
                this.addSpecialCardsToCards(
                    [
                        [CARD_ID_JERSEY_PLUS_TEN, () => data.args.withJersey],
                        [CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE, () => data.args.withLegendsBroomWagon],
                        [CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER, () => data.args.withLegendsEagle],
                        [CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR, () => data.args.withLegendsPanda],
                        [CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN, () => data.args.withLegendsShark],
                        [CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR, () => data.args.withLegendsBadger],
                        [CARD_ID_LEGENDS_ELEPHANT_STOP, () => data.args.withLegendsElephant],
                    ].reduce((acc, cardIdAndPredicate) => {
                        if (cardIdAndPredicate[1]()) {
                            return acc.concat(cardIdAndPredicate[0]);
                        }
                        return acc;
                    }, []),
                    data.args.playedCards,
                )
            );

            // update special cards state if used
            if (data.args.withJersey) {
                this.useSpecialCardForCurrentRound(CARD_ID_JERSEY_PLUS_TEN);
            }
            if (data.args.withLegendsBroomWagon) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
            }
            if (data.args.withLegendsEagle) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER);
            }
            if (data.args.withLegendsPanda) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR);
            }
            if (data.args.withLegendsShark) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN);
            }
            if (data.args.withLegendsBadger) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR);
            }
            if (data.args.withLegendsElephant) {
                this.useSpecialCardForCurrentRound(CARD_ID_LEGENDS_ELEPHANT_STOP);
            }
        },
        notif_turnPassed: function (data) {
            this.showTurnPassedBubble(data.args.playerId);
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
        /**
         * Note about special cards: the special cards are restored and moved to their next owner before the next round begins,
         *                           so, when the game ends, the winner will visibly own the jersey, and the last loser will visibly own the legends broom wagon
         */
        notif_roundEnded: function (data) {
            // remove special cards (that can move) from current player hand
            if (this.currentPlayerHasJersey && !this.jerseyIsNotPlayable) {
                this.removeCardFromPlayerHand(CARD_ID_JERSEY_PLUS_TEN);
            }
            if (this.currentPlayerHasLegendsBroomWagon && !this.legendsBroomWagonIsNotPlayable) {
                this.removeCardFromPlayerHand(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE);
            }

            this.players = data.args.players;
            this.resetDisplayedNumberOfCardsByPlayerId();
            this.setupPlayersHiddenCards();
            data.args.specialCardIdsToRestore.forEach((cardId) => {
                this.restoreSpecialCardForCurrentRound(cardId);
            });
            if (!this.is2PlayersMode()) {
                this.moveJerseyToCurrentWinner();
            }
            this.moveLegendsBroomWagonToLastLoser();

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
