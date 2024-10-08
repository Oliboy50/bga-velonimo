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
  * velonimo.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */

declare(strict_types=1);

require_once(APP_GAMEMODULE_PATH.'module/table/table.game.php');
require_once('modules/constants.inc.php');
require_once('modules/VelonimoCard.php');
require_once('modules/VelonimoPlayer.php');

class Velonimo extends Table
{
    private const NUMBER_OF_CARDS_TO_DEAL_TO_EACH_PLAYER = 11;
    private const SCORE_TO_REACH_IN_2_PLAYERS_MODE = 8;

    private const GAME_STATE_CURRENT_ROUND = 'currentRound';
    private const GAME_STATE_JERSEY_IS_NOT_PLAYABLE = 'jerseyIsNotPlayable';
    private const GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE = 'legendsBroomWagonIsNotPlayable';
    private const GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE = 'legendsEagleIsNotPlayable';
    private const GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE = 'legendsPandaIsNotPlayable';
    private const GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE = 'legendsSharkIsNotPlayable';
    private const GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE = 'legendsBadgerIsNotPlayable';
    private const GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE = 'legendsElephantIsNotPlayable';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE = 'previousValueToBeat';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_JERSEY = 'previousPlayedCardsContainJersey';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON = 'previousPlayedCardsContainLegendsBroomWagon';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE = 'previousPlayedCardsContainLegendsEagle';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA = 'previousPlayedCardsContainLegendsPanda';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK = 'previousPlayedCardsContainLegendsShark';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER = 'previousPlayedCardsContainLegendsBadger';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT = 'previousPlayedCardsContainLegendsElephant';
    private const GAME_STATE_LAST_PLAYED_CARDS_VALUE = 'valueToBeat';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY = 'lastPlayedCardsContainJersey';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON = 'lastPlayedCardsContainLegendsBroomWagon';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE = 'lastPlayedCardsContainLegendsEagle';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA = 'lastPlayedCardsContainLegendsPanda';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK = 'lastPlayedCardsContainLegendsShark';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER = 'lastPlayedCardsContainLegendsBadger';
    private const GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT = 'lastPlayedCardsContainLegendsElephant';
    private const GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID = 'playerIdForValueToBeat';
    private const GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID = 'selectedNextPlayerId';
    private const GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK = 'numberOfCardsToPick';
    private const GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK = 'numberOfCardsToGiveBack';
    private const GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK = 'playerIdToGiveCardsBack';
    private const GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK_FROM_DECK = 'numberOfCardsToPickFromDeck';

    private const GAME_OPTION_HOW_MANY_ROUNDS = 'howManyRounds';
    private const GAME_OPTION_ENABLE_EXTENSION_LEGENDS = 'withExtensionLegends';

    private const CARD_LOCATION_DECK = 'deck';
    private const CARD_LOCATION_PLAYER_HAND = 'hand';
    private const CARD_LOCATION_DISCARD = 'discard';
    private const CARD_LOCATION_PLAYED = 'played';
    private const CARD_LOCATION_PREVIOUS_PLAYED = 'previousPlayed';
    // /!\ 2P mode only
    private const CARD_LOCATION_ATTACK_REWARD = 'attackReward';

    /** @var Deck (BGA framework component to manage cards) */
    private $deck;

    function __construct() {
        parent::__construct();

        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        self::initGameStateLabels([
            self::GAME_STATE_CURRENT_ROUND => 10,
            self::GAME_STATE_LAST_PLAYED_CARDS_VALUE => 11,
            self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID => 12,
            self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID => 13,
            self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE => 14,
            self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK => 15,
            self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK => 16,
            self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK => 17,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE => 18,
            self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK_FROM_DECK => 19,
            self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE => 20,
            self::GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE => 21,
            self::GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE => 22,
            self::GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE => 23,
            self::GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE => 24,
            self::GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE => 25,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY => 26,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON => 27,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE => 28,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA => 29,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK => 30,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER => 31,
            self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT => 32,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_JERSEY => 33,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON => 34,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE => 35,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA => 36,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK => 37,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER => 38,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT => 39,
            self::GAME_OPTION_HOW_MANY_ROUNDS => 100,
            self::GAME_OPTION_ENABLE_EXTENSION_LEGENDS => 110,
        ]);

        $this->deck = self::getNew('module.common.deck');
        $this->deck->init('card');
	}

    protected function getGameName() {
		// Used for translations and stuff. Please do not modify.
        return 'velonimo';
    }

    /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame($players, $options = []) {
        self::DbQuery('DELETE FROM player WHERE 1');

        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameInfos = self::getGameinfos();
        $defaultColors = $gameInfos['player_colors'];

        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = 'INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ';
        $values = [];
        foreach($players as $playerId => $player)
        {
            $color = array_shift($defaultColors);
            $values[] = sprintf(
                "('%s','%s','%s','%s','%s')",
                $playerId,
                $color,
                $player['player_canal'],
                addslashes($player['player_name']),
                addslashes($player['player_avatar'])
            );
        }
        $sql .= implode(',', $values);
        self::DbQuery($sql);
        self::reattributeColorsBasedOnPreferences($players, $gameInfos['player_colors']);
        self::reloadPlayersBasicInfos();

        /************ Start the game initialization *****/

        // Init global values with their initial values
        self::setGameStateValue(self::GAME_STATE_CURRENT_ROUND, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_JERSEY, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID, 0);
        self::setGameStateValue(self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK_FROM_DECK, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE, 0);

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        // Table statistics
        self::initStat('table', 'minValue', 0);
        self::initStat('table', 'maxValue', 0);
        self::initStat('table', 'numberOfJerseyPlayed', 0);
        self::initStat('table', 'numberOfLegendsBroomWagonPlayed', 0);
        self::initStat('table', 'numberOfLegendsEaglePlayed', 0);
        self::initStat('table', 'numberOfLegendsPandaPlayed', 0);
        self::initStat('table', 'numberOfLegendsSharkPlayed', 0);
        self::initStat('table', 'numberOfLegendsBadgerPlayed', 0);
        self::initStat('table', 'numberOfLegendsElephantPlayed', 0);
        // Player statistics (init for all players)
        self::initStat('player', 'numberOfRoundsWon', 0);
        self::initStat('player', 'minValue', 0);
        self::initStat('player', 'maxValue', 0);
        self::initStat('player', 'numberOfJerseyPlayed', 0);
        self::initStat('player', 'numberOfLegendsBroomWagonPlayed', 0);
        self::initStat('player', 'numberOfLegendsEaglePlayed', 0);
        self::initStat('player', 'numberOfLegendsPandaPlayed', 0);
        self::initStat('player', 'numberOfLegendsSharkPlayed', 0);
        self::initStat('player', 'numberOfLegendsBadgerPlayed', 0);
        self::initStat('player', 'numberOfLegendsElephantPlayed', 0);

        // Create cards
        $cards = [];
        // colored cards
        foreach([
            COLOR_BLUE,
            COLOR_BROWN,
            COLOR_GRAY,
            COLOR_GREEN,
            COLOR_PINK,
            COLOR_RED,
            COLOR_YELLOW,
        ] as $colorId) {
            foreach([
                VALUE_1,
                VALUE_2,
                VALUE_3,
                VALUE_4,
                VALUE_5,
                VALUE_6,
                VALUE_7,
            ] as $value) {
                $cards[] = [
                    'type' => $colorId,
                    'type_arg' => $value,
                    'nbr' => 1,
                ];
            }
        }
        // adventurer cards
        foreach([
            VALUE_25,
            VALUE_30,
            VALUE_35,
            VALUE_40,
            VALUE_45,
            VALUE_50,
        ] as $value) {
            $cards[] = [
                'type' => COLOR_ADVENTURER,
                'type_arg' => $value,
                'nbr' => 1,
            ];
        }
        $this->deck->createCards($cards, self::CARD_LOCATION_DECK);
    }

