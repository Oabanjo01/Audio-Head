import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import IconComponent from "root/components/customIcon";
import CustomWrapper from "root/components/customScrollableWrapper";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { ProductType } from "root/constants/types/productTypes";
import { formatPriceIntl } from "root/utils/formatPrice";

const ProductDetail = () => {
  const { item } = useLocalSearchParams();
  const {
    category,
    date,
    description,
    images,
    name,
    price,
    seller,
    thumbnail,
  }: ProductType = JSON.parse(item as string);

  console.log(seller);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const onScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const aspectRatio = 16 / 9;

  const modifiedDate = new Date(date).toDateString().split("T")[0];
  return (
    <CustomWrapper title="Product Detail" leftHeaderIcon>
      <>
        <View
          style={{
            marginHorizontal: width * 0.025,
            height: (width * 0.9) / aspectRatio,
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <FlatList
            data={images}
            keyExtractor={(item, index) => `${item}_${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const currentScrollX = event.nativeEvent.contentOffset.x;
              const itemWidth = width * 0.95; // took note of the margin too

              if (onScrollTimeout.current) {
                clearTimeout(onScrollTimeout.current);
              }

              onScrollTimeout.current = setTimeout(() => {
                const newIndex = Math.round(currentScrollX / itemWidth);
                setActiveIndex(
                  Math.max(0, Math.min(newIndex, images.length - 1))
                );
              }, 50);
            }}
            onMomentumScrollEnd={(event) => {
              const currentScrollX = event.nativeEvent.contentOffset.x;
              const itemWidth = width * 0.95;
              const newIndex = Math.round(currentScrollX / itemWidth);
              setActiveIndex(
                Math.max(0, Math.min(newIndex, images.length - 1))
              );
            }}
            pagingEnabled
            renderItem={({ item, index }) => {
              return (
                <Image
                  source={{ uri: item }}
                  style={{
                    overflow: "hidden",
                    justifyContent: "center",
                    borderRadius: 20,
                    height: (width * 0.9) / aspectRatio,
                    width: width * 0.9,
                    marginHorizontal: width * 0.025,
                  }}
                />
              );
            }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          {Array.from({ length: images.length }).map((_, index) => {
            return (
              <View
                style={{
                  marginTop: 5,
                  marginHorizontal: 3,
                  borderRadius: 10 / 2,
                  width: 10,
                  height: 10,
                  backgroundColor:
                    activeIndex === index
                      ? Colors.light.primary
                      : Colors.light.lightGrey,
                }}
              />
            );
          })}
        </View>
        <View
          style={{
            width: width - width * 0.05,
            marginTop: 20,
          }}
        >
          <Text>{name}</Text>
          <Text
            style={{
              color: Colors.light.primary,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            {formatPriceIntl(price)}
          </Text>
          <Text style={{ fontStyle: "italic", marginBottom: 20 }}>
            {category}
          </Text>

          <Text>{description}</Text>

          {!seller.avatar ? (
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                marginTop: height * 0.3,
              }}
            >
              <View
                style={{
                  height: height * 0.05,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 15,
                  width: height * 0.05,
                  borderRadius: (height * 0.05) / 2,
                  borderWidth: 1,
                }}
              >
                <IconComponent name={"person-4"} />
              </View>
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: Colors.light.primary }}>
                  {seller.name}
                </Text>
                <Text style={{ marginBottom: 20 }}>
                  Created on: {modifiedDate}
                </Text>
              </View>
            </View>
          ) : (
            <Image />
          )}
        </View>
      </>
    </CustomWrapper>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({});
