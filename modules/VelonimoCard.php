<?php

declare(strict_types=1);

class VelonimoCard
{
    private int $bgaId;
    private int $color;
    private int $value;

    public function __construct(
        int $bgaId,
        int $color,
        int $value
    ) {
        $this->bgaId = $bgaId;
        $this->color = $color;
        $this->value = $value;
    }

    public function getId(): int
    {
        return $this->bgaId;
    }

    public function getColor(): int
    {
        return $this->color;
    }

    public function getValue(): int
    {
        return $this->value;
    }
}
