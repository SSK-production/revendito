# stage-project

## Description du projet

**Revendito** est une application web moderne dédiée à la vente et à l'achat d'articles de seconde main. Ce projet vise à offrir une plateforme intuitive et sécurisée pour connecter les vendeurs et les acheteurs, tout en promouvant une consommation plus durable. Il utilise **Next.js** comme framework principal, avec une architecture modulaire et bien organisée pour garantir une évolutivité et une maintenance aisée.

## Architecture du projet

Le projet suit une architecture modulaire et bien structurée pour simplifier le développement et la maintenance. Voici les principaux dossiers et fichiers :

### Dossiers principaux

```
├── app/               # Dossier principal de l'application
│   ├── (pages)/       # Pages dynamiques ou groupements de routes
│   ├── api/           # Routes API pour le backend côté serveur
│   ├── components/    # Composants spécifiques à certaines pages
│   ├── fonts/         # Gestion des polices de caractères
│   ├── hooks/         # Hooks personnalisés pour la logique réutilisable
│   ├── lib/           # Fonctions spécifiques à certaines fonctionnalités
│   ├── sitemaps/      # Fichiers sitemap pour améliorer le SEO
│   ├── types/         # Définition des types TypeScript globaux
│   ├── validation/    # Schémas de validation (ex : Zod)
│   ├── layout.tsx     # Layout global de l'application
│   └── page.tsx       # Page d'accueil
│
├── components/        # Composants réutilisables à l'échelle de l'application
├── lib/               # Fonctions utilitaires partagées globalement
├── prisma/            # Schéma Prisma et gestion de la base de données
├── public/            # Fichiers statiques accessibles publiquement
├── utils/             # Helpers génériques (gestion des dates, formats, etc.)
├── .env               # Fichier des variables d'environnement sensibles
├── fonts.css          # Définition des styles pour les polices
├── globals.css        # Styles globaux de l'application
```

Cette organisation modulaire permet une séparation claire des responsabilités, rendant le projet plus lisible, maintenable et évolutif.

### Fichiers importants

- **`.env`** : Contient les variables d'environnement sensibles nécessaires au bon fonctionnement de l'application.
- **`next.config.js`** : Fichier de configuration de Next.js pour personnaliser le comportement de l'application.
- **`tailwind.config.js`** : Fichier de configuration de Tailwind CSS pour la gestion des styles.
- **`tsconfig.json`** : Fichier de configuration TypeScript pour définir les options du compilateur.


## 🔧 Installation & Setup

### 1. Cloner le projet

```bash
git clone https://github.com/ton-utilisateur/Revendito.git
cd Revendito
npm install

create file .env

npx prisma generate
npx prisma migrate dev

npm run dev
```

### Variables d'environnement (.env)

Le fichier `.env` contient les informations sensibles nécessaires à l'application, telles que les identifiants de base de données, les clés JWT, et les paramètres SMTP pour l'envoi d'emails. Voici un exemple des variables utilisées :

```
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NO_SSL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

ACCESS_JWT_SECRET="..."
REFRESH_JWT_SECRET="..."
RESET_PASSWORD_JWT_SECRET="..."

EMAIL_USER="..."
EMAIL_PASS="..."
SMTP_HOST="..."
SMTP_PORT=587

PUSHER_APP_ID="..."
PUSHER_KEY="..."
PUSHER_SECRET="..."
PUSHER_CLUSTER

BASE_URL=""

```

### Doc api
```
This code implements functionality for [describe the purpose of the code here].

Features:
- Provides [list key features or functionalities].
- Handles [describe any specific handling or processing].

Note:
- API documentation is accessible via the `/swagger` route for detailed information about available endpoints and their usage.
```