// app.js'in işi uygulamayı kurmak: hangi middleware, hangi router, hangi sırayla olacağını belirlemek.
import express from "express";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware.js";
const app = express();

app.use(express.json());
app.use("/api/v1", apiRouter);

app.get("/health", (_req, res) => {
    return res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use(notFoundHandler);
app.use(errorHandler);



export default app;
