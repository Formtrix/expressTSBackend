import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import env from "./lib/env";
import indexRouter from "./app_api/routes/index";
import usersRouter from "./app_api/routes/users";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(helmet());
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

export default app;