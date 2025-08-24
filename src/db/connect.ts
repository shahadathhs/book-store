import { ConfigEnum } from '@/lib/enum/config.enum';
import config from 'config';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

const db = drizzle(config.get(ConfigEnum.DATABASE_URL) as string, { schema });

export default db;
