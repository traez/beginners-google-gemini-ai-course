import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sql, eq } from "drizzle-orm";
import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

config({ path: ".env" });

export const c5MigrationHistory = pgTable("c5MigrationHistory", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  checksum: varchar("checksum", { length: 64 }).notNull(),
  executed_at: timestamp("executed_at").defaultNow().notNull(),
});

async function ensureMigrationHistoryTable(db: PostgresJsDatabase) {
  console.log("Checking for c5MigrationHistory table...");
  const tableExists = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 
      FROM information_schema.tables 
      WHERE table_name = 'c5MigrationHistory'
    );
  `);

  if (!tableExists[0].exists) {
    console.log("Creating c5MigrationHistory table...");
    await db.execute(sql`
      CREATE TABLE "c5MigrationHistory" (
        id SERIAL PRIMARY KEY,
        name VARCHAR(256) NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);
    console.log("c5MigrationHistory table created successfully.");
  } else {
    console.log("c5MigrationHistory table already exists.");
  }
}

async function logMigrationToHistory(
  db: PostgresJsDatabase,
  migrationName: string
) {
  const migrationFilePath = path.join("./supabase/migrations", migrationName);

  // Skip if it's not a file or not an SQL file
  if (
    !fs.statSync(migrationFilePath).isFile() ||
    !migrationName.endsWith(".sql")
  ) {
    console.log(`Skipping non-SQL file or directory: ${migrationName}`);
    return;
  }

  const migrationContent = fs.readFileSync(migrationFilePath, "utf-8");
  const checksum = crypto
    .createHash("sha256")
    .update(migrationContent)
    .digest("hex");

  // Check if the migration is already logged
  const existingMigration = await db
    .select()
    .from(c5MigrationHistory)
    .where(eq(c5MigrationHistory.name, migrationName))
    .execute();

  if (existingMigration.length === 0) {
    console.log(`Logging migration ${migrationName} to c5MigrationHistory...`);
    await db
      .insert(c5MigrationHistory)
      .values({ name: migrationName, checksum })
      .execute();
    console.log(`Migration ${migrationName} logged successfully.`);
  } else {
    console.log(`Migration ${migrationName} already logged.`);
  }
}

export async function runMigrations() {
  try {
    console.log("Starting migration process...");
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log("Connecting to database...");
    const migrationClient = postgres(connectionString, { max: 1 });
    const db = drizzle(migrationClient);

    await ensureMigrationHistoryTable(db);

    console.log("Running migrations...");
    await migrate(db, {
      migrationsFolder: "./supabase/migrations",
    });

    // Log each migration to c5MigrationHistory
    const migrationFiles = fs.readdirSync("./supabase/migrations");
    for (const migrationFile of migrationFiles) {
      await logMigrationToHistory(db, migrationFile);
    }

    console.log("Migrations completed successfully");
    await migrationClient.end();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run migrations
runMigrations()
  .then(() => {
    console.log("Migration script completed.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error in migration script:", error);
    process.exit(1);
  });
