import { useBottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useState } from "react";
import { showToast } from "root/components/toast";
import {
  filterLocalImages,
  isCloudImage,
} from "root/utils/images/filterOutLocalImages";

import { useProduct } from "./useProduct";

export const handleProductImageDeletion = (images: string[]) => {
  const [imageList, setImageList] = useState<string[]>(images);
  const [restorableImageList, setrestorableImageList] =
    useState<string[]>(images);
  const [imageToModify, setImageToModify] = useState<string>("");

  const { dismiss } = useBottomSheetModal();
  const { deletProduct, deleteImage } = useProduct();

  const handleDeletion = async (
    id: string,
    title: string,
    imageToDelete: string
  ) => {
    dismiss();
    if (title.toLowerCase().includes("confirm")) {
      await deletProduct(id);
      router.navigate("/(screens)/userProducts");
      return;
    }

    if (title.toLowerCase().includes("image")) {
      if (!isCloudImage(imageToDelete)) {
        setImageList((prevImages) =>
          prevImages.filter((img) => img !== imageToDelete)
        );
        setrestorableImageList((prevImages) =>
          prevImages.filter((img) => img !== imageToDelete)
        );
        setImageToModify("");
        return;
      }

      if (
        filterLocalImages(imageList).length <= 1 &&
        isCloudImage(imageToDelete)
      ) {
        return showToast({
          text1: "Cannot delete",
          text2: "You cannot delete the last saved product image",
          type: "error",
          position: "top",
        });
      }

      const splittedString = imageToDelete.split("/");
      const imageId = splittedString[splittedString.length - 1].split(".")[0];
      await deleteImage(id, imageId);

      setImageList((prevImages) =>
        prevImages.filter((img) => img !== imageToDelete)
      );
      setrestorableImageList((prevImages) =>
        prevImages.filter((img) => img !== imageToDelete)
      );
      setImageToModify("");
    }
  };

  return {
    handleDeletion,
    restorableImageList,
    imageList,
    imageToModify,
    setImageToModify,
    setImageList,
  };
};
