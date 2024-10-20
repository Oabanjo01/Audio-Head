import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { ComponentProps, FC, useState } from "react";
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
import { Colors } from "root/constants/Colors";
import { fontSize, width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";
import {
  handleChangeType,
  handleDateChangeType,
  setFieldValueType,
} from "root/constants/types/textInputs/formik";
import { cleanCurrencyString, formatPrice } from "root/utils/formatPrice";

import IconComponent from "../customIcon";
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
}

export const TextField: FC<TextFieldProps> = ({
  setFieldValue,
  label,
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
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [texts, setText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === "ios");

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
      setText(formattedDate.split("T")[0]);
      setFieldValue(fieldName, formattedDate, true);
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
              // height: Platform.select({
              //   ios: height * 0.0325,
              // }),
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
                }}
                color={Colors.light.primary}
              />
            )}
            <TextInput
              placeholder={label}
              cursorColor={"black"}
              selectionColor={Colors.light.primary}
              style={{ flex: 1, color: "black" }}
              onPress={Platform.select({
                ios: handlePress,
              })}
              onChangeText={(text) => {
                if (price) {
                  const validText = text.replace(/[^0-9.]/g, "");
                  const dotCount = (validText.match(/\./g) || []).length;

                  if (dotCount < 2 && price) {
                    const { formattedValue } = formatPrice(text);
                    setFieldValue(fieldName, cleanCurrencyString(text), true);
                    setText(formattedValue);
                  } else if (dotCount === 2) {
                    return text;
                  } else {
                    setFieldValue(fieldName, cleanCurrencyString(text), true);
                    setText(text);
                  }
                } else {
                  setText(text);
                  setFieldValue(fieldName, text, true);
                }
              }}
              value={categoryValue ? categoryValue : texts}
              onFocus={() => {
                setIsFocused(true);
              }}
              onBlur={() => setIsFocused(false)}
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
              }}
              color={Colors.light.primary}
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
              color={Colors.light.primary}
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
    borderColor: Colors.light.text,
    borderWidth: 1.5,
  },
  inActiveBorder: {
    borderColor: Colors.light.lightGrey,
    borderWidth: 1,
  },
});
