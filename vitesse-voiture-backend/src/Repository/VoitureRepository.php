<?php

namespace App\Repository;

use App\Entity\Voiture;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class VoitureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Voiture::class);
    }

    public function findByModel(string $model): ?Voiture
    {
        return $this->createQueryBuilder('v')
            ->andWhere('v.model = :model')
            ->setParameter('model', $model)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
