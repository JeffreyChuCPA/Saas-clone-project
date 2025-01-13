//db configuration

import { subscriptionTiers, TierNames } from "@/data/subscriptionTiers";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  real,
  text,
  primaryKey,
  timestamp,
  uuid,
  pgEnum
} from "drizzle-orm/pg-core";

//created these fields as variables as they are used in multiple tables
const createdAt = timestamp("created_at", { withTimezone: true })
  .notNull()
  .defaultNow();
const updatedAt = timestamp("updated_at", { withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

//defining the columns for the table called ProductTable
export const ProductTable = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull(),
    name: text("name").notNull(),
    url: text("url").notNull(),
    description: text("description"),
    createdAt,
    updatedAt
  },
  (table) => ({
    clerkUserIdIndex: index("products.clerk_user_id_index").on(
      table.clerkUserId
    )
  })
);

//1 product in producttable has 1 product in productcustomization table.
export const productRelations = relations(ProductTable, ({ one, many }) => ({
  productCustomization: one(ProductCustomizationTable),
  productViews: many(ProductViewTable),
  countryGroupDiscounts: many(CountryGroupDiscountTable)
}));

export const ProductCustomizationTable = pgTable("product_customizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  classPrefix: text("class_prefix"),
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductTable.id, { onDelete: "cascade" })
    .unique(),
  locationMessage: text("location_message")
    .notNull()
    .default(
      "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off."
    ),
  backgroundColor: text("background_color")
    .notNull()
    .default("hsl(193, 82%, 31%"),
  textColor: text("text_color").notNull().default("hsl(0, 0%, 100%)"),
  fontSize: text("font_size").notNull().default("1rem"),
  bannerContainer: text("banner_container").notNull().default("body"),
  isSticky: boolean("is_sticky").notNull().default(false),
  createdAt,
  updatedAt
});

//1 to 1 relationship. need to specify more because ProductCustomizationTable has product ID as foreign key from ProductTable
export const productCustomizationRelations = relations(
  ProductCustomizationTable,
  ({ one }) => ({
    product: one(ProductTable, {
      //foreign key defined here as productID in the ProductCustomizationTable
      fields: [ProductCustomizationTable.productId],
      //references to what field in other table as the relationship
      references: [ProductTable.id]
    })
  })
);

//Productviewing table to track what product is viewed and where it was visited from
export const ProductViewTable = pgTable("product_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => ProductTable.id, { onDelete: "cascade" }),
  countryId: uuid("country_id").references(() => CountryTable.id, {
    onDelete: "cascade"
  }),
  visitedAt: timestamp("visited_at", { withTimezone: true })
    .notNull()
    .defaultNow()
});

export const productViewRelations = relations(ProductViewTable, ({ one }) => ({
  product: one(ProductTable, {
    fields: [ProductViewTable.productId],
    references: [ProductTable.id]
  }),
  country: one(CountryTable, {
    fields: [ProductViewTable.countryId],
    references: [CountryTable.id]
  })
}));

//Country Table
export const CountryTable = pgTable("countries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  countryGroupId: uuid("country_group_id")
    .notNull()
    .references(() => CountryGroupTable.id, { onDelete: "cascade" }),
  createdAt,
  updatedAt
});

//country has a single country group, but many views
export const countryRelations = relations(CountryTable, ({ one, many }) => ({
  countryGroups: one(CountryGroupTable, {
    fields: [CountryTable.countryGroupId],
    references: [CountryGroupTable.id]
  }),
  productViews: many(ProductViewTable)
}));

//CountryGroupTable, be able to view all people in a discount group. Each country belongs to a discount group
export const CountryGroupTable = pgTable("country_groups", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  recommendedDiscountPercentage: real("recommended_discount_percentage"),
  createdAt,
  updatedAt
});

//each country can have many different country groups
export const countryGroupRelations = relations(
  CountryGroupTable,
  ({ many }) => ({
    countries: many(CountryTable),
    countryGroupDiscounts: many(CountryGroupDiscountTable)
  })
);

//discount table for individual group for individual product
export const CountryGroupDiscountTable = pgTable(
  "country_group_discounts",
  {
    countryGroupId: uuid("country_group_id")
      .notNull()
      .references(() => CountryGroupTable.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => ProductTable.id, { onDelete: "cascade" }),
    coupon: text("coupon").notNull(),
    discountPercentage: real("discount_percentage").notNull(),
    createdAt,
    updatedAt
  },
  (table) => ({
    //setting the primary key for this table to be countryGroupId and productId
    pk: primaryKey({ columns: [table.countryGroupId, table.productId] })
  })
);

export const countryGroupDiscountRelations = relations(
  CountryGroupDiscountTable,
  ({ one }) => ({
    product: one(ProductTable, {
      fields: [CountryGroupDiscountTable.productId],
      references: [ProductTable.id]
    }),
    countryGroup: one(CountryGroupTable, {
      fields: [CountryGroupDiscountTable.countryGroupId],
      references: [CountryGroupTable.id]
    })
  })
);

export const TierEnum = pgEnum(
  "tier",
  Object.keys(subscriptionTiers) as [TierNames]
);

export const UserSubscriptionTable = pgTable(
  "user_subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    stripeSubscriptionItemId: text("stripe_subscription_item_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    stripeCustomerId: text("stripe_customer_id"),
    tier: TierEnum("tier").notNull(),
    createdAt,
    updatedAt
  },
  (table) => ({
    clerkUserIdIndex: index("user_subscription.clerk_user_id_index").on(
      table.clerkUserId
    ),
    stripeCustomerIdIndex: index(
      "user_subscription.stripe_customer_id_index"
    ).on(table.stripeCustomerId)
  })
);
