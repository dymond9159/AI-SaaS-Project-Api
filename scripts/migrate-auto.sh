
#!/bin/bash

# Get the migration name from command line argument
MIGRATION_NAME=$1

if [ -z "$MIGRATION_NAME" ]; then
  echo "Please provide a migration name"
  exit 1
fi

# Run Prisma commands
prisma migrate dev --name $MIGRATION_NAME
