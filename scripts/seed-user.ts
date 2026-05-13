import { Role } from '@/generated/prisma/enums';
import { db } from '@/lib/db';
import { hashPassword } from 'better-auth/crypto';
import 'dotenv/config';

type SeedUserInput = {
	name: string;
	email: string;
	password: string;
	role: Role;
	emailVerified: boolean;
	isVerified: boolean;
};

function parseRole(input: string | undefined): Role {
	if (!input) return Role.ADMIN;
	const normalized = input.toUpperCase();
	if (normalized in Role) return Role[normalized as keyof typeof Role];
	return Role.ADMIN;
}

function getSeedUserInput(): SeedUserInput {
	const name = process.env.SEED_USER_NAME || 'Seed Admin';
	const email = process.env.SEED_USER_EMAIL || 'admin@mero-uni.local';
	const password = process.env.SEED_USER_PASSWORD || 'admin1234';

	if (password.length < 8) {
		throw new Error('SEED_USER_PASSWORD must be at least 8 characters long');
	}

	return {
		name,
		email,
		password,
		role: parseRole(process.env.SEED_USER_ROLE),
		emailVerified:
			process.env.SEED_USER_EMAIL_VERIFIED === 'false' ? false : true,
		isVerified: process.env.SEED_USER_IS_VERIFIED === 'false' ? false : true
	};
}

async function main() {
	const payload = getSeedUserInput();
	const passwordHash = await hashPassword(payload.password);

	await db.$transaction(async (tx) => {
		const user = await tx.user.upsert({
			where: { email: payload.email },
			create: {
				name: payload.name,
				email: payload.email,
				role: payload.role,
				emailVerified: payload.emailVerified,
				isVerified: payload.isVerified
			},
			update: {
				name: payload.name,
				role: payload.role,
				emailVerified: payload.emailVerified,
				isVerified: payload.isVerified
			}
		});

		await tx.account.upsert({
			where: {
				providerId_accountId: {
					providerId: 'credential',
					accountId: user.id
				}
			},
			create: {
				userId: user.id,
				providerId: 'credential',
				accountId: user.id,
				password: passwordHash
			},
			update: {
				password: passwordHash
			}
		});
	});

	console.log('Seed user created or updated:', payload.email);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await db.$disconnect();
	});
