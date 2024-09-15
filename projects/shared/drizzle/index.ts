import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as requirement from "@/projects/requirements/infrastructure/persistence/mysql/requirements.schema";

import dotenv from 'dotenv';

dotenv.config();

export const client = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    database: process.env.DB_NAME || 'logistics_db',
    port: Number(process.env.DB_PORT) || 3309,
    password: process.env.DB_PASSWORD || 'secret'
});
export const db = drizzle(client, {
    schema: {
        ...requirement
    },
    mode: "default"
});
// export const adapter = new DrizzleMySQLAdapter(db);


// const adapter = new DrizzleMySQLAdapter(db, requirementDetailsTable, requirementTable);
