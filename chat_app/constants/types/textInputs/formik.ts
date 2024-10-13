import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { FormikErrors, FormikTouched } from "formik";
import { CreateProductModel } from "root/constants/types/productTypes";

export type setFieldValueType = (
  field: string,
  value: string,
  shouldValidate?: boolean
) => Promise<void | FormikErrors<any>>;

export type handleChangeType =
  | {
      (e: React.ChangeEvent<any>): void;
      <T = string | React.ChangeEvent<any>>(
        field: T
      ): T extends React.ChangeEvent<any>
        ? void
        : (e: string | React.ChangeEvent<any>) => void;
    }
  | any;

export type handleDateChangeType =
  | ((event: DateTimePickerEvent, date?: Date) => void)
  | undefined;

export type setTouchedType = (
  touched: FormikTouched<CreateProductModel>,
  shouldValidate?: boolean
) => Promise<void | FormikErrors<CreateProductModel>>;
