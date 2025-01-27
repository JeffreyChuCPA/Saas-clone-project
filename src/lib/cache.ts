//3 different tiers of caching

import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";

//1 is for global cache, like for countries
//1 is for users, just want to refresh the cache for that users products
//1 is for individual products, just update cache for that 1 product instead update for all users in app

//To allow only certain tags to cache
export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  products: "products",
  productViews: "productViews",
  subscription: "subscription",
  countries: "countries",
  countryGroups: "countryGroups",
} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS) {
  return `global:${CACHE_TAGS[tag]}` as const;
}

export function getUserTag(userId: string, tag: keyof typeof CACHE_TAGS) {
  return `user:${userId}-${CACHE_TAGS[tag]}` as const;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS) {
  return `id:${id}-${CACHE_TAGS[tag]}` as const;
}

//clears all cache as the "*" is added to all tags via the dbCache function below
export function clearFullCache() {
  revalidateTag("*");
}

//returns the cache result of the function passed in with the specified tags also passed in
//type of function passed in adheres to the 1st param of unstable_cache which is a function. passing the type of unstable cache as props
//type of tags passed in adheres to ValidTags, and at the end we add the "*" as part of the tag returned
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  cb: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) {
  return cache(unstable_cache<T>(cb, undefined, { tags: [...tags, "*"] }));
}

export function revalidateDbCache({
  tag,
  userId,
  id
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  revalidateTag(getGlobalTag(tag));
  if (userId != null) {
    revalidateTag(getUserTag(userId, tag));
  }
  if (id != null) {
    revalidateTag(getIdTag(id, tag));
  }
}
