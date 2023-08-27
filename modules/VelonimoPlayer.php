<?php

declare(strict_types=1);

class VelonimoPlayer
{
    private const ROUNDS_RANKING_SERIALIZED_KEY_VALUE_SEPARATOR = '=';
    private const ROUNDS_RANKING_SERIALIZED_ROUNDS_SEPARATOR = '|';

    private int $bgaId;
    private int $naturalOrderPosition;
    private string $name;
    private string $color;
    private int $score;
    private int $lastNumberOfPointsEarned;
    /**
     * @var array<int, int> where the key is the round_number and the value is the rank_number
     * Example: if the player finished 1st during the 2nd round (i.e. he won this round), the array will contain [..., 2 => 1, ...].
     */
    private array $roundsRanking;
    private bool $isWearingJersey;
    private bool $hasCardLegendsBroomWagon;
    private bool $hasCardLegendsEagle;
    private bool $hasCardLegendsPanda;
    private bool $hasCardLegendsShark;
    private bool $hasCardLegendsBadger;
    private bool $hasCardLegendsElephant;

    public function __construct(
        int $bgaId,
        int $naturalOrderPosition,
        string $name,
        string $color,
        int $score,
        int $lastNumberOfPointsEarned,
        array $roundsRanking,
        bool $isWearingJersey,
        bool $hasCardLegendsBroomWagon,
        bool $hasCardLegendsEagle,
        bool $hasCardLegendsPanda,
        bool $hasCardLegendsShark,
        bool $hasCardLegendsBadger,
        bool $hasCardLegendsElephant
    ) {
        $this->bgaId = $bgaId;
        $this->naturalOrderPosition = $naturalOrderPosition;
        $this->name = $name;
        $this->color = $color;
        $this->score = $score;
        $this->lastNumberOfPointsEarned = $lastNumberOfPointsEarned;
        $this->roundsRanking = $roundsRanking;
        $this->isWearingJersey = $isWearingJersey;
        $this->hasCardLegendsBroomWagon = $hasCardLegendsBroomWagon;
        $this->hasCardLegendsEagle = $hasCardLegendsEagle;
        $this->hasCardLegendsPanda = $hasCardLegendsPanda;
        $this->hasCardLegendsShark = $hasCardLegendsShark;
        $this->hasCardLegendsBadger = $hasCardLegendsBadger;
        $this->hasCardLegendsElephant = $hasCardLegendsElephant;
    }

    /*
     * STATICS
     */
    public static function serializeRoundsRanking(array $deserialized): string
    {
        $serialized = '';
        foreach ($deserialized as $round => $rank) {
            $serialized .= $round.self::ROUNDS_RANKING_SERIALIZED_KEY_VALUE_SEPARATOR.$rank.self::ROUNDS_RANKING_SERIALIZED_ROUNDS_SEPARATOR;
        }

        return rtrim($serialized, self::ROUNDS_RANKING_SERIALIZED_ROUNDS_SEPARATOR);
    }
    public static function deserializeRoundsRanking(string $serialized): array
    {
        /** @var string[] $rounds */
        $rounds = explode(self::ROUNDS_RANKING_SERIALIZED_ROUNDS_SEPARATOR, $serialized);
        if (
            !$rounds
            || (
                count($rounds) === 1
                && $rounds[0] === ''
            )
        ) {
            return [];
        }

        $deserialized = [];
        foreach ($rounds as $roundRanking) {
            /** @var string[] $roundAndRanking */
            $roundAndRanking = explode(self::ROUNDS_RANKING_SERIALIZED_KEY_VALUE_SEPARATOR, $roundRanking);
            if (
                (!$roundAndRanking)
                || (count($roundAndRanking) !== 2)
            ) {
                throw new BgaVisibleSystemException('Invalid rounds ranking'); // NOI18N
            }
            $deserialized[(int) $roundAndRanking[0]] = (int) $roundAndRanking[1];
        }

        return $deserialized;
    }

