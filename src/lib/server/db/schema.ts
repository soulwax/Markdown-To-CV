import { bigint, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	age: integer('age'),
	username: text('username').notNull().unique(),
	passwordHash: text('password_hash').notNull()
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull()
});

export const inputDocument = pgTable('input_document', {
	id: uuid('id').defaultRandom().primaryKey(),
	markdown: text('markdown').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export const outputDocument = pgTable('output_document', {
	id: uuid('id').defaultRandom().primaryKey(),
	inputDocumentId: uuid('input_document_id')
		.notNull()
		.references(() => inputDocument.id, { onDelete: 'cascade' }),
	type: text('type').notNull(), // 'pdf' or 'docx'
	filePath: text('file_path').notNull(),
	fileName: text('file_name').notNull(),
	fileSize: bigint('file_size', { mode: 'number' }).notNull(), // Size in bytes
	createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;

export type InputDocument = typeof inputDocument.$inferSelect;

export type OutputDocument = typeof outputDocument.$inferSelect;
