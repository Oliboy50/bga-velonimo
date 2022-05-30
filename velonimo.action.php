<?php
/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * Velonimo implementation : © Oliver THEBAULT (a.k.a. Oliboy50)
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 *
 * velonimo.action.php
 *
 * Velonimo main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/velonimo/velonimo/myAction.html", ...)
 *
 */

declare(strict_types=1);

class action_velonimo extends APP_GameAction
{
    // Constructor: please do not modify
    public function __default()
    {
        if(self::isArg( 'notifwindow')) {
            $this->view = 'common_notifwindow';
            $this->viewArgs['table'] = self::getArg('table', AT_posint, true);
        } else {
            $this->view = 'velonimo_velonimo';
            self::trace('Complete reinitialization of board game');
        }
    }

    public function playCards()
    {
        self::setAjaxMode();

        $cardsArg = trim(self::getArg('cards', AT_numberlist, true), ';');
        $cardIds = explode(';', $cardsArg);

        $withJerseyArg = (bool) self::getArg('withJersey', AT_bool, true);

        $this->game->playCards(array_map(fn ($id) => (int) $id, $cardIds), $withJerseyArg);

        self::ajaxResponse();
    }

    public function passTurn()
    {
        self::setAjaxMode();

        $this->game->passTurn();

        self::ajaxResponse();
    }

    public function selectNextPlayer()
    {
        self::setAjaxMode();

        $selectedPlayerId = trim(self::getArg('selectedPlayerId', AT_int, true));

        $this->game->selectNextPlayer((int) $selectedPlayerId);

        self::ajaxResponse();
    }

    public function selectPlayerToPickCards()
    {
        self::setAjaxMode();

        $selectedPlayerId = trim(self::getArg('selectedPlayerId', AT_int, true));

        $this->game->selectPlayerToPickCards((int) $selectedPlayerId);

        self::ajaxResponse();
    }

    public function selectCardsToGiveBack()
    {
        self::setAjaxMode();

        $cardsArg = trim(self::getArg('cards', AT_numberlist, true), ';');
        $cardIds = explode(';', $cardsArg);

        $this->game->selectCardsToGiveBack(array_map(fn ($id) => (int) $id, $cardIds));

        self::ajaxResponse();
    }
}
