This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


********************************Startup instructions**********************************************

First, make sure you have PostgreSQL running using Docker. Your docker-compose.yml is already configured:

bashCopy# Start PostgreSQL container
docker-compose up -d

Install dependencies (I can see you're using npm from your package.json):

bashCopy
npm install

Set up your environment variables. Create a .env file in your project root:

envCopy# Database
DATABASE_URL="postgresql://huubr_user:huubr_password@localhost:5432/huubr_db"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate a random string

# Only needed when implementing social login
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# FACEBOOK_APP_ID=""
# FACEBOOK_APP_SECRET=""
# APPLE_ID=""
# APPLE_SECRET=""

Run Prisma migrations to set up your database:

bashCopynpx prisma generate
npx prisma migrate dev

Start the development server:

bashCopynpm run dev
The application should now be running at http://localhost:3000.
To verify everything is working:

Check if PostgreSQL is running:

bashCopydocker ps
You should see the huubr-postgres container running.

Check Prisma Studio to view/edit your database:

bashCopy
npx prisma studio
This will open a database UI at http://localhost:5555.
Common issues and solutions:

If Docker container fails to start:

bashCopy# Stop the container
docker-compose down

# Remove the volume
docker volume rm huubr_postgres_data

# Start again
docker-compose up -d

If Prisma migration fails:

bashCopy# Reset the database
npx prisma migrate reset

# Run migrations again
npx prisma migrate dev

If dependencies cause issues:

bashCopy# Remove node_modules and reinstall
rm -rf node_modules
npm install
The project structure should look like this:
Huubr/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── package.json
├── docker-compose.yml
└── ...