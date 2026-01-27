import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";
import postFilter from "./postFilter";

interface Category {
  category: string;
  categoryName: string;
}

const CATEGORIES = [
  "Intrusion Log",
  "Frameworks",
  "Research",
  "Diary",
] as const;

const getUniqueCategories = (posts: CollectionEntry<"blog">[]) => {
  const categories: Category[] = CATEGORIES.map(category => ({
    category: slugifyStr(category),
    categoryName: category,
  }));

  return categories;
};

export default getUniqueCategories;