    /*
        getAllDatas:

        Gather all information about current game situation (visible by the current player).

        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player refreshes the game page (F5)
    */
    protected function getAllDatas() {
        $result = [];
        $currentPlayerId = (int) self::getCurrentPlayerId();
        $activePlayerId = (int) self::getActivePlayerId();
        $players = $this->getPlayersFromDatabase();

        // Rounds
        $result['currentRound'] = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $result['jerseyIsNotPlayable'] = $this->isJerseyNotPlayable($players);
        $result['howManyRounds'] = $this->getHowManyRounds();

        // Players
        $result['players'] = $this->formatPlayersForClient($players);
        $result['currentPlayerId'] = $currentPlayerId;
        $result['activePlayerId'] = $activePlayerId;

        // Cards
        $result['currentPlayerCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId))
        );
        $result['playedCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYED))
        );
        $result['playedSpecialCards'] = $this->formatCardsForClient(
            $this->fromSpecialPlayedCardsToVelonimoCards('LAST')
        );
        $result['playedCardsValue'] = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $result['playedCardsPlayerId'] = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID);
        $result['previousPlayedCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PREVIOUS_PLAYED))
        );
        $result['previousPlayedSpecialCards'] = $this->formatCardsForClient(
            $this->fromSpecialPlayedCardsToVelonimoCards('PREVIOUS')
        );
        $result['previousPlayedCardsValue'] = (int) self::getGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE);

        if ($this->is2PlayersMode($players)) {
            $result['numberOfCardsInDeck'] = $this->getNumberOfCardsInDeck();
            $result['attackRewardCards'] = $this->formatCardsForClient(
                $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_ATTACK_REWARD))
            );
        }

        if ($this->isExtensionLegendsEnabled()) {
            $result['isExtensionLegendsEnabled'] = true;
            $result['legendsBroomWagonIsNotPlayable'] = $this->isLegendsBroomWagonNotPlayable();
            $result['legendsEagleIsNotPlayable'] = $this->isLegendsEagleNotPlayable();
            $result['legendsPandaIsNotPlayable'] = $this->isLegendsPandaNotPlayable();
            $result['legendsSharkIsNotPlayable'] = $this->isLegendsSharkNotPlayable();
            $result['legendsBadgerIsNotPlayable'] = $this->isLegendsBadgerNotPlayable();
            $result['legendsElephantIsNotPlayable'] = $this->isLegendsElephantNotPlayable();
        }

        return $result;
    }

    /*
        getGameProgression:

        Compute and return the current game progression.
        The number returned must be an integer between 0 (=the game just started) and
        100 (= the game is finished or almost finished).

        This method is called each time we are in a game state with the "updateGameProgression" property set to true
        (see states.inc.php)
    */
    function getGameProgression() {
        $howManyRounds = $this->getHowManyRounds();
        $currentRound = ((int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND)) ?: 1;

        return floor((($currentRound - 1) * 100) / $howManyRounds);
    }

