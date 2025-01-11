import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import mime from "mime";
import React, { useCallback, useRef } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import BaseModalOption from "root/components/addproducts/baseModalOptions";
import ShinyPurpleButton from "root/components/auth/ShinyPurpleButton";
import CustomUnscrollableWrapper from "root/components/custom/customUnScrollableWrapper";
import GeneralModal from "root/components/modal";
import ProductForm from "root/components/product/editProductForm";
import { ImageSection } from "root/components/product/imageListSlider";
import { showToast } from "root/components/toast";
import categories, { CategoryItemType } from "root/constants/categories";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import {
  CreateProductModel,
  ProductType,
} from "root/constants/types/productTypes";
import { handleProductImageDeletion } from "root/utils/hooks/product/useHandleProductImageModifications";
import { useProduct } from "root/utils/hooks/product/useProduct";
import { areImageListsEqual } from "root/utils/images/compareImageArray";
import { isCloudImage } from "root/utils/images/filterOutLocalImages";
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

  const formikRef = useRef<FormikProps<any>>(null);
  const deleteProductRef = useRef<BottomSheetModal>(null);
  const categoriesRef = useRef<BottomSheetModal>(null);
  const optionsRef = useRef<BottomSheetModal>(null);

  const { dismiss } = useBottomSheetModal();
  const {
    handleDeletion,
    imageList,
    imageToModify,
    restorableImageList,
    setImageToModify,
    setImageList,
    makeThumbnail,
    newThumbnail,
  } = handleProductImageDeletion(images);
  const { updateProduct } = useProduct();

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
            : makeThumbnail(imageToModify!, () => dismiss());
        }}
      />
    );
  }, []);
  console.log(
    thumbnail,
    "thumbnail",
    newThumbnail,
    "newThumbnail",
    areImageListsEqual(imageList, images)
  );

  const handleSubmit = async (payload: object) => {
    Keyboard.dismiss();

    console.log(payload, "submit");
    const formData = new FormData();

    type FormKeys = keyof Omit<UpdateProductModel, "thumbnail">;

    const appendInitialFormData = (key: FormKeys, value: string) => {
      formData.append(key, value);
    };

    Object.entries(payload).forEach(([key, value]) =>
      appendInitialFormData(key as FormKeys, value)
    );

    const imageBlob = images.map((image, index) => {
      if (!isCloudImage(image)) {
        return {
          name: `image_${index}`,
          type: mime.getType(image),
          uri: image,
        };
      }
    });

    imageBlob.forEach((img) => formData.append("image", img as any));
    console.log("blah blah");
    await updateProduct(formData, id).then(() => {
      formikRef.current?.resetForm();
    });
  };

  const initialValues = {
    category,
    description,
    name,
    price,
    images,
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
            const payload = {
              ...values,
              thumbnail: newThumbnail || thumbnail,
            };
            // Handle submit
            handleSubmit(payload);
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
                    optionsRef.current?.present();
                  }}
                  formikRef={formikRef}
                />
                <ProductForm
                  onCategoryPress={() => categoriesRef.current?.present()}
                  formikRef={formikRef}
                />
              </View>

              <ShinyPurpleButton
                buttonStyle={styles.updateButton}
                label="Update"
                onPress={() => {
                  !areImageListsEqual(imageList, images)
                    ? handleSubmit()
                    : showToast({
                        text1: "Please select atleast one different image",
                        type: "error",
                        position: "top",
                        text2: "No edits made",
                      });
                }}
                disabled={
                  !isValid || imageList.length === 0
                  // ||
                  // areImageListsEqual(imageList, images)
                }
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
          ref={optionsRef}
          title="Options"
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
  },
  deleteButton: {
    alignSelf: "center",
  },
  deleteButtonText: {
    color: Colors.light.redColor,
  },
});

export default EditProduct;
