import 'dotenv/config'; // <--- This loads your .env file
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Point to your schema file
  schema: 'prisma/schema.prisma',
  // Define the connection URL here
  datasource: {
    url: env('DATABASE_URL'),
  },
});