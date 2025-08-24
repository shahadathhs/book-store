import 'reflect-metadata';
import { container } from 'tsyringe';
import { DatabaseClientPool } from './lib/db/DatabaseClientPool';
import { DatabaseClientToken } from './lib/db/IDatabaseClient';
import config from 'config';
import { ConfigEnum } from './lib/enum/config.enum';

export async function registerDependencies() {
  try {
    const databaseClient = new DatabaseClientPool({
      url: config.get<string>(ConfigEnum.DATABASE_URL),
      maxConnection: 10,
      idleTimeout: 10000,
      connectionTimeout: 10000,
      maxUses: 1000,
      ssl: false,
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
