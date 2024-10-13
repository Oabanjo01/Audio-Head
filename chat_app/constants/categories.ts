import { IconName, MaterialIconName } from "root/components/auth/TextField";

export type CategoryIconName = MaterialIconName | IconName;

type Icon = {
  library: "Ionicons" | "MaterialIcons";
  name: CategoryIconName;
};

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

export type Category = (typeof categories)[number]["name"];
export type IconLibray = (typeof categories)[number]["icon"]["library"];

export default categories.sort();
