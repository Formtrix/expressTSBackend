import cors from "cors";
import express from "express";
import morgan from "morgan";
import env from "./lib/env";
import indexRouter from "./app_api/routes/index";
import usersRouter from "./app_api/routes/users";
import sqlRouter from './app_api/routes/sql'; // Import the sql route

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: env.APP_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use('/sql', sqlRouter); // Register the sql route

export default app;