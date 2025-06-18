// /src/db/schema.ts
import { pgTable, text, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";

// Define an enum for the message role (user or model)
export const messageRoleEnum = pgEnum("message_role", ["user", "model"]);

export const c5chatSession = pgTable("c5chat_session", {
  id: text("id").primaryKey(), // This will store your client-generated sessionId
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // You might want to add a foreign key to your 'user' table if you integrate user accounts
  // userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
});

export const c5chatMessage = pgTable("c5chat_message", {
  id: serial("id").primaryKey(), // Auto-incrementing primary key for individual messages
  sessionId: text("session_id")
    .notNull()
    .references(() => c5chatSession.id, { onDelete: "cascade" }), // Link to the chat session
  role: messageRoleEnum("role").notNull(), // 'user' or 'model'
  content: text("content").notNull(), // The actual message text
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const schema = {
  c5chatSession,
  c5chatMessage,
  messageRoleEnum, // Export the enum as well if you need it elsewhere
};
