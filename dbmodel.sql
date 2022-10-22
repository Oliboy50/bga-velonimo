
-- ------
-- BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
-- Velonimo implementation : © Oliver THEBAULT (a.k.a. Oliboy50)
--
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

CREATE TABLE IF NOT EXISTS `card` (
  `card_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `card_type` VARCHAR(30) NOT NULL,
  `card_type_arg` INT NOT NULL,
  `card_location` VARCHAR(30) NOT NULL,
  `card_location_arg` INT NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;


-- Example 2: add a custom field to the standard "player" table

ALTER TABLE `player`
    ADD `rounds_ranking` VARCHAR(250) NOT NULL DEFAULT '',
    ADD `has_card_jersey` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_broom_wagon` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_eagle` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_panda` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_shark` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_badger` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    ADD `has_card_legends_elephant` TINYINT UNSIGNED NOT NULL DEFAULT 0;