    /*
     * GETTERS
     */
    public function getId(): int
    {
        return $this->bgaId;
    }
    public function getNaturalOrderPosition(): int
    {
        return $this->naturalOrderPosition;
    }
    public function getName(): string
    {
        return $this->name;
    }
    public function getColor(): string
    {
        return $this->color;
    }
    public function getScore(): int
    {
        return $this->score;
    }
    public function getLastNumberOfPointsEarned(): int
    {
        return $this->lastNumberOfPointsEarned;
    }
    public function isWearingJersey(): bool
    {
        return $this->isWearingJersey;
    }
    public function hasCardLegendsBroomWagon(): bool
    {
        return $this->hasCardLegendsBroomWagon;
    }
    public function hasCardLegendsEagle(): bool
    {
        return $this->hasCardLegendsEagle;
    }
    public function hasCardLegendsPanda(): bool
    {
        return $this->hasCardLegendsPanda;
    }
    public function hasCardLegendsShark(): bool
    {
        return $this->hasCardLegendsShark;
    }
    public function hasCardLegendsBadger(): bool
    {
        return $this->hasCardLegendsBadger;
    }
    public function hasCardLegendsElephant(): bool
    {
        return $this->hasCardLegendsElephant;
    }
    public function getRoundsRanking(): array
    {
        return $this->roundsRanking;
    }
    public function getLastRoundRank(): int
    {
        $lastRound = max(array_keys($this->roundsRanking));

        return $this->roundsRanking[$lastRound];
    }
    public function isLastRoundWinner(): bool
    {
        return $this->getLastRoundRank() === 1;
    }
    public function isLastRoundLoser(int $numberOfPlayers): bool
    {
        return $this->getLastRoundRank() === $numberOfPlayers;
    }
    public function getCoachCardId(): ?int
    {
        if ($this->hasCardLegendsEagle) {
            return CARD_ID_LEGENDS_EAGLE_ADD_ONE_OTHER_NUMBER;
        } elseif ($this->hasCardLegendsPanda) {
            return CARD_ID_LEGENDS_PANDA_ADD_ONE_OTHER_COLOR;
        } elseif ($this->hasCardLegendsShark) {
            return CARD_ID_LEGENDS_SHARK_ONE_RED_MULTIPLY_TEN;
        } elseif ($this->hasCardLegendsBadger) {
            return CARD_ID_LEGENDS_BADGER_ANY_NUMBER_OF_EACH_COLOR;
        } elseif ($this->hasCardLegendsElephant) {
            return CARD_ID_LEGENDS_ELEPHANT_STOP;
        } else {
            return null;
        }
    }

    /*
     *  SETTERS
     */
    public function addPoints(int $points): self
    {
        $this->score = $this->score + $points;

        return $this;
    }
    public function setLastNumberOfPointsEarned(int $lastNumberOfPointsEarned): self
    {
        $this->lastNumberOfPointsEarned = $lastNumberOfPointsEarned;

        return $this;
    }
    public function setIsWearingJersey(bool $isWearingJersey): self
    {
        $this->isWearingJersey = $isWearingJersey;

        return $this;
    }
    public function setHasCardLegendsBroomWagon(bool $hasCardLegendsBroomWagon): self
    {
        $this->hasCardLegendsBroomWagon = $hasCardLegendsBroomWagon;

        return $this;
    }
    public function setHasCardLegendsEagle(bool $hasCardLegendsEagle): self
    {
        $this->hasCardLegendsEagle = $hasCardLegendsEagle;

        return $this;
    }
    public function setHasCardLegendsPanda(bool $hasCardLegendsPanda): self
    {
        $this->hasCardLegendsPanda = $hasCardLegendsPanda;

        return $this;
    }
    public function setHasCardLegendsShark(bool $hasCardLegendsShark): self
    {
        $this->hasCardLegendsShark = $hasCardLegendsShark;

        return $this;
    }
    public function setHasCardLegendsBadger(bool $hasCardLegendsBadger): self
    {
        $this->hasCardLegendsBadger = $hasCardLegendsBadger;

        return $this;
    }
    public function setHasCardLegendsElephant(bool $hasCardLegendsElephant): self
    {
        $this->hasCardLegendsElephant = $hasCardLegendsElephant;

        return $this;
    }
    public function addRoundRanking(int $round, int $rank): self
    {
        if (isset($this->roundsRanking[$round])) {
            throw new BgaVisibleSystemException('History cannot be rewritten'); // NOI18N
        }

        $this->roundsRanking[$round] = $rank;

        return $this;
    }
}
