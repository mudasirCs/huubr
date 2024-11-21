# Huubr Business Directory

A comprehensive business directory platform built with Next.js, PostgreSQL, and Prisma.

## Setup Requirements

- Node.js 18+
- Docker & Docker Compose
- Git

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/huubr-directory.git
cd huubr-directory
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the database:
```bash
docker-compose up -d
```

5. Run migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

## Tech Stack

- Next.js 14
- TypeScript
- PostgreSQL
- Prisma
- Docker
- Tailwind CSS

## Project Structure

- `/prisma` - Database schema and migrations
- `/src/app` - Next.js application code
- `/docker-compose.yml` - Docker configuration

## Development

Make sure to run `npm run build` before pushing to ensure everything builds correctly.
