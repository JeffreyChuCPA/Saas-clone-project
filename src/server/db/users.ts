import { db } from "@/drizzle/db";
import { ProductTable, UserSubscriptionTable } from "@/drizzle/schema";
import { CACHE_TAGS, revalidateDbCache } from "@/lib/cache";
import { eq } from "drizzle-orm";

export async function deleteUser(clerkUserId: string) {
  //when deleting user, batch delete the user and the products associated with user
  //we set up cascades in schema so that all other tables with a related foreign key with producttable and usersubscriptiontable would also delete any associated row items
  const [userSubscriptions, products] = await db.batch([
    db
      .delete(UserSubscriptionTable)
      .where(eq(UserSubscriptionTable.clerkUserId, clerkUserId)).returning({ id: UserSubscriptionTable.id}),
    db.delete(ProductTable).where(eq(ProductTable.clerkUserId, clerkUserId)).returning({ id: ProductTable.id})
  ]);

  // if (userSubscriptions != null && products != null) {
    userSubscriptions.forEach((sub) => {
      revalidateDbCache({
        tag: CACHE_TAGS.subscription,
        userId: clerkUserId,
        id: sub.id
      })
    })

    products.forEach((product) => {
      revalidateDbCache({
        tag: CACHE_TAGS.products,
        userId: clerkUserId,
        id: product.id
      })
    })
  // }

  return [userSubscriptions, products]
}
