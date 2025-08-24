import 'reflect-metadata';

import express from 'express';
import authRouter from '@/routers/auth.routes';
import genreRouter from '@/routers/genre.routes';
import publisherRouter from '@/routers/publishers.routes';
import userRouter from '@/routers/user.routes';
import bookRouter from '@/routers/book.routes';
import { registerControllers } from './lib/core/registerControllers';
import { PostController } from './controllers/post.controller';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());

  // Register routes
  app.use('/api/auth', authRouter);
  app.use('/api/genres', genreRouter);
  app.use('/api/publishers', publisherRouter);
  app.use('/api/users', userRouter);
  app.use('/api/books', bookRouter);

  registerControllers(app, [PostController]);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      console.error(err.stack);
      res.status(500).json({ message: 'Something went wrong!' });
    },
  );

  return app;
};
