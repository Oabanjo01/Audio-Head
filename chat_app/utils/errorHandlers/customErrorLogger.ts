export const logErrorDetails = (error: any) => {
  const propertyNames = Object.getOwnPropertyNames(error);
  propertyNames.forEach((propertyName) => {
    console.log(`${propertyName}:`, error[propertyName]);
  });
};
