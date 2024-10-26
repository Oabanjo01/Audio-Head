import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import CustomWrapper from "root/components/customScrollableWrapper";

const ChatScreen = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  return (
    <CustomWrapper title="Chat" leftHeaderIcon>
      <Text>ChatScreen</Text>
    </CustomWrapper>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
