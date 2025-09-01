# Organisation des Composants

## Structure des dossiers

### `/components` - Composants réutilisables
- `common/` - Composants génériques (boutons, inputs, modals, etc.)
- `auth/` - Composants d'authentification (login, signup, etc.)
- `dashboard/` - Composants spécifiques au dashboard
- `account/` - Composants de gestion de compte utilisateur
- `candidates/` - Composants de gestion des candidats
- `layout/` - Composants de mise en page (sidebar, header, etc.)
- `navigation/` - Composants de navigation
- `form-steps/` - Composants de formulaires multi-étapes

## Conventions

### Naming Conventions
- **Composants** : PascalCase (`UserProfile.tsx`)
- **Fichiers utilitaires** : camelCase (`useAuth.ts`)
- **Dossiers** : kebab-case (`form-steps/`)

### Organisation par domaine
- **common/** : Composants réutilisables dans toute l'application
- **auth/** : Composants spécifiques à l'authentification
- **account/** : Composants de gestion du profil utilisateur
- **candidates/** : Composants de gestion des candidats
- **layout/** : Composants de structure de page
- **navigation/** : Composants de navigation

### Imports
- Utiliser des imports absolus avec `@/`
- Grouper les imports : React, Next.js, composants, utilitaires

## Exemples d'utilisation

### Import depuis common
```tsx
import { Button, Input, Modal } from '@/components/common'
```

### Import depuis un domaine spécifique
```tsx
import { LoginForm } from '@/components/auth'
import { UserProfile } from '@/components/account'
import { CandidateCard } from '@/components/candidates'
```

### Import direct
```tsx
import { Button } from '@/components/common/button'
import { LoginForm } from '@/components/auth/login-form'
``` 