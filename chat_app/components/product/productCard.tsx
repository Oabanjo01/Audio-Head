import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "root/constants/colors/Colors";
import { height, width } from "root/constants/Dimensions";
import { ProductType } from "root/constants/types/productTypes";
import { getAuthState } from "root/redux/slices/authSlice";
import { useAppSelector } from "root/redux/store";
import { formatPriceIntl } from "root/utils/formatPrice";

import IconComponent from "../customIcon";

const avatarSize = (((width * 0.6) / 2) * 0.75) / 3;
const imageSize = (height / 3) * 0.75;
const avatarPadding = 17;

const ProductCard = ({ item }: { item: ProductType }) => {
  const {
    images,
    date,
    category,
    description,
    id,
    name,
    price,
    seller,
    thumbnail,
  } = item;

  const { userData } = useAppSelector(getAuthState);

  return (
    <Link
      href={{
        pathname: "/(products)/productDetail",
        params: {
          item: JSON.stringify(item),
        },
      }}
      asChild
      style={styles.itemContainer}
    >
      <Pressable>
        <View
          style={{
            marginBottom: (avatarSize + avatarPadding) / 2,
          }}
        >
          <Image
            source={{ uri: images[0] }}
            style={styles.imageStyle}
            resizeMethod="resize"
            resizeMode="cover"
          />
          <Pressable onPress={() => {}} style={styles.avatarOuterContainer}>
            <View style={styles.avatarInnerContainer}>
              <IconComponent name="person-outline" size={avatarSize * 0.5} />
            </View>
          </Pressable>
          {userData?.id !== seller.id && (
            <Pressable onPress={() => {}} style={styles.favouriteIcon}>
              <IconComponent
                name="favorite-outline"
                color={Colors.light.redColor}
              />
            </Pressable>
          )}
        </View>

        <Text style={[styles.itemName, { paddingVertical: 5 }]}>
          {name.length > 15 ? name.slice(0, 14) + "..." : name}
        </Text>
        <Text
          style={[
            styles.itemName,
            {
              paddingBottom: 5,
              fontSize: 14,
              fontWeight: "400",
              color: Colors.light.primary,
            },
          ]}
        >
          {formatPriceIntl(price)}
        </Text>
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.primary,
    width: width * 0.4,
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageStyle: {
    width: "100%",
    height: imageSize,
    borderRadius: 20,
    // aspectRatio: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    color: Colors.light.text,
  },
  avatarOuterContainer: {
    position: "absolute",
    alignSelf: "center",
    bottom: -(avatarSize + avatarPadding) / 2,
    width: avatarSize + avatarPadding,
    height: avatarSize + avatarPadding,
    borderRadius: (avatarSize + avatarPadding) / 2,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInnerContainer: {
    borderRadius: avatarSize / 2,
    height: avatarSize,
    width: avatarSize,
    padding: 2,
    borderColor: Colors.light.primary,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  favouriteIcon: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 5,
    right: 5,
    height: imageSize * 0.175,
    width: imageSize * 0.175,
    borderRadius: (imageSize * 0.175) / 2,
  },
});

export default ProductCard;
