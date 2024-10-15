import { Icon } from "./icons/icon";

type CategoryType = {
  name:
    | "Electronics"
    | "Fashion"
    | "Fitness"
    | "Home & Kitchen"
    | "Books"
    | "Toys & Games"
    | "Beauty & Personal Care"
    | "Sports & Outdoors"
    | "Automotive"
    | "Tools & Home Improvement";
  icon: Icon;
};

const categories: CategoryType[] = [
  {
    name: "Electronics",
    icon: { library: "Ionicons", name: "tv-outline" },
  },
  {
    name: "Fashion",
    icon: { library: "Ionicons", name: "glasses-outline" },
  },
  { name: "Fitness", icon: { library: "Ionicons", name: "fitness-outline" } },
  {
    name: "Home & Kitchen",
    icon: { library: "MaterialIcons", name: "kitchen" },
  },
  { name: "Books", icon: { library: "Ionicons", name: "book-outline" } },
  {
    name: "Toys & Games",
    icon: { library: "Ionicons", name: "game-controller-outline" },
  },
  {
    name: "Beauty & Personal Care",
    icon: { library: "MaterialIcons", name: "face-retouching-natural" },
  },
  {
    name: "Sports & Outdoors",
    icon: { library: "MaterialIcons", name: "sports-soccer" },
  },
  {
    name: "Automotive",
    icon: { library: "Ionicons", name: "car-sport-outline" },
  },
  {
    name: "Tools & Home Improvement",
    icon: { library: "Ionicons", name: "build-outline" },
  },
];

export const categoryNames = categories.map((category) => category.name);

export type CategoryItemType = (typeof categories)[number];
export type CategoriesNameType = (typeof categoryNames)[number];

export default categories.sort();
