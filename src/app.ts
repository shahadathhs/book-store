import 'reflect-metadata';

import config from 'config';
import express from 'express';
import { container } from 'tsyringe';
import { AuthController } from './controllers/auth.controller';
import { PostController } from './controllers/post.controller';
import { registerControllers } from './lib/core/registerControllers';
import { ConfigEnum } from './lib/enum/config.enum';
import { UserService } from './services/user.service';

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

  // Root Route
  app.get('/', (_req, res) => {
    res.status(200).json({ message: 'Welcome!' });
  });

  // API Route
  app.get('/api', (_req, res) => {
    res.status(200).json({ message: 'This is the API endpoint!' });
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ message: 'OK' });
  });

  // Register controllers
  registerControllers(app, [AuthController, PostController], {
    jwtSecret: config.get<string>(ConfigEnum.JWT_SECRET),
    allowMissingRoles: true,
    getUserById: (id: string) => {
      const userService = container.resolve(UserService);
      return userService.getUserByIdRaw(id);
    },
  });

  // Error handling middleware
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(`Error for route ${req.method} ${req.url}:`, err);

      // If response was already started, delegate to Express
      if (res.headersSent) {
        return _next(err);
      }

      // If error has its own status code, use it, otherwise default to 500
      const status = err.statusCode || 500;

      res.status(status).json({
        message: err.message || 'Something went wrong!',
        error:
          config.get<string>(ConfigEnum.NODE_ENV) === 'development'
            ? err.stack
            : undefined,
      });
    },
  );

  return app;
};
