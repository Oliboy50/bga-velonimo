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
    private const GAME_STATE_CURRENT_ROUND = 'currentRound';
    private const GAME_STATE_LAST_PLAYED_CARDS_VALUE = 'valueToBeat';
    private const GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID = 'playerIdForValueToBeat';
    private const GAME_STATE_HOW_MANY_ROUNDS = 'howManyRounds';

    private const CARD_LOCATION_DECK = 'deck';
    private const CARD_LOCATION_PLAYER_HAND = 'hand';
    private const CARD_LOCATION_DISCARD = 'discard';
    private const CARD_LOCATION_PLAYED = 'played';

    /** @var Deck */
    private $deck;

    function __construct()
	{
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
            self::GAME_STATE_HOW_MANY_ROUNDS => 100,
        ]);

        $this->deck = self::getNew('module.common.deck');
        $this->deck->init('card');
	}

    protected function getGameName()
    {
		// Used for translations and stuff. Please do not modify.
        return 'velonimo';
    }

    /*
        setupNewGame:

        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame($players, $options = [])
    {
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
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);

        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        // Table statistics
        self::initStat('table', 'playCardsAction', 0);
        self::initStat('table', 'passTurnAction', 0);
        // Player statistics (init for all players)
        self::initStat('player', 'playCardsAction', 0);
        self::initStat('player', 'passTurnAction', 0);

        // Create cards
        $cards = [];
        // common cards
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
    protected function getAllDatas()
    {
        $result = [];

        // Players info
        $result['players'] = $this->formatPlayersForClient($this->getPlayersFromDatabase());

        // Rounds info
        $result['currentRound'] = self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $result['howManyRounds'] = self::getGameStateValue(self::GAME_STATE_HOW_MANY_ROUNDS);

        // Last cards played on the table
        $result['playedCards'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYED))
        );
        $result['playedCardsValue'] = self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $result['playedCardsPlayerId'] = self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID);

        // Cards in player hand
        $result['hand'] = $this->formatCardsForClient(
            $this->fromBgaCardsToVelonimoCards($this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, self::getCurrentPlayerId()))
        );

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
    function getGameProgression()
    {
        $howManyRounds = self::getGameStateValue(self::GAME_STATE_HOW_MANY_ROUNDS);
        $currentRound = self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);

        return ((int) floor(($currentRound - 1) / $howManyRounds)) * 100;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////

    /*
        In this space, you can put any utility methods useful for your game logic
    */



