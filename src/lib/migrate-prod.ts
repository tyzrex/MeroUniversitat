import 'dotenv/config';

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const adapterProd = new PrismaPg({
	connectionString: process.env.DATABASE_URL_PROD!
});

export const dbProd = new PrismaClient({
	adapter: adapterProd,
	log: ['error']
});

export async function migrateProd() {
	await dbProd.$executeRaw`PRISMA MIGRATE DEPLOY`;
}
