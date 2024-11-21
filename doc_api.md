# Documentation de l'API

## URL
api/vehicle


---

## Description
Cette route permet de créer une nouvelle annonce de véhicule. La création est autorisée uniquement pour les utilisateurs authentifiés, qu'ils soient des utilisateurs individuels ou des entreprises.

---

## Requête

### En-têtes
- `Authorization`: Obligatoire. Doit contenir un token d'accès valide dans un cookie.

### Corps de la requête (JSON)
| Champ           | Type     | Obligatoire | Description                                                                                  |
|------------------|----------|-------------|----------------------------------------------------------------------------------------------|
| `title`         | string   | Oui         | Titre de l'annonce (3-100 caractères).                                                      |
| `description`   | string   | Oui         | Description du véhicule (3-500 caractères).                                                 |
| `price`         | number   | Oui         | Prix du véhicule (nombre positif).                                                          |
| `city`          | string   | Oui         | Ville où se situe le véhicule (3-100 caractères).                                           |
| `country`       | string   | Oui         | Pays où se situe le véhicule (2-100 caractères).                                            |
| `model`         | string   | Oui         | Modèle du véhicule (2-50 caractères).                                                       |
| `year`          | number   | Oui         | Année de fabrication (1900 à l'année actuelle).                                             |
| `mileage`       | number   | Oui         | Kilométrage du véhicule (nombre entier positif).                                             |
| `fuelType`      | string   | Oui         | Type de carburant (Petrol, Diesel, Electric, Hybrid).                                        |
| `color`         | string   | Oui         | Couleur du véhicule (3-30 caractères).                                                      |
| `transmission`  | string   | Oui         | Transmission du véhicule (Manual, Automatic).                                               |
| `subCategoryId` | number   | Oui         | Identifiant de la sous-catégorie (nombre entier).                                            |

---

## Réponses

### Succès (201 Created)
- **Statut :** `201 Created`
- **Corps :**
```json
{
  "id": "UUID",
  "title": "string",
  "description": "string",
  "price": "number",
  "city": "string",
  "country": "string",
  "model": "string",
  "year": "number",
  "mileage": "number",
  "fuelType": "string",
  "color": "string",
  "transmission": "string",
  "subCategoryId": "number",
  "userId": "UUID | null",
  "companyId": "UUID | null"
}
