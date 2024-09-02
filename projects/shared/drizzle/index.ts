import mysql from "mysql2/promise";
// import {DrizzleMySQLAdapter} from "@lucia-auth/adapter-drizzle";
import {drizzle} from "drizzle-orm/mysql2";
import * as requirement from "@/projects/requirements/infrastructure/persistence/mysql/requirements.schema";

export const client = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "acosoDB",
    port: 3309,
    password: "secret"
});
export const db = drizzle(client, {
    schema: {
        ...requirement
    },
    mode: "default"
});
// export const adapter = new DrizzleMySQLAdapter(db);


// const adapter = new DrizzleMySQLAdapter(db, requirementDetailsTable, requirementTable);
