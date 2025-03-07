<?php

namespace App\Entity;

use App\Repository\VoitureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: VoitureRepository::class)]
class Voiture
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: "Le modèle est obligatoire")]
    private ?string $model = null;

    #[ORM\Column]
    #[Assert\NotBlank(message: "La vitesse en Km/h est obligatoire")]
    #[Assert\Positive(message: "La vitesse doit être positive")]
    private ?float $kmh = null;

    #[ORM\Column(nullable: true)]
    private array $caracteristiques = [];

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getModel(): ?string
    {
        return $this->model;
    }

    public function setModel(string $model): static
    {
        $this->model = $model;

        return $this;
    }

    public function getKmh(): ?float
    {
        return $this->kmh;
    }

    public function setKmh(float $kmh): static
    {
        $this->kmh = $kmh;

        return $this;
    }

    public function getCaracteristiques(): array
    {
        return $this->caracteristiques;
    }

    public function setCaracteristiques(?array $caracteristiques): static
    {
        $this->caracteristiques = $caracteristiques ?: [];

        return $this;
    }
}
