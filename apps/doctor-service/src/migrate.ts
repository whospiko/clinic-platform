import 'reflect-metadata';

import AppDataSource from './app/configs/db/data-source';

async function migrate(): Promise<void> {
  try {
    console.log('[doctor-service] Initializing database connection...');

    await AppDataSource.initialize();

    console.log('[doctor-service] Running migrations...');

    const migrations = await AppDataSource.runMigrations({
      transaction: 'all',
    });

    if (migrations.length === 0) {
      console.log('[doctor-service] No pending migrations.');
    } else {
      console.log(
        `[doctor-service] Applied ${migrations.length} migration(s):`,
      );

      for (const migration of migrations) {
        console.log(` - ${migration.name}`);
      }
    }

    await AppDataSource.destroy();

    console.log('[doctor-service] Migration completed successfully.');

    process.exit(0);
  } catch (error) {
    console.error('[doctor-service] Migration failed:', error);

    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }

    process.exit(1);
  }
}

void migrate();