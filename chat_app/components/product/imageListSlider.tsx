import { FormikProps } from "formik";
import React from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import IconComponent from "root/components/customIcon";
import { showToast } from "root/components/toast";
import { Colors } from "root/constants/Colors";
import { width } from "root/constants/Dimensions";
import { pickImage } from "root/utils/pickImage";

interface ImageSectionProps {
  imageList: string[];
  setImageList: (images: string[]) => void;
  onThumbnailPress: (image: string) => void;
  formikRef: React.RefObject<FormikProps<any>>;
}

export const ImageSection = ({
  imageList,
  setImageList,
  onThumbnailPress,
  formikRef,
}: ImageSectionProps) => {
  const handleImagePick = async () => {
    const response = await pickImage();
    if (!response) return;

    const newImages = response.map((image) => image.uri);
    if (imageList.length + newImages.length > 5) {
      showToast({
        text1: "Too many images selected",
        text2: "Image length exceeds 5",
        type: "info",
        position: "top",
      });
      return;
    }

    const updatedImages = [...imageList, ...newImages];
    setImageList(updatedImages);
    formikRef.current?.setFieldValue("images", updatedImages);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.addImageBox} onPress={handleImagePick}>
        <IconComponent name="images-outline" size={30} />
      </Pressable>

      <FlatList
        data={imageList}
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item, index }) => (
          <Pressable onLongPress={() => onThumbnailPress(item)}>
            <Image source={{ uri: item }} style={styles.image} />
            <Pressable
              onPress={() => {
                const newImages = imageList.filter((_, i) => i !== index);
                setImageList(newImages);
                formikRef.current?.setFieldValue("images", newImages);
              }}
              style={styles.removeImageBtn}
            >
              <IconComponent
                name="cancel"
                color={Colors.light.errorClor}
                style={styles.removeIcon}
              />
            </Pressable>
          </Pressable>
        )}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.undoContainer}>
        <IconComponent
          name="arrow-undo-circle-outline"
          onPress={() => {
            setImageList(imageList);
            formikRef.current?.setFieldValue("images", imageList);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 10,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
    borderWidth: 1,
  },
  addImageBox: {
    width: width * 0.2,
    height: width * 0.2,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginRight: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  removeImageBtn: {
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "white",
  },
  removeIcon: {
    alignSelf: "center",
  },
  separator: {
    width: 10,
  },
  listContainer: {
    marginBottom: 20,
  },
  undoContainer: {
    width: width * 0.1,
    justifyContent: "center",
    marginBottom: 20,
    alignItems: "center",
  },
});
