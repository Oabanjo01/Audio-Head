import { ImageSourcePropType } from "react-native";

const images: {
  google: ImageSourcePropType | undefined;
} = {
  google: require("root/assets/google.png"),
};

export type image = keyof typeof images;

export default images;
