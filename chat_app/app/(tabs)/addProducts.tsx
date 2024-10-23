import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Formik, FormikProps } from "formik";
import mime from "mime";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import BaseModalOption from "root/components/addproducts/baseModalOptions";
import Button from "root/components/auth/Button";
import { TextField } from "root/components/auth/TextField";
import CustomWrapper from "root/components/customScrollableWrapper";
import GeneralModal from "root/components/modal";
import { showToast } from "root/components/toast";
import categories, { CategoryItemType } from "root/constants/categories";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { CreateProductModel } from "root/constants/types/productTypes";
import { formatPrice } from "root/utils/formatPrice";
import { useProduct } from "root/utils/hooks/product/useProduct";
import { pickImage } from "root/utils/pickImage";
import { createProductSchema } from "root/utils/validations";

const initialValues: CreateProductModel = {
  name: "",
  price: 0,
  purchasingDate: new Date().toISOString().split("T")[0],
  category: "",
  description: "",
  images: [],
};

export default function AddProduct() {
  const categoriesBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const imageOptionsBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const formikRef = useRef<FormikProps<CreateProductModel> | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { dismiss } = useBottomSheetModal();

  const handlePresentCategoryModalPress = useCallback(() => {
    categoriesBottomSheetModalRef.current?.present();
  }, []);
  const handlePresentImageModalPress = useCallback(() => {
    imageOptionsBottomSheetModalRef.current?.present();
  }, []);

  const { createProduct } = useProduct();

  const options = [
    {
      title: "Remove",
      id: "remove",
      onPress: () => {
        const newImages = images.filter((image) => image !== selectedImage);
        setImages(newImages);
        formikRef.current?.setFieldValue("images", [...newImages]);
      },
    },
  ];

  const renderItem = useCallback((item: CategoryItemType, index: number) => {
    return (
      <BaseModalOption
        title={item.name}
        icon={item.icon}
        onPress={() => {
          formikRef.current?.setFieldValue("category", item.name);
          dismiss();
        }}
      />
    );
  }, []);

  const renderDeleteOption = (item: any) => (
    <BaseModalOption
      title={item.title}
      icon="trash-bin-outline"
      color={Colors.light.redColor}
      onPress={() => {
        item.onPress();
        dismiss();
      }}
    />
  );

  const handleSubmit = async (values: CreateProductModel, images: string[]) => {
    Keyboard.dismiss();

    const formData = new FormData();

    type FormKeys = keyof Omit<CreateProductModel, "thumbnail">;

    const appendInitialFormData = (key: FormKeys, value: any) => {
      if (key === "purchasingDate" && typeof value === "string") {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    };

    Object.entries(values).forEach(([key, value]) =>
      appendInitialFormData(key as FormKeys, value)
    );

    const imageBlob = images.map((image, index) => ({
      name: `image_${index}`,
      type: mime.getType(image),
      uri: image,
    }));

    imageBlob.forEach((img) => formData.append("image", img as any));

    await createProduct(formData).then(() => {
      setImages([]);
      formikRef.current?.resetForm();
    });
  };

  return (
    <>
      <CustomWrapper
        title="New Product"
        rightHeaderIcon
        rightHeaderIconTitle="cart"
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={createProductSchema}
          onSubmit={async (values) => handleSubmit(values, images)}
        >
          {({
            handleSubmit,
            errors,
            touched,
            setFieldValue,
            isValidating,
            isValid,
            handleChange,
            values,
          }) => {
            console.log(values);
            return (
              <>
                <View style={{ paddingHorizontal: width * 0.035 }}>
                  <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <Pressable
                      style={styles.addImageBox}
                      onPress={async () => {
                        const response = await pickImage();
                        if (!response) return;

                        const imageList = response?.map((image) => {
                          return image.uri;
                        });
                        if (images.length + imageList.length > 5) {
                          return showToast({
                            text1: `Too many images selected`,
                            text2: `Image length exceeds 5`,
                            type: `info`,
                            position: "top",
                          });
                        }
                        setImages([...images, ...imageList]);
                        setFieldValue("images", [...images, ...imageList]);
                      }}
                    >
                      <Text style={{ flexWrap: "wrap" }}>Add Images</Text>
                    </Pressable>
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={images}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <Pressable
                              onLongPress={() => {
                                setSelectedImage(item);
                                handlePresentImageModalPress();
                              }}
                            >
                              <Image
                                source={{ uri: item }}
                                style={styles.image}
                              />
                            </Pressable>
                          );
                        }}
                      />
                    </View>
                  </View>
                  <TextField
                    label="Name"
                    leftIconTitle="bag-outline"
                    maxLength={12}
                    leftIcon
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    values={values.name}
                    autoCapitalize="none"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    fieldName="name"
                    error={errors.name && isValid ? true : false}
                    errorMessage={errors.name}
                  />
                  <TextField
                    label="Price"
                    autoCapitalize="none"
                    maxLength={15}
                    keyboardType="numeric"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    values={formatPrice(String(values.price))}
                    leftIcon
                    leftIconTitle="cash-outline"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    error={
                      errors.price && isValidating && touched.price
                        ? true
                        : false
                    }
                    price
                    handleChange={handleChange}
                    errorMessage={errors.price}
                    fieldName="price"
                  />
                  <TextField
                    label="Purchasing Date"
                    editable={false}
                    values={values.purchasingDate}
                    autoCapitalize="none"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    isDateField
                    leftIcon
                    leftIconTitle="time-outline"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    error={
                      errors.purchasingDate &&
                      isValidating &&
                      touched.purchasingDate
                        ? true
                        : false
                    }
                    errorMessage={errors.purchasingDate}
                    fieldName="purchasingDate"
                  />
                  <TextField
                    label="Category"
                    editable={false}
                    values={values.category}
                    categoryValue={values.category}
                    autoCapitalize="none"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    leftIcon
                    leftIconTitle="grid-outline"
                    rightIconName="caret-down"
                    rightIcon
                    rightIconPress={handlePresentCategoryModalPress}
                    secureTextEntry={false}
                    error={
                      errors.category && isValidating && touched.category
                        ? true
                        : false
                    }
                    errorMessage={errors.category}
                    setFieldValue={setFieldValue}
                    fieldName="category"
                  />
                  <TextField
                    label="Description"
                    values={values.description}
                    numberOfLines={5}
                    maxLength={150}
                    multiline
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    autoCapitalize="none"
                    error={
                      errors.description && isValidating && touched.description
                        ? true
                        : false
                    }
                    errorMessage={errors.description}
                    leftIconTitle="document-outline"
                    leftIcon
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    fieldName="description"
                    style={{
                      width: width * 0.7,
                    }}
                  />
                </View>
                <Button
                  buttonStyle={{
                    marginTop: height * 0.05,
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                  disabled={!isValid || images.length === 0}
                  onPress={handleSubmit}
                  label={"Create"}
                />
              </>
            );
          }}
        </Formik>
      </CustomWrapper>
      <GeneralModal
        ref={categoriesBottomSheetModalRef}
        title="Categories"
        itemsList={categories}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />
      <GeneralModal
        ref={imageOptionsBottomSheetModalRef}
        title="Options"
        initialSnap={0}
        itemsList={options}
        keyExtractor={(item) => item.id}
        renderItem={renderDeleteOption}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addImageBox: {
    width: width * 0.25,
    marginRight: 20,
    height: width * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
