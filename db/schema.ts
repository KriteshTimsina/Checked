import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const entries = sqliteTable('entries', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  completed: integer({ mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  project_id: integer('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
});

export const userPreferences = sqliteTable('user_preferences', {
  id: integer().primaryKey({ autoIncrement: true }),
  app_theme_id: integer().notNull(),
  app_theme_mode: text({ enum: ['dark', 'light'] })
    .default('dark')
    .notNull(),
});

export type IProject = typeof projects.$inferSelect;
export type IEntry = typeof entries.$inferSelect;
export type IUserPreferences = typeof userPreferences.$inferSelect;
