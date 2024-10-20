export const formatPrice: (value: string) => {
  formattedValue: string;
} = (value: string) => {
  const numbersOnly = value.replace(/[^\d.]/g, "");

  let [integerPart, decimalPart] = numbersOnly.split(".");

  const containsDecimal = numbersOnly.includes(".");

  if (integerPart) {
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  if (decimalPart !== undefined) {
    decimalPart = decimalPart.slice(0, 2);
  }

  let formattedValue = containsDecimal
    ? `${integerPart}.${decimalPart !== undefined ? decimalPart : ""}`
    : integerPart;

  //   if (formattedValue.length > 14 && formattedValue.endsWith(".")) {
  //     console.log("got here");
  //     formattedValue = formattedValue.slice(0, 13);
  //   }

  return { formattedValue };
};

export const cleanCurrencyString = (value: string): string => {
  return value.replace(/[^0-9.]/g, "");
};
