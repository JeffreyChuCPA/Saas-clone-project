import { db } from "@/drizzle/db";
import { UserSubscriptionTable } from "@/drizzle/schema";

export function createUserSubscription(
  data: typeof UserSubscriptionTable.$inferInsert
) {
  return db.insert(UserSubscriptionTable).values(data).
  //if user already exists, then at that conflict do nothing
  onConflictDoNothing({
    target: UserSubscriptionTable.clerkUserId
  })
}
