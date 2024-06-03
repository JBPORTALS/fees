import {
  Select,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormErrorIcon,
} from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import moment from "moment";
import { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import ReactDatePicker from "react-datepicker";
import * as Yup from "yup";

type HookProps = FieldHookConfig<string>;
type FieldInputTypeAttribute = HTMLInputTypeAttribute | "select";

export type FieldProps = {
  name: string;
  type: FieldInputTypeAttribute;
  label: string;
  isReadonly?: boolean;
  isDisabled?: boolean;
  validateField?: Yup.AnySchema;
  options?: Array<any>;
} & HookProps &
  HTMLAttributes<HTMLInputElement>;

export const Field = (props: FieldProps) => {
  const [fieldProps, metaProps, helperProps] = useField(props);
  const type = props.type as FieldInputTypeAttribute;

  function renderConditionalInputField() {
    switch (type) {
      case "date":
        return (
          <Input
            {...fieldProps}
            as={ReactDatePicker}
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            bg={"white"}
            selected={
              fieldProps.value !== "" ? new Date(fieldProps.value) : new Date()
            }
            dateFormat={"dd/MM/yyyy"}
            onBlur={fieldProps.onBlur}
            name={fieldProps.name}
            isDisabled={props?.isDisabled}
            isReadOnly={props?.isReadonly}
            //  @ts-ignore
            onChange={(value: Date) =>
              helperProps.setValue(moment(value).format("yyyy-MM-DD"))
            }
          />
        );
      case "select":
        return (
          <Select
            {...fieldProps}
            isDisabled={props?.isDisabled}
            isReadOnly={props?.isReadonly}
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            bg={"white"}
            {...fieldProps}
          >
            <option value={""}>{props.placeholder}</option>
            {props.options?.map((op) => (
              <option value={op.value} key={op.value}>
                {op.option}
              </option>
            ))}
          </Select>
        );
      default:
        return (
          <Input
            {...fieldProps}
            _invalid={{
              background(theme) {
                return theme.colors.red["50"];
              },
              borderColor(theme) {
                return theme.colors.red["500"];
              },
              borderWidth: "2px",
            }}
            bg={"white"}
            {...fieldProps}
            placeholder={props.placeholder}
            type={props.type}
            isDisabled={props?.isDisabled}
            isReadOnly={props?.isReadonly}
          />
        );
    }
  }

  return (
    <FormControl
      isInvalid={!!metaProps.touched && !!metaProps.error}
      hidden={props.hidden}
    >
      <FormLabel>{props.label}</FormLabel>
      {renderConditionalInputField()}
      {metaProps.touched && metaProps.error && (
        <FormErrorMessage>
          <FormErrorIcon />
          {metaProps.error}
        </FormErrorMessage>
      )}
      {/* <pre>{JSON.stringify(metaProps.error)}</pre> */}
    </FormControl>
  );
};
