import 'reflect-metadata';

import dataSource from './app/configs/db/data-source';

async function bootstrap() {
  console.log('[booking-service] Starting database migration...');

  await dataSource.initialize();

  try {
    const migrations = await dataSource.runMigrations({
      transaction: 'all',
    });

    console.log(
      `[booking-service] Migration completed. Executed ${migrations.length} migration(s).`,
    );
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error('[booking-service] Migration failed:', error);
  process.exit(1);
});
