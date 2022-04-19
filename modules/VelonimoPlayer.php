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
    /**
     * @var array<int, int> where the key is the round_number and the value is the rank_number
     * Example: if the player finished 1st during the 2nd round (i.e. he won this round), the array will contain [..., 2 => 1, ...].
     */
    private array $roundsRanking;
    private bool $isWearingJersey;

    public function __construct(
        int $bgaId,
        int $naturalOrderPosition,
        string $name,
        string $color,
        int $score,
        array $roundsRanking,
        bool $isWearingJersey
    ) {
        $this->bgaId = $bgaId;
        $this->naturalOrderPosition = $naturalOrderPosition;
        $this->name = $name;
        $this->color = $color;
        $this->score = $score;
        $this->roundsRanking = $roundsRanking;
        $this->isWearingJersey = $isWearingJersey;
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
                throw new BgaVisibleSystemException('Invalid rounds ranking');
            }
            $deserialized[$roundAndRanking[0]] = $roundAndRanking[1];
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
    public function isWearingJersey(): bool
    {
        return $this->isWearingJersey;
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

    /*
     *  SETTERS
     */
    public function addPoints($points): self
    {
        $this->score = $this->score + $points;

        return $this;
    }
    public function setIsWearingJersey(bool $isWearingJersey): self
    {
        $this->isWearingJersey = $isWearingJersey;

        return $this;
    }
    public function addRoundRanking(int $round, int $rank): self
    {
        if (isset($this->roundsRanking[$round])) {
            throw new BgaVisibleSystemException('History cannot be rewritten');
        }

        $this->roundsRanking[$round] = $rank;

        return $this;
    }
}
