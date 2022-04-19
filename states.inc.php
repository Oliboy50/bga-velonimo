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


$machinestates = [
    // The initial state. Do not modify.
    1 => [
        'name' => 'gameSetup',
        'description' => clienttranslate('Game setup'),
        'type' => 'manager',
        'action' => 'stGameSetup',
        'transitions' => ['' => 10],
    ],

    // Start round, deal cards and define the first player
    10 => [
        'name' => 'startRound',
        'description' => '',
        'type' => 'game',
        'action' => 'stStartRound',
        'updateGameProgression' => true,
        'transitions' => ['firstPlayerTurn' => 12],
    ],

    // The first player of a round must play cards
    12 => [
        'name' => 'firstPlayerTurn',
        'description' => clienttranslate('${actplayer} must play cards'),
        'descriptionmyturn' => clienttranslate('${you} must play cards'),
        'type' => 'activeplayer',
        'possibleactions' => ['playCards'],
        'transitions' => ['nextPlayer' => 22],
    ],

    // The next player must choose to play cards or pass
    20 => [
        'name' => 'playerTurn',
        'description' => clienttranslate('${actplayer} must play cards or pass'),
        'descriptionmyturn' => clienttranslate('${you} must play cards or pass'),
        'type' => 'activeplayer',
        'possibleactions' => ['playCards', 'passTurn'],
        'transitions' => ['nextPlayer' => 22, 'endRound' => 80],
    ],

    // Activate the next player who can play
    22 => [
        'name' => 'activateNextPlayer',
        'description' => '',
        'type' => 'game',
        'action' => 'stActivateNextPlayer',
        'transitions' => ['playerTurn' => 20, 'playerSelectNextPlayer' => 30],
    ],

    // The "natural" next player don't have cards anymore,
    // he must choose the next player who will play
    30 => [
        'name' => 'playerSelectNextPlayer',
        'description' => clienttranslate('${actplayer} must choose the next player'),
        'descriptionmyturn' => clienttranslate('${you} must choose the next player'),
        'type' => 'activeplayer',
        'possibleactions' => ['selectNextPlayer'],
        'transitions' => ['firstPlayerTurn' => 12],
    ],

    // End round, count round points and give yellow jersey to the current winner
    80 => [
        'name' => 'endRound',
        'description' => '',
        'type' => 'game',
        'action' => 'stEndRound',
        'transitions' => ['nextRound' => 10, 'endGame' => 99],
    ],

    // Final state. Do not modify (and do not overload action/args methods).
    99 => [
        'name' => 'gameEnd',
        'description' => clienttranslate('End of game'),
        'type' => 'manager',
        'action' => 'stGameEnd',
        'args' => 'argGameEnd',
    ],
];