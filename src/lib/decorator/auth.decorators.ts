import 'reflect-metadata';

import { UserRole } from '@/db/schemas';
import { AUTH_ROLE_KEY, PUBLIC_KEY } from './decorator.keys';

// * Can be applied on class or method
export function Roles(...roles: UserRole[]) {
  return function (target: any, propertyKey?: string | symbol) {
    if (propertyKey) {
      Reflect.defineMetadata(AUTH_ROLE_KEY, roles, target, propertyKey);
    } else {
      Reflect.defineMetadata(AUTH_ROLE_KEY, roles, target);
    }
  };
}

// * Mark route (or whole controller) public — disables auth even when controller has Roles
export function Public() {
  return function (target: any, propertyKey?: string | symbol) {
    if (propertyKey) {
      Reflect.defineMetadata(PUBLIC_KEY, true, target, propertyKey);
    } else {
      Reflect.defineMetadata(PUBLIC_KEY, true, target);
    }
  };
}
