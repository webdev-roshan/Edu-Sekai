#!/bin/sh

if [ "$DATABASE" = "postgres" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $DB_HOST $DB_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Run migrations for tenants
echo "Running makemigrations"
python manage.py makemigrations

echo "Running migrate_schemas --shared"
python manage.py migrate_schemas --shared

exec "$@"
