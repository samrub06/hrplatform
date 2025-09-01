# Organisation des Utilitaires

## Structure des dossiers

### `/lib` - Utilitaires et services
- `types.ts` - Types TypeScript globaux
- `utils.ts` - Fonctions utilitaires générales
- `backendFetch.ts` - Configuration des appels API
- `auth/` - Services d'authentification
- `services/` - Services métier
- `hooks/` - Hooks personnalisés
- `validations/` - Schémas de validation Zod
- `stores/` - Stores Zustand
- `dal/` - Data Access Layer
- `core/` - Fonctionnalités de base
- `forms/` - Utilitaires pour les formulaires

## Conventions

### Naming Conventions
- **Fichiers** : camelCase (`useAuth.ts`, `backendFetch.ts`)
- **Types** : PascalCase (`UserData`, `ActionResult`)
- **Fonctions** : camelCase (`getUserData`, `updateProfile`)
- **Constantes** : UPPER_SNAKE_CASE (`API_BASE_URL`)

### Organisation par fonctionnalité
- **auth/** : Services d'authentification et gestion des sessions
- **services/** : Services métier (API calls, business logic)
- **hooks/** : Hooks React personnalisés
- **validations/** : Schémas de validation Zod
- **stores/** : Stores Zustand pour la gestion d'état
- **dal/** : Data Access Layer (couche d'accès aux données)

### Imports
- Utiliser des imports absolus avec `@/`
- Grouper les imports par type : React, Next.js, utilitaires, types

## Exemples d'utilisation

### Import de types
```tsx
import { UserData, Candidate } from '@/lib/types'
```

### Import de services
```tsx
import { AuthDAL } from '@/lib/dal/auth'
import { backendFetch } from '@/lib/backendFetch'
```

### Import de hooks
```tsx
import { useAuth } from '@/lib/hooks/useAuth'
import { usePermissions } from '@/lib/hooks/usePermissions'
```

### Import de validations
```tsx
import { userSchema } from '@/lib/validations/user'
import { loginSchema } from '@/lib/validations/auth'
```

### Import de stores
```tsx
import { useFormCacheStore } from '@/lib/stores/form-cache-store'
``` 