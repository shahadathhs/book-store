import 'reflect-metadata';

import { CONTROLLER_KEY } from './decorator.keys';

export function Controller(basePath: string) {
	return function (target: any) {
		Reflect.defineMetadata(CONTROLLER_KEY, basePath, target);
	};
}
