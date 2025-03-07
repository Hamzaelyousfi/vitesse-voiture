<?php

namespace App\Controller;

use App\Repository\VoitureRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/calcul')]
class CalculController extends AbstractController
{
    private VoitureRepository $voitureRepository;
    private ValidatorInterface $validator;

    public function __construct(
        VoitureRepository $voitureRepository,
        ValidatorInterface $validator
    ) {
        $this->voitureRepository = $voitureRepository;
        $this->validator = $validator;
    }

    #[Route('/temps', name: 'api_calcul_temps', methods: ['POST'])]
    public function calculTemps(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $constraints = new Assert\Collection([
            'distance' => [
                new Assert\NotBlank(['message' => 'La distance est obligatoire']),
                new Assert\Type(['type' => 'numeric', 'message' => 'La distance doit être un nombre']),
                new Assert\Positive(['message' => 'La distance doit être positive'])
            ],
            'model' => [
                new Assert\NotBlank(['message' => 'Le modèle est obligatoire']),
                new Assert\Type(['type' => 'string', 'message' => 'Le modèle doit être une chaîne de caractères'])
            ]
        ]);

        $errors = $this->validator->validate($data, $constraints);

        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $propertyPath = $error->getPropertyPath();
                $propertyPath = str_replace(['[', ']'], '', $propertyPath);
                $errorMessages[$propertyPath] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $distance = $data['distance'];
        $model = $data['model'];

        $voiture = $this->voitureRepository->findByModel($model);

        if (!$voiture) {
            return $this->json(['message' => 'Modèle de voiture introuvable'], Response::HTTP_NOT_FOUND);
        }

        $vitesse = $voiture->getKmh();
        $temps = $distance / $vitesse;
        $heures = floor($temps);
        $minutes = floor(($temps - $heures) * 60);
        $secondes = floor(((($temps - $heures) * 60) - $minutes) * 60);

        return $this->json([
            'distance' => $distance,
            'model' => $model,
            'vitesse' => $vitesse,
            'temps' => [
                'heures' => $heures,
                'minutes' => $minutes,
                'secondes' => $secondes,
                'decimal' => $temps
            ],
            'message' => sprintf(
                "Pour parcourir %s km avec une %s roulant à %s km/h, il faudra %s heures %s minutes et %s secondes.",
                $distance,
                $model,
                $vitesse,
                $heures,
                $minutes,
                $secondes
            )
        ]);
    }
}
