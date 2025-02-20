import { Request, Response } from 'express';
import sql from '../database/db';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await sql`SELECT * FROM users`;
        res.json(users);
    } catch (error) {
        console.error('Error executing query:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
};

export const addUser = async (req: Request, res: Response) => {
    const { name, email, password, username } = req.body;
    try {
        const newUser = await sql`
            INSERT INTO users (name, email, password, username)
            VALUES (${name}, ${email}, ${password}, ${username})
            RETURNING *
        `;
        res.json(newUser);
    } catch (error) {
        console.error('Error executing query:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email } = req.body;
    try {
        const updatedUser = await sql`
            UPDATE users
            SET email = ${email}
            WHERE id = ${id}
            RETURNING *
        `;
        res.json(updatedUser);
    } catch (error) {
        console.error('Error executing query:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const deletedUser = await sql`
            DELETE FROM users
            WHERE id = ${id}
            RETURNING *
        `;
        res.json(deletedUser);
    } catch (error) {
        console.error('Error executing query:', error);
        const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
        res.status(500).json({ error: 'Internal Server Error', details: errorMessage });
    }
};