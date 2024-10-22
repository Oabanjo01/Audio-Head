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
import { width } from "root/constants/Dimensions";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
import { useProduct } from "root/utils/hooks/product/useProduct";

const aspectRatio = 16 / 9;
const UserProducts = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  const { fetchProductListing, productListing } = useProduct();
  const { signOut } = useAuthentication();

  useEffect(() => {
    fetchProductListing();
  }, []);

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <CustomUnscrollableWrapper
      rightHeaderIcon
      rightHeaderIconTitle="ellipsis-vertical"
      onPress={signOut}
      title={title}
      leftHeaderIcon
    >
      <View style={{ marginHorizontal: 20 }}>
        <FlatList
          data={productListing}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            alignItems: "center",
          }}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          renderItem={({ item, index }) => {
            console.log(item.images[0], "item");
            return (
              <Link
                key={index}
                href={{
                  pathname: "/productDetail/productDetail",
                  params: {
                    item: JSON.stringify(item),
                  },
                }}
                asChild
                style={
                  {
                    //   height: height * 0.3,
                    //   marginRight: width * 0.05,
                  }
                }
              >
                <Pressable>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.imageStyle}
                    resizeMethod="resize"
                    resizeMode="cover"
                  />
                  <Text
                    style={{
                      letterSpacing: 1.5,
                      marginTop: 10,
                      marginLeft: 10,
                    }}
                  >
                    {item.name}
                  </Text>
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
  imageStyle: {
    width: width * 0.9,
    height: (width * 0.9) / aspectRatio,
    borderRadius: 10,
  },
  separator: {
    marginVertical: 10,
  },
});
