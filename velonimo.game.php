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

    private const GAME_STATE_CURRENT_ROUND = 'currentRound';
    private const GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND = 'jerseyUsedInRound';
    private const GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE = 'previousValueToBeat';
    private const GAME_STATE_LAST_PLAYED_CARDS_VALUE = 'valueToBeat';
    private const GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID = 'playerIdForValueToBeat';
    private const GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID = 'selectedNextPlayerId';
    private const GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK = 'numberOfCardsToPick';
    private const GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK = 'numberOfCardsToGiveBack';
    private const GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK = 'playerIdToGiveCardsBack';

    private const GAME_OPTION_HOW_MANY_ROUNDS = 'howManyRounds';

    private const CARD_LOCATION_DECK = 'deck';
    private const CARD_LOCATION_PLAYER_HAND = 'hand';
    private const CARD_LOCATION_DISCARD = 'discard';
    private const CARD_LOCATION_PLAYED = 'played';
    private const CARD_LOCATION_PREVIOUS_PLAYED = 'previousPlayed';

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
            self::GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND => 14,
            self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK => 15,
            self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK => 16,
            self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK => 17,
            self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE => 18,
            self::GAME_OPTION_HOW_MANY_ROUNDS => 100,
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
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID, 0);
        self::setGameStateValue(self::GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_PICK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK, 0);

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        // Table statistics
        self::initStat('table', 'minValue', 0);
        self::initStat('table', 'maxValue', 0);
        // Player statistics (init for all players)
        self::initStat('player', 'minValue', 0);
        self::initStat('player', 'maxValue', 0);
        self::initStat('player', 'numberOfRoundsWon', 0);

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

        // Rounds
        $result['currentRound'] = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $result['jerseyHasBeenUsedInTheCurrentRound'] = $this->isJerseyUsedInCurrentRound();
        $result['howManyRounds'] = (int) self::getGameStateValue(self::GAME_OPTION_HOW_MANY_ROUNDS);

        // Players
        $result['players'] = $this->formatPlayersForClient($this->getPlayersFromDatabase());
        // @TODO: support spectator
        $result['currentPlayerId'] = $currentPlayerId;
        $result['currentPlayerCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId))
        );

        // Cards
        $result['playedCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYED))
        );
        $result['playedCardsValue'] = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $result['playedCardsPlayerId'] = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID);
        $result['previousPlayedCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PREVIOUS_PLAYED))
        );
        $result['previousPlayedCardsValue'] = (int) self::getGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE);

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
        $howManyRounds = (int) self::getGameStateValue(self::GAME_OPTION_HOW_MANY_ROUNDS);
        $currentRound = ((int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND)) ?: 1;

        return ((int) floor(($currentRound - 1) / $howManyRounds)) * 100;
    }

