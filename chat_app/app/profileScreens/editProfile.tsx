import React from "react";
import { StyleSheet, Text } from "react-native";
import CustomWrapper from "root/components/customScrollableWrapper";

const EditProfile = () => {
  return (
    <CustomWrapper title="Edit Profile" leftHeaderIcon>
      <Text>EditProfile</Text>
    </CustomWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});
