import { imageBaseUrl } from "./compareImageArray";

export const filterLocalImages: (selectedImage: string[]) => string[] = (
  selectedImage: string[]
) => {
  const filteredImages = selectedImage.filter((image) => {
    const cloudImage = image.startsWith(imageBaseUrl);
    return cloudImage;
  });
  console.log(filteredImages);
  return filteredImages;
};

export const isCloudImage = (selectedImage: string) => {
  return selectedImage.startsWith(imageBaseUrl);
};
