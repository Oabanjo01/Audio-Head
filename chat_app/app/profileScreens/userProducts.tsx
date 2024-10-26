import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomUnscrollableWrapper from "root/components/customUnScrollableWrapper";
import { Colors } from "root/constants/Colors";
import { width } from "root/constants/Dimensions";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
import { useProduct } from "root/utils/hooks/product/useProduct";

const UserProducts = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  const { fetchProductListing, productListing } = useProduct();
  const { signOut } = useAuthentication();

  useEffect(() => {
    fetchProductListing();
  }, []);

  return (
    <CustomUnscrollableWrapper
      //   onPress={signOut}
      title={title}
      leftHeaderIcon
    >
      <View style={styles.container}>
        <FlatList
          numColumns={2}
          data={productListing}
          ListEmptyComponent={
            <View>
              <Text>Sigh, you have no products currently.</Text>
            </View>
          }
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContentContainer}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <Link
                href={{
                  pathname: "/products/productDetail",
                  params: {
                    item: JSON.stringify(item),
                  },
                }}
                asChild
                style={styles.itemContainer}
              >
                <Pressable>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.imageStyle}
                    resizeMethod="resize"
                    resizeMode="cover"
                  />
                  <Text style={styles.itemName}>{item.name}</Text>
                </Pressable>
              </Link>
            );
          }}
        />
      </View>
    </CustomUnscrollableWrapper>
  );
};

export default UserProducts;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    width: width,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: Colors.light.primary,
    width: width * 0.4,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
    // elevation: 3,
    // shadowColor: "#000",
    // shadowOffset: { width: 2, height: 10 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
  },
  imageStyle: {
    width: "100%",
    height: (width / 2) * 0.75,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    aspectRatio: 3 / 2,
  },
  itemName: {
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.light.text,
  },
});
