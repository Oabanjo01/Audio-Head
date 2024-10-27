import { useFormikContext } from "formik";
import React from "react";
import TextField from "root/components/auth/TextField";
import { width } from "root/constants/Dimensions";

interface ProductFormProps {
  onCategoryPress: () => void;
}

const ProductForm = ({ onCategoryPress }: ProductFormProps) => {
  const {
    values,
    errors,
    touched,
    isValidating,
    isValid,
    handleChange,
    setFieldValue,
  } = useFormikContext<any>();

  const fieldProps = {
    paddingVertical: 15,
    marginBottom: 10,
  };

  return (
    <>
      <TextField
        label="Name"
        leftIconTitle="bag-outline"
        maxLength={12}
        leftIcon
        viewProps={fieldProps}
        values={values.name}
        autoCapitalize="none"
        secureTextEntry={false}
        setFieldValue={setFieldValue}
        fieldName="name"
        // error={errors.name && isValid}
      />

      <TextField
        label="Price"
        autoCapitalize="none"
        maxLength={15}
        keyboardType="numeric"
        viewProps={fieldProps}
        values={String(values.price)}
        leftIcon
        leftIconTitle="cash-outline"
        secureTextEntry={false}
        setFieldValue={setFieldValue}
        // error={errors.price && isValidating && touched.price}
        price
        handleChange={handleChange}
        fieldName="price"
      />

      <TextField
        label="Category"
        editable={false}
        values={values.category}
        categoryValue={values.category}
        autoCapitalize="none"
        viewProps={fieldProps}
        leftIcon
        leftIconTitle="grid-outline"
        rightIconName="caret-down"
        rightIcon
        rightIconPress={onCategoryPress}
        secureTextEntry={false}
        // error={errors.category && isValidating && touched.category}
        setFieldValue={setFieldValue}
        fieldName="category"
      />

      <TextField
        label="Description"
        values={values.description}
        numberOfLines={5}
        maxLength={150}
        multiline
        viewProps={fieldProps}
        autoCapitalize="none"
        // error={errors.description && isValidating && touched.description}
        leftIconTitle="document-outline"
        leftIcon
        secureTextEntry={false}
        setFieldValue={setFieldValue}
        fieldName="description"
        style={{
          width: width * 0.7,
        }}
      />
    </>
  );
};

export default ProductForm;
