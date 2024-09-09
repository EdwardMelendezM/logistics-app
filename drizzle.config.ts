import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './projects/requirements/infrastructure/persistence/mysql/requirements.schema.ts',
    out: './drizzle',
    dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        host: "localhost",
        user: "root",
        database: "logistics_db",
        port: 3309,
        password: "secret"
    },
});