////////////////////////////////////////////////////////////////////////////
//////////// Player actions
////////////////////////////////////////////////////////////////////////////

    /**
     * @param int[] $playedCardIds
     */
    function playCards(
        array $playedCardIds,
        bool $cardsPlayedWithJersey,
        bool $cardsPlayedWithLegendsBroomWagon,
        bool $cardsPlayedWithLegendsEagle,
        bool $cardsPlayedWithLegendsPanda,
        bool $cardsPlayedWithLegendsShark,
        bool $cardsPlayedWithLegendsBadger,
        bool $cardsPlayedWithLegendsElephant
    ) {
        self::checkAction('playCards');

        $numberOfPlayedCards = count($playedCardIds);
        if ($numberOfPlayedCards < 1) {
            throw new BgaUserException(self::_('You must play at least 1 simple card.'));
        }

        [
            $playedCards,
            $currentPlayerId,
            $currentPlayerCards,
        ] = $this->hydratePlayedCards($playedCardIds);

        if (
            !$this->isExtensionLegendsEnabled()
            && (
                $cardsPlayedWithLegendsBroomWagon
                || $cardsPlayedWithLegendsEagle
                || $cardsPlayedWithLegendsPanda
                || $cardsPlayedWithLegendsShark
                || $cardsPlayedWithLegendsBadger
                || $cardsPlayedWithLegendsElephant
            )
        ) {
            throw new BgaUserException(self::_('Extension Legends is not enabled.'));
        }

        // check that player is allowed to use special cards
        $players = $this->getPlayersFromDatabase();
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);
        $currentPlayerIsWearingJersey = $currentPlayer->isWearingJersey();
        if ($cardsPlayedWithJersey) {
            if ($this->isJerseyNotPlayable($players)) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayerIsWearingJersey) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsBroomWagon) {
            if ($this->isLegendsBroomWagonNotPlayable()) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsBroomWagon()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsEagle) {
            if (
                $currentPlayerIsWearingJersey
                || $this->isLegendsEagleNotPlayable()
            ) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsEagle()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsPanda) {
            if (
                $currentPlayerIsWearingJersey
                || $this->isLegendsPandaNotPlayable()
            ) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsPanda()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsShark) {
            if (
                $currentPlayerIsWearingJersey
                || $this->isLegendsSharkNotPlayable()
            ) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsShark()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsBadger) {
            if (
                $currentPlayerIsWearingJersey
                || $this->isLegendsBadgerNotPlayable()
            ) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsBadger()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }
        if ($cardsPlayedWithLegendsElephant) {
            if (
                $currentPlayerIsWearingJersey
                || $this->isLegendsElephantNotPlayable()
            ) {
                $this->throwPlayedCardNotPlayable();
            }
            if (!$currentPlayer->hasCardLegendsElephant()) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }

        $this->assertCardsCanBePlayedTogether(
            $playedCards,
            $cardsPlayedWithJersey,
            $cardsPlayedWithLegendsBroomWagon,
            $cardsPlayedWithLegendsEagle,
            $cardsPlayedWithLegendsPanda,
            $cardsPlayedWithLegendsShark,
            $cardsPlayedWithLegendsBadger,
            $cardsPlayedWithLegendsElephant
        );

        // check that played cards value is higher than the previous played cards value
        $lastPlayedCardsValue = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $playedCardsValue = $this->getCardsValue(
            $playedCards,
            $cardsPlayedWithJersey,
            $cardsPlayedWithLegendsBroomWagon,
            $cardsPlayedWithLegendsShark
        );
        if ($playedCardsValue <= $lastPlayedCardsValue) {
            throw new BgaUserException(sprintf(
                self::_('The value of the cards you play must be higher than %s.'),
                $lastPlayedCardsValue
            ));
        }

        // discard table cards and play cards
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PREVIOUS_PLAYED, self::CARD_LOCATION_DISCARD);
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PLAYED, self::CARD_LOCATION_PREVIOUS_PLAYED);
        $this->deck->moveCards($playedCardIds, self::CARD_LOCATION_PLAYED, $currentPlayerId);
        if ($cardsPlayedWithJersey) {
            self::setGameStateValue(self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfJerseyPlayed');
            $this->incStat(1, 'numberOfJerseyPlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsBroomWagon) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsBroomWagonPlayed');
            $this->incStat(1, 'numberOfLegendsBroomWagonPlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsEagle) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsEaglePlayed');
            $this->incStat(1, 'numberOfLegendsEaglePlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsPanda) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsPandaPlayed');
            $this->incStat(1, 'numberOfLegendsPandaPlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsShark) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsSharkPlayed');
            $this->incStat(1, 'numberOfLegendsSharkPlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsBadger) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsBadgerPlayed');
            $this->incStat(1, 'numberOfLegendsBadgerPlayed', $currentPlayerId);
        }
        if ($cardsPlayedWithLegendsElephant) {
            self::setGameStateValue(self::GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE, 1);
            $this->incStat(1, 'numberOfLegendsElephantPlayed');
            $this->incStat(1, 'numberOfLegendsElephantPlayed', $currentPlayerId);
        }
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, $currentPlayerId);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE, $lastPlayedCardsValue);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_JERSEY, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER));
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT));
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, $playedCardsValue);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY, $cardsPlayedWithJersey ? CARD_ID_JERSEY_PLUS_TEN : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, $cardsPlayedWithLegendsBroomWagon ? CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, $cardsPlayedWithLegendsEagle ? CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, $cardsPlayedWithLegendsPanda ? CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, $cardsPlayedWithLegendsShark ? CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, $cardsPlayedWithLegendsBadger ? CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR : 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, $cardsPlayedWithLegendsElephant ? CARD_ID_LEGENDS_ELEPHANT_STOP : 0);
        self::notifyAllPlayers('cardsPlayed', clienttranslate('${player_name} attacks with ${cardsImage}'), [
            'players' => $this->formatPlayersForClient($players),
            'playedCardsPlayerId' => $currentPlayerId,
            'playedCards' => $formattedCards = $this->formatCardsForClient($playedCards),
            'cardsImage' => [
                ...$formattedCards,
                ...($cardsPlayedWithJersey ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_JERSEY_PLUS_TEN])) : []),
                ...($cardsPlayedWithLegendsBroomWagon ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE])) : []),
                ...($cardsPlayedWithLegendsEagle ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER])) : []),
                ...($cardsPlayedWithLegendsPanda ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR])) : []),
                ...($cardsPlayedWithLegendsShark ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN])) : []),
                ...($cardsPlayedWithLegendsBadger ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR])) : []),
                ...($cardsPlayedWithLegendsElephant ? $this->formatCardsForClient($this->fromSpecialCardIdsToVelonimoCards([CARD_ID_LEGENDS_ELEPHANT_STOP])) : []),
            ],
            'player_name' => $currentPlayerName = self::getCurrentPlayerName(),
            'playedCardsValue' => $playedCardsValue,
            'withJersey' => $cardsPlayedWithJersey,
            'withLegendsBroomWagon' => $cardsPlayedWithLegendsBroomWagon,
            'withLegendsEagle' => $cardsPlayedWithLegendsEagle,
            'withLegendsPanda' => $cardsPlayedWithLegendsPanda,
            'withLegendsShark' => $cardsPlayedWithLegendsShark,
            'withLegendsBadger' => $cardsPlayedWithLegendsBadger,
            'withLegendsElephant' => $cardsPlayedWithLegendsElephant,
        ]);

        // update player's min/max value played
        $previousMinValuePlayedByPlayer = (int) $this->getStat('minValue', $currentPlayerId);
        if (
            $previousMinValuePlayedByPlayer === 0
            || $playedCardsValue < $previousMinValuePlayedByPlayer
        ) {
            $this->setStat($playedCardsValue, 'minValue', $currentPlayerId);
        }
        if ($playedCardsValue > (int) $this->getStat('maxValue', $currentPlayerId)) {
            $this->setStat($playedCardsValue, 'maxValue', $currentPlayerId);
        }

        $numberOfCurrentPlayerCards = count($currentPlayerCards);

        if ($this->is2PlayersMode($players)) {
            // if the player played cards of value "2", he has to pick as many cards from deck
            $numberOfPlayedCardsOfValueTwo = count(
                array_filter($playedCards, fn (VelonimoCard $c) => $c->getValue() === VALUE_2)
            );
            if ($numberOfPlayedCardsOfValueTwo > 0) {
                $numberOfCardsInDeck = $this->getNumberOfCardsInDeck();
                $numberOfCardsToPickFromDeck = min($numberOfPlayedCardsOfValueTwo, $numberOfCardsInDeck);

                if ($numberOfCardsToPickFromDeck > 0) {
                    $cardsPickedFromDeck = $this->fromBgaCardsToVelonimoCards(
                        $this->deck->pickCards($numberOfCardsToPickFromDeck, self::CARD_LOCATION_DECK, $currentPlayer->getId())
                    );
                    $numberOfCurrentPlayerCards = $numberOfCurrentPlayerCards + $numberOfCardsToPickFromDeck;
                    self::notifyAllPlayers('cardsMovedFromDeckToAnotherPlayer', clienttranslate('${player_name} picks ${numberOfCards} card(s) from the deck'), [
                        'players' => $this->formatPlayersForClient($players),
                        'receiverPlayerId' => $currentPlayer->getId(),
                        'numberOfCards' => $numberOfCardsToPickFromDeck,
                        'player_name' => $currentPlayer->getName(),
                    ]);
                    $translatedMessage = clienttranslate('${player_name} picks ${cardsImage} from the deck');
                    foreach ($players as $player) {
                        if ($player->getId() === $currentPlayer->getId()) {
                            self::notifyPlayer($currentPlayer->getId(), 'cardsReceivedFromDeck', $translatedMessage, [
                                'players' => $this->formatPlayersForClient($players),
                                'cards' => $formattedCards = $this->formatCardsForClient($cardsPickedFromDeck),
                                'cardsImage' => $formattedCards,
                                'player_name' => $currentPlayer->getName(),
                            ]);
                        }
                    }
                }
            }
        }

        // if the player played his last card, set its rank for this round
        if (($numberOfCurrentPlayerCards - $numberOfPlayedCards) === 0) {
            $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
            $nextRankForRound = $this->getNextRankForRound($players, $currentRound);
            $this->updatePlayerRoundsRanking($currentPlayer, $players, $currentRound, $nextRankForRound);
            if ($nextRankForRound === 1) {
                $this->incStat(1, 'numberOfRoundsWon', $currentPlayerId);
            }
            self::notifyAllPlayers('playerHasFinishedRound', clienttranslate('${player_name} finished in position ${rank}'), [
                'playerId' => $currentPlayer->getId(),
                'roundsRanking' => $currentPlayer->getRoundsRanking(),
                'lastNumberOfPointsEarned' => $currentPlayer->getLastNumberOfPointsEarned(),
                'player_name' => $currentPlayerName,
                'rank' => $nextRankForRound,
            ]);

            $playersWhoCanPlay = array_filter(
                $this->getPlayersWhoCanPlayDuringRound($currentRound, $players),
                fn (VelonimoPlayer $player) => $player->getId() !== $currentPlayerId
            );

            // end the round if there is only 1 player who can play now
            if (count($playersWhoCanPlay) === 1) {
                $lastPlayer = $playersWhoCanPlay[0];
                $this->updatePlayerRoundsRanking($lastPlayer, $players, $currentRound, $nextRankForRound + 1);

                $this->gamestate->nextState('endRound');
                return;
            }

            $this->gamestate->nextState('nextPlayer');
            return;
        }

        // if the player played cards of value "1", he has to pick as many cards from another player
        $numberOfPlayedCardsOfValueOne = count(
            array_filter($playedCards, fn (VelonimoCard $c) => $c->getValue() === VALUE_1)
        );
        if ($numberOfPlayedCardsOfValueOne > 0) {
            self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK, $numberOfPlayedCardsOfValueOne);

            self::giveExtraTime($currentPlayerId);
            $this->gamestate->nextState('pickCardsFromAnotherPlayer');
            return;
        }

        $this->gamestate->nextState('nextPlayer');
    }

    function passTurn() {
        self::checkAction('passTurn');

        self::notifyAllPlayers('turnPassed', clienttranslate('${player_name} passes'), [
            'playerId' => (int) self::getCurrentPlayerId(),
            'player_name' => self::getCurrentPlayerName(),
        ]);

        $this->gamestate->nextState('nextPlayer');
    }

    function selectNextPlayer(int $selectedPlayerId) {
        self::checkAction('selectNextPlayer');

        // make sure the player didn't select himself
        $currentPlayerId = (int) self::getCurrentPlayerId();
        if ($selectedPlayerId === $currentPlayerId) {
            throw new BgaUserException(self::_('You cannot select yourself.'));
        }

        // make sure the selected player can play
        $nextPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $selectedPlayerId)
        );
        if (empty($nextPlayerCards)) {
            throw new BgaUserException(self::_('This player cannot play. Please select a player who has cards.'));
        }

        $players = $this->getPlayersFromDatabase();
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);
        $selectedPlayer = $this->getPlayerById($selectedPlayerId, $players);
        self::notifyAllPlayers('nextPlayerSelected', clienttranslate('${player_name} chooses ${player_name2} as next player'), [
            'player_name' => $currentPlayer->getName(),
            'player_name2' => $selectedPlayer->getName(),
        ]);

        // in order to change the active player during an "activeplayer" type state,
        // we have to use an intermediate global variable and an intermediate "game" type state
        self::setGameStateValue(self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID, $selectedPlayerId);
        $this->gamestate->nextState('applySelectedNextPlayer');
    }

    /**
     * /!\ 2P mode only
     */
    function selectWhoTakeAttackReward(int $selectedPlayerId) {
        self::checkAction('selectWhoTakeAttackReward');

        $players = $this->getPlayersFromDatabase();
        if (!$this->is2PlayersMode($players)) {
            $this->gamestate->nextState('firstPlayerTurn');

            return;
        }

        try {
            $selectedPlayer = $this->getPlayerById($selectedPlayerId, $players);
            $currentPlayer = $this->getPlayerById((int) self::getCurrentPlayerId(), $players);
        } catch (\Throwable $e) {
            throw new BgaUserException(self::_('This player does not exist.'));
        }

        $rewardCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_ATTACK_REWARD)
        );
        // skip if no more reward
        if (count($rewardCards) <= 0) {
            $this->gamestate->nextState('firstPlayerTurn');

            return;
        }

        // give reward to selected player
        $this->deck->moveCards(
            array_map(fn (VelonimoCard $c) => $c->getId(), $rewardCards),
            self::CARD_LOCATION_PLAYER_HAND,
            $selectedPlayer->getId()
        );

        // notify players
        if ($currentPlayer->getId() === $selectedPlayer->getId()) {
            $translatedMessage = clienttranslate('${player_name} takes the attacker reward ${cardsImage}');
        } else {
            $translatedMessage = clienttranslate('${player_name} gives the attacker reward ${cardsImage} to ${player_name2}');
        }
        self::notifyAllPlayers('attackRewardCardsMovedToPlayer', $translatedMessage, [
            'players' => $this->formatPlayersForClient($players),
            'cards' => $formattedCards = $this->formatCardsForClient($rewardCards),
            'cardsImage' => $formattedCards,
            'receiverPlayerId' => $selectedPlayer->getId(),
            'player_name' => $currentPlayer->getName(),
            'player_name2' => $selectedPlayer->getName(),
        ]);

        // reveal new attack reward
        $this->revealNewAttackRewardCardsIfEnoughCardsInDeck();

        $this->gamestate->nextState('firstPlayerTurn');
    }

    function selectPlayerToPickCards(int $selectedPlayerId) {
        self::checkAction('selectPlayerToPickCards');

        // make sure the player didn't select himself
        $currentPlayerId = (int) self::getCurrentPlayerId();
        if ($selectedPlayerId === $currentPlayerId) {
            throw new BgaUserException(self::_('You cannot select yourself.'));
        }

        $selectedPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $selectedPlayerId)
        );
        // make sure the selected player has cards
        if (empty($selectedPlayerCards)) {
            throw new BgaUserException(self::_('This player does not have cards.'));
        }

        $players = $this->getPlayersFromDatabase();
        $selectedPlayer = $this->getPlayerById($selectedPlayerId, $players);
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);

        // current player cannot take more cards than the selected player has
        $numberOfCardsToPick = min(
            (int) self::getGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK),
            count($selectedPlayerCards)
        );

        // pick cards randomly
        $pickedCards = [];
        $randomizedCardKeys = $numberOfCardsToPick === 1 ? [
            array_rand($selectedPlayerCards, $numberOfCardsToPick)
        ] : array_rand($selectedPlayerCards, $numberOfCardsToPick);
        foreach ($randomizedCardKeys as $key) {
            $pickedCards[] = $selectedPlayerCards[$key];
        }
        /** @var VelonimoCard[] $pickedCards */
        $this->deck->moveCards(
            array_map(fn (VelonimoCard $c) => $c->getId(), $pickedCards),
            self::CARD_LOCATION_PLAYER_HAND,
            $currentPlayer->getId()
        );
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK, $selectedPlayer->getId());
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK, $numberOfCardsToPick);

        // notify players
        $formattedPickedCards = $this->formatCardsForClient($pickedCards);
        self::notifyAllPlayers('cardsMovedBetweenTwoOtherPlayers', clienttranslate('${player_name} picks ${numberOfCards} card(s) from ${player_name2} hand'), [
            'players' => $this->formatPlayersForClient($players),
            'receiverPlayerId' => $currentPlayer->getId(),
            'senderPlayerId' => $selectedPlayer->getId(),
            'numberOfCards' => $numberOfCardsToPick,
            'player_name' => $currentPlayer->getName(),
            'player_name2' => $selectedPlayer->getName(),
        ]);
        $translatedMessage = clienttranslate('${player_name} picks ${cardsImage} from ${player_name2} hand');
        foreach ($players as $player) {
            if ($player->getId() === $currentPlayer->getId()) {
                self::notifyPlayer($currentPlayer->getId(), 'cardsReceivedFromAnotherPlayer', $translatedMessage, [
                    'players' => $this->formatPlayersForClient($players),
                    'cards' => $formattedPickedCards,
                    'cardsImage' => $formattedPickedCards,
                    'senderPlayerId' => $selectedPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToPick,
                    'player_name' => $currentPlayer->getName(),
                    'player_name2' => $selectedPlayer->getName(),
                ]);
            } elseif ($player->getId() === $selectedPlayer->getId()) {
                self::notifyPlayer($selectedPlayer->getId(), 'cardsSentToAnotherPlayer', $translatedMessage, [
                    'players' => $this->formatPlayersForClient($players),
                    'cards' => $formattedPickedCards,
                    'cardsImage' => $formattedPickedCards,
                    'receiverPlayerId' => $currentPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToPick,
                    'player_name' => $currentPlayer->getName(),
                    'player_name2' => $selectedPlayer->getName(),
                ]);
            }
        }

        // reset temporary values
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK, 0);

        $this->gamestate->nextState('giveCardsBack');
    }

    /**
     * @param int[] $selectedCardIds
     */
    function selectCardsToGiveBack(array $selectedCardIds) {
        self::checkAction('selectCardsToGiveBack');

        $numberOfCardsToGiveBack = (int) self::getGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK);

        // validate $selectedCardIds
        if (count($selectedCardIds) !== $numberOfCardsToGiveBack) {
            throw new BgaUserException(sprintf(self::_('You must select exactly %s cards.'), $numberOfCardsToGiveBack));
        }
        foreach ($selectedCardIds as $id) {
            if (in_array($id, [
                CARD_ID_JERSEY_PLUS_TEN,
                CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE,
                CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                CARD_ID_LEGENDS_ELEPHANT_STOP,
            ], true)) {
                throw new BgaUserException(self::_('This card cannot be given.'));
            }
        }

        [
            $selectedCards,
            $currentPlayerId,
        ] = $this->hydratePlayedCards($selectedCardIds);

        $players = $this->getPlayersFromDatabase();
        $receiverPlayer = $this->getPlayerById((int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK), $players);
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);

        $this->deck->moveCards(
            array_map(fn (VelonimoCard $c) => $c->getId(), $selectedCards),
            self::CARD_LOCATION_PLAYER_HAND,
            $receiverPlayer->getId()
        );

        // notify players
        $formattedSelectedCards = $this->formatCardsForClient($selectedCards);
        self::notifyAllPlayers('cardsMovedBetweenTwoOtherPlayers', clienttranslate('${player_name} gives back ${numberOfCards} card(s) to ${player_name2}'), [
            'players' => $this->formatPlayersForClient($players),
            'receiverPlayerId' => $receiverPlayer->getId(),
            'senderPlayerId' => $currentPlayer->getId(),
            'numberOfCards' => $numberOfCardsToGiveBack,
            'player_name2' => $receiverPlayer->getName(),
            'player_name' => $currentPlayer->getName(),
        ]);
        $translatedMessage = clienttranslate('${player_name} gives back ${cardsImage} to ${player_name2}');
        foreach ($players as $player) {
            if ($player->getId() === $currentPlayer->getId()) {
                self::notifyPlayer($currentPlayer->getId(), 'cardsSentToAnotherPlayer', $translatedMessage, [
                    'players' => $this->formatPlayersForClient($players),
                    'cards' => $formattedSelectedCards,
                    'cardsImage' => $formattedSelectedCards,
                    'receiverPlayerId' => $receiverPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToGiveBack,
                    'player_name2' => $receiverPlayer->getName(),
                    'player_name' => $currentPlayer->getName(),
                ]);
            } elseif ($player->getId() === $receiverPlayer->getId()) {
                self::notifyPlayer($receiverPlayer->getId(), 'cardsReceivedFromAnotherPlayer', $translatedMessage, [
                    'players' => $this->formatPlayersForClient($players),
                    'cards' => $formattedSelectedCards,
                    'cardsImage' => $formattedSelectedCards,
                    'senderPlayerId' => $currentPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToGiveBack,
                    'player_name2' => $receiverPlayer->getName(),
                    'player_name' => $currentPlayer->getName(),
                ]);
            }
        }

        // reset temporary values
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK, 0);

        $this->gamestate->nextState('nextPlayer');
    }

