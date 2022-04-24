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
const DOM_ID_PLAYER_HAND = 'my-hand';
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
        constructor: function() {
            // GameInfo
            this.currentRound = 0;
            this.howManyRounds = 0;
            this.howManyPlayers = 0;

            // Board
            this.margin = 20;
            this.playertableWidth = 130;
            this.playertableHeight = 165;
            this.playertablesWidth = Math.min(740, (this.playertableWidth + (this.margin * 2.5)) * 5);
            this.playertablesHeight = (this.playertableHeight + (this.margin * 2.5)) * 2.5;

            // Cards
            this.playerHand = null; // https://en.doc.boardgamearena.com/Stock
            this.cardWidth = 90;
            this.cardHeight = 126;

            // Played cards position indexed by howManyPlayers
            this.playedCardsPosition = []; // array of [dx, dy] player card position offset
            this.playedCardsPosition[2] = [[0, 0.75], [0, -0.75]];
            this.playedCardsPosition[3] = [[0, 0.75], [-0.75, -0.75], [0.75, -0.75]];
            this.playedCardsPosition[4] = [[0, 0.75], [-1.2, 0], [0, -0.75], [1.2, 0]];
            this.playedCardsPosition[5] = [[0, 0.75], [-1.2, 0.4], [-0.75, -0.75], [0.75, -0.75], [1.2, 0.4]];
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
        setup: function(gamedatas) {
            console.log(gamedatas);
            this.currentRound = gamedatas.currentRound;
            this.howManyRounds = gamedatas.howManyRounds;

            // Setup board
            dojo.place(
                `<div id="player-tables" style="width: ${this.playertablesWidth}px; height: ${this.playertablesHeight}px;"></div>
<div class="player-board" id="gameinfo">
    <div id="hand-counter"></div>
</div>`,
                'board'
            );

            // Setup players
            const players = gamedatas.players;
            const playerIds = Object.keys(players);
            this.howManyPlayers = playerIds.length;

            let playerId = gamedatas.currentPlayerId;
            if(!playerIds.includes(playerId)) {
                playerId = playerIds[0];
            }

            const sizeDx = this.playertableWidth + (this.margin * 2);
            const sizeDy = this.playertableHeight + (this.margin * 2);
            for (let i = 1; i <= this.howManyPlayers; i++) {
                const player = players[playerId];
                const dx = this.playedCardsPosition[this.howManyPlayers][i-1][0];
                const dy = this.playedCardsPosition[this.howManyPlayers][i-1][1];

                dojo.place(this.format_block('jstpl_player_table', {
                    w: this.playertableWidth,
                    h: this.playertableHeight,
                    x: (this.playertablesWidth / 2) + (dx * sizeDx) - (this.playertableWidth / 2),
                    y: (this.playertablesHeight / 2) - (dy * sizeDy) - (this.playertableHeight / 2) - this.margin,
                    id: playerId,
                    position: player.position,
                    color: player.color,
                    name: (player.name.length > 10 ? (player.name.substr(0,10) + "...") : player.name),
                }), 'player-tables');

                playerId = gamedatas.nextPlayerIds[playerId];
            }

            // Init playerHand ("ebg.stock" component)
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
            gamedatas.currentPlayerCards.forEach((card) => {
                this.playerHand.addToStockWithId(this.getCardPositionInSpriteByColorAndValue(card.color, card.value), card.id );
            });

            // Cards played on table
            this.playCardsOnTable(playerId, gamedatas.playedCards);

            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();
        },


        ///////////////////////////////////////////////////
        //// Game & client states
        ///////////////////////////////////////////////////

        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function(stateName, args) {
            console.log( 'Entering state: '+stateName );

            switch( stateName )
            {

            /* Example:

            case 'myGameState':

                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );

                break;
           */


            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function(stateName) {
            console.log( 'Leaving state: '+stateName );

            switch( stateName )
            {

            /* Example:

            case 'myGameState':

                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );

                break;
           */


            case 'dummmy':
                break;
            }
        },

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //
        onUpdateActionButtons: function(stateName, args) {
            console.log( 'onUpdateActionButtons: '+stateName );

            if(this.isCurrentPlayerActive()) {
                switch(stateName) {
/*
                 Example:

                 case 'myGameState':

                    // Add 3 action buttons in the action status bar:

                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' );
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' );
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' );
                    break;
*/
                }
            }
        },
        onPlayerHandSelectionChanged: function(controlName, itemId)
        {
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
            if (
                state === 'firstPlayerTurn'
                || state === 'playerTurn'
            ){
                if (!this.isCurrentPlayerActive()) {
                    return;
                }

                this.removeActionButtons();

                const selectedCards = this.getSelectedPlayerCards();
                if (selectedCards.length > 0) {
                    // @TODO:
                    // this.addActionButton('giveCards_button', _('Give selected cards'), 'onGiveCards');
                }
            }
        },

        ///////////////////////////////////////////////////
        //// Utility methods
        ///////////////////////////////////////////////////

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
         * This function gives the position of the card in the sprite "cards.png",
         * it also gives weight to cards to sort them by color (blue-1, blue-2, ...) just like in the sprite,
         * it also gives the type ID for the stock component.
         *
         *
         * @param {number} color
         * @param {number} value
         * @returns {number}
         */
        getCardPositionInSpriteByColorAndValue: function(color, value) {
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
        getCardObjectFromPositionInSpriteAndId: function(position, cardId) {
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
        getCardsThatCannotBePlayedWithCard: function(color, value, cards) {
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
         * @returns {function(object[], object): object[]}
         */
        getPlayerCardsThatCannotBePlayedWithSelectedCardsReducer: function(playerCards) {
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
                const cardDomId = `${DOM_ID_PLAYER_HAND}_item_${playedCard.id}`;
                if (cards.map((card) => card.id).includes(playedCard.id)) {
                    dojo.addClass(cardDomId, DOM_CLASS_NON_SELECTABLE_CARD);
                } else {
                    dojo.removeClass(cardDomId, DOM_CLASS_NON_SELECTABLE_CARD);
                }
            });
        },
        sortPlayedCards: function (cards) {
            return [...cards].sort((a, b) => b.value - a.value);
        },
        playCardsOnTable: function(playerId, cards) {
            if (cards.length <= 0) {
                return;
            }

            const stackedCards = this.sortPlayedCards(cards);
            const topOfStackCardId = stackedCards[stackedCards.length - 1];

            // create played cards
            dojo.place(
                this.format_block('jstpl_cards_stack', {
                    id: topOfStackCardId,
                }),
                `player-table-${playerId}-cards`
            );
            stackedCards.forEach((card) => {
                dojo.place(
                    this.format_block('jstpl_card_in_stack', {
                        id: card.id,
                        color: card.color,
                        value: card.value,
                    }),
                    `cards-stack-${topOfStackCardId}`
                );
            });

            // place cards from where the animation will start
            if (playerId !== this.player_id) {
                this.placeOnObject('cards-stack-'+topOfStackCardId, 'overall_player_board_'+playerId);
            } else if ($(`${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`)) {
                this.placeOnObject('cards-stack-'+topOfStackCardId, `${DOM_ID_PLAYER_HAND}_item_${topOfStackCardId}`);
                stackedCards.forEach((card) => {
                    this.playerHand.removeFromStockById(card.id);
                });
            }

            // move cards to their destination
            this.slideToObject('cards-stack-'+topOfStackCardId, `player-table-${playerId}-cards`).play();
        },

        ///////////////////////////////////////////////////
        //// Player's action
        ///////////////////////////////////////////////////

        onPlayCards: function() {
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
        setupNotifications: function() {
            console.log( 'notifications subscriptions setup' );

            // TODO: here, associate your game notifications with local methods

            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            //
        },

        // TODO: from this point and below, you can write your game notifications handling methods

        /*
        Example:

        notif_cardPlayed: function(notif) {
            console.log( 'notif_cardPlayed' );
            console.log( notif );

            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call

            // TODO: play the card in the user interface.
        },

        */
   });
});