//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
////////////

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in velonimo.action.php)
    */

    /**
     * @param int[] $playedCardIds
     */
    function playCards(array $playedCardIds)
    {
        self::checkAction('playCards');

        // validate $playedCardIds
        foreach ($playedCardIds as $cardId) {
            if (!is_int($cardId)) {
                throw new BgaVisibleSystemException(self::_('Invalid $playedCardIds.'));
            }
        }
        $numberOfPlayedCards = count($playedCardIds);
        if ($numberOfPlayedCards < 1) {
            throw new BgaUserException(self::_('You cannot play less than 1 card.'));
        }
        if (count(array_unique($playedCardIds)) !== $numberOfPlayedCards) {
            throw new BgaUserException(self::_('You cannot play twice the same card.'));
        }

        // make sure the cards are in player's hand
        $currentPlayerId = self::getCurrentPlayerId();
        $currentPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $currentPlayerId)
        );
        $currentPlayerCardIds = array_map(fn(VelonimoCard $card) => $card->getId(), $currentPlayerCards);
        foreach ($playedCardIds as $id) {
            if (!in_array($currentPlayerCardIds, $id, true)) {
                throw new BgaUserException(self::_('You cannot play a card which is not in your hand.'));
            }
        }

        /** @var VelonimoCard[] $playedCards */
        $playedCards = [];
        foreach ($currentPlayerCards as $playerCard) {
            if (in_array($playerCard->getId(), $playedCardIds, true)) {
                $playedCards[] = $playerCard;
            }
        }

        $lastPlayedCardsValue = self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE);
        $playedCardsValue = $this->getCardsValue($playedCards);
        if ($playedCardsValue <= $lastPlayedCardsValue) {
            throw new BgaUserException(sprintf(
                self::_('The value of the cards you play must be higher than %s.'),
                $lastPlayedCardsValue
            ));
        }

        // discard table cards and play cards
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PLAYED, self::CARD_LOCATION_DISCARD);
        $this->deck->moveCards($playedCardIds, self::CARD_LOCATION_PLAYED, $currentPlayerId);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, $currentPlayerId);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, $playedCardsValue);
        self::incStat('table', 'playCardsAction');
        self::incStat('player', 'playCardsAction', $currentPlayerId);
        self::notifyAllPlayers('cardsPlayed', clienttranslate('${playerName} plays ${playedCardsValue}'), [
            'playerId' => $currentPlayerId,
            'playerName' => self::getCurrentPlayerName(),
            'playedCards' => $this->formatCardsForClient($playedCards),
            'playedCardsValue' => $playedCardsValue,
        ]);

        // if the player did not play his last card, it's next player turn
        if ($numberOfPlayedCards < count($currentPlayerCards)) {
            $this->gamestate->nextState('nextPlayer');
            return;
        }

        // the player played his last card, set its rank for this round
        $players = $this->getPlayersFromDatabase();
        $currentRound = self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $nextRankForRound = $this->getNextRankForRound($players, $currentRound);
        $currentPlayer = $this->getPlayerById($currentPlayerId, $players);
        $currentPlayer->addRoundRanking($currentRound, $nextRankForRound);
        self::DbQuery(sprintf(
            'UPDATE player SET rounds_ranking=%s WHERE player_id=%s',
            VelonimoPlayer::serializeRoundsRanking($currentPlayer->getRoundsRanking()),
            $currentPlayer->getId()
        ));

        // if there are at least 2 players who have cards, it's next player turn
        $playersWhoCanPlay = array_filter(
            $this->getPlayersWhoCanPlayDuringRound($currentRound, $players),
            fn (VelonimoPlayer $player) => $player->getId() !== $currentPlayerId
        );
        if (count($playersWhoCanPlay) !== 1) {
            $this->gamestate->nextState('nextPlayer');
            return;
        }

        // end the round
        $lastPlayer = $playersWhoCanPlay[0];
        $lastPlayer->addRoundRanking($currentRound, $nextRankForRound + 1);
        self::DbQuery(sprintf(
            'UPDATE player SET rounds_ranking=%s WHERE player_id=%s',
            VelonimoPlayer::serializeRoundsRanking($lastPlayer->getRoundsRanking()),
            $lastPlayer->getId()
        ));
        $this->gamestate->nextState('endRound');
    }

    function passTurn()
    {
        self::checkAction('passTurn');

        $this->incStat(1, 'passTurnAction');
        $this->incStat(1, 'passTurnAction', self::getCurrentPlayerId());

        // @TODO: notify

        $this->gamestate->nextState('nextPlayer');
    }

    function selectNextPlayer(int $nextPlayerId)
    {
        self::checkAction('selectNextPlayer');

        // make sure the selected player can play
        $nextPlayerCards = $this->fromBgaCardsToVelonimoCards(
            $this->deck->getCardsInLocation(self::CARD_LOCATION_PLAYER_HAND, $nextPlayerId)
        );
        if (empty($nextPlayerCards)) {
            throw new BgaUserException(self::_('This player cannot play. Please select another player who has cards.'));
        }

        self::giveExtraTime($nextPlayerId);
        $this->gamestate->changeActivePlayer($nextPlayerId);

        // @TODO: notify

        $this->gamestate->nextState('firstPlayerTurn');
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*

    Example for game state "MyGameState":

    function argMyGameState()
    {
        // Get some values from the current game situation in database...

        // return values:
        return [
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        ];
    }
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */

    function stStartRound()
    {
        // take back all cards and shuffle them
        $this->deck->moveAllCardsInLocation(null, self::CARD_LOCATION_DECK);
        $this->deck->shuffle(self::CARD_LOCATION_DECK);

        // increment current round value
        self::setGameStateValue(
            self::GAME_STATE_CURRENT_ROUND,
            self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND) + 1
        );

        // deal 11 cards to each player
        $players = $this->getPlayersFromDatabase();
        foreach($players as $player)
        {
            $cards = $this->fromBgaCardsToVelonimoCards(
                $this->deck->pickCards(11, self::CARD_LOCATION_DECK, $player->getId())
            );

            self::notifyPlayer($player->getId(), 'newHand', '', [
                'cards' => $this->formatCardsForClient($cards),
            ]);
        }

        // if there is a loser, he plays first during this round
        if ($currentLoser = $this->getCurrentLoser($players)) {
            $this->gamestate->changeActivePlayer($currentLoser->getId());
        } else {
            self::activeNextPlayer();
        }

        $this->gamestate->nextState('firstPlayerTurn');
    }

    function stActivateNextPlayer()
    {
        $players = $this->getPlayersFromDatabase();
        $currentRound = self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        $playersWhoCanPlayIds = array_map(
            fn (VelonimoPlayer $player) => $player->getId(),
            $this->getPlayersWhoCanPlayDuringRound($currentRound, $players)
        );
        $playerIdWhoPlayedTheLastCards = self::getGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID);

        // @TODO: make sure we can use "self::activeNextPlayer()" in a loop,
        //        if we can't => either try to use the nextPlayerTable() or make this state recursive
        // activate next players until we find one who can play
        foreach ($players as $ignored) {
            $nextPlayerId = self::activeNextPlayer();
            // if the next player is the one who played the last played cards, remove the cards from the table
            if ($nextPlayerId === $playerIdWhoPlayedTheLastCards) {
                $this->discardLastPlayedCards();
                $this->gamestate->nextState('playerSelectNextPlayer');
                return;
            }
            if (in_array($nextPlayerId, $playersWhoCanPlayIds, true)) {
                self::giveExtraTime($nextPlayerId);
                break;
            }
        }

        $this->gamestate->nextState('playerTurn');
    }

    function stEndRound()
    {
        // update players score and jersey
        $players = $this->getPlayersFromDatabase();
        $numberOfPlayers = count($players);
        $currentRound = self::getGameStateValue(self::GAME_STATE_CURRENT_ROUND);
        foreach ($players as $k => $player) {
            $players[$k] = $player->addPoints(
                $this->getNumberOfPointsAtRankForRound(
                    $player->getLastRoundRank(),
                    $currentRound,
                    $numberOfPlayers
                )
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

        self::notifyAllPlayers('roundEnded', '', [
            'players' => $players,
        ]);

        // go to next round or end the game
        $howManyRounds = self::getGameStateValue(self::GAME_STATE_HOW_MANY_ROUNDS);
        if ($currentRound < $howManyRounds) {
            $this->gamestate->nextState('nextRound');
        } else {
            $this->gamestate->nextState('endGame');
        }
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

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

    function zombieTurn($state, $active_player)
    {
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

        if ($state['type'] === 'multipleactiveplayer') {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive($active_player, '');

            return;
        }

        throw new feException('Zombie mode not supported at this game state: '.$statename);
    }

///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:

        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.

    */

    function upgradeTableDb($from_version)
    {
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

///////////////////////////////////////////////////////////////////////////////////:
////////// Velonimo specific functions
//////////

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
            $bgaCards
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
    private function getCardsValue(array $cards): int {
        if (count($cards) <= 0) {
            return 0;
        }

        if (count($cards) === 1) {
            return $cards[0]->getValue();
        }

        $minCardValue = 1000;
        foreach ($cards as $card) {
            if ($card->getValue() < $minCardValue) {
                $minCardValue = $card->getValue();
            }
        }

        return (count($cards) * 10) + $minCardValue;
    }

    /**
     * @return VelonimoPlayer[]
     */
    private function getPlayersFromDatabase(): array {
        $players = self::getCollectionFromDB('SELECT player_id, player_name, player_score, rounds_ranking, is_wearing_jersey FROM player');

        return array_map(
            fn (array $player) => new VelonimoPlayer(
                (int) $player['player_id'],
                $player['player_name'],
                (int) $player['player_score'],
                VelonimoPlayer::deserializeRoundsRanking($player['rounds_ranking']),
                ((int) $player['is_wearing_jersey']) === 1,
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
     * @param VelonimoPlayer[] $players
     */
    private function formatPlayersForClient(array $players): array {
        return array_map(
            fn (VelonimoPlayer $player) => [
                'id' => $player->getId(),
                'name' => $player->getName(),
                'score' => $player->getScore(),
            ],
            $players
        );
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

    private function discardLastPlayedCards(): void
    {
        $this->deck->moveAllCardsInLocation(self::CARD_LOCATION_PLAYED, self::CARD_LOCATION_DISCARD);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_VALUE, 0);
        self::setGameStateValue(self::GAME_STATE_LAST_PLAYED_CARDS_PLAYER_ID, 0);
    }
}
