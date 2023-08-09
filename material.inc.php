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
 * material.inc.php
 *
 * Velonimo game material description
 *
 * Here, you can describe the material of your game with PHP variables.
 *
 * This file is loaded in your game logic class constructor, ie these variables
 * are available everywhere in your game logic code.
 *
 */

require_once('modules/constants.inc.php');

$this->legends_coaches = [
    CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER => [
        'name' => clienttranslate('Eagle'),
    ],
    CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR => [
        'name' => clienttranslate('Panda'),
    ],
    CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN => [
        'name' => clienttranslate('Shark'),
    ],
    CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR => [
        'name' => clienttranslate('Badger'),
    ],
    CARD_ID_LEGENDS_ELEPHANT_STOP => [
        'name' => clienttranslate('Elephant'),
    ],
];
