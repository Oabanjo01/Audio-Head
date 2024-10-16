import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, ReactElement, useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export type Ref = BottomSheetModal;

type BottomSheetProps = {
  itemsList: any[];
  title: string;
  renderItem: (item: any, index: number) => ReactElement;
  keyExtractor: (item: any, index: number) => string;
};

const GeneralModal = forwardRef<Ref, BottomSheetProps>((props, ref) => {
  const { title, itemsList, renderItem, keyExtractor, ...rest } = props;

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  const snapPoints = useMemo(() => ["20%", "50%", "75%"], []);
  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      {...rest}
    >
      <Text style={styles.modalHeaderTitle}>{title}</Text>
      <View style={{ padding: 20, flex: 1 }}>
        <BottomSheetFlatList
          showsVerticalScrollIndicator={false}
          data={itemsList}
          keyExtractor={keyExtractor}
          renderItem={({ item, index }): ReactElement | null => {
            return renderItem(item, index);
          }}
        />
      </View>
    </BottomSheetModal>
  );
});

export default GeneralModal;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  containerHeadline: {
    fontSize: 24,
    fontWeight: "600",
    padding: 20,
  },
  modalHeaderTitle: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
