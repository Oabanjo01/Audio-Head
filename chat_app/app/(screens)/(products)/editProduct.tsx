import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BaseModalOption from "root/components/addproducts/baseModalOptions";
import Button from "root/components/auth/Button";
import TextField from "root/components/auth/TextField";
import CustomWrapper from "root/components/customScrollableWrapper";
import GeneralModal from "root/components/modal";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import { useProduct } from "root/utils/hooks/product/useProduct";
// import * as yup from 'yup';

type OptionType = {
  title: string;
  icon: CategoryIconName;
  onPress?(): void;
};

const options: OptionType[] = [
  { icon: "cancel", title: "Cancel" },
  { icon: "delete-outline", title: "Confirm Delete" },
];

const EditProduct = () => {
  const formikRef = useRef<FormikProps<any> | null>(null);
  const deleteProductBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const params: { title: string; productData: any } = useLocalSearchParams();
  const { title, productData } = params;

  const prevProductData = JSON.parse(productData);
  console.log(prevProductData.id, "productData  - edit product");

  const { dismiss } = useBottomSheetModal();

  const { deletProduct } = useProduct();

  const handleProductDeletion = async (id: string) => {
    dismiss();
    await deletProduct(id).then(() => {
      router.navigate("/(screens)/userProducts");
    });
  };

  const renderItem = useCallback((item: OptionType, _: number) => {
    return (
      <BaseModalOption
        key={`index_ ${item.title}`}
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
            ? handleProductDeletion(prevProductData.id)
            : dismiss();
        }}
      />
    );
  }, []);
  return (
    <CustomWrapper title={title} leftHeaderIcon>
      <>
        <Formik
          innerRef={formikRef}
          initialValues={{}}
          // validationSchema={createProductSchema}
          onSubmit={async (values) => {}}
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
                  {/* <View style={{ flexDirection: "row", marginBottom: 10 }}>
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
                  </View> */}
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
                    // errorMessage={errors.name}
                  />
                </View>
                <Button
                  buttonStyle={{
                    marginTop: height * 0.05,
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                  // disabled={!isValid || images.length === 0}
                  // onPress={handleSubmit}
                  label={"Create"}
                />

                <Pressable
                  onPress={() => {
                    deleteProductBottomSheetModalRef.current?.present();
                  }}
                >
                  <Text style={{ color: Colors.light.redColor }}>
                    Delete Product?
                  </Text>
                </Pressable>
              </>
            );
          }}
        </Formik>
        <GeneralModal
          ref={deleteProductBottomSheetModalRef}
          title="Categories"
          itemsList={options}
          keyExtractor={(item: OptionType) => item.title}
          renderItem={renderItem}
        />
      </>
    </CustomWrapper>
  );
};

export default EditProduct;

const styles = StyleSheet.create({});
