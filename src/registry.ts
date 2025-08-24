import 'reflect-metadata';
import { container } from 'tsyringe';
import { DatabaseClientPool } from './lib/db/DatabaseClientPool';
import { DatabaseClientToken } from './lib/db/IDatabaseClient';

export async function registerDependencies() {
  try {
    const databaseClient = new DatabaseClientPool({
      url: process.env.DATABASE_URL!,
      maxConnection: 10,
      idleTimeout: 10000,
      connectionTimeout: 10000,
      maxUses: 1000,
      ssl: process.env.NODE_ENV === 'production',
    });

    container.register(DatabaseClientToken, {
      useValue: databaseClient,
    });

    await databaseClient.connect();
  } catch (error) {
    console.error('Failed to register dependencies', error);
    throw error;
  }
}
