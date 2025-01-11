import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import CustomUnscrollableWrapper from "root/components/custom/customUnScrollableWrapper";
import ProductCard from "root/components/product/productCard";
import { getAuthState } from "root/redux/slices/authSlice";
import { useAppSelector } from "root/redux/store";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
import { useProduct } from "root/utils/hooks/product/useProduct";

const UserProducts = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  const { loading } = useAppSelector(getAuthState);

  const { fetchProductListing, productListing } = useProduct();
  const { signOut } = useAuthentication();

  useFocusEffect(
    React.useCallback(() => {
      fetchProductListing();
    }, [])
  );

  return (
    <CustomUnscrollableWrapper title={title || "Your Products"} leftHeaderIcon>
      <View style={styles.container}>
        <FlatList
          numColumns={2}
          data={productListing}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View>
              {!loading && <Text>Sigh, you have no products currently.</Text>}
            </View>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContentContainer}
          renderItem={({ item }) => {
            return <ProductCard item={item} />;
          }}
        />
      </View>
    </CustomUnscrollableWrapper>
  );
};

export default UserProducts;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  flatListContentContainer: {
    paddingBottom: 200,
  },
});
