import { Router } from "express";
import { check, validationResult } from "express-validator";
import { getUsers, getUserById, createUser, loginUser } from "../controllers/userController";
import { Request, Response, NextFunction } from "express";
import { Prisma } from '@prisma/client';

const router = Router();
interface UserRequest extends Request {
    body: Prisma.UserCreateInput & { username: string };
}

router.post(
    "/register",
    [
        check("email").isEmail().withMessage("Enter a valid email"),
        check("name").not().isEmpty().withMessage("Name is required"),
        check("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
        check("username").not().isEmpty().withMessage("User Name is required")
    ],
    (req: UserRequest, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    },
    createUser
);

interface LoginRequest extends Request {
    body: Pick<Prisma.UserCreateInput, 'email' | 'password'>;
}

router.post(
    "/login",
    [
        check("email")
            .isEmail()
            .withMessage("Enter a valid email")
            .normalizeEmail(),
        check("password")
            .not()
            .isEmpty()
            .withMessage("Password is required")
            .trim()
            .isLength({ min: 6 })
            .withMessage("Password must be at least 6 characters long")
    ],
    (req: LoginRequest, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }
        next();
    },
    loginUser
);

router.get("/", getUsers);

router.get("/:id", getUserById);

export default router;