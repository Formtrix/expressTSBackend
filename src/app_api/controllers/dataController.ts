import { Request, Response } from "express";

export const getData = (req: Request, res: Response) => {
    res.json({ message: "Hello from the Express as a backend API" });
};