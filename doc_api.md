# Documentation de l'API

# POST `/api/auth`

## Description

Cette route permet à un utilisateur ou une entreprise de se connecter en utilisant un **email** et un **mot de passe**. Si la connexion est réussie, des **tokens JWT** (Access Token et Refresh Token) sont générés et envoyés dans les cookies de la réponse.

L'**access token** est valide pendant 3 heures, et le **refresh token** est valide pendant 7 jours. Ces tokens sont utilisés pour authentifier l'utilisateur dans les requêtes suivantes.

---

## Méthode

`POST`

---

## Paramètres de la requête

Les paramètres doivent être envoyés sous forme de **JSON**.

| Paramètre  | Type     | Description                           | Obligatoire |
|------------|----------|---------------------------------------|-------------|
| `email`    | `String` | L'adresse email de l'utilisateur ou de l'entreprise. | Oui         |
| `password` | `String` | Le mot de passe de l'utilisateur ou de l'entreprise. | Oui         |

---

## Exemple de requête

```bash
POST /api/auth
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
### Route `GET /api/auth`

```markdown
# GET `/api/auth`

## Description

Cette route permet de vérifier l'authentification d'un utilisateur ou d'une entreprise en utilisant l'**access token**. Si l'**access token** est valide, la réponse renvoie les informations de l'utilisateur (comme l'email). Si l'**access token** est invalide ou expiré, la route tente de rafraîchir le token en utilisant le **refresh token**.

Si aucun des tokens n'est valide ou disponible, une erreur 401 est renvoyée.

---

## Méthode

`GET`

---

## Authentification

**Token d'accès nécessaire** : Oui

Le **access token** est utilisé pour vérifier l'authentification. S'il est expiré ou invalide, la route tente de rafraîchir le token avec le **refresh token** si celui-ci est fourni.

---

## Réponses

### 1. **Code HTTP 200** : **Utilisateur authentifié**

- Si l'**access token** est valide, un message de succès avec l'email de l'utilisateur est retourné.

  **Exemple de réponse :**
  ```json
  {
    "message": "User authenticated",
    "email": "user@example.com"
  }

```
# API des offres de véhicule

## Endpoints

### `GET /api/vehicle`

#### Description
Récupère toutes les offres de véhicules disponibles.

#### Méthode
`GET`

#### Paramètres de la requête
Aucun paramètre nécessaire.

#### Réponse

- **Code HTTP 200** : Retourne une liste d'offres de véhicules.
  
  - **Exemple** :
  ```json
  [
    {
      "id": 1,
      "title": "Toyota Corolla",
      "description": "Reliable and fuel-efficient vehicle.",
      "price": 15000,
      "city": "Paris",
      "country": "France",
      "model": "Corolla",
      "year": 2018,
      "mileage": 50000,
      "fuelType": "Gasoline",
      "color": "White",
      "transmission": "Manual",
      "photos": ["photo1.jpg", "photo2.jpg"],
      "subCategoryId": 1,
      "userId": 1,
      "companyId": null
    }
  ]

# POST `/api/vehicle`

## Description

Cette route permet de créer une nouvelle offre de véhicule. Elle nécessite un **token d'accès valide** pour l'authentification de l'utilisateur, ainsi que des données de formulaire contenant les détails du véhicule (comme le titre, la description, le prix, etc.).

Le token d'accès doit être fourni dans les **cookies** sous la clé `access_token`

---

## Méthode

`POST`

---

## Authentification

**Token d'accès nécessaire** : Oui

Le token d'accès est utilisé pour vérifier l'identité de l'utilisateur ou de l'entreprise associée à l'offre. Vous devez envoyer un token d'accès valide dans les cookies


---

## Paramètres de la requête

Les paramètres doivent être envoyés sous forme de **form-data**.

| Paramètre   | Type       | Description                                                           | Obligatoire |
|-------------|------------|-----------------------------------------------------------------------|-------------|
| `title`     | `String`   | Le titre de l'offre de véhicule.                                      | Oui         |
| `description` | `String`   | La description détaillée du véhicule.                                 | Oui         |
| `price`     | `String`   | Le prix du véhicule (doit être un nombre).                            | Oui         |
| `city`      | `String`   | La ville où se trouve le véhicule.                                    | Oui         |
| `country`   | `String`   | Le pays où se trouve le véhicule.                                     | Oui         |
| `model`     | `String`   | Le modèle du véhicule.                                                | Oui         |
| `year`      | `String`   | L'année de fabrication du véhicule.                                   | Oui         |
| `mileage`   | `String`   | Le kilométrage du véhicule.                                           | Oui         |
| `fuelType`  | `String`   | Le type de carburant (ex : essence, diesel).                          | Oui         |
| `color`     | `String`   | La couleur du véhicule.                                               | Oui         |
| `transmission` | `String`   | Le type de transmission (ex : manuelle, automatique).                 | Oui         |
| `photos`    | `File(s)`  | Les photos du véhicule (facultatif).                                  | Non         |

---

## Réponses

### 1. **Code HTTP 201** : **Création réussie de l'offre**

- La création de l'offre a réussi. Retourne les informations de la nouvelle offre de véhicule.

  **Exemple de réponse :**
  ```json
  {
    "id": 1,
    "title": "Honda Civic",
    "description": "Compact and sporty car.",
    "price": 18000,
    "city": "Lyon",
    "country": "France",
    "model": "Civic",
    "year": 2020,
    "mileage": 30000,
    "fuelType": "Diesel",
    "color": "Black",
    "transmission": "Automatic",
    "photos": ["photo1.jpg", "photo2.jpg"],
    "subCategoryId": 1,
    "userId": 1,
    "companyId": null
  }

# GET `/api/user`

## Description

Cette route permet de récupérer la liste de tous les utilisateurs de la base de données.

---

## Méthode

`GET`

---

## Réponses

### 1. **Code HTTP 200** : **Succès**

- Si la récupération des utilisateurs est réussie, une liste des utilisateurs est retournée.

  **Exemple de réponse :**
  ```json
  [
    {
      "id": 1,
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "birthDate": "1990-01-01T00:00:00.000Z",
      "city": "Paris",
      "country": "France",
      "profilePicture": ""
    },
    ...
  ]


---

### Route `POST /api/user`

```markdown
# POST `/api/user`

## Description

Cette route permet de créer un nouvel utilisateur. Les informations nécessaires pour créer l'utilisateur incluent le **nom d'utilisateur**, le **mot de passe**, le **prénom**, le **nom**, l'**email**, la **date de naissance**, la **ville**, et le **pays**.

---

## Méthode

`POST`

---

## Paramètres de la requête
```
Les paramètres doivent être envoyés sous forme de **JSON**.

| Paramètre    | Type     | Description                           | Obligatoire |
|--------------|----------|---------------------------------------|-------------|
| `username`   | `String` | Le nom d'utilisateur de l'utilisateur. | Oui         |
| `password`   | `String` | Le mot de passe de l'utilisateur.      | Oui         |
| `firstName`  | `String` | Le prénom de l'utilisateur.            | Oui         |
| `lastName`   | `String` | Le nom de famille de l'utilisateur.    | Oui         |
| `email`      | `String` | L'email de l'utilisateur.              | Oui         |
| `birthDate`  | `String` | La date de naissance de l'utilisateur. | Oui         |
| `city`       | `String` | La ville de résidence de l'utilisateur.| Non         |
| `country`    | `String` | Le pays de résidence de l'utilisateur.| Non         |
| `profilePicture` | `String` | URL de la photo de profil de l'utilisateur (facultatif). | Non |

---

## Exemple de requête

```bash
POST /api/user
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "birthDate": "1990-01-01",
  "city": "Paris",
  "country": "France"
}