////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////////////////////////////////////////////////////////////////////

    function argFirstPlayerTurn(): array
    {
        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
        ];
    }

    function argPlayerTurn(): array
    {
        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
            'playedCardsValue' => (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE),
        ];
    }

    function argPlayerSelectNextPlayer(): array
    {
        $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $activePlayerId = (int) self::getActivePlayerId();

        return [
            'activePlayerId' => $activePlayerId,
            'selectablePlayers' => $this->formatPlayersForClient(
                array_values(array_filter(
                    $this->getPlayersWhoCanPlayDuringRound($currentRound),
                    fn(VelonimoPlayer $player) => $player->getId() !== $activePlayerId,
                ))
            ),
        ];
    }

    /**
     * /!\ 2P mode only
     */
    function argPlayerSelectWhoTakeAttackReward(): array
    {
        $activePlayerId = (int) self::getActivePlayerId();

        return [
            'activePlayerId' => $activePlayerId,
            'selectablePlayers' => $this->formatPlayersForClient(
                $this->getPlayersFromDatabase(),
            ),
        ];
    }

    function argPlayerSelectPlayerToPickCards(): array
    {
        $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $activePlayerId = (int) self::getActivePlayerId();

        return [
            'activePlayerId' => $activePlayerId,
            'numberOfCards' => (int) self::getGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK),
            'selectablePlayers' => $this->formatPlayersForClient(
                array_values(array_filter(
                    $this->getPlayersWhoCanPlayDuringRound($currentRound),
                    fn(VelonimoPlayer $player) => $player->getId() !== $activePlayerId,
                ))
            ),
        ];
    }

    function argPlayerGiveCardsBackAfterPicking(): array
    {
        $playerToGiveCardsBack = $this->getPlayerById((int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK));

        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
            'numberOfCards' => (int) self::getGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK),
            'otherplayer' => $playerToGiveCardsBack->getName(),
            'otherplayer_id' => $playerToGiveCardsBack->getId(),
        ];
    }

