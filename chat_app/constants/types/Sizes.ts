export type FontSize = Record<
  "small" | "medium" | "large" | "extraLarge",
  number
>;
export type FontWeight = Record<
  "light" | "medium" | "bold" | "veryBold",
  string
>;
export type SizesTypes = {
  fontSize: FontSize;
  fontWeight: FontWeight;
};
