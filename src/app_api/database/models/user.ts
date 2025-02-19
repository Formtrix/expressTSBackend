import { PrismaClient, Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createUser = async (email: string, name: string, password: string, username: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
            username // Include username
        }
    });
};

export const validatePassword = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: { email },
        select: { password: true }
    });

    if (!user || !user.password) {
        return false;
    }

    return bcrypt.compare(password, user.password);
};


export const generateJwt = (user: Prisma.UserGetPayload<{ select: { id: true; email: true; name: true; password: true; username: true } }>) => {
    const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username // Include username
    };

    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};