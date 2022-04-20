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
            this.playerHand.create(this, $('myhand'), this.cardWidth, this.cardHeight);
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
                    const stockItemId = this.getStockCardIdForColorAndValue(color, value);
                    this.playerHand.addItemType(stockItemId, stockItemId, cardsImageUrl, stockItemId);
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
                const stockItemId = this.getStockCardIdForColorAndValue(COLOR_ADVENTURER, value);
                this.playerHand.addItemType(stockItemId, stockItemId, cardsImageUrl, stockItemId);
            });

            // Setup currentPlayer cards
            dojo.connect(this.playerHand, 'onChangeSelection', this, 'onPlayerHandSelectionChanged');
            gamedatas.currentPlayerCards.forEach((card) => {
                this.playerHand.addToStockWithId(this.getStockCardIdForColorAndValue(card.color, card.value), card.id );
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

            const state = this.gamedatas.gamestate.name;
            const selectedCards = this.playerHand.getSelectedItems();

            if (
                state === 'firstPlayerTurn'
                || state === 'playerTurn'
            ){
                this.removeActionButtons();

                if (selectedCards.length > 0) {
                    this.addActionButton('giveCards_button', _('Give selected cards'), 'onGiveCards');
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
                `/papayoo/papayoo/${action}.html`,
                Object.assign({}, data, { lock: true }),
                this,
                () => {}
            );
        },
        getStockCardIdForColorAndValue: function(color, value) {
            return color + value;
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

            // place cards from where there animation will start
            if (playerId !== this.player_id) {
                this.placeOnObject('cards-stack-'+topOfStackCardId, 'overall_player_board_'+playerId);
            } else if ($('myhand_item_'+topOfStackCardId)) {
                this.placeOnObject('cards-stack-'+topOfStackCardId, 'myhand_item_'+topOfStackCardId);
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

            const playedCards = this.playerHand.getSelectedItems();
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
