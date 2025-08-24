import { createApp } from '@/app';
import config from 'config';
import http from 'http';
import { seedSuperAdmin } from './db/seed/super-admin.seed';
import { ConfigEnum } from './lib/enum/config.enum';
import { registerDependencies } from './registry';

const port = config.get<number>(ConfigEnum.PORT) || 3000;

let server: http.Server;

async function main() {
  try {
    // Register dependencies
    await registerDependencies();

    // Seed the  super admin
    const superAdmin = await seedSuperAdmin();
    console.log('Super admin Seeded with email:', superAdmin.email);

    // Start the server
    const app = createApp();

    server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the server', error);
    process.exit(1);
  }
}

main();
