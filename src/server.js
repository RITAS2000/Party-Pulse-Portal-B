import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import rateLimit from 'express-rate-limit';

const PORT = process.env.PORT;
export function setupServer() {
  const app = express();
  app.set('trust proxy', 1);

  // const frontendUrl = process.env.FRONTEND_URL;

  // app.use(
  //   cors({
  //     origin: frontendUrl,
  //     credentials: true,
  //   }),
  // );
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    }),
  );
  // app.use((req, res, next) => {
  //   const origin = req.headers.origin;
  //   if (!origin || origin !== frontendUrl) {
  //     return res.status(403).end();
  //   }
  //   next();
  // });
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });
  app.use(limiter);
  app.use(express.json());
  app.use('/party', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
