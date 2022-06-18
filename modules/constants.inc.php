<?php

declare(strict_types=1);

/**
 * Velonimo constants
 */

// States
define('ST_BGA_GAME_SETUP', 1);
define('ST_START_ROUND', 10);
define('ST_FIRST_PLAYER_TURN', 12);
define('ST_PLAYER_TURN', 20);
define('ST_ACTIVATE_NEXT_PLAYER', 22);
define('ST_PLAYER_SELECT_NEXT_PLAYER', 30);
define('ST_APPLY_SELECTED_NEXT_PLAYER', 31);
define('ST_PLAYER_PICK_CARDS_FROM_PLAYER', 40);
define('ST_PLAYER_GIVE_CARDS_BACK_TO_PLAYER_AFTER_PICKING', 41);
define('ST_END_ROUND', 80);
define('ST_BGA_GAME_END', 99);

// Cards color ID
define('COLOR_BLUE', 10);
define('COLOR_BROWN', 20);
define('COLOR_GRAY', 30);
define('COLOR_GREEN', 40);
define('COLOR_PINK', 50);
define('COLOR_RED', 60);
define('COLOR_YELLOW', 70);
define('COLOR_ADVENTURER', 80);
define('COLOR_JERSEY', 90);

// Cards value
define('VALUE_1', 1);
define('VALUE_2', 2);
define('VALUE_3', 3);
define('VALUE_4', 4);
define('VALUE_5', 5);
define('VALUE_6', 6);
define('VALUE_7', 7);
define('VALUE_25', 25);
define('VALUE_30', 30);
define('VALUE_35', 35);
define('VALUE_40', 40);
define('VALUE_45', 45);
define('VALUE_50', 50);
define('VALUE_JERSEY', 10);
