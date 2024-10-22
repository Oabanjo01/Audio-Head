import { Link } from "expo-router";
import React, { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CustomWrapper from "root/components/customScrollableWrapper";
import { height, width } from "root/constants/Dimensions";
import { useAuthentication } from "root/utils/hooks/auth/useAuthentication";
import { useProduct } from "root/utils/hooks/product/useProduct";

const aspectRatio = 16 / 9;

export default function Homepage() {
  const { fetchProductListing, productListing } = useProduct();
  const { signOut } = useAuthentication();

  useEffect(() => {
    fetchProductListing();
  }, []);
  return (
    <CustomWrapper
      title="Home"
      rightHeaderIcon
      rightHeaderIconTitle="log-out"
      onPress={signOut}
    >
      <>
        <View style={{ width }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "600",
              marginHorizontal: 20,
              marginBottom: 10,
            }}
          >
            Your Listings
          </Text>
        </View>
        <View style={{ marginHorizontal: 20 }}>
          <FlatList
            data={productListing}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
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
                  style={{
                    height: height * 0.3,
                    marginRight: width * 0.05,
                  }}
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
            horizontal
            // contentContainerStyle={{
            //   width,
            //   height: height * 0.5,
            // }}
          />
        </View>
      </>
    </CustomWrapper>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: height * 0.35,
    height: (height * 0.35) / aspectRatio, // important afff for maintainging aspect ratios
    borderRadius: 10,
  },
});
