import { ImageSourcePropType } from "react-native";

const images: {
  authImage: ImageSourcePropType | undefined;
  google: ImageSourcePropType | undefined;
} = {
  authImage: require("root/assets/authImage.png"),
  google: require("root/assets/google.png"),
};

export default images;
