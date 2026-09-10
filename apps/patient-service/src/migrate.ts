import dataSource from './app/configs/db/data-source';

async function bootstrap() {
  await dataSource.initialize();

  try {
    await dataSource.runMigrations();
    console.log('Patient service migrations executed successfully.');
  } finally {
    await dataSource.destroy();
  }
}

bootstrap().catch((error) => {
  console.error('Patient service migration failed:', error);
  process.exit(1);
});