////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////////////////////////////////////////////////////////////////////

    function stStartRound() {
        $this->discardPlayedCards();
        $this->discardAttackRewardCards();
        // take back all cards and shuffle them
        $this->deck->moveAllCardsInLocation(null, self::CARD_LOCATION_DECK);
        $this->deck->shuffle(self::CARD_LOCATION_DECK);

        // increment current round value
        $newRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND) + 1;
        self::setGameStateValue(self::GAME_STATE_CURRENT_ROUND, $newRound);

        // deal cards to each player
        $players = $this->getPlayersFromDatabase();
        foreach ($players as $player)
        {
            $cards = $this->fromBgaCardsToVelonimoCards(
                $this->deck->pickCards(self::NUMBER_OF_CARDS_TO_DEAL_TO_EACH_PLAYER, self::CARD_LOCATION_DECK, $player->getId())
            );

            self::notifyPlayer($player->getId(), 'cardsDealt', '', [
                'cards' => $this->formatCardsForClient($cards),
            ]);
        }

        // if first round,
        // deal a coach of legends extension to each player
        if (
            $this->isExtensionLegendsEnabled()
            && $newRound === 1
        ) {
            $availableCoachCards = $this->fromSpecialCardIdsToVelonimoCards([
                CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER,
                CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR,
                CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN,
                CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR,
                CARD_ID_LEGENDS_ELEPHANT_STOP,
            ]);
            foreach ($players as $player)
            {
                $pickedCoachKey = array_rand($availableCoachCards, 1);
                $pickedCoachCard = $availableCoachCards[$pickedCoachKey];
                unset($availableCoachCards[$pickedCoachKey]);

                $this->dealCoachCardToPlayer($player, $pickedCoachCard);
            }
        }

        // if there is a loser, he plays first during this round
        if ($currentLoser = $this->getCurrentLoser($players)) {
            $this->gamestate->changeActivePlayer($currentLoser->getId());
        } else {
            self::activeNextPlayer();
        }

        if ($this->is2PlayersMode($players)) {
            $this->revealNewAttackRewardCardsIfEnoughCardsInDeck();
        }

        self::notifyAllPlayers('roundStarted', clienttranslate('Round #${currentRound} starts'), [
            'currentRound' => $newRound,
            'players' => $this->formatPlayersForClient($players),
            'numberOfCardsInDeck' => $this->getNumberOfCardsInDeck(),
        ]);

        $this->gamestate->nextState('firstPlayerTurn');
    }

    function stActivateNextPlayer() {
        $players = $this->getPlayersFromDatabase();
        $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $playersWhoCanPlayIds = array_map(
            fn (VelonimoPlayer $player) => $player->getId(),
            $this->getPlayersWhoCanPlayDuringRound($currentRound, $players)
        );
        $playerIdWhoPlayedTheLastCards = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID);

        // activate next players until we find one who can play
        for ($i = 0; $i < count($players); $i++) {
            // if the last player played the coach Elephant, then he is the next player,
            // otherwise the next player is the next one in the "natural" order
            $nextPlayerId = $this->lastPlayedCardsContainLegendsElephant()
                ? $playerIdWhoPlayedTheLastCards
                : self::activeNextPlayer();
            $nextPlayerCanPlay = in_array($nextPlayerId, $playersWhoCanPlayIds, true);
            // if the next player is the one who played the last played cards
            if ($nextPlayerId === $playerIdWhoPlayedTheLastCards) {
                $this->discardPlayedCards();
                self::giveExtraTime($nextPlayerId);

                if (
                    $this->is2PlayersMode($players)
                    && $this->getNumberOfCardsInAttackReward() > 0
                ) {
                    $this->gamestate->nextState('playerSelectWhoTakeAttackReward');
                    return;
                }

                if ($nextPlayerCanPlay) {
                    $this->gamestate->nextState('firstPlayerTurn');
                    return;
                }

                $this->gamestate->nextState('playerSelectNextPlayer');
                return;
            }
            if ($nextPlayerCanPlay) {
                self::giveExtraTime($nextPlayerId);
                $this->gamestate->nextState('playerTurn');
                return;
            }
        }
    }

    function stApplySelectedNextPlayer() {
        $nextPlayerId = (int) self::getGameStateValue(self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID);

        self::giveExtraTime($nextPlayerId);
        $this->gamestate->changeActivePlayer($nextPlayerId);

        $this->gamestate->nextState('firstPlayerTurn');
    }

    function stEndRound() {
        // update players score and jersey
        $players = $this->getPlayersFromDatabase();
        $numberOfPlayers = count($players);
        $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        foreach ($players as $k => $player) {
            $players[$k] = $player->addPoints($player->getLastNumberOfPointsEarned());
        }
        $newWinner = $this->getCurrentWinner($players);
        $newLoserIds = array_map(
            fn (VelonimoPlayer $p) => $p->getId(),
            $this->getCurrentLosers($players)
        );

        // check if all coaches have been used
        $allCoachesAreNotPlayable = true;
        foreach ($players as $player) {
            if (
                ($coachCardId = $player->getCoachCardId())
                && 0 === (int) self::getGameStateValue($this->fromSpecialCardIdToIsNotPlayableGameStateKey($coachCardId))
            ) {
                $allCoachesAreNotPlayable = false;
                break;
            }
        }

        $restoredCoachCardIds = [];
        foreach ($players as $k => $player) {
            // update player state
            $players[$k] = $player->setIsWearingJersey(
                $newWinner && $newWinner->getId() === $player->getId()
            )->setHasCardLegendsBroomWagon(
                $player->isLastRoundLoser($numberOfPlayers)
            );
            self::DbQuery(sprintf(
                'UPDATE player SET player_score=%s, %s=%s, %s=%s WHERE player_id=%s',
                $player->getScore(),
                $this->fromSpecialCardIdToPlayerTableKey(CARD_ID_JERSEY_PLUS_TEN),
                $player->isWearingJersey() ? 1 : 0,
                $this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE),
                $player->hasCardLegendsBroomWagon() ? 1 : 0,
                $player->getId()
            ));

            // mark player coach card as reusable if needed
            if (
                ($coachCardId = $player->getCoachCardId())
                && (
                    $allCoachesAreNotPlayable
                    || in_array($player->getId(), $newLoserIds, true)
                )
            ) {
                $restoredCoachCardIds[] = $coachCardId;
                self::setGameStateValue($this->fromSpecialCardIdToIsNotPlayableGameStateKey($coachCardId), 0);
            }
        }

        // re-allow the jersey/broom_wagon to be used
        self::setGameStateValue(self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE, 0);
        self::setGameStateValue(self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE, 0);

        self::notifyAllPlayers('roundEnded', clienttranslate('Round #${currentRound} ends'), [
            'currentRound' => $currentRound,
            'players' => $this->formatPlayersForClient($players),
            'specialCardIdsToRestore' => [CARD_ID_JERSEY_PLUS_TEN, CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE, ...$restoredCoachCardIds],
        ]);

        // notify points earned by each player
        $translatedMessageForPoints = clienttranslate('${player_name} wins ${points} point(s)');
        $translatedMessageForNoPoints = clienttranslate('${player_name} does not get any point');
        foreach ($players as $player) {
            self::notifyAllPlayers('pointsWon', ($player->getLastNumberOfPointsEarned() > 0) ? $translatedMessageForPoints : $translatedMessageForNoPoints, [
                'player_name' => $player->getName(),
                'points' => $player->getLastNumberOfPointsEarned(),
            ]);
        }

        $howManyRounds = $this->getHowManyRounds();
        $isGameOver = ($currentRound >= $howManyRounds)
            || (
                $this->is2PlayersMode()
                && array_reduce($players, fn (bool $acc, VelonimoPlayer $player) => $acc || ($player->getScore() >= self::SCORE_TO_REACH_IN_2_PLAYERS_MODE), false)
            );

        // use "Scoring dialogs" to recap scoring for end-users before moving forward
        // @see https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Scoring_dialogs
        $headers = [
            '', // the first column of headers is empty
        ];
        $previousPoints = [
            [
                'str' => clienttranslate('Previous score'),
                'args' => [],
            ],
        ];
        $roundPoints = [
            [
                'str' => clienttranslate('Round points'),
                'args' => [],
            ],
        ];
        $totalPoints = [
            [
                'str' => clienttranslate('New score'),
                'args' => [],
            ],
        ];
        foreach ($players as $player) {
            $headers[] = [
                'str' => '${player_name}',
                'args' => [
                    'player_name' => $player->getName(),
                ],
                'type' => 'header'
            ];
            $previousPoints[] = $player->getScore() - $player->getLastNumberOfPointsEarned();
            $roundPoints[] = $player->getLastNumberOfPointsEarned() === 0 ? '0' : sprintf('+%s', $player->getLastNumberOfPointsEarned());
            $totalPoints[] = $player->getScore();
        }
        $this->notifyAllPlayers('tableWindow', '', [
            'id' => 'finalScoring',
            'title' => [
                'str' => clienttranslate('Result of round ${currentRound}/${howManyRounds}'),
                'args' => [
                    'currentRound' => $currentRound,
                    'howManyRounds' => $howManyRounds,
                ],
            ],
            'table' => [
                $headers,
                $previousPoints,
                $roundPoints,
                $totalPoints
            ],
            'closing' => $isGameOver ? clienttranslate('End of game') : clienttranslate('Next round')
        ]);

        // update global min/max value played stats
        if ($isGameOver) {
            $minValuePlayedGlobally = 1000;
            $maxValuePlayedGlobally = 0;
            foreach ($players as $player) {
                $minValuePlayedByPlayer = (int) $this->getStat('minValue', $player->getId());
                if ($minValuePlayedByPlayer < $minValuePlayedGlobally) {
                    $minValuePlayedGlobally = $minValuePlayedByPlayer;
                }
                $maxValuePlayedByPlayer = (int) $this->getStat('maxValue', $player->getId());
                if ($maxValuePlayedByPlayer > $maxValuePlayedGlobally) {
                    $maxValuePlayedGlobally = $maxValuePlayedByPlayer;
                }
            }
            $this->setStat($minValuePlayedGlobally, 'minValue');
            $this->setStat($maxValuePlayedGlobally, 'maxValue');
        }

        // go to next round or end the game
        $this->gamestate->nextState($isGameOver ? 'endGame' : 'nextRound');
    }

