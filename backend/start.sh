#!/bin/sh

echo "En attente de la base de données..."
sleep 10

echo "Vérification des migrations..."
npx sequelize-cli db:migrate

echo "Démarrage de l'application..."
npm run start:prod 