import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    schema: './projects/requirements/infrastructure/persistence/mysql/requirements.schema.ts',
    out: './drizzle',
    dialect: 'mysql', // 'postgresql' | 'mysql' | 'sqlite'
    dbCredentials: {
        host: process.env.DB_HOST || '34.27.42.59',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'logistics_db',
        port: Number(process.env.DB_PORT) || 3306,
        password: process.env.DB_PASSWORD || 'onichan'
    },
});