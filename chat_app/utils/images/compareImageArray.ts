export const imageBaseUrl = "https://res.cloudinary.com";

export const areImageListsEqual = (
  list1: string[],
  list2: string[]
): boolean => {
  if (list1.length !== list2.length) {
    return false;
  }

  const sortedList1 = [...list1].sort();
  const sortedList2 = [...list2].sort();

  return sortedList1.every((url, index) => url === sortedList2[index]);
};
