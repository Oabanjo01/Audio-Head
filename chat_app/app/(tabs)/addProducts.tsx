import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetFlatList,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useRef } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import Button from "root/components/auth/Button";
import { TextField } from "root/components/auth/TextField";
import CustomWrapper from "root/components/customWrapper";
import GeneralModal from "root/components/modal";
import categories, { CategoryItemType } from "root/constants/categories";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { CreateProductModel } from "root/constants/types/productTypes";
import { createProductSchema } from "root/utils/validations";

const initialValues: CreateProductModel = {
  images: [],
  name: "",
  price: 0,
  purchasingDate: "",
  category: "",
  description: "",
};

export default function Search() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const formikRef = useRef<FormikProps<CreateProductModel> | null>(null);

  const { dismiss } = useBottomSheetModal();
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderItem = useCallback(({ item }: { item: CategoryItemType }) => {
    const IconComponent =
      item.icon.library === "Ionicons" ? Ionicons : MaterialIcons;
    return (
      <Pressable
        style={styles.itemStyle}
        onPress={() => {
          formikRef.current?.setFieldValue("category", item.name);
          dismiss();
        }}
      >
        <IconComponent
          name={item.icon.name as any}
          size={26}
          color={Colors.light.primary}
        />
        <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: "500" }}>
          {item.name}
        </Text>
      </Pressable>
    );
  }, []);

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
          onSubmit={async (values, { validateForm }) => {
            Keyboard.dismiss();
            const response = await validateForm(values);
          }}
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
            console.log(values, "validation");
            return (
              <>
                <View style={{ paddingHorizontal: width * 0.035 }}>
                  <TextField
                    label="Name"
                    leftIconTitle="bag-outline"
                    maxLength={12}
                    leftIcon
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
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
                    maxLength={10}
                    keyboardType="numeric"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
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
                    rightIconPress={handlePresentModalPress}
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
                  disabled={!isValid}
                  onPress={handleSubmit}
                  label={"Create"}
                />
              </>
            );
          }}
        </Formik>
      </CustomWrapper>
      <GeneralModal ref={bottomSheetModalRef} title="Categories">
        <View style={{ padding: 20 }}>
          <BottomSheetFlatList
            showsVerticalScrollIndicator={false}
            data={categories}
            keyExtractor={({ name }) => name}
            renderItem={renderItem}
          />
        </View>
      </GeneralModal>
    </>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    flexDirection: "row",
    height: height * 0.08,
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: width * 0.9,
  },
});
