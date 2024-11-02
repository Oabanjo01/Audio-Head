import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BaseModalOption from "root/components/addproducts/baseModalOptions";
import ShinyPurpleButton from "root/components/auth/ShinyPurpleButton";
import CustomUnscrollableWrapper from "root/components/customUnScrollableWrapper";
import GeneralModal from "root/components/modal";
import ProductForm from "root/components/product/editProductForm";
import { ImageSection } from "root/components/product/imageListSlider";
import { showToast } from "root/components/toast";
import categories, { CategoryItemType } from "root/constants/categories";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import {
  CreateProductModel,
  ProductType,
} from "root/constants/types/productTypes";
import { useProduct } from "root/utils/hooks/product/useProduct";
import {
  filterLocalImages,
  isCloudImage,
} from "root/utils/images/filterOutLocalImages";
import { updateProductSchema } from "root/utils/validations";

type OptionType = {
  title: string;
  icon: CategoryIconName;
  onPress?(): void;
};

type UpdateProductModel = Omit<CreateProductModel, "purchasingDate" | "images">;

const options = [
  { icon: "cancel", title: "Cancel" },
  { icon: "delete-outline", title: "Confirm Delete" },
];

const thumbnailOptions: OptionType[] = [
  { icon: "images-outline", title: "Set as Thumbnail" },
  { icon: "delete-outline", title: "Delete Image" },
];

const EditProduct = () => {
  const params: { title: string; productData: any } = useLocalSearchParams();
  const { title, productData } = params;
  const parsedProductData: ProductType = JSON.parse(productData);
  const { images, category, description, name, price, thumbnail, id } =
    parsedProductData;

  const [imageList, setImageList] = useState<string[]>(images);
  const [restorableImageList, setrestorableImageList] =
    useState<string[]>(images);
  const [imageToModify, setImageToModify] = useState<string>("");

  const formikRef = useRef<FormikProps<any>>(null);
  const deleteProductRef = useRef<BottomSheetModal>(null);
  const categoriesRef = useRef<BottomSheetModal>(null);
  const thumbnailRef = useRef<BottomSheetModal>(null);

  const { dismiss } = useBottomSheetModal();
  const { deletProduct, deleteImage } = useProduct();

  const handleDeletion = async (
    id: string,
    title: string,
    imageToDelete: string
  ) => {
    dismiss();
    if (title.toLowerCase().includes("confirm")) {
      await deletProduct(id);
      router.navigate("/(screens)/userProducts");
      return;
    }

    if (title.toLowerCase().includes("image")) {
      if (!isCloudImage(imageToDelete)) {
        setImageList((prevImages) =>
          prevImages.filter((img) => img !== imageToDelete)
        );
        setrestorableImageList((prevImages) =>
          prevImages.filter((img) => img !== imageToDelete)
        );
        setImageToModify("");
        return;
      }

      if (
        filterLocalImages(imageList).length <= 1 &&
        isCloudImage(imageToDelete)
      ) {
        return showToast({
          text1: "Cannot delete",
          text2: "You cannot delete the last saved product image",
          type: "error",
          position: "top",
        });
      }

      const splittedString = imageToDelete.split("/");
      const imageId = splittedString[splittedString.length - 1].split(".")[0];
      await deleteImage(id, imageId);

      setImageList((prevImages) =>
        prevImages.filter((img) => img !== imageToDelete)
      );
      setrestorableImageList((prevImages) =>
        prevImages.filter((img) => img !== imageToDelete)
      );
      setImageToModify("");
    }
  };

  const renderModalOptionsItems = useCallback(
    (item: CategoryItemType) => (
      <BaseModalOption
        title={item.name}
        icon={item.icon}
        onPress={() => {
          formikRef.current?.setFieldValue("category", item.name);
          dismiss();
        }}
      />
    ),
    []
  );

  const renderItem = useCallback((item: OptionType, imageToModify?: string) => {
    return (
      <BaseModalOption
        key={`index_${item.title}`}
        title={item.title}
        icon={item.icon}
        textStyle={{
          color: item.title.includes("Delete") ? "white" : Colors.light.text,
        }}
        pressableStyle={{
          backgroundColor: item.title.includes("Delete")
            ? Colors.light.redColor
            : "transparent",
        }}
        color={item.title.includes("Delete") ? "white" : Colors.light.primary}
        onPress={() => {
          item.title.includes("Delete")
            ? handleDeletion(id, item.title, imageToModify!)
            : dismiss();
        }}
      />
    );
  }, []);

  const initialValues = {
    category,
    description,
    name,
    price,
    thumbnail,
  };

  return (
    <CustomUnscrollableWrapper title={title} leftHeaderIcon>
      <>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={updateProductSchema}
          onSubmit={async (values) => {
            // Handle submit
          }}
        >
          {({ handleSubmit, isValid }) => (
            <>
              <View style={styles.container}>
                <ImageSection
                  restorableImageList={restorableImageList}
                  imageList={imageList}
                  setImageList={setImageList}
                  onThumbnailPress={(image) => {
                    setImageToModify(image);
                    thumbnailRef.current?.present();
                  }}
                  formikRef={formikRef}
                />
                <ProductForm
                  onCategoryPress={() => categoriesRef.current?.present()}
                />
              </View>

              {/* <Button
                buttonStyle={styles.updateButton}
                disabled={!isValid || imageList.length === 0}
                onPress={handleSubmit}
                label="Update"
              /> */}

              <ShinyPurpleButton
                buttonStyle={styles.updateButton}
                label="Update"
                onPress={handleSubmit}
                disabled={!isValid || imageList.length === 0}
              />

              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteProductRef.current?.present()}
              >
                <Text style={styles.deleteButtonText}>Delete Product?</Text>
              </Pressable>
            </>
          )}
        </Formik>

        <GeneralModal
          ref={deleteProductRef}
          title="Confirm Product Deletion?"
          itemsList={options}
          keyExtractor={(item: OptionType) => item.title}
          renderItem={(item: any, index: number) => {
            return renderItem(item);
          }}
        />
        <GeneralModal
          ref={categoriesRef}
          title="Categories"
          itemsList={categories}
          keyExtractor={(item) => item.name}
          renderItem={renderModalOptionsItems}
        />
        <GeneralModal
          ref={thumbnailRef}
          // title="Modify Existing Picture"
          itemsList={thumbnailOptions}
          keyExtractor={(item: OptionType) => item.title}
          renderItem={(item: any, index: number) => {
            return renderItem(item, imageToModify);
          }}
        />
      </>
    </CustomUnscrollableWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.035,
  },
  updateButton: {
    marginTop: height * 0.05,
    // alignSelf: "center",
    // paddingVertical: 10,
  },
  deleteButton: {
    alignSelf: "center",
  },
  deleteButtonText: {
    color: Colors.light.redColor,
  },
});

export default EditProduct;
