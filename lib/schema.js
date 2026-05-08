// Drizzle schema for the Shanky storefront. Five tables map 1:1 to the
// previous data/*.json files. Run scripts/schema.sql in Supabase once to
// bootstrap, then scripts/migrate-from-json.js to seed existing local data.

import {
  pgTable,
  text,
  integer,
  bigint,
  boolean,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core'

export const products = pgTable('products', {
  slug: text('slug').primaryKey(),
  name: text('name').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  category: text('category').notNull(),
  gender: text('gender').notNull().default('Men'),
  badge: text('badge'),
  colors: jsonb('colors').$type().notNull().default([]),
  sizes: jsonb('sizes').$type().notNull().default([]),
  material: text('material').notNull().default(''),
  care: text('care').notNull().default(''),
  description: text('description').notNull().default(''),
  images: jsonb('images').$type().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const addresses = pgTable('addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fullName: text('full_name').notNull().default(''),
  phone: text('phone').notNull().default(''),
  address: text('address').notNull().default(''),
  address2: text('address2').notNull().default(''),
  city: text('city').notNull().default(''),
  state: text('state').notNull().default(''),
  pincode: text('pincode').notNull().default(''),
  label: text('label').notNull().default('Home'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
})

export const orders = pgTable('orders', {
  orderId: text('order_id').primaryKey(),
  email: text('email').notNull(),
  items: jsonb('items').$type().notNull(),
  address: jsonb('address').$type().notNull(),
  payment: text('payment').notNull().default('Online'),
  totals: jsonb('totals').$type().notNull(),
  etaText: text('eta_text').notNull().default(''),
  status: text('status').notNull().default('placed'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }),
})

export const coupons = pgTable('coupons', {
  code: text('code').primaryKey(),
  percent: integer('percent').notNull(),
  description: text('description').notNull().default(''),
  active: boolean('active').notNull().default(true),
  minSubtotal: integer('min_subtotal').notNull().default(0),
})

export const theme = pgTable('theme', {
  id: integer('id').primaryKey().default(1),
  cream: text('cream').notNull(),
  cream2: text('cream2').notNull(),
  black: text('black').notNull(),
  rust: text('rust').notNull(),
  rustLight: text('rust_light').notNull(),
  sand: text('sand').notNull(),
  muted: text('muted').notNull(),
})
