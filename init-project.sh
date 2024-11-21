#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Huubr Directory project initialization...${NC}"

# 1. Start Docker containers
echo -e "${BLUE}Starting Docker containers...${NC}"
docker-compose up -d
sleep 5 # Wait for PostgreSQL to start

# 2. Initialize Prisma
echo -e "${BLUE}Initializing Prisma...${NC}"
npx prisma generate
npx prisma migrate dev --name init

# 3. Verify setup
echo -e "${BLUE}Verifying setup...${NC}"
if docker ps | grep -q "huubr-postgres"; then
    echo -e "${GREEN}✓ PostgreSQL is running${NC}"
else
    echo "⨯ PostgreSQL is not running"
    exit 1
fi

# 4. Create prisma client
echo -e "${BLUE}Creating Prisma client...${NC}"
npx prisma generate

echo -e "${GREEN}✓ Project initialization completed!${NC}"
echo -e "${BLUE}You can now start the development server with:${NC}"
echo "npm run dev"