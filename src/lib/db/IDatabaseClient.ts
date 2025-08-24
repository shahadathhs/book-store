import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schemas';

export type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

export const DatabaseClientToken = Symbol('DatabaseClientToken');

export interface IDatabaseClient {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	getClient(): DrizzleClient;
	isConnected(): boolean;
	executeQuery<T>(
		label: string,
		queryFn: (db: DrizzleClient) => Promise<T>
	): Promise<T>;
}

export type DatabaseConfig = {
	url: string;
	maxConnection?: number;
	idleTimeout?: number;
	connectionTimeout?: number;
	maxUses?: number;
	ssl?: boolean;
};
