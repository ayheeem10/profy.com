# Profy — La marketplace tunisienne des cours particuliers

> "Trouve le professeur qui te correspond."

Ce dépôt contient les **fondations** de Profy : design system, homepage,
authentification par rôle (élève / professeur / admin), schéma de base de
données PostgreSQL complet, et données de démonstration.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **NextAuth v5** (Credentials, sessions JWT, protection de routes par rôle)
- **Prisma** + **PostgreSQL** (schéma complet prêt à l'emploi)
- **React Hook Form** + **Zod** pour les formulaires
- **Lucide** pour les icônes, polices **Sora / Inter / IBM Plex Mono** auto-hébergées (fontsource)

## Démarrer en local

```bash
npm install
cp .env.example .env
npm run dev
```

L'app tourne sur `http://localhost:3000`. Tu peux immédiatement :
- Parcourir la homepage (recherche, matières, profs de démo)
- T'inscrire comme élève (`/register`)
- Créer un profil professeur (`/become-teacher`)
- Te connecter (`/login`) et accéder à ton dashboard selon ton rôle

## Connecter une vraie base PostgreSQL (Supabase) et déployer sur Netlify

L'app utilise désormais **directement Prisma** (plus de couche mémoire) dans
`src/auth.ts`, `src/app/api/register/route.ts`,
`src/app/api/become-teacher/route.ts` et `src/app/teacher/dashboard/page.tsx`.
Il ne reste qu'à brancher une vraie base.

> ⚠️ Cette bascule a été écrite avec soin mais **n'a pas pu être testée en
> conditions réelles** dans l'environnement où ce projet a été généré : cet
> environnement n'a pas d'accès réseau à `binaries.prisma.sh`, nécessaire pour
> générer le client Prisma. Le seul point non vérifié est donc l'exécution
> réelle des requêtes — la structure du code, elle, a été confirmée cohérente
> avec le schéma. Si tu rencontres une erreur après `npx prisma generate`,
> montre-la moi et je la corrige tout de suite.

### 1. Crée un projet Supabase

Sur [supabase.com](https://supabase.com) → New Project. Une fois créé, va
dans **Project Settings → Database** et récupère deux chaînes de connexion :
- **Connection pooling** (port 6543) → sera `DATABASE_URL`
- **Direct connection** (port 5432) → sera `DIRECT_URL`

### 2. Configure `.env` en local

```bash
cp .env.example .env
```

Renseigne `DATABASE_URL`, `DIRECT_URL`, puis génère un secret :

```bash
npx auth secret   # colle la valeur générée dans AUTH_SECRET
```

### 3. Applique le schéma et les données de démo

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

Tu peux maintenant explorer les données dans **Supabase → Table Editor**, ou
avec `npx prisma studio` (interface web locale pour voir/éditer les tables).

### 4. Déploie sur Netlify

1. Pousse le projet sur GitHub (Netlify se branche sur un repo Git, pas sur un zip).
2. Sur Netlify → **Add new site → Import from Git** → sélectionne le repo.
3. Netlify détecte Next.js automatiquement (build command `next build`).
4. Dans **Site settings → Environment variables**, ajoute :
   - `DATABASE_URL` (la version *pooled*, port 6543)
   - `DIRECT_URL` (port 5432)
   - `AUTH_SECRET`
   - `AUTH_URL` → l'URL de ton site Netlify, ex: `https://profy.netlify.app`
5. Redéploie (**Trigger deploy**).

Une fois en ligne, les inscriptions via `/register` et `/become-teacher`
seront persistées dans Supabase — visibles dans le Table Editor.

## Ce qui est construit (fondations)

- [x] Design system (tokens, composants UI réutilisables)
- [x] Homepage complète et responsive (hero, recherche, matières, "comment ça marche", profs populaires, CTA)
- [x] Authentification (inscription élève, inscription professeur, connexion, déconnexion, sessions JWT) — branchée sur PostgreSQL via Prisma
- [x] Protection des routes par rôle (`/dashboard`, `/teacher/dashboard`, `/admin`)
- [x] Recherche de professeurs avec filtres réels (`/teachers`, `/teachers/[ville]`, `/subjects`, `/subjects/[matiere]`, `/teacher/[id]`) — sur données de démonstration statiques pour l'instant
- [x] Schéma PostgreSQL complet (16 tables, relations, index anti-double-réservation)
- [x] Données de démonstration (villes, matières, niveaux, profs fictifs)

## Prochaines étapes (non incluses dans cette itération)

Recherche & filtres réels, profils professeur détaillés, calendrier de
disponibilités, réservation, messagerie, avis, paiements (D17/Flouci/IZI),
dashboard admin complet, notifications, SEO avancé.

## Structure du projet

```
src/
  app/                  routes (App Router)
  components/
    ui/                 composants de base (Button, Card, Input, Modal...)
    layout/              Navbar, Footer
    home/                sections de la homepage
    auth/                formulaires d'authentification
    dashboard/           coquille des dashboards protégés
    teachers/             carte professeur
  lib/
    prisma.ts            client Prisma (utilisé partout)
    validations.ts       schémas Zod partagés
    demo-data.ts         données fictives pour la recherche/homepage
  auth.ts / auth.config.ts   configuration NextAuth (edge-safe + complète)
  proxy.ts               protection de routes par rôle (ex-middleware)
prisma/
  schema.prisma          schéma PostgreSQL complet
  seed.ts                script de peuplement (réel, Prisma)
```
