#!/bin/bash

# Simple database migration runner using psql
# Usage: ./scripts/migrate.sh

set -e

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    echo "Please set it in your .env file or export it:"
    echo "export DATABASE_URL=postgresql://user:password@localhost:5432/dbname"
    exit 1
fi

echo "Running database migrations..."
echo ""

# Run the migration file
psql "$DATABASE_URL" -f migrations/001_initial_schema.sql

echo ""
echo "✓ Migration completed successfully!"
