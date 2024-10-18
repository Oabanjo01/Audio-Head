import * as ImagePicker from "expo-image-picker";

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsMultipleSelection: true,
    selectionLimit: 5,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result) return;

  return result.assets;
};
