import 'reflect-metadata';

import config from 'config';
import { container } from 'tsyringe';
import { DatabaseClientPool } from './lib/db/DatabaseClientPool';
import { DatabaseClientToken } from './lib/db/IDatabaseClient';
import { ConfigEnum } from './lib/enum/config.enum';

export async function registerDependencies() {
  try {
    const databaseClient = new DatabaseClientPool({
      url: config.get<string>(ConfigEnum.DATABASE_URL),
      maxConnection: 10,
      idleTimeout: 10000,
      connectionTimeout: 10000,
      maxUses: 1000,
      ssl:
        config.get<string>(ConfigEnum.NODE_ENV) === 'localhost' ? false : true,
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
