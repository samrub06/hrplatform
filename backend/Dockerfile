# Builder
FROM node:18-alpine as builder

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires depuis le dossier backend
COPY backend/package*.json ./
COPY backend/tsconfig*.json ./
COPY backend/.sequelizerc ./

# Installation des dépendances
RUN npm ci

# Copie du code source du backend
COPY backend/ ./

# Construction du projet
RUN npm run build

# Image finale
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY backend/package*.json ./
COPY backend/.sequelizerc ./

# Installation des dépendances
RUN npm ci --only=production

# Copie des fichiers nécessaires
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/sequelize ./src/sequelize
COPY --from=builder /app/src/config ./src/config
COPY backend/start.sh /start.sh

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Script de démarrage
RUN chmod +x /start.sh

# Démarrage de l'application
CMD ["/start.sh"]