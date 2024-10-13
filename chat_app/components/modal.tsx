import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { forwardRef, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
export type Ref = BottomSheetModal;

type BottomSheetProps = {
  children: ReactNode;
  title: string;
};

const GeneralModal = forwardRef<Ref, BottomSheetProps>((props, ref) => {
  const { children, title, ...rest } = props;

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
      <View style={styles.contentContainer}>{children}</View>
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
