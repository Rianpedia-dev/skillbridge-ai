import {
    pgTable,
    text,
    timestamp,
    boolean,
    integer,
    real,
    pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================
// ENUMS
// ============================================================

export const userRoleEnum = pgEnum("user_role", ["customer", "freelancer", "admin"]);

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "accepted",
    "in_progress",
    "completed",
    "cancelled",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "unpaid",
    "escrow",
    "released",
    "refunded",
]);

export const balanceTransactionTypeEnum = pgEnum("balance_transaction_type", [
    "earning",
    "withdrawal",
    "refund",
]);

export const payoutStatusEnum = pgEnum("payout_status", [
    "pending",
    "processing",
    "completed",
    "failed",
]);

// ============================================================
// BETTER AUTH TABLES (managed by Better Auth)
// ============================================================

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    role: userRoleEnum("role").notNull().default("customer"),
    banned: boolean("banned").notNull().default(false),
    bannedReason: text("banned_reason"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

// ============================================================
// APP TABLES
// ============================================================

// --- Freelancer Profile ---
export const freelancerProfile = pgTable("freelancer_profile", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(), // e.g. "Senior Graphic Designer"
    bio: text("bio"),
    location: text("location"),
    skills: text("skills").array(), // ["Figma", "Photoshop", "Illustrator"]
    portfolioUrls: text("portfolio_urls").array(),
    hourlyRate: integer("hourly_rate"), // in IDR
    isAvailable: boolean("is_available").notNull().default(true),
    completedProjects: integer("completed_projects").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Service Category ---
export const serviceCategory = pgTable("service_category", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull().unique(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    icon: text("icon"), // icon name from lucide
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Service ---
export const service = pgTable("service", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    description: text("description").notNull(),
    price: integer("price").notNull(), // in IDR
    categoryId: text("category_id").references(() => serviceCategory.id),
    providerId: text("provider_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    isOnSite: boolean("is_on_site").notNull().default(false),
    location: text("location"),
    image: text("image"),
    rating: real("rating").default(0),
    reviewCount: integer("review_count").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Order ---
export const order = pgTable("order", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderNumber: text("order_number").notNull().unique(),
    serviceId: text("service_id")
        .notNull()
        .references(() => service.id),
    customerId: text("customer_id")
        .notNull()
        .references(() => user.id),
    freelancerId: text("freelancer_id")
        .notNull()
        .references(() => user.id),
    status: orderStatusEnum("status").notNull().default("pending"),
    paymentStatus: paymentStatusEnum("payment_status").notNull().default("unpaid"),
    totalPrice: integer("total_price").notNull(),
    requirements: text("requirements"), // project requirements from customer
    mayarTransactionId: text("mayar_transaction_id"), // Mayar payment transaction ID
    deliveryDate: timestamp("delivery_date"),
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Freelancer Balance ---
export const freelancerBalance = pgTable("freelancer_balance", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .unique()
        .references(() => user.id, { onDelete: "cascade" }),
    balance: integer("balance").notNull().default(0), // in IDR
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Balance Transaction ---
export const balanceTransaction = pgTable("balance_transaction", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    orderId: text("order_id").references(() => order.id),
    type: balanceTransactionTypeEnum("type").notNull(),
    amount: integer("amount").notNull(), // positive for earning, negative for withdrawal
    description: text("description"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Payout ---
export const payout = pgTable("payout", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    status: payoutStatusEnum("status").notNull().default("pending"),
    bankName: text("bank_name"),
    bankAccountNumber: text("bank_account_number"),
    bankAccountName: text("bank_account_name"),
    note: text("note"),
    processedAt: timestamp("processed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Review ---
export const review = pgTable("review", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    orderId: text("order_id")
        .notNull()
        .unique()
        .references(() => order.id),
    reviewerId: text("reviewer_id")
        .notNull()
        .references(() => user.id),
    freelancerId: text("freelancer_id")
        .notNull()
        .references(() => user.id),
    rating: integer("rating").notNull(), // 1-5
    comment: text("comment"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Chat Room ---
export const chatRoom = pgTable("chat_room", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    participantOneId: text("participant_one_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    participantTwoId: text("participant_two_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// --- Chat Message ---
export const chatMessage = pgTable("chat_message", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    roomId: text("room_id")
        .notNull()
        .references(() => chatRoom.id, { onDelete: "cascade" }),
    senderId: text("sender_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

// --- Site Settings ---
export const siteSettings = pgTable("site_settings", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    key: text("key").notNull().unique(), // e.g. "hero_image_1"
    value: text("value").notNull(), // URL or JSON data
    label: text("label"), // human-readable label
    type: text("type").notNull().default("text"), // "image", "text", etc.
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// RELATIONS
// ============================================================

export const userRelations = relations(user, ({ one, many }) => ({
    freelancerProfile: one(freelancerProfile, {
        fields: [user.id],
        references: [freelancerProfile.userId],
    }),
    services: many(service),
    ordersAsCustomer: many(order, { relationName: "customer" }),
    ordersAsFreelancer: many(order, { relationName: "freelancer" }),
    reviewsWritten: many(review, { relationName: "reviewer" }),
    reviewsReceived: many(review, { relationName: "reviewedFreelancer" }),
    sessions: many(session),
    accounts: many(account),
    balance: one(freelancerBalance, {
        fields: [user.id],
        references: [freelancerBalance.userId],
    }),
    balanceTransactions: many(balanceTransaction),
    payouts: many(payout),
    chatRoomsOne: many(chatRoom, { relationName: "participantOne" }),
    chatRoomsTwo: many(chatRoom, { relationName: "participantTwo" }),
    sentMessages: many(chatMessage),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const freelancerProfileRelations = relations(freelancerProfile, ({ one }) => ({
    user: one(user, {
        fields: [freelancerProfile.userId],
        references: [user.id],
    }),
}));

export const serviceCategoryRelations = relations(serviceCategory, ({ many }) => ({
    services: many(service),
}));

export const serviceRelations = relations(service, ({ one, many }) => ({
    category: one(serviceCategory, {
        fields: [service.categoryId],
        references: [serviceCategory.id],
    }),
    provider: one(user, {
        fields: [service.providerId],
        references: [user.id],
    }),
    orders: many(order),
}));

export const orderRelations = relations(order, ({ one }) => ({
    service: one(service, {
        fields: [order.serviceId],
        references: [service.id],
    }),
    customer: one(user, {
        fields: [order.customerId],
        references: [user.id],
        relationName: "customer",
    }),
    freelancer: one(user, {
        fields: [order.freelancerId],
        references: [user.id],
        relationName: "freelancer",
    }),
    review: one(review),
}));

export const reviewRelations = relations(review, ({ one }) => ({
    order: one(order, {
        fields: [review.orderId],
        references: [order.id],
    }),
    reviewer: one(user, {
        fields: [review.reviewerId],
        references: [user.id],
        relationName: "reviewer",
    }),
    freelancer: one(user, {
        fields: [review.freelancerId],
        references: [user.id],
        relationName: "reviewedFreelancer",
    }),
}));

export const freelancerBalanceRelations = relations(freelancerBalance, ({ one }) => ({
    user: one(user, {
        fields: [freelancerBalance.userId],
        references: [user.id],
    }),
}));

export const balanceTransactionRelations = relations(balanceTransaction, ({ one }) => ({
    user: one(user, {
        fields: [balanceTransaction.userId],
        references: [user.id],
    }),
    order: one(order, {
        fields: [balanceTransaction.orderId],
        references: [order.id],
    }),
}));

export const payoutRelations = relations(payout, ({ one }) => ({
    user: one(user, {
        fields: [payout.userId],
        references: [user.id],
    }),
}));

export const chatRoomRelations = relations(chatRoom, ({ one, many }) => ({
    participantOne: one(user, {
        fields: [chatRoom.participantOneId],
        references: [user.id],
        relationName: "participantOne",
    }),
    participantTwo: one(user, {
        fields: [chatRoom.participantTwoId],
        references: [user.id],
        relationName: "participantTwo",
    }),
    messages: many(chatMessage),
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
    room: one(chatRoom, {
        fields: [chatMessage.roomId],
        references: [chatRoom.id],
    }),
    sender: one(user, {
        fields: [chatMessage.senderId],
        references: [user.id],
    }),
}));
