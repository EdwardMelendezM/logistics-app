import mysql from "mysql2/promise";
import {DrizzleMySQLAdapter} from "@lucia-auth/adapter-drizzle";
import {drizzle} from "drizzle-orm/mysql2";
import * as requirement from "@/projects/requirements/domain/requirements.schema";

const client = await mysql.createConnection({
    host: "host",
    user: "user",
    database: "database",
    ...
});
export const db = drizzle(client, {
    schema: {
        ...requirement
    }
});
// export const adapter = new DrizzleMySQLAdapter(db);


// const adapter = new DrizzleMySQLAdapter(db, requirementDetailsTable, requirementTable);
