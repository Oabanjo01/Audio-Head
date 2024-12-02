import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FormikProps } from "formik";
import React, { ComponentProps, FC, MutableRefObject, useState } from "react";
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { CategoriesNameType } from "root/constants/categories";
import { Colors } from "root/constants/colors/Colors";
import { fontSize, width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import Fonts from "root/constants/types/fontTypes";
import { CreateProductModel } from "root/constants/types/productTypes";
import {
  handleChangeType,
  handleDateChangeType,
  setFieldValueType,
} from "root/constants/types/textInputs/formik";
import { cleanCurrencyString, formatPrice } from "root/utils/formatPrice";

import IconComponent from "../custom/customIcon";
import TextFieldError from "./TextFieldError";

const textWidth = width * 0.9;

export type IconName = ComponentProps<typeof Ionicons>["name"];
export type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];

interface TextFieldProps extends TextInputProps {
  label: string;
  fieldName: string;
  showPasswords?(): void;
  isOpen?: boolean;
  leftIconTitle?: CategoryIconName;
  setFieldValue: setFieldValueType;
  leftIcon?: boolean;
  viewProps?: ViewStyle;
  error?: boolean;
  errorMessage?: string;
  price?: boolean;
  isDateField?: boolean;
  categoryValue?: CategoriesNameType | "";
  handleChange?: handleChangeType;
  rightIcon?: boolean;
  rightIconName?: CategoryIconName;
  rightIconPress?(): void;
  values?: any;
  reference?: MutableRefObject<FormikProps<CreateProductModel> | null>;
  leftIconColor?: string;
  rightIconColor?: string;
}

export const TextField: FC<TextFieldProps> = ({
  setFieldValue,
  label,
  reference,
  fieldName,
  showPasswords,
  isOpen = false,
  leftIcon = false,
  leftIconTitle,
  viewProps,
  error,
  errorMessage,
  price,
  categoryValue,
  isDateField,
  rightIcon,
  rightIconName,
  rightIconPress,
  values,
  leftIconColor = Colors.light.primary,
  rightIconColor = Colors.light.primary,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [texts, setText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

  const handlePriceUpdate = (newValue: string) => {
    reference?.current?.setFieldValue("price", newValue);
  };

  const handlePress = () => {
    Keyboard.dismiss();
    setShowDatePicker((prev) => {
      return Platform.OS === "ios" ? true : !prev;
    });
  };

  const handleDateChange: handleDateChangeType = async (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString();
      console.log(formattedDate, "formattedDate");
      const readableDate = formattedDate.split("T")[0];
      setText(readableDate);
      setFieldValue(fieldName, readableDate, true);
    }
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={handlePress}>
        <View
          style={[
            styles.input,
            isFocused ? styles.activeBorder : styles.inActiveBorder,
            {
              marginBottom: 5,
              width: width * 0.9,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "flex-start",
              ...viewProps,
            },
          ]}
        >
          <View
            style={{
              justifyContent: "flex-start",
              flexDirection: "row",
              width: "90%",
            }}
          >
            {leftIcon && (
              <IconComponent
                onPress={showPasswords}
                name={leftIconTitle || "hourglass-empty"}
                size={24}
                style={{
                  alignSelf: "center",
                  marginRight: 15,
                  opacity: 0.75,
                }}
                color={isFocused ? Colors.light.primary : leftIconColor}
              />
            )}
            <TextInput
              placeholder={label}
              cursorColor={"black"}
              selectionColor={Colors.light.primary}
              style={{
                flex: 1,
                color: "black",
                fontFamily: Fonts.DM_Sans_Regular,
                fontSize: 14,
              }}
              onPress={Platform.select({
                ios: handlePress,
              })}
              onChangeText={(text) => {
                if (!price) {
                  setFieldValue(fieldName, text, true);
                  return;
                }

                const validText = cleanCurrencyString(text);
                const dotCount = (validText.match(/\./g) || []).length;

                if (dotCount > 1) return;

                const { formattedValue } = formatPrice(validText);

                setFieldValue(fieldName, formattedValue, true);
                setText(formattedValue);
              }}
              value={values}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                if (!price) return;

                const stringifiedPrice = String(
                  reference?.current?.values.price
                );

                if (stringifiedPrice.endsWith(".")) {
                  handlePriceUpdate(stringifiedPrice.slice(0, -1));
                  return;
                }

                if (
                  stringifiedPrice.length === 1 &&
                  stringifiedPrice.includes(".")
                ) {
                  handlePriceUpdate("0");
                  return;
                }

                if (
                  stringifiedPrice.startsWith("0") &&
                  !(stringifiedPrice.charAt(1) === ".")
                ) {
                  const removeStartingZero = stringifiedPrice.substring(1);
                  handlePriceUpdate(removeStartingZero);
                  return;
                }
              }}
              {...props}
            />
          </View>
          {label === "Password" && (
            <Ionicons
              onPress={showPasswords}
              name={isOpen ? "eye" : "eye-off"}
              size={24}
              style={{
                alignSelf: "center",
                opacity: 0.75,
              }}
              color={isFocused ? Colors.light.primary : rightIconColor}
            />
          )}
          {rightIcon && (
            <IconComponent
              onPress={rightIconPress}
              name={rightIconName || "hourglass-empty"}
              size={24}
              style={{
                alignSelf: "center",
              }}
              color={rightIconColor}
            />
          )}
        </View>
      </TouchableWithoutFeedback>
      {showDatePicker && isDateField && (
        <DateTimePicker
          value={new Date()}
          testID="datePicker"
          mode="date"
          display="default"
          onChange={(_, date) => handleDateChange(_, date)}
          style={{
            marginBottom: Platform.select({
              ios: 10,
            }),
          }}
        />
      )}
      {error ? <TextFieldError error={errorMessage || ""} /> : null}
    </>
  );
};

export default TextField;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    fontSize: fontSize.medium,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: width * 0.03,
    width: textWidth * 0.9,
    alignSelf: "center",
  },
  activeBorder: {
    borderColor: Colors.light.primary,
    borderWidth: 1.5,
  },
  inActiveBorder: {
    borderColor: Colors.light.lightGrey,
    borderWidth: 1,
  },
});
