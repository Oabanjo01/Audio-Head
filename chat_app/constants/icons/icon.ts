import { IconName, MaterialIconName } from "root/components/auth/TextField";

export type CategoryIconName = MaterialIconName | IconName;

export type Icon = {
  library: "Ionicons" | "MaterialIcons";
  name: CategoryIconName;
};
