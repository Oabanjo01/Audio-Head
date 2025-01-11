import { router } from "expo-router";
import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, Text, View } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import { Colors } from "root/constants/colors/Colors";
import { width } from "root/constants/Dimensions";
import { CategoryIconName } from "root/constants/icons/icon";

import IconComponent from "./custom/customIcon";

interface DropDownData {
  label: string;
  icon: CategoryIconName;
}

export interface DropDownRefProps {
  openDropdown: Function;
}

interface DropDownProps {
  productdata?: any;
}

const DropDownMenu = forwardRef<DropDownRefProps, DropDownProps>(
  (props, ref) => {
    const { productdata } = props;

    const dropdownRef = React.useRef<SelectDropdown | null>(null);

    const data: DropDownData[] = [
      { label: "Cart", icon: "cart-outline" },
      {
        label: "Edit",
        icon: "mode-edit-outline",
      },
    ];

    const handleSelect = (label: string) => {
      console.log("label: " + label);
      switch (label) {
        case "Cart":
          router.push({
            pathname: "/(cart)/cart",
            params: {
              title: "Carted Items",
            },
          });
          break;
        case "Edit":
          router.push({
            pathname: "/(products)/editProduct",
            params: {
              title: "Edit Product",
              productData: productdata,
            },
          });
          break;
        default:
          break;
      }
    };

    useImperativeHandle(ref, () => ({
      openDropdown() {
        if (dropdownRef.current) {
          dropdownRef.current.openDropdown();
        }
      },
    }));

    return (
      <SelectDropdown
        ref={dropdownRef}
        data={data}
        onSelect={(selectedItem: DropDownData, index) => {
          const { label } = selectedItem;
          handleSelect(label);
          // return selectedItem.onPress();
        }}
        renderButton={() => {
          return (
            <View style={styles.dropdownButtonStyle}>
              <IconComponent
                name={"ellipsis-vertical"}
                style={styles.dropdownButtonIconStyle}
              />
            </View>
          );
        }}
        renderItem={(item, index, _) => {
          return (
            <>
              <View
                style={{
                  ...styles.dropdownItemStyle,
                }}
              >
                <IconComponent
                  name={item.icon}
                  style={styles.dropdownItemIconStyle}
                />
                <Text style={styles.dropdownItemTxtStyle}>{item.label}</Text>
              </View>
              {index < data.length - 1 && (
                <View
                  style={{
                    height: 1,
                    alignSelf: "center",
                    backgroundColor: Colors.light.primary,
                    width: width * 0.3,
                  }}
                />
              )}
            </>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      />
    );
  }
);

export default DropDownMenu;

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    borderColor: Colors.light.primary,
    height: width * 0.125,
    width: width * 0.125,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
  },
  dropdownMenuStyle: {
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 10,
    position: "absolute",
    left: width * 0.55,
    paddingVertical: 8,
    width: width * 0.4,
  },
  dropdownItemStyle: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: Colors.light.text,
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
