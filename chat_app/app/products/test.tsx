import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import CustomWrapper from "root/components/customScrollableWrapper";

const test = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  return (
    <CustomWrapper>
      <Text>test</Text>
    </CustomWrapper>
  );
};

export default test;

const styles = StyleSheet.create({});
