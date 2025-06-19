import { Input, Field as ChakraField, NativeSelect } from "@chakra-ui/react";
import { FieldHookConfig, useField } from "formik";
import { HTMLAttributes, HTMLInputTypeAttribute } from "react";
import * as Yup from "yup";

type HookProps = FieldHookConfig<string>;
type FieldInputTypeAttribute = HTMLInputTypeAttribute | "select";

export type FieldProps = {
  name: string;
  type: FieldInputTypeAttribute;
  label: string;
  description?: string;
  readOnly?: boolean;
  disabled?: boolean;
  validateField?: Yup.AnySchema;
  options?: Array<any>;
} & HookProps &
  HTMLAttributes<HTMLInputElement>;

export const Field = (props: FieldProps) => {
  const [fieldProps, metaProps] = useField(props);
  const type = props.type as FieldInputTypeAttribute;

  function renderConditionalInputField() {
    switch (type) {
      case "date":
        return (
          <Input
            {...fieldProps}
            type="date"
            _invalid={{
              background: "bg.error",
              borderColor: "border.error",
              borderWidth: "2px",
            }}
          />
        );
      case "select":
        return (
          <NativeSelect.Root disabled={props?.disabled || props?.readOnly}>
            <NativeSelect.Field
              {...fieldProps}
              _invalid={{
                background: "bg.error",
                borderColor: "border.error",
                borderWidth: "2px",
              }}
            >
              <option value={""}>{props.placeholder}</option>
              {props.options?.map((op) => (
                <option value={op.value} key={op.value}>
                  {op.option}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        );
      default:
        return (
          <Input
            {...fieldProps}
            _invalid={{
              background: "bg.error",
              borderColor: "border.error",
              borderWidth: "2px",
            }}
            {...fieldProps}
            placeholder={props.placeholder}
            type={props.type}
            disabled={props?.disabled}
            readOnly={props?.readOnly}
          />
        );
    }
  }

  return (
    <ChakraField.Root
      invalid={!!metaProps.touched && !!metaProps.error}
      readOnly={props.readOnly}
      disabled={props.disabled}
      hidden={props.hidden}
    >
      <ChakraField.Label>{props.label}</ChakraField.Label>
      {renderConditionalInputField()}
      <ChakraField.HelperText>{props.description}</ChakraField.HelperText>
      {metaProps.touched && metaProps.error && (
        <ChakraField.ErrorText>
          <ChakraField.ErrorIcon size={"xs"} fontSize={"md"} />
          {metaProps.error}
        </ChakraField.ErrorText>
      )}
    </ChakraField.Root>
  );
};
