import 'reflect-metadata';

import { UserRole } from '@/db/schemas';
import Express, { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_ROLE_KEY, PUBLIC_KEY } from '../decorator/decorator.keys';
import { errorResponse } from '../utils/response.util';

export interface AuthRequest extends Express.Request {
  user?: any;
  token?: string;
}

export type CreateAuthMiddlewareOptions<TUser = any> = {
  // function to resolve a user from an id extracted from the JWT
  getUserById: (id: string) => Promise<TUser | null>;

  // JWT secret
  jwtSecret: string;

  // whether to allow missing roles
  allowMissingRoles: boolean;
};

const tokenExtractor = (req: AuthRequest) => {
  const auth = (req.headers?.authorization as string | undefined) || '';
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme.toLowerCase() !== 'Bearer' || !token) return null;
  return token;
};

/**
 * Creates a middleware bound to a specific controller prototype + method name.
 * This allows the middleware to check Reflect metadata (class & method) at runtime
 * and therefore support overriding (method-level Roles/Public) over controller-level Roles.
 */
export function createAuthMiddleware<TUser = any>(
  controllerPrototype: any, // controller.prototype
  methodName: string,
  options: CreateAuthMiddlewareOptions<TUser>,
): RequestHandler {
  const { jwtSecret, getUserById, allowMissingRoles = false } = options;

  return async function authMiddleware(req: AuthRequest, res, next) {
    try {
      // If route or controller is public, skip auth
      const isMethodPublic =
        Reflect.getMetadata(PUBLIC_KEY, controllerPrototype, methodName) ===
        true;
      const isControllerPublic =
        Reflect.getMetadata(PUBLIC_KEY, controllerPrototype.constructor) ===
        true;

      if (isMethodPublic || isControllerPublic) {
        return next();
      }

      // Determine required roles: method-level overrides controller-level
      const methodRoles: UserRole[] | undefined = Reflect.getMetadata(
        AUTH_ROLE_KEY,
        controllerPrototype,
        methodName,
      );
      const controllerRoles: UserRole[] | undefined = Reflect.getMetadata(
        AUTH_ROLE_KEY,
        controllerPrototype.constructor,
      );

      const requiredRoles = methodRoles ?? controllerRoles ?? null;

      // If there are no required roles and allowMissingRoles is true -> skip auth
      if (!requiredRoles && allowMissingRoles) {
        return next();
      }

      // Extract token
      const token = tokenExtractor(req);
      if (!token) {
        return res
          .status(401)
          .json(
            errorResponse(
              new Error('Unauthorized: missing token'),
              'Unauthorized',
            ),
          );
      }
      req.token = token;

      // verify JWT
      let payload: any;
      try {
        payload = jwt.verify(token, jwtSecret);
      } catch (err) {
        return res
          .status(401)
          .json(errorResponse(err, 'Invalid or expired token'));
      }

      // Expect payload to include user id. Adjust key (`sub`/`id`) to your token shape.
      const userId = (payload.sub ?? payload.id ?? payload.userId) as
        | string
        | undefined;
      if (!userId) {
        return res
          .status(401)
          .json(
            errorResponse(new Error('Token missing user id'), 'Unauthorized'),
          );
      }

      // fetch user with provided function
      const user = (await getUserById(userId)) as any;
      if (!user) {
        return res
          .status(401)
          .json(errorResponse(new Error('User not found'), 'Unauthorized'));
      }

      // attach user to request
      req.user = user;

      // if roles specified, check
      if (requiredRoles && requiredRoles.length > 0) {
        if (!requiredRoles.includes(user?.role as UserRole)) {
          return res
            .status(403)
            .json(errorResponse(new Error('Forbidden'), 'Insufficient role'));
        }
      }

      return next();
    } catch (err) {
      // fallback handler
      return res.status(500).json(errorResponse(err, 'Auth middleware error'));
    }
  };
}
