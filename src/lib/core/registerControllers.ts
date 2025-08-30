import 'reflect-metadata';

import { Application, RequestHandler, Router } from 'express';
import { container } from 'tsyringe';
import {
  AUTH_ROLE_KEY,
  CONTROLLER_KEY,
  CONTROLLER_MIDDLEWARE_KEY,
  MIDDLEWARE_KEY,
  PUBLIC_KEY,
  ROUTE_KEY,
} from '../decorator/decorator.keys';
import { RouterDefinition } from '../decorator/router.decorator';
import {
  createAuthMiddleware,
  CreateAuthMiddlewareOptions,
} from '../middleware/auth.middleware';

type Constructor = new (...args: any[]) => {};

type ControllerMetadata = {
  basePath: string;
  routes: RouterDefinition[];
  middlewares: RequestHandler[];
};

export function registerControllers(
  app: Application,
  controllers: Constructor[],
  authOptions?: CreateAuthMiddlewareOptions,
) {
  controllers.forEach((Controller) => {
    const controllerInstance = container.resolve(Controller);

    const controllerMetadata: ControllerMetadata = {
      basePath: Reflect.getMetadata(CONTROLLER_KEY, Controller),
      routes:
        (Reflect.getMetadata(
          ROUTE_KEY,
          Controller.prototype,
        ) as RouterDefinition[]) || [],
      middlewares:
        (Reflect.getMetadata(
          CONTROLLER_MIDDLEWARE_KEY,
          Controller,
        ) as RequestHandler[]) || [],
    };

    if (!controllerMetadata.basePath) {
      throw new Error(
        `[registerControllers] Base path is not defined for controller ${Controller.name}`,
      );
    }

    if (!controllerMetadata.routes.length) {
      throw new Error(
        `[registerControllers] No routes defined for controller ${Controller.name}`,
      );
    }

    const router = Router();

    // Apply controller-level middlewares
    if (controllerMetadata.middlewares.length > 0) {
      router.use(controllerMetadata.middlewares);
      console.info(
        `[registerControllers] Controller middlewares applied for ${Controller.name}`,
      );
    }

    // Handle individual routes
    controllerMetadata.routes.forEach((route) => {
      // check if the method exist in the controller instance
      if (!(route.methodName in controllerInstance)) {
        throw new Error(
          `[registerControllers] Method ${route.methodName} is not defined in controller ${Controller.name}`,
        );
      }

      const methodMiddlewares =
        Reflect.getMetadata(
          MIDDLEWARE_KEY,
          Controller.prototype,
          route.methodName,
        ) || [];

      const handler = (controllerInstance as any)[route.methodName].bind(
        controllerInstance,
      );

      const fullMiddlewares: RequestHandler[] = [];

      // ---- AUTH HANDLING ----
      if (authOptions) {
        const isMethodPublic =
          Reflect.getMetadata(
            PUBLIC_KEY,
            Controller.prototype,
            route.methodName,
          ) === true;
        const isControllerPublic =
          Reflect.getMetadata(PUBLIC_KEY, Controller) === true;

        const methodRoles: string[] | undefined = Reflect.getMetadata(
          AUTH_ROLE_KEY,
          Controller.prototype,
          route.methodName,
        );
        const controllerRoles: string[] | undefined = Reflect.getMetadata(
          AUTH_ROLE_KEY,
          Controller,
        );

        const hasRoles = methodRoles || controllerRoles;

        if (!isMethodPublic && !isControllerPublic && hasRoles) {
          const authMw = createAuthMiddleware(
            Controller.prototype,
            route.methodName,
            authOptions,
          );
          fullMiddlewares.push(authMw);
        }
      }

      // method-level middlewares
      if (methodMiddlewares.length > 0) {
        fullMiddlewares.push(...methodMiddlewares);
      }

      // finally add handler
      (router as any)[route.method](route.path, ...fullMiddlewares, handler);
    });

    app.use(controllerMetadata.basePath, router);
  });
}
