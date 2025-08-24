import { RequestHandler } from 'express';
import { ROUTE_KEY } from './decorator.keys';

export type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type RouterDefinition = {
	method: HTTPMethod;
	path: string;
	middlewares: RequestHandler[];
	methodName: string;
};

export function Route(
	method: HTTPMethod,
	path: string,
	middlewares: RequestHandler[]
) {
	return function (
		target: any,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor
	) {
		const routes: RouterDefinition[] =
			Reflect.getMetadata(ROUTE_KEY, target) || [];
		routes.push({
			method,
			path,
			middlewares,
			methodName: propertyKey.toString(),
		});
		Reflect.defineMetadata(ROUTE_KEY, routes, target);
		return descriptor;
	};
}

export const Get = (path: string, middlewares: RequestHandler[] = []) =>
	Route('get', path, middlewares);

export const Post = (path: string, middlewares: RequestHandler[] = []) =>
	Route('post', path, middlewares);

export const Put = (path: string, middlewares: RequestHandler[] = []) =>
	Route('put', path, middlewares);

export const Patch = (path: string, middlewares: RequestHandler[] = []) =>
	Route('patch', path, middlewares);

export const Delete = (path: string, middlewares: RequestHandler[] = []) =>
	Route('delete', path, middlewares);