```

# GET `/api/company`

## Description

Cette route permet de récupérer la liste de toutes les entreprises de la base de données.

---

## Méthode

`GET`

---

## Réponses

### 1. **Code HTTP 200** : **Succès**

- Si la récupération des entreprises est réussie, une liste d'entreprises est retournée.

  **Exemple de réponse :**
  ```json
  [
    {
      "id": 1,
      "companyName": "TechCorp",
      "email": "contact@techcorp.com",
      "companyNumber": "123456789",
      "birthDate": "2000-01-01T00:00:00.000Z",
      "city": "Paris",
      "country": "France",
      "street": "123 Tech Street"
    },
    ...
  ]



---

### Route `POST /api/company`

```markdown
# POST `/api/company`

## Description

Cette route permet de créer une nouvelle entreprise. Les informations nécessaires pour créer l'entreprise incluent le **nom de l'entreprise**, le **mot de passe**, l'**email**, le **numéro d'entreprise**, la **date de naissance**, la **ville**, le **pays**, et l'**adresse** de l'entreprise.

---

## Méthode

`POST`

---

## Paramètres de la requête

Les paramètres doivent être envoyés sous forme de **JSON**.
```
| Paramètre        | Type     | Description                             | Obligatoire |
|------------------|----------|-----------------------------------------|-------------|
| `companyName`    | `String` | Le nom de l'entreprise.                 | Oui         |
| `password`       | `String` | Le mot de passe de l'entreprise.        | Oui         |
| `email`          | `String` | L'email de l'entreprise.                | Oui         |
| `companyNumber`  | `String` | Le numéro d'enregistrement de l'entreprise. | Oui         |
| `birthDate`      | `String` | La date de naissance de l'entreprise.   | Oui         |
| `city`           | `String` | La ville de l'entreprise.               | Non         |
| `country`        | `String` | Le pays de l'entreprise.                | Non         |
| `street`         | `String` | L'adresse de l'entreprise.              | Oui         |

---

## Exemple de requête

```bash
POST /api/company
Content-Type: application/json

{
  "companyName": "TechCorp",
  "password": "password123",
  "email": "contact@techcorp.com",
  "companyNumber": "123456789",
  "birthDate": "2000-01-01",
  "city": "Paris",
  "country": "France",
  "street": "123 Tech Street"
}
