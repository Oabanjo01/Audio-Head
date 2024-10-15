export const formatAmount: (value: string) => {
  formattedValue: string;
  numbersOnly: string;
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

  return { formattedValue, numbersOnly };
};