////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////////////////////////////////////////////////////////////////////

    function zombieTurn($state, $activePlayerId) {
    	$stateName = $state['name'];

        if ($state['type'] === 'activeplayer') {
            $this->gamestate->nextState('zombiePass');
            return;
        }

        throw new BgaVisibleSystemException('Zombie mode not supported at this game state: '.$stateName); // NOI18N
    }

////////////////////////////////////////////////////////////////////////////
////////// DB upgrade
////////////////////////////////////////////////////////////////////////////

    /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

    function upgradeTableDb($from_version) {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345

        // Example:
//        if($from_version <= 1404301345)
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = 'ALTER TABLE DBPREFIX_xxxxxxx ....';
//            self::applyDbUpgradeToAllDB($sql);
//        }
//        if($from_version <= 1405061421)
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = 'CREATE TABLE DBPREFIX_xxxxxxx ....';
//            self::applyDbUpgradeToAllDB($sql);
//        }
//        // Please add your future database scheme changes here
    }

////////////////////////////////////////////////////////////////////////////
////////// Velonimo specific functions
////////////////////////////////////////////////////////////////////////////

    /**
     * @return VelonimoCard[]
     */
    private function fromBgaCardsToVelonimoCards(array $bgaCards): array {
        return array_map(
            fn (array $card) => new VelonimoCard(
                (int) $card['id'],
                (int) $card['type'],
                (int) $card['type_arg']
            ),
            array_values($bgaCards)
        );
    }

    /**
     * @return VelonimoCard[]
     */
    private function fromSpecialPlayedCardsToVelonimoCards(string $playedCardsType): array {
        if (!in_array($playedCardsType, [
            'LAST',
            'PREVIOUS',
        ], true)) {
            throw new BgaVisibleSystemException('Invalid argument for ' . __FUNCTION__); // NOI18N
        }

        $cardIds = array_values(array_filter(
            array_map(
                fn (string $cardKey) => (int) self::getGameStateValue(constant('self::GAME_STATE_'.$playedCardsType.'_PLAYED_CARDS_CONTAIN_'.$cardKey)),
                [
                    'JERSEY',
                    'LEGENDS_BROOM_WAGON',
                    'LEGENDS_EAGLE',
                    'LEGENDS_PANDA',
                    'LEGENDS_SHARK',
                    'LEGENDS_BADGER',
                    'LEGENDS_ELEPHANT',
                ]
            ),
            fn (int $id) => $id !== 0
        ));

        return $this->fromSpecialCardIdsToVelonimoCards($cardIds);
    }

    /**
     * @param int[] $cardIds
     *
     * @return VelonimoCard[]
     */
    private function fromSpecialCardIdsToVelonimoCards(array $cardIds): array {
        return array_map(
            fn (int $id) => new VelonimoCard(
                $id,
                COLOR_SPECIAL,
                $this->fromSpecialCardIdToValue($id)
            ),
            $cardIds
        );
    }

    private function fromSpecialCardIdToValue(int $cardId): int {
        if ($cardId === CARD_ID_JERSEY_PLUS_TEN) {
            return VALUE_JERSEY_PLUS_TEN;
        }
        if ($cardId === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
            return VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE;
        }
        if ($cardId === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
            return VALUE_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER;
        }
        if ($cardId === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
            return VALUE_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR;
        }
        if ($cardId === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
            return VALUE_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN;
        }
        if ($cardId === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
            return VALUE_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR;
        }
        if ($cardId === CARD_ID_LEGENDS_ELEPHANT_STOP) {
            return VALUE_LEGENDS_ELEPHANT_STOP;
        }

        throw new BgaVisibleSystemException('Unsupported special card.'); // NOI18N
    }

    /**
     * @param VelonimoCard[] $cards
     */
    private function formatCardsForClient(array $cards): array {
        return array_map(
            fn (VelonimoCard $card) => [
                'id' => $card->getId(),
                'color' => $card->getColor(),
                'value' => $card->getValue(),
            ],
            $cards
        );
    }

    /**
     * @param VelonimoCard[] $cards
     */
    private function getCardsValue(
        array $cards,
        bool $cardsPlayedWithJersey,
        bool $cardsPlayedWithLegendsBroomWagon,
        bool $cardsPlayedWithLegendsShark
    ): int {
        if (count($cards) <= 0) {
            return 0;
        }

        $addJerseyValueIfUsed = fn (int $value) => $value + (
            $cardsPlayedWithJersey ? VALUE_JERSEY_PLUS_TEN : 0
        );
        $addBroomWagonValueIfUsed = fn (int $value) => $value + (
            $cardsPlayedWithLegendsBroomWagon ? VALUE_LEGENDS_BROOM_WAGON_PLUS_FIVE : 0
        );
        $withJerseyAndBroomWagon = fn (int $value) => $addJerseyValueIfUsed($addBroomWagonValueIfUsed($value));

        if (count($cards) === 1) {
            $uniqueCardValue = current($cards)->getValue();
            if ($cardsPlayedWithLegendsShark) {
                return $withJerseyAndBroomWagon($uniqueCardValue * 10);
            }

            return $withJerseyAndBroomWagon($uniqueCardValue);
        }

        $minCardValue = 1000;
        foreach ($cards as $card) {
            if ($card->getValue() < $minCardValue) {
                $minCardValue = $card->getValue();
            }
        }

        return $withJerseyAndBroomWagon((count($cards) * 10) + $minCardValue);
    }

    /**
     * @return VelonimoPlayer[]
     */
    private function getPlayersFromDatabase(): array {
        $players = array_values(self::getCollectionFromDB(
            'SELECT player_id, player_no, player_name, player_color, player_score, player_score_aux, rounds_ranking, has_card_jersey, has_card_legends_broom_wagon, has_card_legends_eagle, has_card_legends_panda, has_card_legends_shark, has_card_legends_badger, has_card_legends_elephant FROM player'
        ));

        return array_map(
            fn (array $player) => new VelonimoPlayer(
                (int) $player['player_id'],
                (int) $player['player_no'],
                $player['player_name'],
                $player['player_color'],
                (int) $player['player_score'],
                (int) $player['player_score_aux'],
                VelonimoPlayer::deserializeRoundsRanking($player['rounds_ranking']),
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_JERSEY_PLUS_TEN)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR)]) === 1,
                ((int) $player[$this->fromSpecialCardIdToPlayerTableKey(CARD_ID_LEGENDS_ELEPHANT_STOP)]) === 1
            ),
            $players
        );
    }

    /**
     * @param VelonimoPlayer[] $players
     */
    private function getPlayerById(int $playerId, array $players = null): VelonimoPlayer {
        if ($players === null) {
            $players = $this->getPlayersFromDatabase();
        }

        foreach ($players as $player) {
            if ($player->getId() === $playerId) {
                return $player;
            }
        }

        throw new BgaVisibleSystemException('Player not found.'); // NOI18N
    }

    /**
     * @param int[] $playedCardIds
     *
     * @return array tuple of ($playedCards, $currentPlayerId, $currentPlayerCards)
     */
    public function hydratePlayedCards(array $playedCardIds): array
    {
        $numberOfPlayedCards = count($playedCardIds);
        if (count(array_unique($playedCardIds)) !== $numberOfPlayedCards) {
            throw new BgaUserException(self::_('You cannot use twice the same card.'));
        }

        // make sure the cards are in player's hand
        $currentPlayerId = (int) self::getCurrentPlayerId();
        $currentPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId)
        );
        $currentPlayerCardIds = array_map(fn(VelonimoCard $card) => $card->getId(), $currentPlayerCards);
        foreach ($playedCardIds as $id) {
            if (!in_array($id, $currentPlayerCardIds, true)) {
                $this->throwPlayedCardNotInPlayerHand();
            }
        }

        // get cards object from ID
        /** @var VelonimoCard[] $playedCards */
        $playedCards = [];
        foreach ($currentPlayerCards as $playerCard) {
            if (in_array($playerCard->getId(), $playedCardIds, true)) {
                $playedCards[] = $playerCard;
            }
        }

        return [
            $playedCards,
            $currentPlayerId,
            $currentPlayerCards,
        ];
    }

    /**
     * @param VelonimoPlayer[] $players
     */
    private function is2PlayersMode(array $players = null): bool {
        if ($players === null) {
            $players = $this->getPlayersFromDatabase();
        }

        return count($players) === 2;
    }

    /**
     * @param VelonimoPlayer[] $players
     *
     * @return VelonimoPlayer[]
     */
    private function getPlayersWhoCanPlayDuringRound(int $round, array $players = null): array {
        if ($players === null) {
            $players = $this->getPlayersFromDatabase();
        }

        $playersWhoCanPlay = [];
        foreach ($players as $player) {
            if (!isset($player->getRoundsRanking()[$round])) {
                $playersWhoCanPlay[] = $player;
            }
        }

        return $playersWhoCanPlay;
    }

    /**
     * @param VelonimoPlayer[] $players Indexed by player ID
     */
    private function formatPlayersForClient(array $players): array {
        $result = [];
        foreach ($players as $player) {
            $result[$player->getId()] = [
                'id' => $player->getId(),
                'position' => $player->getNaturalOrderPosition(),
                'name' => $player->getName(),
                'color' => $player->getColor(),
                'score' => $player->getScore(),
                'lastNumberOfPointsEarned' => $player->getLastNumberOfPointsEarned(),
                'roundsRanking' => $player->getRoundsRanking(),
                'isWearingJersey' => $player->isWearingJersey(),
                'hasCardLegendsBroomWagon' => $player->hasCardLegendsBroomWagon(),
                'hasCardLegendsEagle' => $player->hasCardLegendsEagle(),
                'hasCardLegendsPanda' => $player->hasCardLegendsPanda(),
                'hasCardLegendsShark' => $player->hasCardLegendsShark(),
                'hasCardLegendsBadger' => $player->hasCardLegendsBadger(),
                'hasCardLegendsElephant' => $player->hasCardLegendsElephant(),
                'howManyCards' => count($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $player->getId())),
            ];
        }

        return $result;
    }

    /**
     * The current winner is the one who wears the yellow jersey.
     *
     * @param VelonimoPlayer[] $players
     */
    private function getCurrentWinner(array $players): ?VelonimoPlayer {
        $highestScore = 0;
        foreach ($players as $player) {
            if ($player->getScore() > $highestScore) {
                $highestScore = $player->getScore();
            }
        }
        if ($highestScore === 0) {
            return null;
        }

        $playersWhoHaveHighestScore = [];
        foreach ($players as $player) {
            if ($player->getScore() === $highestScore) {
                $playersWhoHaveHighestScore[] = $player;
            }
        }

        // if only one player has the highest score, he is the current winner
        if (count($playersWhoHaveHighestScore) === 1) {
            return $playersWhoHaveHighestScore[0];
        }

        // if more than one player has the highest score,
        // the winner is the one who won the last round
        foreach ($playersWhoHaveHighestScore as $player) {
            if ($player->isLastRoundWinner()) {
                return $player;
            }
        }

        // if there is more than one player that have the highest score
        // and one of these players did not win the last round...
        // the official rule does not say anything in this case
        //
        // maybe it is impossible to reach this point,
        // so we decide to say that there is no winner if this happen
        return null;
    }

    /**
     * The current losers have the smallest number of points.
     *
     * @param VelonimoPlayer[] $players
     *
     * @return VelonimoPlayer[]
     */
    private function getCurrentLosers(array $players): array {
        $lowestScore = 1000;
        foreach ($players as $player) {
            if ($player->getScore() < $lowestScore) {
                $lowestScore = $player->getScore();
            }
        }

        $playersWhoHaveLowestScore = [];
        foreach ($players as $player) {
            if ($player->getScore() === $lowestScore) {
                $playersWhoHaveLowestScore[] = $player;
            }
        }

        return $playersWhoHaveLowestScore;
    }

    private function getNumberOfPointsAtRankForRound(
        int $rank,
        int $round,
        int $numberOfPlayers
    ): int {
        return $round * ($numberOfPlayers - $rank);
    }

    /**
     * @param VelonimoPlayer[] $players
     */
    private function getNextRankForRound(array $players, int $round): int {
        $highestCurrentRank = 0;
        foreach ($players as $player) {
            $playerRoundRanking = $player->getRoundsRanking()[$round] ?? 0;
            if ($playerRoundRanking > $highestCurrentRank) {
                $highestCurrentRank = $playerRoundRanking;
            }
        }

        return $highestCurrentRank + 1;
    }

    /**
     * The current loser is the one who starts a new round.
     *
     * @param VelonimoPlayer[] $players
     */
    private function getCurrentLoser(array $players): ?VelonimoPlayer {
        $lowestScore = 100000;
        $numberOfPlayersWhoHaveZeroPoints = 0;
        foreach ($players as $player) {
            if ($player->getScore() === 0) {
                $numberOfPlayersWhoHaveZeroPoints++;
            }
            if ($player->getScore() < $lowestScore) {
                $lowestScore = $player->getScore();
            }
        }

        // if all players have 0, there is no loser
        if (count($players) === $numberOfPlayersWhoHaveZeroPoints) {
            return null;
        }

        // take the first player who has the lowest score
        foreach ($players as $player) {
            if ($player->getScore() === $lowestScore) {
                return $player;
            }
        }

        // if $players array is empty
        return null;
    }

    private function discardPlayedCards(): void {
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PREVIOUS_PLAYED, self::CARD_LOCATION_DISCARD);
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PLAYED, self::CARD_LOCATION_DISCARD);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_JERSEY, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, 0);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_JERSEY, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BROOM_WAGON, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_EAGLE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_PANDA, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_SHARK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_BADGER, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);
        self::notifyAllPlayers('playedCardsDiscarded', '', []);
    }

    private function discardAttackRewardCards(): void {
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_ATTACK_REWARD, self::CARD_LOCATION_DISCARD);
        self::notifyAllPlayers('attackRewardCardsDiscarded', '', []);
    }

    /**
     * @param VelonimoPlayer[] $players
     */
    private function updatePlayerRoundsRanking(
        VelonimoPlayer $player,
        array $players,
        int $currentRound,
        int $nextRankForRound
    ): void {
        $player->addRoundRanking($currentRound, $nextRankForRound);
        $player->setLastNumberOfPointsEarned($this->getNumberOfPointsAtRankForRound(
            $player->getLastRoundRank(),
            $currentRound,
            count($players)
        ));

        self::DbQuery(sprintf(
            'UPDATE player SET rounds_ranking="%s", player_score_aux=%s WHERE player_id=%s',
            VelonimoPlayer::serializeRoundsRanking($player->getRoundsRanking()),
            $player->getLastNumberOfPointsEarned(),
            $player->getId()
        ));
    }

    private function dealCoachCardToPlayer(
        VelonimoPlayer $player,
        VelonimoCard $coachCard
    ): void {
        self::DbQuery(sprintf(
            'UPDATE player SET %s=1 WHERE player_id=%s',
            $this->fromSpecialCardIdToPlayerTableKey($coachCard->getId()),
            $player->getId()
        ));

        self::notifyAllPlayers('legendsCoachCardDealt', clienttranslate('${player_name} receives coach ${coachName} ${cardsImage}'), [
            'cards' => $formattedCards = $this->formatCardsForClient([$coachCard]),
            'cardsImage' => $formattedCards,
            'coachName' => $this->legends_coaches[$coachCard->getId()]['name'],
            'receiverPlayerId' => $player->getId(),
            'player_name' => $player->getName(),
        ]);
    }

    private function fromSpecialCardIdToPlayerTableKey(int $cardId): string
    {
        if ($cardId === CARD_ID_JERSEY_PLUS_TEN) {
            return 'has_card_jersey';
        } elseif ($cardId === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
            return 'has_card_legends_broom_wagon';
        } elseif ($cardId === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
            return 'has_card_legends_eagle';
        } elseif ($cardId === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
            return 'has_card_legends_panda';
        } elseif ($cardId === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
            return 'has_card_legends_shark';
        } elseif ($cardId === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
            return 'has_card_legends_badger';
        } elseif ($cardId === CARD_ID_LEGENDS_ELEPHANT_STOP) {
            return 'has_card_legends_elephant';
        } else {
            throw new BgaVisibleSystemException('Unsupported special card ID'); // NOI18N
        }
    }

    private function fromSpecialCardIdToIsNotPlayableGameStateKey(int $cardId): string
    {
        if ($cardId === CARD_ID_JERSEY_PLUS_TEN) {
            return self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_BROOM_WAGON_PLUS_FIVE) {
            return self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER) {
            return self::GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR) {
            return self::GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN) {
            return self::GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR) {
            return self::GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE;
        } elseif ($cardId === CARD_ID_LEGENDS_ELEPHANT_STOP) {
            return self::GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE;
        } else {
            throw new BgaVisibleSystemException('Unsupported special card ID'); // NOI18N
        }
    }

    /**
     * @param VelonimoPlayer[] $players
     */
    private function isJerseyNotPlayable(array $players = null): bool {
        return $this->is2PlayersMode($players) || 1 === (int) self::getGameStateValue(self::GAME_STATE_JERSEY_IS_NOT_PLAYABLE);
    }

    private function isLegendsBroomWagonNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_BROOM_WAGON_IS_NOT_PLAYABLE);
    }

    private function isLegendsEagleNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_EAGLE_IS_NOT_PLAYABLE);
    }

    private function isLegendsPandaNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_PANDA_IS_NOT_PLAYABLE);
    }

    private function isLegendsSharkNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_SHARK_IS_NOT_PLAYABLE);
    }

    private function isLegendsBadgerNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_BADGER_IS_NOT_PLAYABLE);
    }

    private function isLegendsElephantNotPlayable(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_LEGENDS_ELEPHANT_IS_NOT_PLAYABLE);
    }

    private function getHowManyRounds(): int {
        return (int) self::getGameStateValue(self::GAME_OPTION_HOW_MANY_ROUNDS);
    }

    private function isExtensionLegendsEnabled(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_OPTION_ENABLE_EXTENSION_LEGENDS);
    }

    /**
     * @param VelonimoCard[] $playedCards
     */
    private function assertCardsCanBePlayedTogether(
        array $playedCards,
        bool $cardsPlayedWithJersey,
        bool $cardsPlayedWithLegendsBroomWagon,
        bool $cardsPlayedWithLegendsEagle,
        bool $cardsPlayedWithLegendsPanda,
        bool $cardsPlayedWithLegendsShark,
        bool $cardsPlayedWithLegendsBadger,
        bool $cardsPlayedWithLegendsElephant
    ): void {
        $cardsCannotBePlayedTogetherErrorMessage = self::_('These cards cannot be played together.');

        // validate jersey is not played with coaches
        if (
            $cardsPlayedWithJersey
            && (
                $cardsPlayedWithLegendsEagle
                || $cardsPlayedWithLegendsPanda
                || $cardsPlayedWithLegendsShark
                || $cardsPlayedWithLegendsBadger
                || $cardsPlayedWithLegendsElephant
            )
        ) {
            throw new BgaUserException($cardsCannotBePlayedTogetherErrorMessage);
        }

        // validate 2 coaches are not played together
        $numberOfLegendsCoachCardsUsed = 0;
        foreach ([
            $cardsPlayedWithLegendsEagle,
            $cardsPlayedWithLegendsPanda,
            $cardsPlayedWithLegendsShark,
            $cardsPlayedWithLegendsBadger,
            $cardsPlayedWithLegendsElephant,
        ] as $legendsCoachCardHasBeenUsed) {
            if ($legendsCoachCardHasBeenUsed) {
                $numberOfLegendsCoachCardsUsed++;
            }
        }
        if ($numberOfLegendsCoachCardsUsed > 1) {
            throw new BgaUserException($cardsCannotBePlayedTogetherErrorMessage);
        }

        // validate adventurer is played alone and without jersey or broom wagon
        $cardsContainAnAdventurer = in_array(COLOR_ADVENTURER, array_map(fn (VelonimoCard $c) => $c->getColor(), $playedCards), true);
        $numberOfCards = count($playedCards);
        if (
            $cardsContainAnAdventurer
            && (
                $numberOfCards > 1
                || $cardsPlayedWithJersey
                || $cardsPlayedWithLegendsBroomWagon
            )
        ) {
            throw new BgaUserException($cardsCannotBePlayedTogetherErrorMessage);
        }

        // validate card combinations
        $playedCardsValues = array_count_values(array_map(fn (VelonimoCard $c) => $c->getValue(), $playedCards));
        $numberOfDifferentValues = count($playedCardsValues);
        $playedCardsColors = array_count_values(array_map(fn (VelonimoCard $c) => $c->getColor(), $playedCards));
        $numberOfDifferentColors = count($playedCardsColors);
        if ($cardsPlayedWithLegendsEagle) {
            if (
                $numberOfDifferentValues !== 2
                || (
                    reset($playedCardsValues) !== 1
                    && end($playedCardsValues) !== 1
                )
            ) {
                throw new BgaUserException(self::_('The Eagle coach must be played with 2 different values (1 or more cards of a same value, but only 1 card of the other value).'));
            }
        } elseif ($cardsPlayedWithLegendsPanda) {
            if (
                $numberOfDifferentColors !== 2
                || (
                    reset($playedCardsColors) !== 1
                    && end($playedCardsColors) !== 1
                )
            ) {
                throw new BgaUserException(self::_('The Panda coach must be played with 2 different colors (1 or more cards of a same color, but only 1 card of the other color).'));
            }
        } elseif ($cardsPlayedWithLegendsShark) {
            $cardsContainARedCard = in_array(COLOR_RED, array_map(fn (VelonimoCard $c) => $c->getColor(), $playedCards), true);
            if (
                !$cardsContainARedCard
                || $numberOfCards > 1
            ) {
                throw new BgaUserException(self::_('The Shark coach must be played with only 1 card of the Red color.'));
            }
        } elseif ($cardsPlayedWithLegendsBadger) {
            if (
                $numberOfDifferentColors < 2
                || $numberOfDifferentColors !== count(array_filter($playedCardsColors, fn ($numberOfCardsForColor) => $numberOfCardsForColor === 1))
            ) {
                throw new BgaUserException(self::_('The Badger coach must be played with several cards. Each of these cards must have a different color.'));
            }
        } else {
            if (
                $numberOfDifferentColors > 1
                && $numberOfDifferentValues > 1
            ) {
                throw new BgaUserException(self::_('You can only play several cards if they share a same color or a same value.'));
            }
        }
    }

    /**
     * /!\ Extension Legends only
     */
    private function lastPlayedCardsContainLegendsElephant(): bool {
        return (0 !== (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_CONTAIN_LEGENDS_ELEPHANT));
    }

    /**
     * /!\ 2P mode only
     */
    private function getNumberOfCardsInDeck(): int {
        return count($this->deck->getCardsInLocation(self::CARD_LOCATION_DECK));
    }

    /**
     * /!\ 2P mode only
     */
    private function getNumberOfCardsInAttackReward(): int {
        return count($this->deck->getCardsInLocation(self::CARD_LOCATION_ATTACK_REWARD));
    }

    /**
     * /!\ 2P mode only
     */
    private function revealNewAttackRewardCardsIfEnoughCardsInDeck(): void {
        if ($this->getNumberOfCardsInDeck() <= 0) {
            return;
        }

        $this->deck->pickCardForLocation(self::CARD_LOCATION_DECK, self::CARD_LOCATION_ATTACK_REWARD);

        self::notifyAllPlayers('attackRewardCardsRevealed', clienttranslate('The best attacker reward is ${cardsImage}'), [
            'cards' => $formattedCards = $this->formatCardsForClient(
                $this->fromBgaCardsToVelonimoCards(
                    $this->deck->getCardsInLocation(self::CARD_LOCATION_ATTACK_REWARD)
                )
            ),
            'cardsImage' => $formattedCards,
        ]);
    }

    private function throwPlayedCardNotPlayable(): void
    {
        throw new BgaUserException(self::_('This card is not playable at the moment.'));
    }

    private function throwPlayedCardNotInPlayerHand(): void
    {
        throw new BgaUserException(self::_('You cannot use a card which is not in your hand.'));
    }
}
