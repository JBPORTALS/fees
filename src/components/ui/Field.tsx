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
import ReactDatePicker from "react-datepicker";
import * as Yup from "yup"

type HookProps = FieldHookConfig<string>;

type FieldProps = {
  options?: { value: string; option: string }[];
  label: string;
  isDisabled?: boolean;
  isReadonly?: boolean;
  placeholder?: string;
  type?: string;
  validateField:Yup.StringSchema | Yup.NumberSchema | Yup.DateSchema
} & HookProps;

export const Field = (props: FieldProps) => {
  const [fieldProps, metaProps, helperProps] = useField(props);

  function renderConditionalInputField() {
    switch (props.type) {
      case "text":
        return (
          <Input
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
      case "number":
        return (
          <Input
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
      case "date":
        return (
          <Input
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
        return null;
    }
  }

  return (
    <FormControl isInvalid={!!metaProps.touched && !!metaProps.error}>
      <FormLabel>{props.label}</FormLabel>
      {renderConditionalInputField()}
      {metaProps.touched && metaProps.error && (
        <FormErrorMessage>
          <FormErrorIcon />
          {metaProps.error}
        </FormErrorMessage>
      )}
    </FormControl>
  );
};
