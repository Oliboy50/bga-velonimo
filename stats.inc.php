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
 * stats.inc.php
 *
 * Velonimo game statistics description
 *
 */

/*
    In this file, you are describing game statistics, that will be displayed at the end of the
    game.

    !! After modifying this file, you must use "Reload  statistics configuration" in BGA Studio backoffice
    ("Control Panel" / "Manage Game" / "Your Game")

    There are 2 types of statistics:
    _ table statistics, that are not associated to a specific player (ie: 1 value for each game).
    _ player statistics, that are associated to each players (ie: 1 value for each player in the game).

    Statistics types can be "int" for integer, "float" for floating point values, and "bool" for boolean

    Once you defined your statistics there, you can start using "initStat", "setStat" and "incStat" method
    in your game logic, using statistics names defined below.

    !! It is not a good idea to modify this file when a game is running !!

    If your game is already public on BGA, please read the following before any change:
    http://en.doc.boardgamearena.com/Post-release_phase#Changes_that_breaks_the_games_in_progress

    Notes:
    * Statistic index is the reference used in setStat/incStat/initStat PHP method
    * Statistic index must contains alphanumerical characters and no space. Example: 'turn_played'
    * Statistics IDs must be >=10
    * Two table statistics can't share the same ID, two player statistics can't share the same ID
    * A table statistic can have the same ID than a player statistics
    * Statistics ID is the reference used by BGA website. If you change the ID, you lost all historical statistic data. Do NOT re-use an ID of a deleted statistic
    * Statistic name is the English description of the statistic as shown to players

*/

$numberOfRoundsWonName = totranslate('Rounds won');
$minValueName = totranslate('Minimum value played');
$maxValueName = totranslate('Maximum value played');
$numberOfJerseyPlayedName = totranslate('Number of Jersey played');
$numberOfLegendsBroomWagonPlayedName = totranslate('Number of Broom Wagon played');
$numberOfLegendsEaglePlayedName = totranslate('Number of coach Eagle played');
$numberOfLegendsPandaPlayedName = totranslate('Number of coach Panda played');
$numberOfLegendsSharkPlayedName = totranslate('Number of coach Shark played');
$numberOfLegendsBadgerPlayedName = totranslate('Number of coach Badger played');
$numberOfLegendsElephantPlayedName = totranslate('Number of coach Elephant played');

$stats_type = [
    // Statistics global to table
    'table' => [
        'minValue' => [
            'id' => 13,
            'name' => $minValueName,
            'type' => 'int',
        ],
        'maxValue' => [
            'id' => 14,
            'name' => $maxValueName,
            'type' => 'int',
        ],
        'numberOfJerseyPlayed' => [
            'id' => 15,
            'name' => $numberOfJerseyPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsBroomWagonPlayed' => [
            'id' => 16,
            'name' => $numberOfLegendsBroomWagonPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsEaglePlayed' => [
            'id' => 17,
            'name' => $numberOfLegendsEaglePlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsPandaPlayed' => [
            'id' => 18,
            'name' => $numberOfLegendsPandaPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsSharkPlayed' => [
            'id' => 19,
            'name' => $numberOfLegendsSharkPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsBadgerPlayed' => [
            'id' => 20,
            'name' => $numberOfLegendsBadgerPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsElephantPlayed' => [
            'id' => 21,
            'name' => $numberOfLegendsElephantPlayedName,
            'type' => 'int',
        ],
    ],

    // Statistics existing for each player
    'player' => [
        'numberOfRoundsWon' => [
            'id' => 12,
            'name' => $numberOfRoundsWonName,
            'type' => 'int',
        ],
        'minValue' => [
            'id' => 13,
            'name' => $minValueName,
            'type' => 'int',
        ],
        'maxValue' => [
            'id' => 14,
            'name' => $maxValueName,
            'type' => 'int',
        ],
        'numberOfJerseyPlayed' => [
            'id' => 15,
            'name' => $numberOfJerseyPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsBroomWagonPlayed' => [
            'id' => 16,
            'name' => $numberOfLegendsBroomWagonPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsEaglePlayed' => [
            'id' => 17,
            'name' => $numberOfLegendsEaglePlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsPandaPlayed' => [
            'id' => 18,
            'name' => $numberOfLegendsPandaPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsSharkPlayed' => [
            'id' => 19,
            'name' => $numberOfLegendsSharkPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsBadgerPlayed' => [
            'id' => 20,
            'name' => $numberOfLegendsBadgerPlayedName,
            'type' => 'int',
        ],
        'numberOfLegendsElephantPlayed' => [
            'id' => 21,
            'name' => $numberOfLegendsElephantPlayedName,
            'type' => 'int',
        ],
    ],
];
