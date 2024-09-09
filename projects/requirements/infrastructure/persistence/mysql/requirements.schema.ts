import {varchar, timestamp, mysqlTable, int} from "drizzle-orm/mysql-core";
import {sql} from "drizzle-orm";

export const requirementTable = mysqlTable("requirements", {
    id: varchar("id", {length: 36}).primaryKey(),
    description: varchar("description", {length: 255}).notNull(),
    status: varchar("status", {length: 255}).notNull(),
    priority: varchar("priority", {length: 255}).notNull(),
    // created_by: varchar("created_by", {length: 255}).notNull(),
    created_at: timestamp("created_at", {mode: "string"}).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp("updated_at", {mode: "string"}).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    deleted_at: timestamp("deleted_at", {mode: "string"})
});

export const requirementDetailsTable = mysqlTable("requirement_details", {
    id: varchar("id", {length: 36}).primaryKey(),
    requirement_id: varchar("requirement_id", {length: 36})
        .references(() => requirementTable.id)
        .notNull(),
    description: varchar("description", {length: 255}).notNull(),
    quantity: int("quantity").notNull(),
    created_at: timestamp("created_at", {mode: "string"}).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp("updated_at", {mode: "string"}).$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    deleted_at: timestamp("deleted_at", {mode: "string"})
});
