import 'reflect-metadata';

import config from 'config';
import express from 'express';
import { PostController } from './controllers/post.controller';
import { registerControllers } from './lib/core/registerControllers';
import { ConfigEnum } from './lib/enum/config.enum';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
  });

  // Register controllers
  registerControllers(app, [PostController]);

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(`Error for route ${req.url}:`, err.stack);

      res.status(res.statusCode || 500).json({
        message: 'Something went wrong!',
        error:
          config.get<string>(ConfigEnum.NODE_ENV) === 'development'
            ? err.stack
            : undefined,
      });
    },
  );

  return app;
};
