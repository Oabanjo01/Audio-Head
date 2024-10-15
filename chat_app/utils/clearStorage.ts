import AsyncStorage from "@react-native-async-storage/async-storage";

const clearAllTokens = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();

    const tokenKeys = keys.filter((key) =>
      key.toLowerCase().includes("tokens")
    );

    if (tokenKeys.length > 0) {
      await AsyncStorage.multiRemove(tokenKeys);
      console.log("All token items cleared successfully");
    } else {
      console.log("No token items found to clear");
    }
  } catch (error) {
    console.error("Error clearing token items:", error);
  }
};

export default clearAllTokens;
