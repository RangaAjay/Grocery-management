export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    databaseType: process.env.DATABASE_TYPE ?? 'postgres',
    databaseHost: process.env.DATABASE_HOST ?? 'localhost',
    databasePort: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    databasePassword: process.env.DATABASE_PASSWORD ?? '',
    databaseUsername: process.env.DATABASE_USERNAME ?? 'postgres',
    databaseName: process.env.DATABASE_NAME ?? 'postgres',
  },
});
