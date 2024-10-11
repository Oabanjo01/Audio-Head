import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Formik } from "formik";
import React, { useState } from "react";
import { Keyboard, Platform, View } from "react-native";
import Button from "root/components/auth/Button";
import { TextField } from "root/components/auth/TextField";
import { height, width } from "root/constants/Dimensions";
import { CreateProductModel } from "root/constants/types/productTypes";
import CustomWrapper from "root/utils/customWrapper";
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
  const submit = () => {
    console.log("duration");
  };

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setOpen(Platform.OS === "ios");
    setDate(currentDate);
  };
  return (
    <CustomWrapper
      title="Add a New Product"
      rightHeaderIcon
      rightHeaderIconTitle="cart"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={createProductSchema}
        onSubmit={async (values, { validateForm }) => {
          Keyboard.dismiss();
          const response = await validateForm(values);
          // .then((value) => {
          //   sunmit();
          //   console.log("Product", value);
          // })
          // .catch((err) => {
          //   console.log("Product", err);
          // });
        }}
      >
        {({
          handleSubmit,
          errors,
          touched,
          setFieldValue,
          isValidating,
          isValid,
          validateForm,
          handleChange,
        }) => {
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
                    errors.price && isValidating && touched.price ? true : false
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
                  leftIcon
                  onPress={() => {
                    console.log("Purchasing Date");
                    setOpen((prev) => !prev);
                  }}
                  // onFocus={}
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
                {(open || Platform.OS === "ios") && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                    style={{ marginBottom: 10 }}
                  />
                )}
                <TextField
                  label="Category"
                  autoCapitalize="none"
                  viewProps={{
                    paddingVertical: 15,
                    marginBottom: 10,
                  }}
                  leftIcon
                  leftIconTitle="grid-outline"
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
                label={"Add"}
              />
            </>
          );
        }}
      </Formik>
    </CustomWrapper>
  );
}
