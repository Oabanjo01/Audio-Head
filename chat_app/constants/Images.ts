import { ImageSourcePropType } from "react-native";

const images: {
  google: ImageSourcePropType | undefined;
  facebook: ImageSourcePropType | undefined;
  apple: ImageSourcePropType | undefined;
  appIcon: ImageSourcePropType | undefined;
} = {
  google: require("root/assets/socials/google.png"),
  facebook: require("root/assets/socials/facebook.png"),
  apple: require("root/assets/socials/apple.png"),
  appIcon: require("root/assets/appicon.png"),
};

export type image = keyof typeof images;
export type ImageType = typeof images;

export default images;
