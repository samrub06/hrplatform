-- Créer l'utilisateur postgres s'il n'existe pas
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'postgres') THEN
        CREATE USER postgres WITH PASSWORD 'postgres';
    END IF;
END
$$;

-- Donner tous les droits
GRANT ALL PRIVILEGES ON DATABASE hrplatform TO postgres;

-- Se connecter à la base
\c hrplatform;

-- Donner tous les droits sur le schéma public
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;