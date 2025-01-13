import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export function deleteUser(clerkUserId: string) {
  //when deleting user, batch delete the user and the products associated with user
  //we set up cascades in schema so that all other tables with a related foreign key with producttable and usersubscriptiontable would also delete any associated row items
  return db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId))
  ]);
}
