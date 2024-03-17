import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['warn', 'error'],
});

console.log('utils/prisma.ts', 'prisma', prisma)

export default prisma;