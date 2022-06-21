<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Velonimo implementation : © Oliver THEBAULT (a.k.a. Oliboy50)
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * states.inc.php
 *
 * Velonimo game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: self::checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

require_once('modules/constants.inc.php');

$machinestates = [
    // The initial state. Do not modify.
    ST_BGA_GAME_SETUP => [
        'name' => 'gameSetup',
        'description' => clienttranslate('Game setup'),
        'type' => 'manager',
        'action' => 'stGameSetup',
        'transitions' => ['' => ST_START_ROUND],
    ],

    // Start round, deal cards and define the first player
    ST_START_ROUND => [
        'name' => 'startRound',
        'description' => '',
        'type' => 'game',
        'action' => 'stStartRound',
        'updateGameProgression' => true,
        'transitions' => ['firstPlayerTurn' => ST_FIRST_PLAYER_TURN],
    ],

    // The first player must play cards
    ST_FIRST_PLAYER_TURN => [
        'name' => 'firstPlayerTurn',
        'description' => clienttranslate('${actplayer} must play card(s)'),
        'descriptionmyturn' => clienttranslate('${you} must play card(s)'),
        'type' => 'activeplayer',
        'args' => 'argFirstPlayerTurn',
        'possibleactions' => ['playCards'],
        'transitions' => [
            'pickCardsFromAnotherPlayer' => ST_PLAYER_PICK_CARDS_FROM_PLAYER,
            'nextPlayer' => ST_ACTIVATE_NEXT_PLAYER,
            'endRound' => ST_END_ROUND,
            'zombiePass' => ST_ACTIVATE_NEXT_PLAYER,
        ],
    ],

    // The next players must choose to play cards or pass
    ST_PLAYER_TURN => [
        'name' => 'playerTurn',
        'description' => clienttranslate('${actplayer} must play card(s) to beat ${playedCardsValue} or pass'),
        'descriptionmyturn' => clienttranslate('${you} must play card(s) to beat ${playedCardsValue} or pass'),
        'type' => 'activeplayer',
        'args' => 'argPlayerTurn',
        'possibleactions' => ['playCards', 'passTurn'],
        'transitions' => [
            'pickCardsFromAnotherPlayer' => ST_PLAYER_PICK_CARDS_FROM_PLAYER,
            'nextPlayer' => ST_ACTIVATE_NEXT_PLAYER,
            'endRound' => ST_END_ROUND,
            'zombiePass' => ST_ACTIVATE_NEXT_PLAYER,
        ],
    ],

    // Activate the next player who can play
    ST_ACTIVATE_NEXT_PLAYER => [
        'name' => 'activateNextPlayer',
        'description' => '',
        'type' => 'game',
        'action' => 'stActivateNextPlayer',
        'transitions' => ['firstPlayerTurn' => ST_FIRST_PLAYER_TURN, 'playerTurn' => ST_PLAYER_TURN, 'playerSelectNextPlayer' => ST_PLAYER_SELECT_NEXT_PLAYER],
    ],

    // The "natural" next player don't have cards anymore,
    // he must choose the next player who will play
    ST_PLAYER_SELECT_NEXT_PLAYER => [
        'name' => 'playerSelectNextPlayer',
        'description' => clienttranslate('${actplayer} must choose the next player'),
        'descriptionmyturn' => clienttranslate('${you} must choose the next player'),
        'type' => 'activeplayer',
        'args' => 'argPlayerSelectNextPlayer',
        'possibleactions' => ['selectNextPlayer'],
        'transitions' => [
            'applySelectedNextPlayer' => ST_APPLY_SELECTED_NEXT_PLAYER,
            'zombiePass' => ST_ACTIVATE_NEXT_PLAYER,
        ],
    ],

    // Intermediate state to change the active player
    ST_APPLY_SELECTED_NEXT_PLAYER => [
        'name' => 'applySelectedNextPlayer',
        'description' => '',
        'type' => 'game',
        'action' => 'stApplySelectedNextPlayer',
        'transitions' => ['firstPlayerTurn' => ST_FIRST_PLAYER_TURN],
    ],

    // When someone plays one or more cards of value "1",
    // this player has to pick one or more cards from another player of its choice
    ST_PLAYER_PICK_CARDS_FROM_PLAYER => [
        'name' => 'playerSelectPlayerToPickCards',
        'description' => clienttranslate('${actplayer} must pick ${numberOfCards} card(s) from another player\'s hand'),
        'descriptionmyturn' => clienttranslate('${you} must pick ${numberOfCards} card(s) from another player\'s hand'),
        'type' => 'activeplayer',
        'args' => 'argPlayerSelectPlayerToPickCards',
        'possibleactions' => ['selectPlayerToPickCards'],
        'transitions' => [
            'giveCardsBack' => ST_PLAYER_GIVE_CARDS_BACK_TO_PLAYER_AFTER_PICKING,
            'zombiePass' => ST_ACTIVATE_NEXT_PLAYER,
        ],
    ],

    // After picking cards from another player's hand,
    // the player who picked cards must give back the same number of cards of its choice
    ST_PLAYER_GIVE_CARDS_BACK_TO_PLAYER_AFTER_PICKING => [
        'name' => 'playerGiveCardsBackAfterPicking',
        'description' => clienttranslate('${actplayer} must choose ${numberOfCards} card(s) for ${otherplayer}'),
        'descriptionmyturn' => clienttranslate('${you} must choose ${numberOfCards} card(s) for ${otherplayer}'),
        'type' => 'activeplayer',
        'args' => 'argPlayerGiveCardsBackAfterPicking',
        'possibleactions' => ['selectCardsToGiveBack'],
        'transitions' => [
            'nextPlayer' => ST_ACTIVATE_NEXT_PLAYER,
            'zombiePass' => ST_ACTIVATE_NEXT_PLAYER,
        ],
    ],

    // End round, count round points and give yellow jersey to the current winner
    ST_END_ROUND => [
        'name' => 'endRound',
        'description' => '',
        'type' => 'game',
        'action' => 'stEndRound',
        'transitions' => ['nextRound' => ST_START_ROUND, 'endGame' => ST_BGA_GAME_END],
    ],

    // Final state. Do not modify (and do not overload action/args methods).
    ST_BGA_GAME_END => [
        'name' => 'gameEnd',
        'description' => clienttranslate('End of game'),
        'type' => 'manager',
        'action' => 'stGameEnd',
        'args' => 'argGameEnd',
    ],
];
