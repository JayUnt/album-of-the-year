import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('utils/prisma.ts', 'prisma', prisma)

export default prisma;