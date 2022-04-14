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

$this->colorNames = [
    COLOR_BLUE => clienttranslate('blue'),
    COLOR_BROWN => clienttranslate('brown'),
    COLOR_GRAY => clienttranslate('gray'),
    COLOR_GREEN => clienttranslate('green'),
    COLOR_PINK => clienttranslate('pink'),
    COLOR_RED => clienttranslate('red'),
    COLOR_YELLOW => clienttranslate('yellow'),
    COLOR_ADVENTURER => clienttranslate('adventurer'),
];