////////////////////////////////////////////////////////////////////////////
//////////// Player actions
////////////////////////////////////////////////////////////////////////////

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in velonimo.action.php)
    */

    /**
     * @param int[] $playedCardIds
     */
    function playCards(array $playedCardIds, bool $cardsPlayedWithJersey) {
        self::checkAction('playCards');

        // validate $playedCardIds
        $numberOfPlayedCards = count($playedCardIds);
        if ($numberOfPlayedCards < 1) {
            throw new BgaUserException(self::_('You cannot play less than 1 card.'));
        }
        if (count(array_unique($playedCardIds)) !== $numberOfPlayedCards) {
            throw new BgaUserException(self::_('You cannot use twice the same card.'));
        }

        // make sure the cards are in player's hand
        $currentPlayerId = (int) self::getCurrentPlayerId();
        $currentPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId)
        );
        $currentPlayerCardIds = array_map(fn (VelonimoCard $card) => $card->getId(), $currentPlayerCards);
        foreach ($playedCardIds as $id) {
            if (!in_array($id, $currentPlayerCardIds, true)) {
                throw new BgaUserException(self::_('You cannot use a card which is not in your hand.'));
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

        // check that played cards can be played together
        /** @var VelonimoCard $lastCheckedCard */
        $lastCheckedCard = null;
        foreach ($playedCards as $card) {
            if (!$lastCheckedCard) {
                $lastCheckedCard = $card;
                continue;
            }

            if (
                $lastCheckedCard->getColor() === COLOR_ADVENTURER
                || (
                    $lastCheckedCard->getColor() !== $card->getColor()
                    && $lastCheckedCard->getValue() !== $card->getValue()
                )
            ) {
                throw new BgaUserException(self::_('These cards cannot be played together.'));
            }
            $lastCheckedCard = $card;
        }

        // check that player is allowed to use jersey
        $players = $this->getPlayersFromDatabase();
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);
        if ($cardsPlayedWithJersey) {
            if ($this->isJerseyUsedInCurrentRound()) {
                throw new BgaUserException(self::_('The jersey can be used only once by turn.'));
            }
            if (!$currentPlayer->isWearingJersey()) {
                throw new BgaUserException(self::_('You cannot play the jersey if you are not wearing it.'));
            }
        }

        // check that played cards value is higher than the previous played cards value
        $lastPlayedCardsValue = (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $playedCardsValue = $this->getCardsValue($playedCards, $cardsPlayedWithJersey);
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
            self::setGameStateValue(self::GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND, 1);
        }
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, $currentPlayerId);
        self::setGameStateValue(self::GAME_STATE_PREVIOUS_PLAYED_CARDS_VALUE, $lastPlayedCardsValue);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, $playedCardsValue);
        self::notifyAllPlayers('cardsPlayed', clienttranslate('${playerName} plays ${playedCardsValue}'), [
            'playedCardsPlayerId' => $currentPlayerId,
            'playedCards' => $this->formatCardsForClient($playedCards),
            'playerName' => self::getCurrentPlayerName(),
            'playedCardsValue' => $playedCardsValue,
            'withJersey' => $cardsPlayedWithJersey,
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

        // if the player played his last card, set its rank for this round
        if ((count($currentPlayerCards) - $numberOfPlayedCards) === 0) {
            $currentRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
            $nextRankForRound = $this->getNextRankForRound($players, $currentRound);
            $currentPlayer->addRoundRanking($currentRound, $nextRankForRound);
            $this->updatePlayerRoundsRanking($currentPlayer);
            if ($nextRankForRound === 1) {
                $this->incStat(1, 'numberOfRoundsWon', $currentPlayerId);
            }

            $playersWhoCanPlay = array_filter(
                $this->getPlayersWhoCanPlayDuringRound($currentRound, $players),
                fn (VelonimoPlayer $player) => $player->getId() !== $currentPlayerId
            );

            // end the round if there is only 1 player who can play now
            if (count($playersWhoCanPlay) === 1) {
                $lastPlayer = $playersWhoCanPlay[0];
                $lastPlayer->addRoundRanking($currentRound, $nextRankForRound + 1);
                $this->updatePlayerRoundsRanking($lastPlayer);

                $this->gamestate->nextState('endRound');
                return;
            }

            $this->gamestate->nextState('nextPlayer');
            return;
        }

        // if the player played cards of value "1", he has to pick cards from another player
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

        self::notifyAllPlayers('turnPassed', clienttranslate('${playerName} passes'), [
            'playerName' => self::getCurrentPlayerName(),
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
        self::notifyAllPlayers('nextPlayerSelected', clienttranslate('${playerName} chooses ${selectedPlayerName} as next player'), [
            'playerName' => $currentPlayer->getName(),
            'selectedPlayerName' => $selectedPlayer->getName(),
        ]);

        // in order to change the active player during an "activeplayer" type state,
        // we have to use an intermediate global variable and an intermediate "game" type state
        self::setGameStateValue(self::GAME_STATE_LAST_SELECTED_NEXT_PLAYER_ID, $selectedPlayerId);
        $this->gamestate->nextState('applySelectedNextPlayer');
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
        $translatedMessage = clienttranslate('${receiverPlayerName} picks ${numberOfCards} cards from ${senderPlayerName} hand');
        foreach ($players as $player) {
            if ($player->getId() === $currentPlayer->getId()) {
                self::notifyPlayer($currentPlayer->getId(), 'cardsReceivedFromAnotherPlayer', $translatedMessage, [
                    'cards' => $formattedPickedCards,
                    'senderPlayerId' => $selectedPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToPick,
                    'receiverPlayerName' => $currentPlayer->getName(),
                    'senderPlayerName' => $selectedPlayer->getName(),
                ]);
            } elseif ($player->getId() === $selectedPlayer->getId()) {
                self::notifyPlayer($selectedPlayer->getId(), 'cardsSentToAnotherPlayer', $translatedMessage, [
                    'cards' => $formattedPickedCards,
                    'receiverPlayerId' => $currentPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToPick,
                    'receiverPlayerName' => $currentPlayer->getName(),
                    'senderPlayerName' => $selectedPlayer->getName(),
                ]);
            } else {
                self::notifyPlayer($player->getId(), 'cardsMovedBetweenTwoOtherPlayers', $translatedMessage, [
                    'receiverPlayerId' => $currentPlayer->getId(),
                    'senderPlayerId' => $selectedPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToPick,
                    'receiverPlayerName' => $currentPlayer->getName(),
                    'senderPlayerName' => $selectedPlayer->getName(),
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
        $numberOfSelectedCards = count($selectedCardIds);
        if ($numberOfSelectedCards !== $numberOfCardsToGiveBack) {
            throw new BgaUserException(sprintf(self::_('You must select exactly %s cards.'), $numberOfCardsToGiveBack));
        }
        if (count(array_unique($selectedCardIds)) !== $numberOfSelectedCards) {
            throw new BgaUserException(self::_('You cannot use twice the same card.'));
        }

        // make sure the cards are in player's hand
        $currentPlayerId = (int) self::getCurrentPlayerId();
        $currentPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId)
        );
        $currentPlayerCardIds = array_map(fn (VelonimoCard $card) => $card->getId(), $currentPlayerCards);
        foreach ($selectedCardIds as $id) {
            if (!in_array($id, $currentPlayerCardIds, true)) {
                throw new BgaUserException(self::_('You cannot use a card which is not in your hand.'));
            }
        }

        // get cards object from ID
        /** @var VelonimoCard[] $selectedCards */
        $selectedCards = [];
        foreach ($currentPlayerCards as $playerCard) {
            if (in_array($playerCard->getId(), $selectedCardIds, true)) {
                $selectedCards[] = $playerCard;
            }
        }

        $players = $this->getPlayersFromDatabase();
        $receiverPlayer = $this->getPlayerById((int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK), $players);
        $currentPlayer = $this->getPlayerById((int) self::getCurrentPlayerId(), $players);

        $this->deck->moveCards(
            array_map(fn (VelonimoCard $c) => $c->getId(), $selectedCards),
            self::CARD_LOCATION_PLAYER_HAND,
            $receiverPlayer->getId()
        );

        // notify players
        $formattedSelectedCards = $this->formatCardsForClient($selectedCards);
        $translatedMessage = clienttranslate('${senderPlayerName} gives back ${numberOfCards} cards to ${receiverPlayerName}');
        foreach ($players as $player) {
            if ($player->getId() === $currentPlayer->getId()) {
                self::notifyPlayer($currentPlayer->getId(), 'cardsSentToAnotherPlayer', $translatedMessage, [
                    'cards' => $formattedSelectedCards,
                    'receiverPlayerId' => $receiverPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToGiveBack,
                    'receiverPlayerName' => $receiverPlayer->getName(),
                    'senderPlayerName' => $currentPlayer->getName(),
                ]);
            } elseif ($player->getId() === $receiverPlayer->getId()) {
                self::notifyPlayer($receiverPlayer->getId(), 'cardsReceivedFromAnotherPlayer', $translatedMessage, [
                    'cards' => $formattedSelectedCards,
                    'senderPlayerId' => $currentPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToGiveBack,
                    'receiverPlayerName' => $receiverPlayer->getName(),
                    'senderPlayerName' => $currentPlayer->getName(),
                ]);
            } else {
                self::notifyPlayer($player->getId(), 'cardsMovedBetweenTwoOtherPlayers', $translatedMessage, [
                    'receiverPlayerId' => $receiverPlayer->getId(),
                    'senderPlayerId' => $currentPlayer->getId(),
                    'numberOfCards' => $numberOfCardsToGiveBack,
                    'receiverPlayerName' => $receiverPlayer->getName(),
                    'senderPlayerName' => $currentPlayer->getName(),
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

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    function argFirstPlayerTurn() {
        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
        ];
    }

    function argPlayerTurn() {
        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
            'playedCardsValue' => (int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE),
        ];
    }

    function argPlayerSelectNextPlayer() {
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

    function argPlayerSelectPlayerToPickCards() {
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

    function argPlayerGiveCardsBackAfterPicking() {
        $playerToGiveCardsBack = $this->getPlayerById((int) self::getGameStateValue(self::GAME_STATE_LAST_PLAYER_ID_TO_GIVE_CARDS_BACK));

        return [
            'activePlayerId' => (int) self::getActivePlayerId(),
            'numberOfCards' => (int) self::getGameStateValue(self::GAME_STATE_LAST_NUMBER_OF_CARDS_TO_GIVE_BACK),
            'selectedPlayerName' => $playerToGiveCardsBack->getName(),
        ];
    }

////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////////////////////////////////////////////////////////////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    function stStartRound() {
        $this->discardPlayedCards();
        // take back all cards and shuffle them
        $this->deck->moveAllCardsInLocation(null, self::CARD_LOCATION_DECK);
        $this->deck->shuffle(self::CARD_LOCATION_DECK);

        // increment current round value
        $newRound = (int) self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND) + 1;
        self::setGameStateValue(self::GAME_STATE_CURRENT_ROUND, $newRound);

        // deal cards to each player
        $players = $this->getPlayersFromDatabase();
        foreach($players as $player)
        {
            $cards = $this->fromBgaCardsToVelonimoCards(
                $this->deck->pickCards(self::NUMBER_OF_CARDS_TO_DEAL_TO_EACH_PLAYER, self::CARD_LOCATION_DECK, $player->getId())
            );

            self::notifyPlayer($player->getId(), 'cardsDealt', '', [
                'cards' => $this->formatCardsForClient($cards),
            ]);
        }

        // if there is a loser, he plays first during this round
        if ($currentLoser = $this->getCurrentLoser($players)) {
            $this->gamestate->changeActivePlayer($currentLoser->getId());
        } else {
            self::activeNextPlayer();
        }

        self::notifyAllPlayers('roundStarted', 'Round #${currentRound} starts', [
            'currentRound' => $newRound,
            'players' => $this->formatPlayersForClient($players),
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
        foreach ($players as $ignored) {
            $nextPlayerId = self::activeNextPlayer();
            $nextPlayerCanPlay = in_array($nextPlayerId, $playersWhoCanPlayIds, true);
            // if the next player is the one who played the last played cards, remove the cards from the table
            if ($nextPlayerId === $playerIdWhoPlayedTheLastCards) {
                $this->discardPlayedCards();
                self::giveExtraTime($nextPlayerId);
                if ($nextPlayerCanPlay) {
                    $this->gamestate->nextState('firstPlayerTurn');
                } else {
                    $this->gamestate->nextState('playerSelectNextPlayer');
                }
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
        $numberOfPointsForRoundByPlayerId = [];
        $winnerOfCurrentRound = null;
        foreach ($players as $k => $player) {
            $playerCurrentRoundRank = $player->getLastRoundRank();
            if ($playerCurrentRoundRank === 1) {
                $winnerOfCurrentRound = $player;
            }
            $numberOfPointsForRoundByPlayerId[$player->getId()] = $this->getNumberOfPointsAtRankForRound(
                $playerCurrentRoundRank,
                $currentRound,
                $numberOfPlayers
            );
            $players[$k] = $player->addPoints(
                $numberOfPointsForRoundByPlayerId[$player->getId()]
            );
        }
        $newWinner = $this->getCurrentWinner($players);
        foreach ($players as $k => $player) {
            $players[$k] = $player->setIsWearingJersey(
                $newWinner && $newWinner->getId() === $player->getId()
            );

            self::DbQuery(sprintf(
                'UPDATE player SET player_score=%s, is_wearing_jersey=%s WHERE player_id=%s',
                $player->getScore(),
                $player->isWearingJersey() ? 1 : 0,
                $player->getId()
            ));
        }

        // re-allow the jersey to be used
        self::setGameStateValue(self::GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND, 0);

        self::notifyAllPlayers('roundEnded', 'Round #${currentRound} has been won by ${playerName}', [
            'currentRound' => $currentRound,
            'playerName' => $winnerOfCurrentRound ? $winnerOfCurrentRound->getName() : 'N/A',
            'players' => $this->formatPlayersForClient($players),
        ]);

        // notify points earned by each player
        foreach ($players as $player) {
            $translatedMessage = ($numberOfPointsForRoundByPlayerId[$player->getId()] > 0)
                ? clienttranslate('${playerName} wins ${points} points')
                : clienttranslate('${playerName} does not get any point');
            self::notifyAllPlayers('pointsWon', $translatedMessage, [
                'playerName' => $player->getName(),
                'points' => $numberOfPointsForRoundByPlayerId[$player->getId()],
            ]);
        }

        $howManyRounds = (int) self::getGameStateValue(self::GAME_OPTION_HOW_MANY_ROUNDS);
        $isGameOver = $currentRound >= $howManyRounds;

        // use "Scoring dialogs" to recap scoring for end-users before moving forward
        // @see https://en.doc.boardgamearena.com/Game_interface_logic:_yourgamename.js#Scoring_dialogs
        $headers = [
            '', // first column of headers line does not have content
        ];
        $roundPoints = [
            [
                'str' => clienttranslate('Round points'),
                'args' => [],
            ],
        ];
        $totalPoints = [
            [
                'str' => clienttranslate('Total points'),
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
            $roundPoints[] = $numberOfPointsForRoundByPlayerId[$player->getId()];
            $totalPoints[] = $player->getScore();
        }
        $this->notifyAllPlayers( 'tableWindow', '', array(
            'id' => 'finalScoring',
            'title' =>  sprintf(
                clienttranslate('Results of round %s/%s'),
                $currentRound,
                $howManyRounds
            ),
            'table' => [
                $headers,
                $roundPoints,
                $totalPoints
            ],
            'closing' => $isGameOver ? clienttranslate('End of game') : clienttranslate('Next round')
        ));

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

    /*
        zombieTurn:

        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).

        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message.
    */

    function zombieTurn($state, $activePlayer) {
        // @TODO: zombie
    	$statename = $state['name'];

        if ($state['type'] === 'activeplayer') {
            switch ($statename) {
                default:
                    $this->gamestate->nextState('zombiePass');
                	break;
            }

            return;
        }

        throw new feException('Zombie mode not supported at this game state: '.$statename);
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
    private function getCardsValue(array $cards, bool $withJersey): int {
        if (count($cards) <= 0) {
            return 0;
        }

        // the jersey cannot be played with an adventurer
        if ($withJersey && in_array(COLOR_ADVENTURER, array_map(fn (VelonimoCard $c) => $c->getColor(), $cards), true)) {
            return 0;
        }

        $addJerseyValueIfUsed = fn (int $value) => $value + ($withJersey ? VALUE_JERSEY : 0);

        if (count($cards) === 1) {
            return $addJerseyValueIfUsed($cards[0]->getValue());
        }

        $minCardValue = 1000;
        foreach ($cards as $card) {
            if ($card->getValue() < $minCardValue) {
                $minCardValue = $card->getValue();
            }
        }

        return $addJerseyValueIfUsed((count($cards) * 10) + $minCardValue);
    }

    /**
     * @return VelonimoPlayer[]
     */
    private function getPlayersFromDatabase(): array {
        $players = array_values(self::getCollectionFromDB(
            'SELECT player_id, player_no, player_name, player_color, player_score, rounds_ranking, is_wearing_jersey FROM player'
        ));

        return array_map(
            fn (array $player) => new VelonimoPlayer(
                (int) $player['player_id'],
                (int) $player['player_no'],
                $player['player_name'],
                $player['player_color'],
                (int) $player['player_score'],
                VelonimoPlayer::deserializeRoundsRanking($player['rounds_ranking']),
                ((int) $player['is_wearing_jersey']) === 1
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

        throw new BgaVisibleSystemException(self::_('Player not found.'));
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
     * @param array<int, VelonimoPlayer> $players Indexed by player ID
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
                'isWearingJersey' => $player->isWearingJersey(),
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
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);
        self::notifyAllPlayers('cardsDiscarded', '', []);
    }

    private function updatePlayerRoundsRanking(VelonimoPlayer $player): void {
        self::DbQuery(sprintf(
            'UPDATE player SET rounds_ranking="%s" WHERE player_id=%s',
            VelonimoPlayer::serializeRoundsRanking($player->getRoundsRanking()),
            $player->getId()
        ));
    }

    private function isJerseyUsedInCurrentRound(): bool {
        return 1 === (int) self::getGameStateValue(self::GAME_STATE_JERSEY_HAS_BEEN_USED_IN_THE_CURRENT_ROUND);
    }
}
