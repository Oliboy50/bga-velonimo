<?php

class VelonimoPlayer
{
    private const ROUNDS_RANKING_SERIALIZED_KEY_VALUE_SEPARATOR = '=';
    private const ROUNDS_RANKING_SERIALIZED_ROUNDS_SEPARATOR = '|';

    private int $bgaId;
    private string $name;
    private int $score;
    /**
     * @var array<int, int> where the key is the round_number and the value is the rank_number
     * Example: if the player finished 1st during the 2nd round (i.e. he won this round), the array will contain [..., 2 => 1, ...].
     */
    private array $roundsRanking;
    private bool $isWearingJersey;

    public function __construct(
        int $bgaId,
        string $name,
        int $score,
        array $roundsRanking,
        bool $isWearingJersey
    ) {
        $this->bgaId = $bgaId;
        $this->name = $name;
        $this->score = $score;
        $this->roundsRanking = $roundsRanking;
        $this->isWearingJersey = $isWearingJersey;
    }

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
        if (!$rounds) {
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

    public function getId(): int
    {
        return $this->bgaId;
    }

    public function getName(): string
    {
        return $this->name;
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
     *  MUTATING FUNCTIONS
     */

    public function addPoints($points): void
    {
        $this->score = $this->score + $points;
    }

    public function setIsWearingJersey(bool $isWearingJersey): void
    {
        $this->isWearingJersey = $isWearingJersey;
    }

    public function addRoundRanking(int $round, int $rank): void
    {
        if (isset($this->roundsRanking[$round])) {
            throw new BgaVisibleSystemException('History cannot be rewritten');
        }

        $this->roundsRanking[$round] = $rank;
    }
}
