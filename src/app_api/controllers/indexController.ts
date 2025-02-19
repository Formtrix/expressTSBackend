import { Request, Response } from "express";

export const getHome = (req: Request, res: Response) => {
    res.json({ message: "Welcome to the Home Page" });
};

export const getData = (req: Request, res: Response) => {
    res.json({ message: "Hello from the Express as a backend API" });
};