import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
    res.json({ message: "Get user" });
};

export const createUser = (req: Request, res: Response) => {
    res.json({ message: "Create user" });
};