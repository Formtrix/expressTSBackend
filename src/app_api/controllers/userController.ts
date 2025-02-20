import { Request, Response, RequestHandler } from "express";
import { createUser as createUserModel, validatePassword, generateJwt } from "../database/models/user";
import prisma from '../database/prisma';
import { Prisma } from '@prisma/client';

// Define type-safe select objects
const userSelect = {
    id: true,
    email: true,
    name: true,
    password: true, // Include password for JWT generation
    username: true // Include username
} satisfies Prisma.UserSelect;

type UserResponse = Prisma.UserGetPayload<{ select: typeof userSelect }>;

export const getUsers: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                username: true // Include username
            }
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const getUserById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                username: true // Include username in the response
            }
        });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const userData: Prisma.UserCreateInput & { username: string } = req.body;

    try {
        const user = await createUserModel(userData.email, userData.name, userData.password, userData.username);
        const safeUser: UserResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username, // Include username
            password: user.password // Include password for JWT generation
        };
        res.status(201).json(safeUser);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const loginUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const loginData: Prisma.UserWhereUniqueInput & { password: string } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: loginData.email },
            select: userSelect
        });

        if (!user) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        if (!loginData.email || !loginData.password) {
            res.status(400).json({ success: false, error: 'Email and password are required' });
            return;
        }
        const isValid = await validatePassword(loginData.email, loginData.password);

        if (!isValid) {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Ensure user includes password
        if (!user.password) {
            throw new Error('Password is missing for the user');
        }

        const token = generateJwt(user);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                username: user.username, // Include username in the response
                lastLoginAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error
                ? `Authentication failed: ${error.message}`
                : 'Internal server error'
        });
    }
};