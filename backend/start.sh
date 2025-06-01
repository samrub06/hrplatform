# start.sh
#!/bin/bash

# Attendre la base de données
echo "En attente de la base de données..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

# Vérifier si les migrations sont nécessaires
echo "Vérification des migrations..."
npx sequelize-cli db:migrate:status

# Exécuter les migrations
echo "Exécution des migrations..."
npx sequelize-cli db:migrate

# Démarrer l'application
echo "Démarrage de l'application..."
npm run start:prod