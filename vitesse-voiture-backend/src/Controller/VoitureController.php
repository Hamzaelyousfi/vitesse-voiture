<?php

namespace App\Controller;

use App\Entity\Voiture;
use App\Repository\VoitureRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/voitures')]
class VoitureController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private SerializerInterface $serializer;
    private VoitureRepository $voitureRepository;
    private ValidatorInterface $validator;

    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        VoitureRepository $voitureRepository,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->voitureRepository = $voitureRepository;
        $this->validator = $validator;
    }

    #[Route('', name: 'api_voitures_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $voitures = $this->voitureRepository->findAll();
        return $this->json($voitures);
    }

    #[Route('', name: 'api_voitures_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $voiture = new Voiture();
        $voiture->setModel($data['model'] ?? '');
        $voiture->setKmh($data['kmh'] ?? 0);

        if (isset($data['caracteristiques']) && is_array($data['caracteristiques'])) {
            $voiture->setCaracteristiques($data['caracteristiques']);
        }
        
        $errors = $this->validator->validate($voiture);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->persist($voiture);
        $this->entityManager->flush();

        return $this->json($voiture, Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_voitures_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $voiture = $this->voitureRepository->find($id);

        if (!$voiture) {
            return $this->json(['message' => 'Voiture non trouvée'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($voiture);
    }

    
    #[Route('/{id}', name: 'api_voitures_update', methods: ['PUT'])]
    public function update(Request $request, int $id): JsonResponse
    {
        $voiture = $this->voitureRepository->find($id);

        if (!$voiture) {
            return $this->json(['message' => 'Voiture non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['model'])) {
            $voiture->setModel($data['model']);
        }

        if (isset($data['kmh'])) {
            $voiture->setKmh($data['kmh']);
        }

        if (isset($data['caracteristiques']) && is_array($data['caracteristiques'])) {
            $voiture->setCaracteristiques($data['caracteristiques']);
        }

        $errors = $this->validator->validate($voiture);
        if (count($errors) > 0) {
            $errorMessages = [];
            foreach ($errors as $error) {
                $errorMessages[$error->getPropertyPath()] = $error->getMessage();
            }
            return $this->json(['errors' => $errorMessages], Response::HTTP_BAD_REQUEST);
        }

        $this->entityManager->flush();

        return $this->json($voiture);
    }

    #[Route('/{id}', name: 'api_voitures_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $voiture = $this->voitureRepository->find($id);

        if (!$voiture) {
            return $this->json(['message' => 'Voiture non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($voiture);
        $this->entityManager->flush();

        return $this->json(['message' => 'Voiture supprimée avec succès']);
    }
}
