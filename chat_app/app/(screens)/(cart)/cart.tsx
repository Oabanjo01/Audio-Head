import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import CustomWrapper from "root/components/custom/customScrollableWrapper";

const Cart = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;
  return (
    <CustomWrapper title={title} leftHeaderIcon>
      <Text>Cart</Text>
    </CustomWrapper>
  );
};

export default Cart;

const styles = StyleSheet.create({});
