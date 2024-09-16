import express from "express";
import {errorMiddleware} from "../middleware/error-middleware.js";
import {publicRouter} from "../route/public-api.js";
import {userRouter} from "../route/api.js";

export const web = express();

web.use(express.json());
web.use(express.urlencoded({ extended: true }));

web.use(userRouter)
web.use(publicRouter)

web.use(errorMiddleware);
