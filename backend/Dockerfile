# Builder
FROM node:18-alpine as builder

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY tsconfig*.json ./
COPY .sequelizerc ./

# Installation des dépendances
RUN npm ci

# Copie du code source
COPY . .

# Construction du projet
RUN npm run build

# Image finale
FROM node:18-alpine

# Dossier de travail
WORKDIR /app

# Copie des fichiers nécessaires
COPY package*.json ./
COPY .sequelizerc ./

# Installation des dépendances
RUN npm ci --only=production

# Copie des fichiers nécessaires
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/sequelize ./src/sequelize
COPY --from=builder /app/src/config ./src/config
COPY start.sh /start.sh

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Exposition du port
EXPOSE 3000

# Script de démarrage
RUN chmod +x /start.sh

# Démarrage de l'application
CMD ["/start.sh"]